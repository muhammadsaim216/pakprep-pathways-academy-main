import { useNavigate, Outlet } from "react-router-dom";
import { LayoutDashboard, GraduationCap, BookOpen, Users, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/admin" },
    { icon: GraduationCap, label: "Universities", path: "/admin/universities" },
    { icon: BookOpen, label: "Test Content", path: "/admin/tests" },
    { icon: Users, label: "Student Stats", path: "/admin/students" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Site
          </Button>
          <h2 className="text-xl font-outfit font-bold text-primary">Admin Control</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="w-full justify-start font-inter hover:bg-primary/5 hover:text-primary"
              onClick={() => navigate(item.path)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;