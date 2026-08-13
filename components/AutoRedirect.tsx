"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AutoRedirect({ seconds = 8 }: { seconds?: number }) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      router.push("/");
      return;
    }
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining, router]);

  return <p className="mt-2 text-sm text-ink-muted">Redirecting to the homepage in {remaining}s…</p>;
}
