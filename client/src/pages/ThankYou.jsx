import React, { useEffect } from "react";
import { Check, Package } from "lucide-react";
import { track } from "../analytics.jsx";

export default function ThankYou({ theme = "dark" }) {
  useEffect(() => {
    track("thank_you_page_view");
  }, []);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden transition-colors duration-300 ${theme === "dark" ? "bg-[#0A0A0A]" : "bg-gray-50"}`}>
      

      <div className="flex flex-col items-center justify-center text-center z-10 max-w-lg mx-auto w-full px-4">
        
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-8 shadow-inner border transition-colors duration-300 ${theme === "dark" ? "bg-[#2A2A2A] border-[#3A3A3A]" : "bg-gray-100 border-gray-200"}`}>
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
        </div>
        
        <h1 className={`text-3xl md:text-4xl font-extrabold mb-4 tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Thank you for your testimonial! 
        </h1>
        
        <p className={`text-base md:text-lg leading-relaxed max-w-md ${theme === "dark" ? "text-[#888888]" : "text-gray-500"}`}>
          Your feedback means a lot to us. We truly appreciate you taking the time to share your experience.
        </p>

      </div>

    </div>
  );
}
