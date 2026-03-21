import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, School, FileText, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { label: "Total Students", value: "0", icon: Users, color: "text-blue-600", key: "students" },
    { label: "Universities Listed", value: "0", icon: School, color: "text-emerald-600", key: "unis" },
    { label: "Practice Quizzes", value: "0", icon: FileText, color: "text-orange-600", key: "quizzes" },
    { label: "Success Rate", value: "85%", icon: CheckCircle, color: "text-purple-600", key: "rate" },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Total Students count from profiles
        const { count: studentCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // 2. Fetch Universities count
        const { count: uniCount } = await supabase
          .from('universities')
          .select('*', { count: 'exact', head: true });

        // 3. Fetch Quizzes count (Assuming table name 'quizzes')
        // If your table name is different, update it here
        const { count: quizCount } = await supabase
          .from('quizzes') 
          .select('*', { count: 'exact', head: true });

        setStats(prev => prev.map(stat => {
          if (stat.key === "students") return { ...stat, value: (studentCount || 0).toLocaleString() };
          if (stat.key === "unis") return { ...stat, value: (uniCount || 0).toString() };
          if (stat.key === "quizzes") return { ...stat, value: (quizCount || 0).toString() };
          return stat;
        }));

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-outfit font-bold text-foreground">Platform Overview</h1>
          <p className="text-muted-foreground font-inter">Monitor your academy's growth and data.</p>
        </div>
        {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground font-inter">
                {stat.label}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-outfit">
                {isLoading ? "..." : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Placeholder for future growth charts */}
      <Card className="p-12 border-dashed border-2 flex flex-col items-center justify-center text-muted-foreground bg-accent/30">
        <TrendingUp className="w-10 h-10 mb-2 opacity-20" />
        <p className="font-inter font-medium">Analytics Chart Coming Soon...</p>
      </Card>
    </div>
  );
};

// Simple internal component for the placeholder icon
const TrendingUp = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

export default AdminDashboard;