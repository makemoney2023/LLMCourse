"use client";

import {
  CapstonePackBuilder,
  type PackTemplate,
} from "@/components/capstone-pack-builder";
import { CapstoneChecklist } from "@/components/capstone-checklist";
import {
  CapstoneScopeForm,
  EMPTY_SCOPE,
  SCOPE_STORAGE_KEY,
  type CapstoneScope,
} from "@/components/capstone-scope-form";
import { CapstoneStoryShare } from "@/components/capstone-story-share";
import { useLocalStorageState } from "@/hooks/use-local-storage-state";

/** Owns the scope state so the share section sees the workflow live. */
export function CapstoneFlow({
  packFiles,
  lookbackFile,
}: {
  packFiles: PackTemplate[];
  lookbackFile: PackTemplate;
}) {
  const [scope, setScope, loaded] = useLocalStorageState<CapstoneScope>(
    SCOPE_STORAGE_KEY,
    EMPTY_SCOPE,
  );

  return (
    <div className="space-y-12">
      <CapstoneScopeForm scope={scope} setScope={setScope} loaded={loaded} />

      <section className="space-y-4" aria-label="Build the pack">
        <div>
          <h2 className="font-heading text-2xl tracking-tight">
            2. Build the eight-piece pack
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every piece can be short — two lines beats zero. Download each file
            when it is ready and drop them into your project folder.
          </p>
        </div>
        <CapstonePackBuilder files={packFiles} />
      </section>

      <CapstoneChecklist />

      <section className="space-y-4" aria-label="Run and look back">
        <div>
          <h2 className="font-heading text-2xl tracking-tight">
            4. Run, then write the look-back
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Set a timer, run the job once with your pack, and record one
            metric. Then fill this in while it is fresh.
          </p>
        </div>
        <CapstonePackBuilder files={[lookbackFile]} />
      </section>

      <CapstoneStoryShare workflow={scope.workflow} />
    </div>
  );
}
