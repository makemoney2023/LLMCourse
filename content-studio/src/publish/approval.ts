export type ApprovalItem = {
  id: string;
  approve: boolean;
};

export type ApprovalFile = {
  items: ApprovalItem[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseApproval(raw: unknown): ApprovalFile {
  if (!isRecord(raw)) {
    throw new Error("Approval must be an object");
  }

  if (!Array.isArray(raw.items)) {
    throw new Error("Approval items must be an array");
  }

  const items: ApprovalItem[] = raw.items.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`Approval item ${index} must be an object`);
    }
    if (typeof item.id !== "string" || item.id.trim() === "") {
      throw new Error(`Approval item ${index} missing or invalid id`);
    }
    if (typeof item.approve !== "boolean") {
      throw new Error(`Approval item ${index} approve must be a boolean`);
    }
    return { id: item.id, approve: item.approve };
  });

  return { items };
}

export function isApproved(approval: ApprovalFile, id: string): boolean {
  const item = approval.items.find((entry) => entry.id === id);
  return item?.approve === true;
}
