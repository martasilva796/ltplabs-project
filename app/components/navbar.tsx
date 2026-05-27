import { useState, useEffect } from "react";

export default function Navbar() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                        {["Home", "Shop", "About", "Contact", "Blog"].map((item) => (
                            <div
                                key={item}
                                className="flex items-center text-[#1F3044]"
                                style={{
                                    fontFamily: "Inter",
                                    fontSize: "15px",
                                    lineHeight: "20px",}}>
                                <span>{item}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-0"><path fill="currentColor" d="M7 10l5 5 5-5H7z"/></svg>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Lado Direito */}
                <div className="flex items-center gap-4">

                    <div className="hidden lg:flex items-center gap-6">

                        <div className="w-6 h-6 flex items-center justify-center">
                        <i className="fa-solid fa-magnifying-glass text-[#1F3044]" />
                        </div>

                        <div className="w-6 h-6 flex items-center justify-center">
                        <i className="fa-regular fa-user text-[#1F3044]" />
                        </div>

                        <div className="w-6 h-6 flex items-center justify-center">
                        <i className="fa-solid fa-bag-shopping text-[#1F3044]" />
                        </div>
                    </div>
                    <div className="lg:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(true)}>
                            <i className="fa-solid fa-bars text-[#1F3044] text-xl"></i>
                        </button>
                    </div>
                </div>

            </div>

            {/* Divider */}
            <div className="w-full border-t border-black" />

            </nav>

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
                        <i className="fa-solid fa-xmark text-2xl text-[#1F3044]" />
                        </button>
                    </div>

                    {/* LINKS */}
                    <div className="flex flex-col gap-6">
                        {["Home", "Shop", "About", "Contact", "Blog"].map((item) => (
                        <button key={item} className="text-left text-[#1F3044] text-lg">{item}</button>
                        ))}
                    </div>

                    {/* ÍCONES */}
                    <div className="flex items-center gap-6 mt-10">
                        <i className="fa-solid fa-magnifying-glass text-[#1F3044]" />
                        <i className="fa-regular fa-user text-[#1F3044]" />
                        <i className="fa-solid fa-bag-shopping text-[#1F3044]" />
                    </div>
                </div>        
            </div>
        </>
    );
}