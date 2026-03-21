import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, User, BookOpen, LogOut, LayoutDashboard, Settings, Loader2, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import { supabase } from "@/lib/supabase"; 

const Header = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAndRole = async (currentUser: any) => {
      if (!currentUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', currentUser.id)
          .single();

        if (!error && data) {
          setIsAdmin(data.is_admin);
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
      } finally {
        setLoading(false);
      }
    };

    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      await checkUserAndRole(currentUser);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await checkUserAndRole(currentUser);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
      
      if (session) setIsLoginModalOpen(false); 
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    navigate('/');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If we are not on the home page, navigate home first
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Student";

  return (
    <header className="bg-background border-b border-border shadow-sm sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo - Always Visible */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => navigate('/')}>
          <div className="p-2 bg-gradient-to-r from-primary to-primary-hover rounded-lg">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-outfit font-bold text-foreground">Prep Master</h1>
            <p className="text-xs text-muted-foreground font-inter">Excellence in Education</p>
          </div>
        </div>

        {/* Navigation - Always Visible */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-4">
          <Button variant="ghost" size="sm" onClick={() => scrollToSection('courses')}>
            Courses
          </Button>
          <Button variant="ghost" size="sm" onClick={() => scrollToSection('practice-tests')}>
            Practice Tests
          </Button>
          
          {user && (
            <>
              <Button variant="ghost" size="sm" className="font-semibold text-primary" onClick={() => navigate('/dashboard')}>
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" className="font-medium text-slate-600" onClick={() => navigate('/notes')}>
                <FileText className="w-4 h-4 mr-2" />
                Notes
              </Button>
            </>
          )}

          {isAdmin && (
            <Button variant="secondary" size="sm" className="bg-primary/10 text-primary hover:bg-primary/20" onClick={() => navigate('/admin/universities')}>
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
          )}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex flex-col items-end text-right">
                <span className="text-sm font-semibold truncate max-w-[100px]">{displayName}</span>
                <span className="text-[10px] text-primary font-bold uppercase">{isAdmin ? "Admin" : "Student"}</span>
              </div>
              <div 
                className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => navigate('/dashboard')}
              >
                <User className="w-5 h-5 text-primary" />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsLoginModalOpen(true)}>
                Login
              </Button>
              <Button variant="default" size="sm" onClick={() => scrollToSection('get-started')}>
                Join
              </Button>
            </div>
          )}
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  );
};

export default Header;