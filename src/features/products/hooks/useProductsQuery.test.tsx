import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const getMock = vi.fn();

vi.mock("@/shared/lib/api", () => ({
  api: {
    get: (...args: unknown[]) => getMock(...args),
  },
}));

import { buildProductsKey, useProductsQuery } from "./useProductsQuery";

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 0 } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe("useProductsQuery", () => {
  beforeEach(() => {
    getMock.mockReset();
  });

  it("returns Paginated<Product> with x-total-count header", async () => {
    getMock.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: "Test",
          description: "",
          price: 10,
          sku: "S-1",
          barcode: "0001",
          categoryId: 1,
          supplierId: 1,
          receivedAt: "2026-01-01",
          rating: 4,
          active: true,
          images: [],
        },
      ],
      headers: { "x-total-count": "42" },
    });

    const { result } = renderHook(
      () => useProductsQuery({ page: 1, limit: 10, search: "Te" }),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.total).toBe(42);
    expect(result.current.data?.data).toHaveLength(1);
    expect(result.current.data?.data[0].name).toBe("Test");
  });

  it("builds queryKey from filters", () => {
    const filters = { page: 2, limit: 20, search: "abc", categoryId: 3 };
    const key = buildProductsKey(filters);
    expect(key[0]).toBe("products");
    expect(key[1]).toEqual(filters);
  });

  it("forwards search params as name_like", async () => {
    getMock.mockResolvedValueOnce({ data: [], headers: { "x-total-count": "0" } });

    renderHook(
      () => useProductsQuery({ page: 1, limit: 10, search: "Drill", categoryId: 2 }),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(getMock).toHaveBeenCalled());
    const callArgs = getMock.mock.calls[0];
    expect(callArgs[0]).toBe("/products");
    expect(callArgs[1].params).toMatchObject({
      name_like: "Drill",
      categoryId: 2,
      _page: 1,
      _limit: 10,
    });
  });
});
