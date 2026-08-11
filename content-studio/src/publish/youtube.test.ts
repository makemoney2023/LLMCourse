import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { stringify as stringifyYaml } from "yaml";
import type { ScriptPack } from "../schema/script-pack";
import { buildDescription } from "./description";
import {
  buildVideoInsertBody,
  clampYoutubeTitle,
  publishBatch,
  refreshAccessToken,
  uploadScheduledShort,
  type PublishPlanItem,
} from "./youtube";

function makeBatchDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "shorts-publish-"));
}

function writePack(batchDir: string, pack: ScriptPack): void {
  const scriptsDir = path.join(batchDir, "scripts");
  fs.mkdirSync(scriptsDir, { recursive: true });
  fs.writeFileSync(
    path.join(scriptsDir, `${pack.id}.yaml`),
    stringifyYaml(pack),
    "utf8",
  );
}

function writeRender(batchDir: string, id: string, bytes = "fake-mp4"): string {
  const rendersDir = path.join(batchDir, "renders");
  fs.mkdirSync(rendersDir, { recursive: true });
  const filePath = path.join(rendersDir, `${id}.mp4`);
  fs.writeFileSync(filePath, bytes, "utf8");
  return filePath;
}

function samplePack(id: string, hook: string): ScriptPack {
  return {
    id,
    module: "01-mental-model",
    anchor: "Context window = desk space",
    format: "voice",
    hook,
    beats: [{ text: "Beat", visual: "title_card" }],
    cta: "Free LLM Leverage course — link in bio",
    duration_target_sec: 45,
  };
}

const planItem: PublishPlanItem = {
  id: "desk-01",
  title: "Your AI isn't dumb — your desk is crowded.",
  description: "CTA\n\nhttps://llm-leverage-course.vercel.app?utm_source=youtube&utm_medium=shorts&utm_campaign=desk-01",
  publishAt: "2026-08-12T13:00:00.000Z",
};

describe("clampYoutubeTitle", () => {
  it("clamps a 120-char hook to at most 100 characters", () => {
    const hook = "A".repeat(120);
    const title = clampYoutubeTitle(hook);
    expect(title.length).toBeLessThanOrEqual(100);
    expect(title).toBe("A".repeat(100));
  });

  it("leaves short titles unchanged", () => {
    expect(clampYoutubeTitle("Short hook")).toBe("Short hook");
  });
});

describe("buildVideoInsertBody", () => {
  it("sets snippet.title, status.publishAt, and privacyStatus private until publishAt", () => {
    const body = buildVideoInsertBody(planItem);

    expect(body.snippet.title).toBe(planItem.title);
    expect(body.snippet.description).toBe(planItem.description);
    expect(body.status.publishAt).toBe(planItem.publishAt);
    expect(body.status.privacyStatus).toBe("private");
  });
});

describe("refreshAccessToken", () => {
  it("exchanges refresh token for access_token via OAuth token endpoint", async () => {
    const fetchFn = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(String(input)).toBe("https://oauth2.googleapis.com/token");
      expect(init?.method).toBe("POST");
      const params = new URLSearchParams(String(init?.body));
      expect(params.get("grant_type")).toBe("refresh_token");
      expect(params.get("client_id")).toBe("cid");
      expect(params.get("client_secret")).toBe("csecret");
      expect(params.get("refresh_token")).toBe("rtoken");
      return new Response(JSON.stringify({ access_token: "atok", expires_in: 3600 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });

    const token = await refreshAccessToken(
      {
        clientId: "cid",
        clientSecret: "csecret",
        refreshToken: "rtoken",
      },
      fetchFn as typeof fetch,
    );

    expect(token).toBe("atok");
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });
});

describe("uploadScheduledShort", () => {
  it("starts resumable session with insert body then PUTs mp4 bytes", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "shorts-upload-"));
    const filePath = path.join(dir, "desk-01.mp4");
    const fileBytes = Buffer.from("vertical-short-bytes");
    fs.writeFileSync(filePath, fileBytes);

    const sessionUrl =
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&upload_id=abc";
    const calls: Array<{ url: string; method?: string; body?: unknown }> = [];

    const fetchFn = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";
      calls.push({ url, method, body: init?.body });

      if (method === "POST" && url.includes("uploadType=resumable")) {
        const headers = new Headers(init?.headers);
        expect(headers.get("Authorization")).toBe("Bearer atok");
        expect(headers.get("Content-Type")).toContain("application/json");
        expect(headers.get("X-Upload-Content-Type")).toBe("video/mp4");
        expect(headers.get("X-Upload-Content-Length")).toBe(String(fileBytes.byteLength));
        const body = JSON.parse(String(init?.body)) as ReturnType<
          typeof buildVideoInsertBody
        >;
        expect(body.snippet.title).toBe(planItem.title);
        expect(body.status.privacyStatus).toBe("private");
        expect(body.status.publishAt).toBe(planItem.publishAt);
        return new Response(null, {
          status: 200,
          headers: { Location: sessionUrl },
        });
      }

      if (method === "PUT" && url === sessionUrl) {
        const headers = new Headers(init?.headers);
        expect(headers.get("Authorization")).toBe("Bearer atok");
        expect(headers.get("Content-Type")).toBe("video/mp4");
        expect(Buffer.from(init?.body as ArrayBuffer)).toEqual(fileBytes);
        return new Response(JSON.stringify({ id: "yt-video-123" }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      }

      throw new Error(`Unexpected fetch: ${method} ${url}`);
    });

    const result = await uploadScheduledShort({
      accessToken: "atok",
      filePath,
      item: planItem,
      fetchFn: fetchFn as typeof fetch,
    });

    expect(result.videoId).toBe("yt-video-123");
    expect(calls).toHaveLength(2);
    expect(calls[0]!.method).toBe("POST");
    expect(calls[1]!.method).toBe("PUT");
  });
});

