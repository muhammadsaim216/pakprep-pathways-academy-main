import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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
import NotesPage from "./pages/Notes"; 
import AdminTestTypes from "./pages/admin/TestTypeAdmin"; 

const queryClient = new QueryClient();

// --- NEW: Protected Route Component ---
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user && requireAdmin) {
        // Check your profiles table for the admin role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(profile?.role === 'admin');
      }
      setLoading(false);
    };
    checkAuth();
  }, [requireAdmin]);

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

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
          
          {/* Protected Student Section */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/notes" element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/notes" element={
            <ProtectedRoute>
              <StudentNotes />
            </ProtectedRoute>
          } />

          {/* Protected Admin Routing Group */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} /> 
            <Route path="universities" element={<AdminUniversities />} />
            <Route path="tests" element={<AdminTest />} />
            <Route path="students" element={<StudentStats />} />
            <Route path="notes" element={<AdminNotes />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="test-types" element={<AdminTestTypes />} />
          </Route>
          
          {/* Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;