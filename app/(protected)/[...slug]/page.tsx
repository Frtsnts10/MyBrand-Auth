"use client";

import React from "react";
import { Hammer } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DevelopmentFallbackPage() {
  const pathname = usePathname();
  
  const pathParts = pathname.split("/").filter(Boolean);
  const rawName = pathParts.length > 0 ? pathParts[pathParts.length - 1] : "requested";
  const featureName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 pb-8">
      <section className="flex flex-col items-center justify-center py-24 px-8 w-full max-w-3xl rounded-2xl border-2 border-dashed border-foreground/10 bg-white/40 dark:bg-black/20 text-center">
        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Hammer className="size-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">We are Building!</h2>
        <p className="text-foreground/60 max-w-md">
          The <span className="font-semibold text-foreground/80">{featureName || "requested"}</span> feature is currently under construction.
          We are working hard to bring you the best experience. Stay tuned!
        </p>
      </section>
    </div>
  );
}
