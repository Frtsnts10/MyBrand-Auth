// components/counter.tsx
// Placeholder - not used in production routes
"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={() => setCount((c) => c - 1)}>-</Button>
      <span className="font-mono text-lg w-8 text-center">{count}</span>
      <Button variant="outline" size="sm" onClick={() => setCount((c) => c + 1)}>+</Button>
    </div>
  );
}
