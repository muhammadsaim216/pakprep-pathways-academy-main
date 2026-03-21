import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Admin Imports
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUniversities from "./pages/AdminUniversities"; 
import AdminTest from "./pages/admin/AdminTest";
import StudentStats from "./pages/admin/StudentStats";
import UniversitySelector from "./components/UniversitySelector";
import AdminNotes from "./pages/admin/AdminNotes";
import StudentNotes from "./pages/StudentNotes";
import AdminSettings from "./pages/admin/AdminSettings";
import NotesPage from "./pages/Notes"; // Note: This was named NotesPage

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/select-university" element={<UniversitySelector />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Student Section */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notes" element={<NotesPage />} />
          
          {/* If you want nested notes under dashboard, keep this: */}
          <Route path="/dashboard/notes" element={<StudentNotes />} />

          {/* Admin Routing Group */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} /> 
            <Route path="universities" element={<AdminUniversities />} />
            <Route path="tests" element={<AdminTest />} />
            <Route path="students" element={<StudentStats />} />
            <Route path="notes" element={<AdminNotes />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          {/* Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;