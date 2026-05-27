import type { Route } from "./+types/home";
import Navbar from "~/components/navbar";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
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
  const TOTAL_PRODUCTS = 100;

  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(0);

  // FETCH por página (API real pagination)
  useEffect(() => {
    const skip = (currentPage - 1) * PRODUCTS_PER_PAGE;

    const remaining = TOTAL_PRODUCTS - skip;
    const limit =
      remaining < PRODUCTS_PER_PAGE ? remaining : PRODUCTS_PER_PAGE;

    fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}&select=title,price,thumbnail`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch((err) => console.error(err));
  }, [currentPage]);

  // range "Showing X-Y of 100"
  const startItem = (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * PRODUCTS_PER_PAGE, TOTAL_PRODUCTS);

  // PAGINAÇÃO EM GRUPOS (1-5 > reset)
  const totalPages = Math.ceil(TOTAL_PRODUCTS / PRODUCTS_PER_PAGE);

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

  return (
    <div>
      <Navbar />

      <main className="px-8 py-10">
        {/* GRID LAYOUT (MAIN + SIDEBAR) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ================= MAIN CONTENT ================= */}
          <section className="lg:col-span-3">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">

              {/* SORT */}
              <button className="flex items-center gap-2 bg-white border border-[#1F3044] rounded-lg py-2 px-4 hover:opacity-80 transition">
                <span className="text-[#1F3044] text-sm">Sort by</span>
                <i className="fa-solid fa-chevron-down text-xs text-[#1F3044]"/>
              </button>

              {/* INFO */}
              <div className="w-[200px] flex justify-end">
                <p className="text-[#1F3044] text-[15px] w-[200px] text-right whitespace-nowrap">Showing {startItem}-{endItem} of {TOTAL_PRODUCTS}</p>
              </div>
            </div>

            {/* PRODUCTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">

              {products.map((product) => (
                <div key={product.id} className="flex flex-col gap-2">

                  {/* IMAGE PLACEHOLDER */}
                  <div className="w-full aspect-square bg-[#1F3044]/10 overflow-hidden">
                    <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover"/>
                  </div>

                  {/* TITLE */}
                  <p className="text-[#1F3044] text-[16px] leading-[19px]">{product.title}</p>

                  {/* PRICE */}
                  <p className="text-[#1F3044] text-[15px] leading-[20px]">${product.price}</p>

                </div>
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
          <aside className="lg:col-span-1 text-[#1F3044]">

            <h2 className="text-lg font-medium mb-4">
              Categories
            </h2>

            {/* CHECKLIST */}
            <div className="flex flex-col gap-3">

              {["Category 1", "Category 2", "Category 3", "Category 4"].map((cat) => (
                <label key={cat} className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>{cat}</span>
                </label>
              ))}

            </div>

            {/* DIVIDER */}
            <hr className="my-6 border-gray-300" />

          </aside>

        </div>

      </main>
    </div>
  );
}
