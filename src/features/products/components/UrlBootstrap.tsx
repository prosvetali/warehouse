"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { subscribe } from "valtio";
import {
  applyStateFromParams,
  buildSearchParams,
  productsStore,
} from "../store";

export function UrlBootstrap() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    applyStateFromParams(new URLSearchParams(searchParams.toString()));
  }, [searchParams]);

  useEffect(() => {
    const unsubscribe = subscribe(productsStore, () => {
      const sp = buildSearchParams();
      const query = sp.toString();
      const url = query ? `${pathname}?${query}` : pathname;
      router.replace(url, { scroll: false });
    });
    return unsubscribe;
  }, [pathname, router]);

  return null;
}
