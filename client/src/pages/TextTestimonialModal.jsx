import React, { useRef, useState } from "react";
import { X, Package, Star, Upload, User, Image as ImageIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function TextTestimonialModal({ onClose, spaceSlug, space }) {
  const spaceName = space?.name || "this space";
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [testimonial, setTestimonial] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [attachedImage, setAttachedImage] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const attachedImageRef = useRef(null);
  const userPhotoRef = useRef(null);
  const navigate = useNavigate();

  const handleSend = async () => {
    setError("");
    if (!name.trim()) return setError("Your name is required.");
    if (!email.trim()) return setError("Your email is required.");
    if (testimonial.trim().length < 30) return setError("Testimonial must be at least 30 characters.");
    if (!permissionGranted) return setError("You must grant permission to submit.");

    setSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/public/${spaceSlug}`, {
        type: "text",
        name: name.trim(),
        email: email.trim(),
        rating,
        message: testimonial.trim(),
        consent: true,
      });
      onClose();
      navigate("/thank-you");
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAttachedImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUserPhoto = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUserPhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm shadow-2xl overflow-y-auto">
      <div className="w-full max-w-[600px] bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 md:p-8 mt-10 mb-10 relative text-left relative flex flex-col">
        
        <button 
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>


        <div className="flex items-center gap-4 mb-8 pr-8">
          <div className="w-12 h-12 rounded-full bg-[#2A2A2A] flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-gray-400" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Write text testimonial to {spaceName}
          </h2>
        </div>


        <div className="mb-6">
          <h3 className="text-sm font-bold text-white mb-4 border-b border-[#333] pb-2">Questions</h3>
          <ul className="space-y-3 text-[#A1A1AA] text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[#666] leading-none mt-[2px]">•</span> 
              Who are you / what are you working on?
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#666] leading-none mt-[2px]">•</span> 
              How has our product helped you?
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#666] leading-none mt-[2px]">•</span> 
              What is the best thing?
            </li>
          </ul>
        </div>


        <div className="flex items-center gap-1 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-7 h-7 cursor-pointer transition-colors ${
                star <= (hoveredRating || rating)
                  ? "fill-amber-500 text-amber-500"
                  : "fill-transparent text-[#444]"
              }`}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>


        <Textarea 
          placeholder="Your testimonial here..."
          value={testimonial}
          onChange={(e) => setTestimonial(e.target.value)}
          className="w-full bg-[#111111] border-[#2A2A2A] text-white placeholder:text-gray-500 min-h-[150px] resize-none focus-visible:ring-1 focus-visible:ring-gray-600 rounded-xl mb-6 p-4"
        />

        <div className="mb-6">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Attach Image(s)
          </label>
          <div className="flex items-center gap-3">
             <input type="file" accept="image/*" className="hidden" ref={attachedImageRef} onChange={handleAttachedImage} />
             <Button 
                variant="outline" 
                onClick={() => attachedImageRef.current?.click()}
                className="bg-transparent border-[#333] hover:bg-[#2A2A2A] text-white h-9 px-4 text-xs font-semibold rounded-lg flex items-center gap-2"
              >
                <ImageIcon className="w-3.5 h-3.5" /> Choose file
              </Button>
              {attachedImage && (
                <div className="w-9 h-9 rounded bg-[#2A2A2A] border border-[#3A3A3A] overflow-hidden flex items-center justify-center">
                   <img src={attachedImage} alt="Attached" className="w-full h-full object-cover" />
                </div>
              )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Your Name <span className="text-red-500">*</span>
            </label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#111111] border-[#2A2A2A] text-white focus-visible:ring-1 focus-visible:ring-gray-600 rounded-lg h-10"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Your Email <span className="text-red-500">*</span>
            </label>
            <Input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111111] border-[#2A2A2A] text-white focus-visible:ring-1 focus-visible:ring-gray-600 rounded-lg h-10"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Upload Your Photo
          </label>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#111111] border border-[#2A2A2A] shadow-inner flex items-center justify-center overflow-hidden flex-shrink-0">
              {userPhoto ? (
                <img src={userPhoto} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-[#444]" />
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" ref={userPhotoRef} onChange={handleUserPhoto} />
            <Button 
                variant="outline" 
                onClick={() => userPhotoRef.current?.click()}
                className="bg-transparent border-[#333] hover:bg-[#2A2A2A] text-white h-9 px-4 text-xs font-semibold rounded-lg flex items-center gap-2"
              >
                Choose file
            </Button>
          </div>
        </div>

        <div className="flex items-start gap-3 mb-8 cursor-pointer" onClick={() => setPermissionGranted(!permissionGranted)}>
          <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${permissionGranted ? 'border-green-500 bg-green-500' : 'border-[#444] bg-transparent'}`}>
            {permissionGranted && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
          </div>
          <span className="text-[#888888] text-xs leading-tight">
            I give permission to use this testimonial across social media and marketing materials.
          </span>
        </div>

        {error && (
          <p className="text-red-500 text-xs font-medium text-center mb-2">{error}</p>
        )}

        <div className="flex items-center justify-end gap-2 mt-auto">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-white hover:bg-[#2A2A2A] hover:text-white px-6 h-11 rounded-lg font-semibold"
          >
            Cancel
          </Button>
          <Button
            disabled={!permissionGranted || submitting}
            onClick={handleSend}
            className={`px-8 h-11 rounded-lg font-bold transition-colors ${
              permissionGranted && !submitting
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-[#333333] text-gray-500 cursor-not-allowed"
            }`}
          >
            {submitting ? "Sending..." : "Send"}
          </Button>
        </div>

      </div>
    </div>
  );
}
