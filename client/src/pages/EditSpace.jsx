import React, { useState, useRef, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Inbox, Heart, Edit, Share2, Video, Edit3, Image as ImageIcon, Check, Moon, Sun } from "lucide-react";
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

const collectionTypeMap = {
  both: "Text and video",
  text: "Text only",
  video: "Video only",
};

const collectionTypeReverseMap = {
  "Text and video": "both",
  "Text only": "text",
  "Video only": "video",
};

export default function EditSpace() {
  const { activeSpace, selectSpace } = useContext(SpaceContext);

  const [form, setForm] = useState({
    spaceName: "",
    headerTitle: "",
    customMessage: "",
    collectStarRatings: false,
    theme: "light",
    collectName: true,
    collectEmail: true,
    collectionType: "Text and video",
    logoUrl: null
  });

  const [logoFile, setLogoFile] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (activeSpace) {
      setForm({
        spaceName: activeSpace.name || "",
        headerTitle: activeSpace.headerTitle || "",
        customMessage: activeSpace.customMessage || "",
        collectStarRatings: activeSpace.allowStarRating || false,
        theme: activeSpace.theme || "light",
        collectName: activeSpace.collectName ?? true,
        collectEmail: activeSpace.collectEmail ?? true,
        collectionType: collectionTypeMap[activeSpace.collectionType] || "Text and video",
        logoUrl: activeSpace.logo || null,
      });
    }
  }, [activeSpace]);

  const handleSave = async () => {
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
    formData.append("collectionType", collectionTypeReverseMap[form.collectionType] || "both");
    formData.append("allowStarRating", form.collectStarRatings);
    formData.append("theme", form.theme);
    if (logoFile) formData.append("logo", logoFile);

    setSubmitting(true);
    try {
      const res = await api.patch(`/workspace/${activeSpace._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      selectSpace(res.data.workspace);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } 
    catch (err) {
      setError(err.response?.data?.message || "Failed to save changes.");
    } 
    finally {
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
    <div className="flex h-screen bg-[#0A0A0A] font-sans text-white overflow-hidden">
      <aside className="w-64 bg-[#0A0A0A] flex flex-col h-full flex-shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-extrabold tracking-tight mb-8">Proof</h1>
          
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-8 px-3 py-2.5 bg-[#1F1F1F] rounded-xl border border-[#2A2A2A]">
            <div className="w-8 h-8 rounded-lg bg-[#333333] flex items-center justify-center text-sm font-bold font-serif text-white overflow-hidden">
              {activeSpace?.logo ? (
                <img src={activeSpace.logo} alt="logo" className="w-full h-full object-cover" />
              ) : (
                (activeSpace?.name || "S").charAt(0).toUpperCase()
              )}
            </div>
            <span className="text-[15px] font-bold text-white tracking-wide truncate">{activeSpace?.name || "My Space"}</span>
          </div>

          <nav className="space-y-1">
             <Link to="/inbox" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-xl text-[15px] font-semibold transition-colors">
               <Inbox className="w-[18px] h-[18px]" /> Inbox
             </Link>
             <Link to="/wall-of-love" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-xl text-[15px] font-semibold transition-colors">
               <Heart className="w-[18px] h-[18px]" /> Wall of Love
             </Link>
          </nav>

          <nav className="space-y-1 mt-8">
             <Link to="/edit-space" className="w-full flex items-center gap-3 px-4 py-3 bg-[#1A1A1A] text-white rounded-xl text-[15px] font-semibold transition-colors">
               <Edit className="w-[18px] h-[18px]" /> Edit Space
             </Link>
             <Link to="/share" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-xl text-[15px] font-semibold transition-colors">
               <Share2 className="w-[18px] h-[18px]" /> Share Link
             </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0A] border-l border-[#1F1F1F]">
        
        <header className="flex items-center justify-between px-8 py-5 border-b border-[#1F1F1F] bg-[#0A0A0A]">
          <h2 className="text-xl font-bold">Edit Space</h2>
        </header>

        <div className="flex-1 overflow-auto bg-white">
           <div className="flex flex-col md:flex-row h-full min-h-max">
             
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

             <div className="w-full md:w-[55%] p-8 overflow-y-auto bg-white text-black text-left">
                <div className="space-y-6">
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700">Space name *</Label>
                    <Input 
                      placeholder="e.g. My Awesome Space" 
                      value={form.spaceName}
                      onChange={(e) => setForm({...form, spaceName: e.target.value})}
                      className="bg-white border-gray-200 focus-visible:ring-[#5D5FEF]" 
                    />
                    <p className="text-[11px] text-gray-400">Public URL is: useproof.io/{form.spaceName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</p>
                  </div>

                  <div className="space-y-3">
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
                        Change Logo
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
                          Name, email 
                          <span className="text-gray-900 text-xs">▼</span>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[320px] bg-white border border-gray-100 shadow-xl rounded-xl p-0" align="start">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <Switch checked={form.collectName} onCheckedChange={(val) => setForm({...form, collectName: val})} className="data-[state=checked]:bg-[#5D5FEF] data-[state=unchecked]:bg-gray-200 scale-90" />
                            <span className="text-sm text-gray-900 font-medium">Name</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <Switch checked={form.collectEmail} onCheckedChange={(val) => setForm({...form, collectEmail: val})} className="data-[state=checked]:bg-[#5D5FEF] data-[state=unchecked]:bg-gray-200 scale-90" />
                            <span className="text-sm text-gray-900 font-medium">Email</span>
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex flex-wrap items-center justify-between pt-4 pb-8 gap-y-4">
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold text-gray-600">Collection type</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="border border-gray-200 rounded-md px-3 py-1.5 text-xs text-gray-700 bg-white min-w-[130px] flex justify-between items-center cursor-pointer">
                            {form.collectionType} <span className="text-gray-400">▼</span>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48 bg-[#444444] border-0 text-white rounded-xl shadow-2xl p-2" align="start">
                          <DropdownMenuItem onClick={() => setForm({...form, collectionType: "Text and video"})} className="flex items-center gap-2 p-2 focus:bg-[#555] cursor-pointer rounded-lg text-sm font-medium">
                            <div className="w-4 flex justify-center">{form.collectionType === "Text and video" && <Check className="w-4 h-4" />}</div>
                            Text and video
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setForm({...form, collectionType: "Text only"})} className="flex items-center gap-2 p-2 focus:bg-[#555] cursor-pointer rounded-lg text-sm font-medium">
                            <div className="w-4 flex justify-center">{form.collectionType === "Text only" && <Check className="w-4 h-4" />}</div>
                            Text only
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setForm({...form, collectionType: "Video only"})} className="flex items-center gap-2 p-2 focus:bg-[#555] cursor-pointer rounded-lg text-sm font-medium">
                            <div className="w-4 flex justify-center">{form.collectionType === "Video only" && <Check className="w-4 h-4" />}</div>
                            Video only
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold text-gray-600">Collect star ratings</Label>
                      <div className="flex items-center h-8">
                        <Switch checked={form.collectStarRatings} onCheckedChange={(val) => setForm({...form, collectStarRatings: val})} className="data-[state=checked]:bg-[#5D5FEF] data-[state=unchecked]:bg-gray-200" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold text-gray-600">Theme</Label>
                      <div className="flex items-center h-8 gap-3">
                         <Switch 
                           checked={form.theme === "dark"} 
                           onCheckedChange={(val) => setForm({...form, theme: val ? "dark" : "light"})} 
                           className="data-[state=checked]:bg-[#5D5FEF] data-[state=unchecked]:bg-gray-200" 
                         />
                         {form.theme === "dark" ? <Moon className="w-4 h-4 text-gray-700" /> : <Sun className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-500 text-xs font-medium">{error}</p>
                  )}

                  <Button
                    onClick={handleSave}
                    disabled={submitting}
                    className="w-full bg-[#5D5FEF] hover:bg-[#4F51D6] text-white py-6 rounded-lg font-bold text-base shadow-lg shadow-indigo-500/20"
                  >
                    {submitting ? "Saving..." : "Save Changes"}
                  </Button>

                  {isSaved && (
                    <p className="text-center text-sm font-medium text-[#22C55E] mt-3 pb-4">
                      Space settings saved successfully!
                    </p>
                  )}

                </div>
             </div>

           </div>
        </div>
      </main>
    </div>
  );
}
