import {createContext, useContext, useState} from "react";

//Single product inside the cart
type CartItem = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
};

//Shape of the cart context exposed to the app
type CartContextType = {
  cartItems: CartItem[];
  count: number; //total quantity of all items in cart
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
};

//Create cart context (initially null)
const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }){
  //Global cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  //Add product to cart (or increase quantity if already exists)
  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if(existing){
        return prev.map((item) =>
          item.id === product.id
            ? {...item, quantity: item.quantity + 1}
            : item
        );
      }
      return [...prev, {...product, quantity: 1}];
    });
  };

  //Increase quantity of a specific item
  const increaseQuantity = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  //Decrease quantity (removes item if quantity reaches 0)
  const decreaseQuantity = (id: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  //Remove item completely from cart
  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  //Total number of items in cart (sum of all quantities)
  const count = cartItems.reduce(
    (total, item) => total + item.quantity, 0
  );

  return (
    <CartContext.Provider value={{cartItems, count, addToCart, increaseQuantity, decreaseQuantity, removeFromCart,}}>
      {children}
    </CartContext.Provider>
  );
}

//Custom hook to access cart context easily
export function useCart(){
  const ctx = useContext(CartContext);
  if(!ctx){
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}