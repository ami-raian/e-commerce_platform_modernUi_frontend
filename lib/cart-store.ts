import { create } from "zustand"
import { persist } from "zustand/middleware"
import { trackAddToCart } from "./metaPixel"

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  size?: string
}

export type ShippingLocation = "inside-dhaka" | "outside-dhaka"

interface CartStore {
  items: CartItem[]
  shippingLocation: ShippingLocation
  directPurchaseItem: CartItem | null
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size?: string) => void
  updateQuantity: (productId: string, size: string | undefined, quantity: number) => void
  setShippingLocation: (location: ShippingLocation) => void
  setDirectPurchaseItem: (item: CartItem | null) => void
  getShippingCost: () => number
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      shippingLocation: "inside-dhaka",
      directPurchaseItem: null,
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId && i.size === item.size
          )

          // Track AddToCart event
          trackAddToCart({
            content_name: item.name,
            content_ids: [item.productId],
            content_type: 'product',
            value: item.price * item.quantity,
            num_items: item.quantity,
            currency: 'BDT',
          })

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.size === item.size
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (productId, size) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.productId === productId && i.size === size)),
        })),
      updateQuantity: (productId, size, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.size === size ? { ...i, quantity } : i
          ),
        })),
      setShippingLocation: (location) => set({ shippingLocation: location }),
      setDirectPurchaseItem: (item) => set({ directPurchaseItem: item }),
      getShippingCost: () => {
        const state = get()
        return state.shippingLocation === "inside-dhaka" ? 60 : 100
      },
      clearCart: () => set({ items: [], directPurchaseItem: null }),
      getTotal: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      getItemCount: () => {
        const state = get()
        return state.items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
