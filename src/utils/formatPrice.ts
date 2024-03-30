import { PriceInput } from "../generated/graphql";

export const formatPrice = (price: PriceInput) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
  }).format(price.amount);
