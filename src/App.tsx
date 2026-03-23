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

// --- FIXED: Protected Route with Session Recovery ---
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. Listen for Auth State Changes (The best way to handle redirects)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser && requireAdmin) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();
        
        setIsAdmin(profile?.role === 'admin');
      }
      
      // Stop loading ONLY after we are sure about the auth state
      setLoading(false); 
    });

    return () => subscription.unsubscribe();
  }, [requireAdmin]);

  // IMPORTANT: Show a full-screen loader while checking session
  // This prevents the "flash" of the login page that causes the refresh loop
  if (loading) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-slate-500 font-medium">Syncing your session...</p>
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
          <Route path="/" element={<Index />} />
          <Route path="/select-university" element={<UniversitySelector />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
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
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;