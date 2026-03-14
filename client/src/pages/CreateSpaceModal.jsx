import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { X, Video, Edit3, Image as ImageIcon, Check, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "../lib/api";
import { SpaceContext } from "../context/SpaceContext";
import { track } from "../analytics.jsx";

export default function CreateSpaceModal({ onClose }) {
  const { selectSpace } = useContext(SpaceContext);
  const [form, setForm] = useState({
    spaceName: "",
    headerTitle: "Your Header Here",
    customMessage: "Your custom message will appear here to welcome your customers.",
    collectStarRatings: true,
    theme: "light",
    collectName: true,
    collectEmail: true,
    collectionType: "Text and video",
    logoUrl: null
  });
  const [logoFile, setLogoFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const collectionTypeMap = {
    "Text and video": "both",
    "Text only": "text",
    "Video only": "video",
  };

  React.useEffect(() => {
    track("create_space_modal_view");
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (!form.spaceName.trim()) return setError("Space name is required.");
    if (!form.headerTitle.trim()) return setError("Header title is required.");
    if (form.customMessage.trim().length < 30) return setError("Custom message must be at least 30 characters.");

    const formData = new FormData();
    formData.append("name", form.spaceName.trim());
    formData.append("headerTitle", form.headerTitle.trim());
    formData.append("customMessage", form.customMessage.trim());
    formData.append("collectName", form.collectName);
    formData.append("collectEmail", form.collectEmail);
    formData.append("collectionType", collectionTypeMap[form.collectionType] || "both");
    formData.append("allowStarRating", form.collectStarRatings);
    formData.append("theme", form.theme);
    if (logoFile) formData.append("logo", logoFile);

    setSubmitting(true);
    try {
      const res = await api.post("/workspace", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      track("space_created_success", { spaceName: form.spaceName });
      selectSpace(res.data.workspace);
      navigate("/space-success");
    } catch (err) {
      track("space_created_error", { error: err.response?.data?.message || err.message });
      setError(err.response?.data?.message || "Failed to create space. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const imageUrl = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, logoUrl: imageUrl }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
      <div className="w-full max-w-5xl max-h-[90vh] flex flex-col bg-white rounded-xl overflow-hidden shadow-2xl">
        
       

        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          
          <div className="w-full md:w-[45%] bg-[#F9FAFB] border-r border-gray-200 p-8 flex flex-col relative overflow-y-auto">
            <div className="inline-flex items-center bg-[#D1FADF] text-[#047857] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-8 self-start">
              Live Preview - Testimonial Page
            </div>

            <div className={`rounded-2xl shadow-sm border p-8 flex-1 flex flex-col items-center text-center transition-colors duration-300 ${form.theme === "dark" ? "bg-[#111111] border-[#2A2A2A]" : "bg-white border-gray-100"}`}>
              <div className={`w-24 h-24 rounded-xl mb-6 shadow-inner flex items-center justify-center overflow-hidden ${form.theme === "dark" ? "bg-[#1A1A1A]" : "bg-gray-100"}`}>
                 {form.logoUrl ? (
                   <img src={form.logoUrl} alt="Live Preview Logo" className="w-full h-full object-cover" />
                 ) : (
                   <ImageIcon className={`w-8 h-8 ${form.theme === "dark" ? "text-gray-600" : "text-gray-300"}`} />
                 )}
              </div>
              
              <h2 className={`text-2xl font-bold mb-3 ${form.theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {form.headerTitle || "Your Header Here"}
              </h2>
              <p className={`text-sm mb-8 max-w-sm ${form.theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                {form.customMessage || "Your custom message will appear here..."}
              </p>

              <div className="w-full text-left mb-8">
                <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${form.theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>Questions</p>
                <ul className={`space-y-3 text-sm ${form.theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  <li className="flex items-start gap-2"><span className={form.theme === "dark" ? "text-gray-600" : "text-gray-300"}>•</span> Who are you / what are you working on?</li>
                  <li className="flex items-start gap-2"><span className={form.theme === "dark" ? "text-gray-600" : "text-gray-300"}>•</span> How has our service helped you?</li>
                  <li className="flex items-start gap-2"><span className={form.theme === "dark" ? "text-gray-600" : "text-gray-300"}>•</span> What is the best thing about our service?</li>
                  <li className="flex items-start gap-2"><span className={form.theme === "dark" ? "text-gray-600" : "text-gray-300"}>•</span> What we can improve in our product?</li>

                </ul>
              </div>

              <div className="w-full space-y-3 mt-auto">
                <Button className="w-full bg-[#5D5FEF] hover:bg-[#4F51D6] text-white py-6 rounded-lg font-semibold flex items-center justify-center gap-2">
                  <Video className="w-5 h-5" /> Record a video
                </Button>
                <Button variant="outline" className="w-full bg-[#1A1A1A] text-white border-0 hover:bg-[#333] hover:text-white py-6 rounded-lg font-semibold flex items-center justify-center gap-2">
                  <Edit3 className="w-5 h-5" /> Send in text
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[55%] p-8 overflow-y-auto bg-white text-black text-left relative">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-8 mt-2">Create Space</h1>

            <div className="space-y-6">
              
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700">Space name *</Label>
                <Input 
                  placeholder="Enter Your Space Name" 
                  value={form.spaceName}
                  onChange={(e) => setForm({...form, spaceName: e.target.value})}
                  className="bg-white border-gray-200 focus-visible:ring-[#5D5FEF]" 
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  
            
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shadow-sm overflow-hidden">
                    {form.logoUrl ? (
                      <img src={form.logoUrl} alt="Logo preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleLogoUpload} 
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 text-xs font-medium bg-white text-black border-gray-200"
                  >
                    Upload
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700">Header title *</Label>
                <Input 
                  value={form.headerTitle}
                  onChange={(e) => setForm({...form, headerTitle: e.target.value})}
                  className="bg-white border-gray-200 focus-visible:ring-[#5D5FEF]" 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700">Your custom message *</Label>
                <Textarea 
                  value={form.customMessage}
                  onChange={(e) => setForm({...form, customMessage: e.target.value})}
                  className="bg-white border-gray-200 focus-visible:ring-[#5D5FEF] min-h-[100px] resize-none" 
                />
                <p className="text-[11px] text-gray-400">Markdown supported</p>
              </div>

              <div className="space-y-2 relative">
                <Label className="text-xs font-bold text-gray-700">Collect extra information ⓘ</Label>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="w-full border border-[#5D5FEF] rounded-md p-2.5 text-sm text-gray-900 font-medium bg-white shadow-sm cursor-pointer flex justify-between items-center ring-2 ring-[#5D5FEF]/20">
                      {form.collectName && form.collectEmail ? "Name, email" : form.collectName ? "Name" : "Email"} 
                      <span className="text-gray-900 text-xs">▼</span>
                    </div>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent className="w-[320px] bg-white border border-gray-100 shadow-xl rounded-xl p-0" align="start">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <Switch 
                          checked={form.collectName} 
                          onCheckedChange={(val) => {
                            if (!val && !form.collectEmail) return; // Prevent turning off both
                            setForm({...form, collectName: val});
                          }} 
                          className="data-[state=checked]:bg-[#5D5FEF] data-[state=unchecked]:bg-gray-200 scale-90" 
                        />
                        <span className="text-sm text-gray-900 font-medium">Name</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <Switch 
                          checked={form.collectEmail} 
                          onCheckedChange={(val) => {
                            if (!val && !form.collectName) return; // Prevent turning off both
                            setForm({...form, collectEmail: val});
                          }} 
                          className="data-[state=checked]:bg-[#5D5FEF] data-[state=unchecked]:bg-gray-200 scale-90" 
                        />
                        <span className="text-sm text-gray-900 font-medium">Email</span>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between pt-4 pb-8"> 
                  

                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-gray-600">Collect star ratings</Label>
                  <div className="flex items-center h-8">
                    <Switch checked={form.collectStarRatings} onCheckedChange={(val) => setForm({...form, collectStarRatings: val})} className="data-[state=checked]:bg-[#5D5FEF] data-[state=unchecked]:bg-gray-200" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-gray-600">Choose a theme</Label>
                  <div className="flex items-center h-8 gap-3">
                     <Switch 
                       checked={form.theme === "dark"} 
                       onCheckedChange={(val) => setForm({...form, theme: val ? "dark" : "light"})} 
                       className="data-[state=checked]:bg-[#5D5FEF] data-[state=unchecked]:bg-gray-200" 
                     />
                     {form.theme === "dark" ? (
                       <Moon className="w-4 h-4 text-gray-700" />
                     ) : (
                       <Sun className="w-4 h-4 text-gray-400" />
                     )}
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs font-medium">{error}</p>
              )}

              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-[#5D5FEF] hover:bg-[#4F51D6] text-white py-6 rounded-lg font-bold text-base shadow-lg shadow-indigo-500/20"
              >
                {submitting ? "Creating..." : "Create new Space"}
              </Button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
