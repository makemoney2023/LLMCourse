import { afterEach, describe, expect, it } from "vitest";
import { getContactEmail } from "./contact-email";

describe("getContactEmail", () => {
  const previous = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  afterEach(() => {
    if (previous === undefined) {
      delete process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    } else {
      process.env.NEXT_PUBLIC_CONTACT_EMAIL = previous;
    }
  });

  it("returns null when the env var is missing or blank", () => {
    delete process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    expect(getContactEmail()).toBeNull();

    process.env.NEXT_PUBLIC_CONTACT_EMAIL = "   ";
    expect(getContactEmail()).toBeNull();
  });

  it("returns a trimmed address when set", () => {
    process.env.NEXT_PUBLIC_CONTACT_EMAIL = "  training@example.com ";
    expect(getContactEmail()).toBe("training@example.com");
  });

  it("never returns the personal chrisb address", () => {
    delete process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    expect(getContactEmail()).not.toBe("chrisb@superpatch.com");
  });
});
