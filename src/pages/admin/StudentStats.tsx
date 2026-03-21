import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, User, GraduationCap, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentProfile {
  id: string;
  full_name: string;
  email: string;
  target_university: string;
  test_type: string;
  completed_quizzes: number;
  average_score: number;
  created_at: string;
}

const StudentStats = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Fetching from your 'profiles' table
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching students",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-outfit font-bold flex items-center gap-2">
          <GraduationCap className="text-primary w-6 h-6" /> Student Analytics
        </h1>
        <p className="text-muted-foreground text-sm font-inter">
          Track student engagement and performance across the platform.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <CardTitle className="text-lg font-outfit flex items-center gap-2">
              <User className="w-5 h-5 text-muted-foreground" />
              Registered Students
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-8 h-9 text-xs font-inter"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="animate-spin text-primary w-8 h-8" />
                <p className="text-sm text-muted-foreground">Loading student data...</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-outfit">Student Info</TableHead>
                    <TableHead className="font-outfit">Target Goal</TableHead>
                    <TableHead className="font-outfit">Activity</TableHead>
                    <TableHead className="font-outfit text-right">Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-muted-foreground font-inter">
                        No students found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id} className="hover:bg-muted/10 transition-colors">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm font-inter">{student.full_name || "New User"}</span>
                            <span className="text-xs text-muted-foreground">{student.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium uppercase text-primary">
                              {student.target_university || "Not Set"}
                            </span>
                            <Badge variant="outline" className="text-[9px] w-fit uppercase">
                              {student.test_type || "General"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-inter">
                              {student.completed_quizzes || 0} Quizzes
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <span className={`text-sm font-bold ${
                              (student.average_score || 0) >= 80 ? "text-green-600" : "text-orange-600"
                            }`}>
                              {student.average_score || 0}%
                            </span>
                            <span className="text-[10px] text-muted-foreground">Avg. Score</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentStats;