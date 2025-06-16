
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TherapyPage from "./pages/TherapyPage";
import JournalPage from "./pages/JournalPage";
import WellnessPage from "./pages/WellnessPage";
import ProgressPage from "./pages/ProgressPage";
import CrisisPage from "./pages/CrisisPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/therapy" element={<TherapyPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/wellness" element={<WellnessPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/crisis" element={<CrisisPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
