import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {useCart} from "~/context/CartContext";
import Navbar from "~/components/navbar";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
  category: string;
};

export default function ProductDetail(){

  //Extract product ID from URL
  const {id} = useParams();

  // Stores the product fetched from API (null = not loaded yet)
  const [product, setProduct] = useState<Product | null>(null);

  //addToCart - function to add product to cart
  const {addToCart} = useCart();

  //Controls visibility of "Product added to cart" message
  const [showToast, setShowToast] = useState(false);

  //Runs when component loads or when "id" changes
  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(console.error);
  }, [id]);

  //Runs when user clicks "Add to cart"
  const handleAdd = () => { 
    if(!product) return; 
    addToCart({id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail,}); 
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000); 
  };

  // If product hasn't loaded yet
  if(!product){
    return <div className="p-10 text-[#1F3044]">Loading...</div>;
  }

  return (
    <div>
      <Navbar variant="product" />
      <main className="px-8 py-10 text-[#1F3044]">
        <div className="grid grid-cols-1 xl:grid-cols-[1.8fr_1fr] gap-10 w-full">
          {/* ----------- Main Content ----------- */}
          <section className="w-full min-w-0">
            <div className="w-full h-[600px] overflow-hidden bg-[#F5F5F5]">
              <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover object-center scale-95"/>
            </div>
          </section>

          {/* ----------- Sidebar ----------- */}
          <aside className="flex flex-col w-full gap-6 items-start">   
            {/* Container (Product title + price + category) */}
            <div className="flex flex-col w-full gap-0">
              {/* Title */}
              <h1 className="text-[28px] leading-[32px] font-bold tracking-[-0.01em] text-[#1F3044]" style={{fontFamily:"Ubuntu"}}>{product.title}</h1>
              {/* Price */}
              <p className="text-[28px] leading-[32px] font-bold tracking-[-0.01em] text-[#1F3044]" style={{fontFamily:"Ubuntu"}}>${product.price}</p>
              {/* Category Badge */}
              <div className="mt-4">
                <span className="inline-flex px-3 py-1 rounded-full bg-[#1F3044]/10 text-[#1F3044] text-[12px] uppercase tracking-[0.08em]" style={{fontFamily: "Inter", fontWeight: 500,}}>
                  {product.category
                    .replace("-", " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())} 
                </span>
              </div>
            </div>

            {/* Container (Button + product details) */}
            <div className="w-[82%] flex flex-col gap-6">
              {/* Button "Add to Cart" */}
              <div className="flex flex-col w-full gap-3">
                <button onClick={handleAdd} className="w-full h-[36px] bg-[#1F3044] text-white flex items-center justify-center" style={{fontFamily: "Roboto Mono", fontSize: "15px", lineHeight: "20px",}}>
                  Add to cart
                </button>
              </div>

              {/* Container (Details title + description) */}
              <div className="flex flex-col w-full pt-4 gap-2 border-t border-[#1F3044]">
                <h2 className="text-[15px] leading-[20px] font-normal" style={{fontFamily: "Ubuntu"}}>Product details</h2>
                <p className="text-[15px] leading-[20px] font-normal" style={{fontFamily: "Ubuntu"}}>{product.description}</p>
              </div>
            </div>           
          </aside>
        </div>
        {showToast && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#1F3044]/10 text-[#1F3044] text-sm">Product added to cart</div>
        )}
      </main>
    </div>
  );
}