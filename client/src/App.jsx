import { AuthProvider } from "./context/AuthContext.jsx";
import { SpaceProvider } from "./context/SpaceContext.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateSpaceModal from "./pages/CreateSpaceModal.jsx";
import EditSpace from "./pages/EditSpace.jsx";
import SpaceSuccessModal from "./pages/SpaceSuccessModal.jsx";
import SpaceInbox from "./pages/SpaceInbox.jsx";
import WallOfLove from "./pages/WallOfLove.jsx";
import WallConfiguration from "./pages/WallConfiguration.jsx";
import EmbedCode from "./pages/EmbedCode.jsx";
import NotFound from "./pages/NotFound.jsx";
import PublicTestimonial from "./pages/PublicTestimonial.jsx";
import ThankYou from "./pages/ThankYou.jsx";
import ShareLink from "./pages/ShareLink.jsx";
import EmbedWall from "./pages/EmbedWall.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";


const App = () => {
  return (
    <AuthProvider>
      <SpaceProvider>
        <Router>
          <Routes>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/embed/:wallId" element={<EmbedWall />} />
            <Route path="/:spaceSlug" element={<PublicTestimonial />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/create-space" element={<ProtectedRoute><CreateSpaceModal onClose={() => window.history.back()} /></ProtectedRoute>} />
            <Route path="/edit-space" element={<ProtectedRoute><EditSpace /></ProtectedRoute>} />
            <Route path="/space-success" element={<ProtectedRoute><SpaceSuccessModal /></ProtectedRoute>} />
            <Route path="/inbox" element={<ProtectedRoute><SpaceInbox /></ProtectedRoute>} />
            <Route path="/wall-of-love" element={<ProtectedRoute><WallOfLove /></ProtectedRoute>} />
            <Route path="/wall-configuration" element={<ProtectedRoute><WallConfiguration /></ProtectedRoute>} />
            <Route path="/embed-code" element={<ProtectedRoute><EmbedCode /></ProtectedRoute>} />
            <Route path="/share" element={<ProtectedRoute><ShareLink /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </SpaceProvider>
    </AuthProvider>
  )
}

export default App;