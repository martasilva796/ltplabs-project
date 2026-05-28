import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Navbar from "~/components/navbar";
import { useCart } from "~/context/CartContext";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
  category: string;
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  const { addToCart } = useCart();
  const { count } = useCart();
  console.log("AFTER CLICK COUNT:", count);
  const [showToast, setShowToast] = useState(false);

  const handleAdd = () => { 
    if (!product) return; 
    addToCart({ 
      id: product.id, 
      title: product.title, 
      price: product.price, 
      thumbnail: product.thumbnail, 
    }); 
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000); };

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(console.error);
  }, [id]);

  if (!product) {
    return <div className="p-10 text-[#1F3044]">Loading...</div>;
  }

  return (
    <div>
      <Navbar variant="product" />

      <main className="px-8 py-10 text-[#1F3044]">
        <div className="grid grid-cols-1 xl:grid-cols-[1.8fr_1fr] gap-10 w-full">

          {/* ----  MAIN CONTENT ------ */}
          <section className="w-full min-w-0">
            {/* LEFT SIDE - IMAGE */}
            <div className="w-full h-[600px] overflow-hidden bg-[#F5F5F5]">
              <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover object-center scale-95"/>
            </div>
          </section>

          {/* ----  SIDE BAR ------ */}
          <aside className="flex flex-col w-full gap-6 items-start">
          
            {/* TITLE + PRICE CONTAINER */}
            <div className="flex flex-col w-full gap-0">

              {/* PRODUCT TITLE */}
              <h1 className="text-[28px] leading-[32px] font-bold tracking-[-0.01em] text-[#1F3044]" style={{fontFamily:"Ubuntu"}}>
                {product.title}
              </h1>

              {/* PRODUCT PRICE */}
              <p className="text-[28px] leading-[32px] font-bold tracking-[-0.01em] text-[#1F3044]" style={{fontFamily:"Ubuntu"}}>
                ${product.price}
              </p>

              <div className="mt-4">
                <span className="inline-flex px-3 py-1 rounded-full bg-[#1F3044]/10 text-[#1F3044] text-[12px] uppercase tracking-[0.08em]"
                  style={{fontFamily: "Inter", fontWeight: 500,}}>
                  {product.category
                    .replace("-", " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              </div>
            </div>

          <div className="w-[82%] flex flex-col gap-6">
            <div className="flex flex-col w-full gap-3">
              {/* ADD TO CART */}
              <button onClick={handleAdd} className="w-full h-[36px] bg-[#1F3044] text-white flex items-center justify-center" style={{
                  fontFamily: "Roboto Mono",
                  fontSize: "15px",
                  lineHeight: "20px",
                }}>Add to cart
              </button>
            </div>

            <div className="flex flex-col w-full pt-4 gap-2 border-t border-[#1F3044]">
              {/* DETAILS TITLE */}
              <h2 className="text-[15px] leading-[20px] font-normal" style={{ fontFamily: "Ubuntu" }}>Product details</h2>

              {/* DESCRIPTION */}
              <p className="text-[15px] leading-[20px] font-normal" style={{ fontFamily: "Ubuntu" }}>
                {product.description}
              </p>
            </div>
          </div>           
          </aside>
        </div>
        {showToast && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#1F3044]/10 text-[#1F3044] text-sm">
            Product added to cart
          </div>
        )}
      </main>
    </div>
  );
}