describe("publishBatch", () => {
  it("throws /no approved/i when every id is unapproved", async () => {
    const batchDir = makeBatchDir();
    const pack = samplePack("a-01", "Hook A");
    writePack(batchDir, pack);
    fs.writeFileSync(
      path.join(batchDir, "approval.yaml"),
      stringifyYaml({ items: [{ id: pack.id, approve: false }] }),
      "utf8",
    );

    await expect(
      publishBatch(batchDir, { dryRun: true, startDate: "2026-08-12" }),
    ).rejects.toThrow(/no approved/i);
  });

  it("skips unapproved ids and dry-runs only approved", async () => {
    const batchDir = makeBatchDir();
    const approved = samplePack("approved-01", "Approved hook");
    const skipped = samplePack("skipped-01", "Skipped hook");
    writePack(batchDir, approved);
    writePack(batchDir, skipped);
    fs.writeFileSync(
      path.join(batchDir, "approval.yaml"),
      stringifyYaml({
        items: [
          { id: approved.id, approve: true },
          { id: skipped.id, approve: false },
        ],
      }),
      "utf8",
    );

    const result = await publishBatch(batchDir, {
      dryRun: true,
      startDate: "2026-08-12",
    });

    expect(result.skipped).toEqual([skipped.id]);
    expect(result.planned).toHaveLength(1);
    expect(result.planned[0]!.id).toBe(approved.id);
    expect(result.planned[0]!.title).toBe(clampYoutubeTitle(approved.hook));
    expect(result.planned[0]!.description).toBe(buildDescription(approved));
  });

  it("clamps planned title from a 120-char hook to ≤100", async () => {
    const batchDir = makeBatchDir();
    const longHook = "B".repeat(120);
    const pack = samplePack("long-hook-01", longHook);
    writePack(batchDir, pack);
    fs.writeFileSync(
      path.join(batchDir, "approval.yaml"),
      stringifyYaml({ items: [{ id: pack.id, approve: true }] }),
      "utf8",
    );

    const result = await publishBatch(batchDir, {
      dryRun: true,
      startDate: "2026-08-12",
    });

    expect(result.planned[0]!.title.length).toBeLessThanOrEqual(100);
    expect(result.planned[0]!.title).toBe(clampYoutubeTitle(longHook));
  });

  it("writes publish-plan.json with daily 9:00 America/New_York publishAt", async () => {
    const batchDir = makeBatchDir();
    const a = samplePack("day-a", "Day A");
    const b = samplePack("day-b", "Day B");
    writePack(batchDir, a);
    writePack(batchDir, b);
    fs.writeFileSync(
      path.join(batchDir, "approval.yaml"),
      stringifyYaml({
        items: [
          { id: a.id, approve: true },
          { id: b.id, approve: true },
        ],
      }),
      "utf8",
    );

    const result = await publishBatch(batchDir, {
      dryRun: true,
      startDate: "2026-08-12",
    });

    const planPath = path.join(batchDir, "publish-plan.json");
    expect(result.planPath).toBe(planPath);
    expect(fs.existsSync(planPath)).toBe(true);

    const plan = JSON.parse(fs.readFileSync(planPath, "utf8")) as {
      items: Array<{
        id: string;
        title: string;
        description: string;
        publishAt: string;
      }>;
    };

    expect(plan.items).toHaveLength(2);
    expect(plan.items[0]!.publishAt).toBe("2026-08-12T13:00:00.000Z"); // EDT
    expect(plan.items[1]!.publishAt).toBe("2026-08-13T13:00:00.000Z");
    expect(plan.items[0]!.description).toContain("utm_campaign=day-a");
    expect(plan.items[1]!.title).toBe(b.hook);
  });

  describe("live upload", () => {
    const prev = {
      clientId: process.env.YOUTUBE_CLIENT_ID,
      clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
      refreshToken: process.env.YOUTUBE_REFRESH_TOKEN,
    };

    beforeEach(() => {
      process.env.YOUTUBE_CLIENT_ID = "test-client-id";
      process.env.YOUTUBE_CLIENT_SECRET = "test-client-secret";
      process.env.YOUTUBE_REFRESH_TOKEN = "test-refresh-token";
    });

    afterEach(() => {
      if (prev.clientId === undefined) delete process.env.YOUTUBE_CLIENT_ID;
      else process.env.YOUTUBE_CLIENT_ID = prev.clientId;
      if (prev.clientSecret === undefined) delete process.env.YOUTUBE_CLIENT_SECRET;
      else process.env.YOUTUBE_CLIENT_SECRET = prev.clientSecret;
      if (prev.refreshToken === undefined) delete process.env.YOUTUBE_REFRESH_TOKEN;
      else process.env.YOUTUBE_REFRESH_TOKEN = prev.refreshToken;
    });

    function mockLiveFetch(opts: {
      title?: string;
      publishAt?: string;
      videoId?: string;
    } = {}) {
      const sessionUrl =
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&upload_id=live";
      const videoId = opts.videoId ?? "yt-live-1";
      return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = init?.method ?? "GET";

        if (url === "https://oauth2.googleapis.com/token") {
          return new Response(JSON.stringify({ access_token: "live-atok" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (method === "POST" && url.includes("uploadType=resumable")) {
          const body = JSON.parse(String(init?.body)) as {
            snippet: { title: string };
            status: { privacyStatus: string; publishAt: string };
          };
          if (opts.title !== undefined) {
            expect(body.snippet.title).toBe(opts.title);
          }
          expect(body.status.privacyStatus).toBe("private");
          if (opts.publishAt !== undefined) {
            expect(body.status.publishAt).toBe(opts.publishAt);
          }
          return new Response(null, {
            status: 200,
            headers: { Location: sessionUrl },
          });
        }

        if (method === "PUT" && url === sessionUrl) {
          return new Response(JSON.stringify({ id: videoId }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        }

        throw new Error(`Unexpected fetch: ${method} ${url}`);
      });
    }

    it("refreshes OAuth and uploads approved renders with scheduled private status", async () => {
      const batchDir = makeBatchDir();
      const pack = samplePack("live-01", "Live hook");
      writePack(batchDir, pack);
      writeRender(batchDir, pack.id, "mp4-bytes");
      fs.writeFileSync(
        path.join(batchDir, "approval.yaml"),
        stringifyYaml({ items: [{ id: pack.id, approve: true }] }),
        "utf8",
      );

      const fetchFn = mockLiveFetch({
        title: pack.hook,
        publishAt: "2026-08-12T13:00:00.000Z",
        videoId: "yt-live-1",
      });

      const result = await publishBatch(batchDir, {
        dryRun: false,
        startDate: "2026-08-12",
        fetchFn: fetchFn as typeof fetch,
      });

      expect(result.planned).toHaveLength(1);
      expect(result.uploaded).toEqual([
        { id: pack.id, videoId: "yt-live-1", publishAt: "2026-08-12T13:00:00.000Z" },
      ]);
      expect(result.planPath).toBe(path.join(batchDir, "publish-plan.json"));
      expect(fetchFn).toHaveBeenCalled();
      const onDisk = JSON.parse(
        fs.readFileSync(path.join(batchDir, "publish-result.json"), "utf8"),
      ) as { uploaded: Array<{ id: string; videoId: string }> };
      expect(onDisk.uploaded).toEqual(result.uploaded);
    });

    it("preflight throws listing missing renders before any upload", async () => {
      const batchDir = makeBatchDir();
      const a = samplePack("missing-a", "Hook A");
      const b = samplePack("missing-b", "Hook B");
      writePack(batchDir, a);
      writePack(batchDir, b);
      writeRender(batchDir, a.id, "mp4-a");
      fs.writeFileSync(
        path.join(batchDir, "approval.yaml"),
        stringifyYaml({
          items: [
            { id: a.id, approve: true },
            { id: b.id, approve: true },
          ],
        }),
        "utf8",
      );

      const fetchFn = mockLiveFetch();

      await expect(
        publishBatch(batchDir, {
          dryRun: false,
          startDate: "2026-08-12",
          fetchFn: fetchFn as typeof fetch,
        }),
      ).rejects.toThrow(/missing-b\.mp4/);

      expect(fetchFn).not.toHaveBeenCalled();
    });

    it("writes publish-result.json after each successful upload", async () => {
      const batchDir = makeBatchDir();
      const a = samplePack("partial-a", "Hook A");
      const b = samplePack("partial-b", "Hook B");
      writePack(batchDir, a);
      writePack(batchDir, b);
      writeRender(batchDir, a.id, "mp4-a");
      writeRender(batchDir, b.id, "mp4-b");
      fs.writeFileSync(
        path.join(batchDir, "approval.yaml"),
        stringifyYaml({
          items: [
            { id: a.id, approve: true },
            { id: b.id, approve: true },
          ],
        }),
        "utf8",
      );

      let putCount = 0;
      const sessionUrl =
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&upload_id=partial";
      const fetchFn = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = init?.method ?? "GET";

        if (url === "https://oauth2.googleapis.com/token") {
          return new Response(JSON.stringify({ access_token: "live-atok" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (method === "POST" && url.includes("uploadType=resumable")) {
          return new Response(null, {
            status: 200,
            headers: { Location: sessionUrl },
          });
        }

        if (method === "PUT" && url === sessionUrl) {
          putCount += 1;
          if (putCount === 1) {
            return new Response(JSON.stringify({ id: "yt-a" }), {
              status: 201,
              headers: { "Content-Type": "application/json" },
            });
          }
          // After first upload succeeded, result file must already include A
          // before B's upload finishes.
          const mid = JSON.parse(
            fs.readFileSync(path.join(batchDir, "publish-result.json"), "utf8"),
          ) as { uploaded: Array<{ id: string; videoId: string }> };
          expect(mid.uploaded).toEqual([
            {
              id: a.id,
              videoId: "yt-a",
              publishAt: "2026-08-12T13:00:00.000Z",
            },
          ]);
          return new Response(JSON.stringify({ id: "yt-b" }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        }

        throw new Error(`Unexpected fetch: ${method} ${url}`);
      });

      const result = await publishBatch(batchDir, {
        dryRun: false,
        startDate: "2026-08-12",
        fetchFn: fetchFn as typeof fetch,
      });

      expect(result.uploaded).toHaveLength(2);
      expect(result.uploaded?.map((u) => u.videoId)).toEqual(["yt-a", "yt-b"]);
    });

    it("skips ids already present in publish-result.json with a videoId", async () => {
      const batchDir = makeBatchDir();
      const a = samplePack("skip-a", "Hook A");
      const b = samplePack("skip-b", "Hook B");
      writePack(batchDir, a);
      writePack(batchDir, b);
      writeRender(batchDir, a.id, "mp4-a");
      writeRender(batchDir, b.id, "mp4-b");
      fs.writeFileSync(
        path.join(batchDir, "approval.yaml"),
        stringifyYaml({
          items: [
            { id: a.id, approve: true },
            { id: b.id, approve: true },
          ],
        }),
        "utf8",
      );
      fs.writeFileSync(
        path.join(batchDir, "publish-result.json"),
        JSON.stringify({
          uploaded: [
            {
              id: a.id,
              videoId: "yt-existing-a",
              publishAt: "2026-08-12T13:00:00.000Z",
            },
          ],
        }),
        "utf8",
      );

      const fetchFn = mockLiveFetch({
        title: b.hook,
        publishAt: "2026-08-13T13:00:00.000Z",
        videoId: "yt-new-b",
      });

      const result = await publishBatch(batchDir, {
        dryRun: false,
        startDate: "2026-08-12",
        fetchFn: fetchFn as typeof fetch,
      });

      expect(result.uploaded).toEqual([
        {
          id: a.id,
          videoId: "yt-existing-a",
          publishAt: "2026-08-12T13:00:00.000Z",
        },
        {
          id: b.id,
          videoId: "yt-new-b",
          publishAt: "2026-08-13T13:00:00.000Z",
        },
      ]);

      // OAuth + one resumable POST + one PUT (only B)
      expect(fetchFn).toHaveBeenCalledTimes(3);
    });
  });
});
