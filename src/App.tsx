import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { useForumEmailNotifications } from "@/hooks/use-forum-email-notifications";
import { useSiteTracking } from "@/hooks/use-site-tracking";
import { ScrollToTop } from "@/components/scroll-to-top";
import Index from "./pages/Index";
import About from "./pages/About";
import Pillars from "./pages/Pillars";
import Deliverables from "./pages/Deliverables";
import Teams from "./pages/Teams";
import Initiatives from "./pages/Initiatives";
import StrategicFocus from "./pages/StrategicFocus";
import Partnerships from "./pages/Partnerships";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import Forum from "./pages/Forum";
import ForumDetail from "./pages/ForumDetail";
import Auth from "./pages/Auth";
import Membership from "./pages/Membership";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Footer from "@/components/ui/footer";

const queryClient = new QueryClient();

function AppContent() {
  // Initialize email notifications hook
  useForumEmailNotifications();
  // Track site visits
  useSiteTracking();

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Navigation />
      <Routes>
        <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/teams" element={<Teams />} />
          <Route path="/about/pillars" element={<Pillars />} />
          <Route path="/about/deliverables" element={<Deliverables />} />
        <Route path="/initiatives" element={<Initiatives />} />
        <Route path="/strategic-focus" element={<StrategicFocus />} />
        <Route path="/partnerships" element={<Partnerships />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/:postId" element={<ForumDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
