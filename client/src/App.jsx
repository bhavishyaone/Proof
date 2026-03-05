import { AuthProvider } from "./context/AuthContext.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateSpaceModal from "./pages/CreateSpaceModal.jsx";
import EditSpace from "./pages/EditSpace.jsx";
import SpaceSuccessModal from "./pages/SpaceSuccessModal.jsx";
import SpaceInbox from "./pages/SpaceInbox.jsx";
import WallOfLove from "./pages/WallOfLove.jsx";
import WallConfiguration from "./pages/WallConfiguration.jsx";
import PublicTestimonial from "./pages/PublicTestimonial.jsx";
import ThankYou from "./pages/ThankYou.jsx";
import ShareLink from "./pages/ShareLink.jsx";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const INITIAL_TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    email: "sarah@acmecorp.io",
    timeAgo: "2h ago",
    avatarInitial: "S",
    avatarColor: "bg-[#D1FADF] text-[#047857]",
    avatar: "https://i.pravatar.cc/150?u=1",
    rating: 5,
    content: "The automated collection workflow is a game changer for us. We've collected more testimonials in 2 weeks than we did the entire last year. Interface is buttery smooth.",
    type: "text",
    status: "pending",
    liked: false
  },
  {
    id: 2,
    name: "Mark Thompson",
    email: "mark@designflow.com",
    timeAgo: "1d ago",
    avatarInitial: "M",
    avatarColor: "bg-[#E0F2FE] text-[#0369A1]",
    avatar: "https://i.pravatar.cc/150?u=2",
    rating: 5,
    content: "Finally a tool that doesn't feel clunky. The embed widgets look fantastic on our landing page and matching our dark mode theme was effortless.",
    type: "text",
    status: "approved",
    liked: true
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    email: "elena@creativehub.es",
    timeAgo: "2d ago",
    avatarInitial: "E",
    avatarColor: "bg-[#FCE7F3] text-[#BE185D]",
    avatar: "https://i.pravatar.cc/150?u=3",
    rating: 5,
    type: "video",
    videoThumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=300",
    status: "pending",
    liked: false
  },
];

const App = () => {
  const [testimonials, setTestimonials] = useState(INITIAL_TESTIMONIALS);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-space" element={<CreateSpaceModal onClose={() => window.history.back()} />} />
          <Route path="/edit-space" element={<EditSpace />} />
          <Route path="/space-success" element={<SpaceSuccessModal />} />
          <Route path="/inbox" element={<SpaceInbox testimonials={testimonials} setTestimonials={setTestimonials} />} />
          <Route path="/wall-of-love" element={<WallOfLove testimonials={testimonials} />} />
          <Route path="/wall-configuration" element={<WallConfiguration />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/share" element={<ShareLink />} />
          <Route path="/:spaceSlug" element={<PublicTestimonial />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;