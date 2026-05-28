import type { Route } from "./+types/home";
import Navbar from "~/components/navbar";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { ChevronDown } from "lucide-react";

type Product = {
   id: number;
   title: string;
   price: number;
   thumbnail: string;
   category: string;
 };

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {

  const PRODUCTS_PER_PAGE = 9;
  const PAGES_PER_GROUP = 5;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  //const [products, setProducts] = useState<Product[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<
    "default" | "price-asc" | "price-desc" | "title-asc" | "title-desc"
  >("default");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement | null>(null);

  //FETCH all products once
  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data.products || []);
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredProducts = useMemo(() => {
    let data = [...allProducts];

    // FILTER BY CATEGORY
    if (selectedCategory) {
      data = data.filter((p) => p.category === selectedCategory);
    }

    // SORT
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //Paginação base
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const startItem = totalProducts === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(endIndex, totalProducts);

  //Paginação group
  const startPage = pageGroup * PAGES_PER_GROUP + 1;
  const endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages);

  const handleNextGroup = () => {
    const maxGroup = Math.floor((totalPages - 1) / PAGES_PER_GROUP);

    if (pageGroup >= maxGroup) {
      setPageGroup(0);
      setCurrentPage(1);
    } else {
      const newGroup = pageGroup + 1;
      setPageGroup(newGroup);
      setCurrentPage(newGroup * PAGES_PER_GROUP + 1);
    }
  };

  //Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.category));
    return Array.from(set);
  }, [allProducts]);

  const formatCategory = (cat: string) =>
    cat
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div>
      <Navbar variant="home" />

      <main className="min-h-screen px-8 py-10">
        {/* GRID LAYOUT (MAIN + SIDEBAR) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ================= MAIN CONTENT ================= */}
          <section className="lg:col-span-3">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">

              {/* SORT */}
              <div className="relative" ref={sortRef}>
                <button onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 bg-white border border-[#1F3044] rounded-lg py-2 px-4 hover:opacity-80 transition">
                  <span className="text-[#1F3044] text-sm">Sort by</span>
                  <ChevronDown className="w-[14px] h-[14px] text-[#1F3044]" />
                </button>

                {/* DROPDOWN */}
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

              {/* INFO */}
              <div className="w-[200px] flex justify-end">
                <p className="text-[#1F3044] text-[15px] w-[200px] text-right whitespace-nowrap">Showing {startItem}-{endItem} of {totalProducts}</p>
              </div>
            </div>

            {/* PRODUCTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">

              {paginatedProducts.map((product) => (
                <Link to={`/ProductDetail/${product.id}`} key={product.id} className="group p-2 bg-white flex flex-col gap-2 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">

                  {/* IMAGE PLACEHOLDER */}
                  <div className="w-full aspect-square bg-[#1F3044]/10 overflow-hidden">
                    <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover"/>
                  </div>

                  {/* TITLE */}
                  <p className="text-[#1F3044] text-[16px] leading-[19px]">{product.title}</p>

                  {/* PRICE */}
                  <p className="text-[#1F3044] text-[15px] leading-[20px]">${product.price}</p>

                </Link>
              ))}

            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-end w-full gap-3 mt-10">

              {Array.from({ length: endPage - startPage + 1 }).map((_, i) => {
                const page = startPage + i;

                return (
                  <span
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer text-[15px]
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

              {/* NEXT (>) */}
              <span
                onClick={handleNextGroup}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-[#1F3044] cursor-pointer"
              >
                &gt;
              </span>

            </div>

          </section>

          {/* ================= SIDEBAR ================= */}
          <aside className="lg:col-span-1 lg:ml-6 text-[#1F3044]">

            {/* CATEGORIES CONTAINER */}
            <div className="flex flex-col gap-4 w-full max-w-[240px]">

              {/* TITLE */}
              <h2
                className="text-[15px] leading-[20px] font-normal"
                style={{ fontFamily: "Inter" }}
              >
                Categories
              </h2>

              {/* CHECKBOX GROUP */}
              <div className="flex flex-col gap-2 w-full">

                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectedCategory === cat} onChange={() => {
                      if (selectedCategory === cat) {
                          setSelectedCategory("");
                        } else {
                          setSelectedCategory(cat);
                        }
                        setCurrentPage(1);
                    }} className="w-6 h-6 accent-[#1F3044]"/>
                    <span className="text-[15px] leading-[20px] font-normal text-[#1F3044]" style={{ fontFamily: 'Inter' }}>{formatCategory(cat)}</span>
                  </label>
                ))}
              </div>

              {/* DIVIDER */}
              <hr className="w-[340px] border-t border-black" />

            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
