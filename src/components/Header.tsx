import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Settings, 
  FileText,
  ChevronDown
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginModal from "./LoginModal";
import { supabase } from "@/lib/supabase"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('is_admin_flag') === 'true';
  });

  const [hasStoredAuth, setHasStoredAuth] = useState(() => {
    return Object.keys(localStorage).some(key => key.includes('auth-token'));
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', userId)
          .single();

        if (!error && data) {
          const adminStatus = !!data.is_admin;
          setIsAdmin(adminStatus);
          localStorage.setItem('is_admin_flag', String(adminStatus));
        }
      } catch (err) {
        console.error("Profile sync error:", err);
      } finally {
        setLoading(false);
      }
    };

    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setHasStoredAuth(true);
        await syncProfile(session.user.id);
      } else {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setHasStoredAuth(true);
        await syncProfile(session.user.id);
      } else {
        setUser(null);
        setIsAdmin(false);
        setHasStoredAuth(false);
        localStorage.removeItem('is_admin_flag');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      // Robust signout with fallback to manual cleanup
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      // Force clear all local states and storage even if network fails
      localStorage.clear();
      setUser(null);
      setHasStoredAuth(false);
      setIsAdmin(false);
      navigate('/');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const showProtectedButtons = !!user || hasStoredAuth;

  return (
    <header className="bg-background border-b border-border shadow-sm sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => navigate('/')}>
          <div className="p-2 bg-gradient-to-r from-primary to-primary-hover rounded-lg">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-outfit font-bold text-foreground">Prep Master</h1>
            <p className="text-xs text-muted-foreground font-inter">Excellence in Education</p>
          </div>
        </div>

        {/* Public Navigation */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-4">
          <Button variant="ghost" size="sm" onClick={() => scrollToSection('courses')}>
            Courses
          </Button>
          <Button variant="ghost" size="sm" onClick={() => scrollToSection('practice-tests')}>
            Practice Tests
          </Button>
          {showProtectedButtons && (
            <Button 
              variant="ghost" 
              size="sm" 
              className={`font-medium ${location.pathname === '/notes' ? 'text-primary bg-primary/5' : 'text-slate-600'}`}
              onClick={() => navigate('/notes')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Notes
            </Button>
          )}
        </nav>

        {/* User Actions Section */}
        <div className="flex items-center gap-3">
          {showProtectedButtons ? (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 flex items-center justify-center bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors focus-visible:ring-0">
                    <User className="w-5 h-5 text-primary" />
                    <ChevronDown className="absolute -bottom-1 -right-1 w-3 h-3 text-primary bg-background rounded-full border border-border" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Account</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user?.email || "User Session"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* Changed to onSelect for better Radix UI event handling */}
                  <DropdownMenuItem onSelect={() => navigate('/dashboard')} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate('/notes')} className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Study Notes</span>
                  </DropdownMenuItem>
                  
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => navigate('/admin/universities')} className="cursor-pointer text-primary font-medium">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  {/* Robust Logout Integration */}
                  <DropdownMenuItem 
                    onSelect={handleLogout} 
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : !loading ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => navigate('/signup')}
              >
                Join
              </Button>
            </div>
          ) : (
             <div className="h-9 w-24 bg-slate-100 animate-pulse rounded-md" />
          )}
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  );
};

export default Header;