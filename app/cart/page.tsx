import type { Metadata } from "next"
import CartClientPage from "./CartClientPage"

export const metadata: Metadata = {
  title: "Shopping Cart | HolaCupid - Dominican Republic Connections",
  description: "Review your selected profiles and proceed to checkout for instant contact information delivery.",
  alternates: {
    canonical: "https://holacupid.com/cart",
  },
}

export default function CartPage() {
  return <CartClientPage />
}
