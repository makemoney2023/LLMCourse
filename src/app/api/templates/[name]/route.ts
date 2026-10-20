import { getCourseAccess } from "@/lib/access/session";
import {
  isTemplateName,
  PRIVATE_NO_STORE,
  readTemplate,
} from "@/lib/access/course-files";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ name: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { name } = await params;
  if (!isTemplateName(name)) {
    return new Response("Not found", { status: 404, headers: PRIVATE_NO_STORE });
  }
  const access = await getCourseAccess();
  if (!access.entitled) {
    return new Response("Payment required", {
      status: 401,
      headers: PRIVATE_NO_STORE,
    });
  }
  const body = readTemplate(name);
  if (body == null) {
    return new Response("Not found", { status: 404, headers: PRIVATE_NO_STORE });
  }
  return new Response(body, {
    headers: {
      ...PRIVATE_NO_STORE,
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}"`,
    },
  });
}
