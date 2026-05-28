import type {Route} from "./+types/home";
import {useState, useRef, useEffect, useMemo} from "react";
import Navbar from "~/components/navbar";
import {ChevronDown} from "lucide-react";
import {Link} from "react-router";

//Product structure coming from API
type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
};

export function meta({}: Route.MetaArgs){
  return [
    {title: "THE ONLINE STORE"},
    {name: "description", content: "Welcome to React Router!"},
  ];
}

export default function Home(){

  //All products fetched from API
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  //Filtering state (category filter)
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  //Sorting state
  const [sortOrder, setSortOrder] = useState<"default"|"price-asc"|"price-desc"|"title-asc"|"title-desc">("default");
  //Sort dropdown open/close state
  const [isSortOpen, setIsSortOpen] = useState(false);

  //Fetch all products once on page load
  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data.products || []);
      })
      .catch((err) => console.error(err));
  }, []);

  //Compute filtered + sorted products
  const filteredProducts = useMemo(() => {
    let data = [...allProducts];

    //Filter by selected category
    if(selectedCategory){
      data = data.filter((p) => p.category === selectedCategory);
    }

    //Sort
    switch (sortOrder) {
      case "price-asc":
        data.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        data.sort((a, b) => b.price - a.price);
        break;
      case "title-asc":
        data.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        data.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // featured (sem alteração)
        break;
    }
    return data;
  }, [allProducts, selectedCategory, sortOrder]);

  //Reference used to close the sort dropdown when clicking outside of it
  const sortRef = useRef<HTMLDivElement | null>(null);

  //Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if(sortRef.current && !sortRef.current.contains(event.target as Node)){
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //Generate a unique list of product categories to use in the category filter sidebar
  const categories = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.category));
    return Array.from(set);
  }, [allProducts]);

  //Format category names
  const formatCategory = (cat: string) =>
    cat
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  //----------- PAGINATION -----------

  //Number of products per page
  const PRODUCTS_PER_PAGE = 9;
  //Number of pagination buttons visible at once
  const PAGES_PER_GROUP = 5;

  //Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(0);

  //Determine which products to display based on the current page
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  //Products shown on current page
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  //Total products after filtering
  const totalProducts = filteredProducts.length;
  //Total pages needed
  const totalPages = Math.ceil(totalProducts/PRODUCTS_PER_PAGE);

  //Display range info (e.g. "1–9 of 100")
  const startItem = totalProducts === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(endIndex, totalProducts);

  //Pagination group
  const startPage = pageGroup * PAGES_PER_GROUP + 1;
  const endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages);

  //Go to next pagination group
  const handleNextGroup = () => {
    const maxGroup = Math.floor((totalPages - 1) / PAGES_PER_GROUP);
    if(pageGroup >= maxGroup){
      setPageGroup(0);
      setCurrentPage(1);
    }else{
      const newGroup = pageGroup + 1;
      setPageGroup(newGroup);
      setCurrentPage(newGroup * PAGES_PER_GROUP + 1);
    }
  };

  return (
    <div>
      <Navbar variant="home" />
      <main className="min-h-screen px-8 py-10">

        {/* Container (Main Content + Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ----------- Main Content ----------- */}
          <section className="lg:col-span-3">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              {/* Sort by */}
              <div className="relative" ref={sortRef}>
                <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 bg-white border border-[#1F3044] rounded-lg py-2 px-4 hover:opacity-80 transition">
                  <span className="text-[#1F3044] text-sm">Sort by</span>
                  <ChevronDown className="w-[14px] h-[14px] text-[#1F3044]"/>
                </button>
                {/* Dropdown */}
                {isSortOpen && (
                  <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-md w-48 z-50 overflow-hidden">
                    <button onClick={() => { setSortOrder("default"); setCurrentPage(1); setIsSortOpen(false);}}
                      className={`w-full text-left px-4 py-3 hover:bg-[#1F3044]/10 text-sm text-[#1F3044] font-[Inter] ${sortOrder === "default" ? "bg-gray-200 font-medium" : ""}`}>Featured
                    </button>

                    <button onClick={() => { setSortOrder("price-asc"); setCurrentPage(1); setIsSortOpen(false);}}
                      className={`w-full text-left px-4 py-3 hover:bg-[#1F3044]/10 text-sm text-[#1F3044] font-[Inter] ${sortOrder === "price-asc" ? "bg-gray-200 font-medium" : ""}`}>Price Low-High
                    </button>

                    <button onClick={() => { setSortOrder("price-desc"); setCurrentPage(1); setIsSortOpen(false);}}
                      className={`w-full text-left px-4 py-3 hover:bg-[#1F3044]/10 text-sm text-[#1F3044] font-[Inter] ${sortOrder === "price-desc" ? "bg-gray-200 font-medium" : ""}`}>Price High-Low
                    </button>

                    <button onClick={() => { setSortOrder("title-asc"); setCurrentPage(1); setIsSortOpen(false);}}
                      className={`w-full text-left px-4 py-3 hover:bg-[#1F3044]/10 text-sm text-[#1F3044] font-[Inter] ${sortOrder === "title-asc" ? "bg-gray-200 font-medium" : ""}`}>Title A–Z
                    </button>

                    <button onClick={() => {setSortOrder("title-desc"); setCurrentPage(1); setIsSortOpen(false);}}
                      className={`w-full text-left px-4 py-3 hover:bg-[#1F3044]/10 text-sm text-[#1F3044] font-[Inter] ${sortOrder === "title-desc" ? "bg-gray-200 font-medium" : ""}`}>Title Z–A
                    </button>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="w-[200px] flex justify-end">
                <p className="text-[#1F3044] text-[15px] w-[200px] text-right whitespace-nowrap">Showing {startItem}-{endItem} of {totalProducts}</p>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
              {paginatedProducts.map((product) => (
                <Link to={`/ProductDetail/${product.id}`} key={product.id} className="group p-2 bg-white flex flex-col gap-2 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  {/* Product Card Image */}
                  <div className="w-full aspect-square bg-[#1F3044]/10 overflow-hidden">
                    <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover"/>
                  </div>
                  {/* Product Title */}
                  <p className="text-[#1F3044] text-[16px] leading-[19px]">{product.title}</p>
                  {/* Product Price */}
                  <p className="text-[#1F3044] text-[15px] leading-[20px]">${product.price}</p>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end w-full gap-3 mt-10">
              {Array.from({ length: endPage - startPage + 1 }).map((_, i) => {
                const page = startPage + i;
                return (
                  <span key={page} onClick={() => setCurrentPage(page)} className={`flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer text-[15px]
                      ${
                        currentPage === page
                          ? "bg-[#1F3044] text-white"
                          : "text-[#1F3044]"
                      }`}
                  >
                    {page}
                  </span>
                );
              })}
              {/* Next (>) */}
              <span onClick={handleNextGroup} className="flex items-center justify-center w-9 h-9 rounded-lg text-[#1F3044] cursor-pointer">&gt;</span>
            </div>
          </section>

          {/* ----------- Sidebar ----------- */}
          <aside className="lg:col-span-1 lg:ml-6 text-[#1F3044]">
            {/* Categories Container */}
            <div className="flex flex-col gap-4 w-full max-w-[240px]">
              {/* Title */}
              <h2 className="text-[15px] leading-[20px] font-normal" style={{fontFamily: "Inter"}}>Categories</h2>

              {/* Checkboxes */}
              <div className="flex flex-col gap-2 w-full">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectedCategory === cat} onChange={() => {
                      if(selectedCategory === cat){
                          setSelectedCategory("");
                        }else{
                          setSelectedCategory(cat);
                        }
                        setCurrentPage(1);
                    }} className="w-6 h-6 accent-[#1F3044]"/>
                    <span className="text-[15px] leading-[20px] font-normal text-[#1F3044]" style={{fontFamily: "Inter"}}>{formatCategory(cat)}</span>
                  </label>
                ))}
              </div>
              {/* Divider */}
              <hr className="w-[340px] border-t border-black" />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
