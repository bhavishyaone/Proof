import React, { useContext, useEffect, useState } from "react";
import { Plus, Search, ChevronDown, Loader2, MoreVertical, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { SpaceContext } from "../context/SpaceContext";
import { track } from "../analytics.jsx";
import api from "../lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const { selectSpace } = useContext(SpaceContext);
  const navigate = useNavigate();

  const displayName = user?.name || "User";
  const initial = displayName.charAt(0).toUpperCase();

  const [spaces, setSpaces] = useState([]);
  const [loadingSpaces, setLoadingSpaces] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalTestimonials, setTotalTestimonials] = useState(null);
  const [approvedCount, setApprovedCount] = useState(null);

  useEffect(() => {
    track("dashboard_view");
    const fetchSpaces = async () => {
      try {
        const res = await api.get("/workspace");
        const fetched = res.data.workspaces || [];
        setSpaces(fetched);


        let total = 0;
        let approved = 0;
        await Promise.all(
          fetched.map(async (space) => {
            try {
              const t = await api.get(`/workspace/${space._id}/testimonials`);
              total += t.data.total || 0;
              const approvedRes = await api.get(`/workspace/${space._id}/testimonials?status=approved`);
              approved += approvedRes.data.total || 0;
            } catch (_) {}
          })
        );
        setTotalTestimonials(total);
        setApprovedCount(approved);
      } catch (err) {
        console.error("Failed to fetch spaces:", err);
      } finally {
        setLoadingSpaces(false);
      }
    };
    fetchSpaces();
  }, []);

  const handleLogout = () => {
    track("user_logout");
    logout();
    navigate("/login", { replace: true });
  };


  const handleSelectSpace = (space) => {
    track("space_selected", { spaceId: space._id, spaceName: space.name });
    selectSpace(space);
    navigate("/inbox");
  };

  const [deletingSpaceId, setDeletingSpaceId] = useState(null);

  const handleDeleteSpace = async (e, spaceId) => {
    e.stopPropagation();
    const confirmed = window.confirm("Are you sure you want to delete this space? All testimonials will be permanently deleted.");
    if (!confirmed) return;
    setDeletingSpaceId(spaceId);
    try {
      await api.delete(`/workspace/${spaceId}`);
      track("space_deleted", { spaceId });
      setSpaces((prev) => prev.filter((s) => s._id !== spaceId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete space.");
    } finally {
      setDeletingSpaceId(null);
    }
  };


  const filteredSpaces = spaces.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col font-sans text-white">

      <header className="flex items-center justify-between px-8 py-5 border-b border-[#1A1A1A]">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-white font-bold text-lg tracking-tight">Proof</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:opacity-80 transition-opacity outline-none">
              <span className="text-sm font-medium">{displayName}</span>
              <Avatar className="w-8 h-8 rounded-full border border-[#2A2A2A]">
                <AvatarFallback className="bg-[#1A1A1A] text-white text-xs">{initial}</AvatarFallback>
              </Avatar>
              <ChevronDown className="w-4 h-4 text-[#6B6B6B]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-[#1A1A1A] border-[#2A2A2A] text-white">
            <DropdownMenuItem
              onClick={handleLogout}
              className="focus:bg-[#2A2A2A] focus:text-white cursor-pointer text-red-400 focus:text-red-400"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-8 flex flex-col gap-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 bg-[#1A1A1A] border-[#2A2A2A] shadow-none rounded-2xl">
            <CardContent className="p-6">
              <p className="text-[#6B6B6B] text-xs font-semibold tracking-widest uppercase mb-2">Total Spaces</p>
              <p className="text-3xl font-bold text-white">
                {loadingSpaces ? <Loader2 className="w-6 h-6 animate-spin text-[#6B6B6B]" /> : spaces.length}
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-1 bg-[#1A1A1A] border-[#2A2A2A] shadow-none rounded-2xl">
            <CardContent className="p-6">
              <p className="text-[#6B6B6B] text-xs font-semibold tracking-widest uppercase mb-2">Total Testimonials</p>
              <p className="text-3xl font-bold text-white">
                {loadingSpaces ? <Loader2 className="w-6 h-6 animate-spin text-[#6B6B6B]" /> : (totalTestimonials ?? "—")}
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-1 bg-[#1A1A1A] border-[#2A2A2A] shadow-none rounded-2xl">
            <CardContent className="p-6">
              <p className="text-[#6B6B6B] text-xs font-semibold tracking-widest uppercase mb-2">Approved</p>
              <p className="text-3xl font-bold text-[#22C55E]">
                {loadingSpaces ? <Loader2 className="w-6 h-6 animate-spin text-[#6B6B6B]" /> : (approvedCount ?? "—")}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Your Spaces</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
              <Input
                type="text"
                placeholder="Search spaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-[#111111] border-[#2A2A2A] text-white placeholder:text-[#6B6B6B] focus-visible:ring-0 focus-visible:border-white transition-colors duration-150 rounded-lg w-full md:w-64 h-10"
              />
            </div>
            <Link to="/create-space" onClick={() => track("create_space_click")}>
              <Button className="bg-white text-black hover:bg-gray-100 font-semibold h-10 px-4 rounded-lg flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create a new space
              </Button>
            </Link>
          </div>
        </div>

        {loadingSpaces ? (
          <div className="flex-1 flex items-center justify-center mt-8">
            <Loader2 className="w-8 h-8 animate-spin text-[#6B6B6B]" />
          </div>
        ) : filteredSpaces.length === 0 ? (
          <div className="flex-1 flex items-center justify-center mt-8 mb-16">
            <div className="w-full max-w-2xl border-2 border-dashed border-[#2A2A2A] rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-[#0A0A0A]">
              <Link to="/create-space" onClick={() => track("create_space_click_empty_state")} className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center mb-6 hover:bg-[#222] transition-colors group">
                <Plus className="w-5 h-5 text-[#6B6B6B] group-hover:text-white transition-colors" />
              </Link>
              <h3 className="text-lg font-semibold text-white mb-2">Create new space</h3>
              <p className="text-[#6B6B6B] text-sm max-w-sm">
                {searchQuery ? "No spaces match your search." : "Get started by creating your first space to collect proof."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-2 mb-16">
            {filteredSpaces.map((space) => (
              <div
                key={space._id}
                onClick={() => handleSelectSpace(space)}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 cursor-pointer hover:border-white/20 hover:bg-[#222] transition-all duration-150 group relative"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#2A2A2A] flex items-center justify-center text-base font-bold text-white flex-shrink-0 overflow-hidden">
                    {space.logo ? (
                      <img src={space.logo} alt={space.name} className="w-full h-full object-cover" />
                    ) : (
                      space.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-semibold text-sm truncate group-hover:text-white">{space.name}</p>

                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg hover:bg-[#2A2A2A] text-[#6B6B6B] hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-40 bg-[#1A1A1A] border-[#2A2A2A] text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenuItem
                        onClick={(e) => handleDeleteSpace(e, space._id)}
                        disabled={deletingSpaceId === space._id}
                        className="text-red-400 focus:text-red-400 focus:bg-[#2A2A2A] cursor-pointer flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {deletingSpaceId === space._id ? "Deleting..." : "Delete Space"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between text-xs text-[#6B6B6B]">


                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-[#1A1A1A] py-6 px-8 flex items-center justify-center">
        <p className="text-[#6B6B6B] text-xs">© 2026 Proof Inc.</p>
      </footer>
    </div>
  );
}
