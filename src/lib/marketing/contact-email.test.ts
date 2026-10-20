import { describe, expect, it } from "vitest";
import { CONTACT_EMAIL, getContactEmail } from "./contact-email";

describe("getContactEmail", () => {
  it("is the Abracadabra demand-gen mailbox", () => {
    expect(CONTACT_EMAIL).toBe("houdini@abra-ca-dabra.app");
    expect(getContactEmail()).toBe("houdini@abra-ca-dabra.app");
  });

  it("does not use the old course inbox or a personal address", () => {
    expect(getContactEmail()).not.toBe("hello@llmleverage.course");
    expect(getContactEmail()).not.toBe("chrisb@superpatch.com");
  });
});
