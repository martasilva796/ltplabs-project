import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  route("ProductDetail/:id", "routes/ProductDetail.$id.tsx"),
  route("ShoppingCart", "routes/ShoppingCart.tsx"),
] satisfies RouteConfig;
