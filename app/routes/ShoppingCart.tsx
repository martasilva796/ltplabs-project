import Navbar from "~/components/navbar";
import { useCart } from "~/context/CartContext";
import { Trash2 } from "lucide-react";

export default function ShoppingCart() {

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 20 : 0;

  const total = subtotal + shipping;

  return (
    <>
      <Navbar variant="product" />

      <main className="px-8 py-12">

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 lg:gap-16">

          {/* LEFT */}
          <div>
            <div className="flex flex-col gap-10">
              {cartItems.map((item, index) => (
                <>
                    <div key={item.id} className="pt-5 pb-5 flex gap-8 w-full">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                            {/* IMAGE */}
                            <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full md:w-[170px] h-[170px] object-cover"
                            />

                            {/* INFO */}
                            <div className="flex flex-col justify-between flex-1 gap-6 md:h-[170px]">

                            <div className="flex flex-col gap-3">

                                <h2 className="text-[#1F3044] text-[18px]" style={{ fontFamily: "Inter", fontWeight: 400, lineHeight: "100%", letterSpacing: "0%", }}>
                                {item.title}
                                </h2>

                                <p className="text-[#1F3044] text-[16px]" style={{ fontFamily: "Ubuntu", fontWeight: 400, lineHeight: "20px", letterSpacing: "0%", }}>
                                ${item.price}
                                </p>
                            </div>

                            {/* QUANTITY */}
                            <div className="flex items-center gap-5">

                                <div className="flex items-center gap-3 border border-black rounded-[8px] px-3 py-2 h-[42px]">

                                <button onClick={() => decreaseQuantity(item.id)} className="w-4 h-4 flex items-center justify-center text-[#1F3044] text-[18px]">-</button>

                                <div className="w-6 text-center text-[#1F3044] text-[15px]" style={{fontFamily: "Ubuntu", fontWeight: 400, lineHeight: "20px",}}>{item.quantity}</div>

                                <button onClick={() => increaseQuantity(item.id)} className="w-4 h-4 flex items-center justify-center text-[#1F3044] text-[18px]">+</button>

                                </div>

                                {/* DELETE */}
                                <button onClick={() => removeFromCart(item.id)} className="text-[#1F3044] flex items-center justify-center">
                                    <Trash2 className="w-[18px] h-[20px] text-[18px]"/>
                                </button>

                            </div>

                            </div>

                        </div>

                    </div>
                    {/* DIVIDER FOR ALL EXCEPT LAST */}
                    {index !== cartItems.length - 1 && (
                    <div className="border-t border-[#1F3044] opacity-40" />
                    )}
                </>             
              ))}

            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-full lg:w-[600px] flex flex-col gap-6">

            <div className="border border-[#1F3044] rounded-[16px] p-6 flex flex-col gap-6">

              <h2
                className="text-[#1F3044] text-[20px]"
                style={{
                  fontFamily: "Ubuntu",
                  fontWeight: 700,
                  lineHeight: "24px",
                }}
              >
                Cart Summary
              </h2>

              <div className="flex flex-col gap-3">

                <div className="flex justify-between text-[#1F3044] text-[15px]">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[#1F3044] text-[15px]">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[#1F3044] text-[16px] font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

              </div>

              <button className="w-full h-[42px] bg-[#1F3044] text-white rounded-[8px] flex items-center justify-center font-normal" style={{ fontFamily: "Roboto Mono", fontSize: "15px", }}>
                Check out
              </button>

              <p className="text-center text-[#1F3044] text-[13px]" style={{ fontFamily: "Ubuntu"}}>
                Or pay with PayPal
              </p>

              <div className="border-t border-[#1F3044] opacity-50" />

              <div className="flex flex-col gap-2">

                <p className="text-[#1F3044] text-[13px]" style={{ fontFamily: "Ubuntu"}}>Promo Code</p>
                <div className="w-full">
                   <div className="flex w-full gap-3 items-center">
                        <input type="text" placeholder="Enter Code" className="flex-1 min-w-0 w-full border border-[#1F3044] rounded-[8px] px-3 h-[36px] text-[#1F3044] outline-none" style={{ fontFamily: "Ubuntu"}}/>
                        <button className="shrink-0 bg-[#1F3044] text-white px-4 h-[36px] rounded-[8px] text-[14px] whitespace-nowrap" style={{ fontFamily: "Ubuntu"}}>Apply</button>
                    </div>
                </div>
                
              </div>

            </div>

          </div>

        </div>

      </main>
    </>
  );
}
