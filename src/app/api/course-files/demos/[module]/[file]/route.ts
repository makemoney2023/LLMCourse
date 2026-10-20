import { getCourseAccess } from "@/lib/access/session";
import {
  isDemoFile,
  PRIVATE_NO_STORE,
  readDemoFile,
} from "@/lib/access/course-files";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ module: string; file: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { module, file } = await params;
  if (!isDemoFile(module, file)) {
    return new Response("Not found", { status: 404, headers: PRIVATE_NO_STORE });
  }
  const access = await getCourseAccess();
  if (!access.entitled) {
    return new Response("Payment required", {
      status: 401,
      headers: PRIVATE_NO_STORE,
    });
  }
  const body = readDemoFile(module, file);
  if (!body) {
    return new Response("Not found", { status: 404, headers: PRIVATE_NO_STORE });
  }
  return new Response(new Uint8Array(body), {
    headers: {
      ...PRIVATE_NO_STORE,
      "Content-Type": "image/svg+xml",
    },
  });
}
