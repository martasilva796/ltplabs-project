import { useState, useEffect } from "react";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "~/context/CartContext";
import { Link } from "react-router";

const homeLinks = ["Home", "Shop", "About", "Contact", "Blog"];
const productLinks = ["Home", "Shop", "Deals", "Contact", "Account"];

export default function Navbar({ variant = "home" }: { variant?: "home" | "product" }) {

    //Para Pesquisa
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!searchQuery) {
            setResults([]);
            return;
        }

        const delay = setTimeout(() => {
            setLoading(true);

            fetch(`https://dummyjson.com/products/search?q=${searchQuery}`)
                .then(res => res.json())
                .then(data => {
                    const query = searchQuery.toLowerCase();

                    const sorted = data.products.sort((a: any, b: any) => {
                        const aMatch = a.title.toLowerCase().startsWith(query);
                        const bMatch = b.title.toLowerCase().startsWith(query);

                        if (aMatch && !bMatch) return -1;
                        if (!aMatch && bMatch) return 1;
                        return 0;
                    });

                    setResults(sorted.slice(0, 8));
                    setLoading(false);
                });
        }, 300);

        return () => clearTimeout(delay);
    }, [searchQuery]);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setSearchOpen(false);
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (searchOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [searchOpen]);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { count } = useCart();

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                setIsMenuOpen(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <>
            <nav className="w-full bg-white border-b border-black">
            
            {/* Container principal */}
            <div className="flex items-center justify-between px-8 py-4">

                {/* Lado Esquerdo */}
                <div className="flex items-center">
                    <span className="text-[#1F3044] whitespace-nowrap text-[24px] lg:text-[18px] lg:text-[22px]"
                        style={{
                        fontFamily: "Bebas Neue",
                        lineHeight: "1",
                        letterSpacing: "0.06em",
                        }}>THE ONLINE STORE
                    </span>
                </div>

                {/* Centro */}
                <div className="hidden lg:flex flex-1 justify-center">
                    <div className="flex items-center gap-8 whitespace-nowrap">
                        {(variant === "product" ? productLinks : homeLinks).map((item) => (
                            <Link
                                key={item}
                                to="/"
                                className="flex items-center text-[#1F3044] transition-all duration-200 hover:opacity-70 hover:translate-y-[-1px]"
                                style={{
                                    fontFamily: "Inter",
                                    fontSize: "15px",
                                    lineHeight: "20px",}}>
                                <span>{item}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-0"><path fill="currentColor" d="M7 10l5 5 5-5H7z"/></svg>
                            </Link>
                        ))}
                    </div>

                </div>

                {/* Lado Direito */}
                <div className="flex items-center gap-4">

                    <div className="hidden lg:flex items-center gap-6">

                        <button className="w-6 h-6 flex items-center justify-center" onClick={() => setSearchOpen(true)}>
                            <Search className="w-[18px] h-[18px] text-[#1F3044]" />
                        </button>

                        <div className="w-6 h-6 flex items-center justify-center">
                            <User className="w-[18px] h-[18px] text-[#1F3044]" />
                        </div>
                        
                        <Link to="/ShoppingCart" className="relative w-6 h-6 flex items-center justify-center">
                            <ShoppingBag className="w-[18px] h-[18px] text-[#1F3044]" />
                            {count > 0 && (
                                <span className="absolute -top-2 -right-2 translate-x-[2px] translate-y-[-2px] bg-[#1F3044] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-medium">
                                {count}
                                </span>
                            )}
                        </Link>
                    </div>
                    <div className="lg:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(true)}>
                            <Menu className="w-[18px] h-[18px] text-[#1F3044] text-xl"/>
                        </button>
                    </div>
                </div>

            </div>

            {/* Divider */}
            <div className="w-full border-t border-black" />

            </nav>
            {searchOpen && (
                <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-md overflow-y-auto flex flex-col items-center pt-32 px-6">
                    
                    {/* CLOSE AREA */}
                    <button
                    onClick={() => setSearchOpen(false)}
                    className="absolute top-6 right-6"
                    >
                    <X className="w-[20px] h-[20px] text-[#1F3044]" />
                    </button>

                    {/* INPUT */}
                    <div className="w-full max-w-2xl">
                    <input
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full border border-[#1F3044] rounded-lg px-4 py-3 text-sm text-[#1F3044]"
                    />
                    </div>

                    {/* RESULTS */}
                    {(loading || results.length > 0 || searchQuery) && (
                        <div className="w-full max-w-2xl mt-6 flex flex-col gap-2 bg-white rounded-2xl border border-[#1F3044]/10 p-2 shadow-sm">
                        
                        {loading && (
                            <p className="text-sm text-[#1F3044]">Loading...</p>
                        )}

                        {!loading && results.length > 0 && (
                            results.map((item: any) => (
                            <Link key={item.id} to={`/ProductDetail/${item.id}`} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 p-3 rounded hover:bg-[#1F3044]/5 text-sm text-[#1F3044]">
                                {item.title}
                            </Link>
                            ))
                        )}
                        {!loading && searchQuery && results.length === 0 && (
                            <p className="text-sm text-[#1F3044]/60 p-3">No results found for "{searchQuery}"</p>
                        )}
                        </div>
                    )}
                </div>
                )}

            <div className={`fixed inset-0 z-50 transition-all duration-300 ${isMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>

                {/* OVERLAY */}
                <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* PANEL */}
                <div className={`absolute right-0 top-0 h-full w-72 bg-white shadow-lg p-6 transform transition-transform duration-300 ${
                    isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
                >

                    {/* CLOSE */}
                    <div className="flex justify-end mb-8">
                        <button onClick={() => setIsMenuOpen(false)}>
                        <X className="w-[18px] h-[18px] text-[#1F3044]" />
                        </button>
                    </div>

                    {/* LINKS */}
                    <div className="flex flex-col gap-6">
                        {(variant === "product" ? productLinks : homeLinks).map((item) => (
                        <Link key={item} to="/" className="text-left text-[#1F3044] transition-all duration-200 hover:opacity-70 hover:translate-y-[-1px]">{item}</Link>
                        ))}
                    </div>

                    {/* ÍCONES */}
                    <div className="flex items-center gap-6 mt-10">
                        <button onClick={() => setSearchOpen(true)}>
                            <Search className="w-[18px] h-[18px] text-[#1F3044]" />
                        </button>
                        <User className="w-[18px] h-[18px] text-[#1F3044]" />
                        <Link to="/ShoppingCart" className="relative w-6 h-6 flex items-center justify-center">
                            <ShoppingBag className="w-[18px] h-[18px] text-[#1F3044]" />
                            {count > 0 && (
                                <span className="absolute -top-2 -right-2 bg-white border border-[#1F3044] text-[#1F3044] text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-medium">
                                {count}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>        
            </div>
        </>
    );
}