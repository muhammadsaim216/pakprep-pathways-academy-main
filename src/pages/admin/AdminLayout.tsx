import { useNavigate, Outlet, useLocation } from "react-router-dom";
// Added ClipboardList for the Test Type module
import { 
  LayoutDashboard, 
  GraduationCap, 
  BookOpen, 
  Users, 
  ChevronLeft, 
  FileText, 
  Settings, 
  ClipboardList 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/admin" },
    { icon: GraduationCap, label: "Universities", path: "/admin/universities" },
    // New Test Types Module for Entry Test Management
    { icon: ClipboardList, label: "Test Types", path: "/admin/test-types" },
    { icon: BookOpen, label: "Test Content", path: "/admin/tests" },
    { icon: Users, label: "Student Stats", path: "/admin/students" },
    { icon: FileText, label: "Study Notes", path: "/admin/notes" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')} 
            className="mb-4 text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Site
          </Button>
          <h2 className="text-xl font-outfit font-bold text-primary tracking-tight">Admin Control</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start font-inter transition-all duration-200 ${
                  isActive 
                    ? "bg-primary/10 text-primary font-bold shadow-sm" 
                    : "hover:bg-primary/5 hover:text-primary text-slate-600"
                }`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-primary" : "text-slate-400"}`} />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className="p-6 border-t bg-slate-50/50">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
            Pak-Prep Pathways
          </p>
          <p className="text-[9px] text-slate-400">v1.0.4 Build</p>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;