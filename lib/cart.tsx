"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { PRODUCTS } from "./content";
import type { Product } from "./types";

const STORAGE_KEY = "facesculpt:cart:v1";
const MAX_QTY = 10;

export type CartItem = { slug: string; quantity: number };
type CartLine = CartItem & { product: Product };

type State = { items: CartItem[] };
type Action =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; slug: string; quantity?: number }
  | { type: "set"; slug: string; quantity: number }
  | { type: "remove"; slug: string }
  | { type: "clear" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { items: action.items };
    case "add": {
      const inc = Math.max(1, action.quantity ?? 1);
      const existing = state.items.find((i) => i.slug === action.slug);
      const items = existing
        ? state.items.map((i) =>
            i.slug === action.slug
              ? { ...i, quantity: clamp(i.quantity + inc) }
              : i,
          )
        : [...state.items, { slug: action.slug, quantity: clamp(inc) }];
      return { items };
    }
    case "set":
      return {
        items: state.items
          .map((i) =>
            i.slug === action.slug ? { ...i, quantity: clamp(action.quantity) } : i,
          )
          .filter((i) => i.quantity > 0),
      };
    case "remove":
      return { items: state.items.filter((i) => i.slug !== action.slug) };
    case "clear":
      return { items: [] };
  }
}

function clamp(qty: number): number {
  if (!Number.isFinite(qty)) return 0;
  return Math.max(0, Math.min(MAX_QTY, Math.floor(qty)));
}

function readStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const valid = PRODUCTS.map((p) => p.slug);
    return parsed
      .filter(
        (x): x is CartItem =>
          !!x &&
          typeof x === "object" &&
          typeof (x as CartItem).slug === "string" &&
          typeof (x as CartItem).quantity === "number" &&
          valid.includes((x as CartItem).slug),
      )
      .map((x) => ({ slug: x.slug, quantity: clamp(x.quantity) }))
      .filter((x) => x.quantity > 0);
  } catch {
    return [];
  }
}

function writeStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage may be disabled or full; cart is non-critical state
  }
}

type CartContextValue = {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  add: (slug: string, quantity?: number) => void;
  setQty: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Provides cart state to the tree. SSR-safe: state starts empty so server
 * render is deterministic, then we hydrate from localStorage on mount.
 * Components that show a count (the bag badge) check `hydrated` before
 * rendering to avoid the SSR/CSR mismatch warning.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Hydrate once on mount.
  useEffect(() => {
    dispatch({ type: "hydrate", items: readStorage() });
    setHydrated(true);
  }, []);

  // Persist to localStorage on every change after hydration.
  useEffect(() => {
    if (hydrated) writeStorage(state.items);
  }, [state.items, hydrated]);

  // Sync between tabs.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      dispatch({ type: "hydrate", items: readStorage() });
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const lines = useMemo<CartLine[]>(() => {
    return state.items
      .map((item) => {
        const product = PRODUCTS.find((p) => p.slug === item.slug);
        return product ? { ...item, product } : null;
      })
      .filter((x): x is CartLine => x !== null);
  }, [state.items]);

  const count = useMemo(
    () => state.items.reduce((s, i) => s + i.quantity, 0),
    [state.items],
  );

  const subtotal = useMemo(
    () => lines.reduce((s, line) => s + line.product.price * line.quantity, 0),
    [lines],
  );

  const add = useCallback((slug: string, quantity?: number) => {
    dispatch({ type: "add", slug, quantity });
    setIsOpen(true);
  }, []);

  const setQty = useCallback((slug: string, quantity: number) => {
    dispatch({ type: "set", slug, quantity });
  }, []);

  const remove = useCallback((slug: string) => {
    dispatch({ type: "remove", slug });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      lines,
      count,
      subtotal,
      hydrated,
      add,
      setQty,
      remove,
      clear,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
    }),
    [state.items, lines, count, subtotal, hydrated, isOpen, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
