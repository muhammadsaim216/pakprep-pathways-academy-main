import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, User, BookOpen, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import { supabase } from "@/lib/supabase"; 

const Header = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session more robustly
    const checkInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial Session User:", session?.user); // Debug check
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkInitialSession();

    // 2. Listen for auth changes and update state immediately
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth event triggered:", _event); // This should log SIGNED_IN
      setUser(session?.user ?? null);
      
      if (session) {
        setIsLoginModalOpen(false); 
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Logic to determine what name to display
  const displayName = 
    user?.user_metadata?.full_name || 
    user?.user_metadata?.name || 
    user?.email?.split('@')[0] || 
    "Student";

  // Prevent UI flickering while checking the cookie
  if (loading) {
    return (
      <header className="bg-background border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 h-[73px]" />
      </header>
    );
  }

  return (
    <header className="bg-background border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="p-2 bg-gradient-to-r from-primary to-primary-hover rounded-lg">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-outfit font-bold text-foreground">Prep Master</h1>
            <p className="text-xs text-muted-foreground font-inter">Excellence in Education</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" className="font-inter" onClick={() => scrollToSection('courses')}>
            <BookOpen className="w-4 h-4 mr-2" />
            Courses
          </Button>
          <Button variant="ghost" className="font-inter" onClick={() => scrollToSection('practice-tests')}>
            Practice Tests
          </Button>
          <Button variant="ghost" className="font-inter" onClick={() => scrollToSection('about')}>
            About
          </Button>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-sm font-semibold">{displayName}</span>
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Student</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <User className="w-5 h-5 text-primary" />
              </div>
              <Button variant="outline" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" className="font-inter" onClick={() => setIsLoginModalOpen(true)}>
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button variant="default" className="font-inter" onClick={() => scrollToSection('get-started')}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </header>
  );
};

export default Header;