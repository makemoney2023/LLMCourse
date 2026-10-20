/** Module 1 stays open as the preview. Everything else requires entitlement. */
export const FREE_MODULE_SLUG = "mental-model";
export const FREE_SANDBOX_ID = "module-mental-model";

export function canReadModule(slug: string, entitled: boolean): boolean {
  return entitled || slug === FREE_MODULE_SLUG;
}

export function canReadSandbox(id: string, entitled: boolean): boolean {
  return entitled || id === FREE_SANDBOX_ID;
}
