import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  FileText, 
  Brain, 
  Download, 
  Play, 
  CheckCircle,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("notes");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // States for Real Database Data
  const [notes, setNotes] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);

  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);
      
      // 1. Check Auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }
      setUser(session.user);

      // 2. Fetch Profile and Data (Parallel fetching for speed)
      // Note: We join courses to get the course name for the notes
      const [profileRes, notesRes, quizzesRes, papersRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('notes').select('*, courses(name)').order('created_at', { ascending: false }),
        supabase.from('quizzes').select('*').order('created_at', { ascending: false }),
        supabase.from('past_papers').select('*').order('year', { ascending: false })
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (notesRes.data) setNotes(notesRes.data);
      if (quizzesRes.data) setQuizzes(quizzesRes.data);
      if (papersRes.data) setPapers(papersRes.data);

      setLoading(false);
    };

    initializeDashboard();
  }, [navigate]);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Student";
  const targetTest = profile?.target_test || "NET/MDCAT";
  const targetUni = profile?.target_university || "NUST/KE";
  const overallProgress = profile?.overall_progress || 0;

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-outfit text-muted-foreground">Syncing your prep data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background overflow-x-hidden custom-scrollbar">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-outfit font-bold text-foreground">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-muted-foreground font-inter mt-1">
                Preparing for <span className="text-primary font-bold uppercase">{targetTest}</span> • Target: <span className="text-primary  font-bold uppercase">{targetUni}</span>
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/")} className="font-inter">
              Change Selection
            </Button>
          </div>

          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-outfit font-semibold mb-2">Overall Progress</h3>
                  <p className="text-muted-foreground font-inter">Your journey to {targetUni} is {overallProgress}% complete!</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{overallProgress}%</div>
                  <Progress value={overallProgress} className="w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Functional Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b overflow-x-auto no-scrollbar">
            {[
              { id: "notes", label: "Notes", icon: BookOpen },
              { id: "quizzes", label: "Practice Quizzes", icon: Brain },
              { id: "papers", label: "Past Papers", icon: FileText }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-b-none font-inter whitespace-nowrap px-6 transition-all ${activeTab === tab.id ? 'border-b-2 border-primary shadow-sm' : ''}`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Area (Mapping Supabase Data) */}
        <div className="grid gap-6 min-h-[300px]">
          {activeTab === "notes" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.length > 0 ? notes.map((note) => (
                <Card key={note.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary">{note.courses?.name || "General"}</Badge>
                      <Download 
                        className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" 
                        onClick={() => window.open(note.file_url, '_blank')}
                      />
                    </div>
                    <CardTitle className="text-lg font-outfit mt-2">{note.title}</CardTitle>
                    <CardDescription>
                      Added on {new Date(note.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => window.open(note.file_url, '_blank')}
                    >
                      Read Notes
                    </Button>
                  </CardContent>
                </Card>
              )) : <p className="col-span-full text-center text-muted-foreground py-10">No notes found for your stream.</p>}
            </div>
          )}

          {activeTab === "quizzes" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.length > 0 ? quizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary">{quiz.subject}</Badge>
                      <Brain className="w-4 h-4 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-outfit mt-2">{quiz.title}</CardTitle>
                    <CardDescription>{quiz.question_count} Questions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Start Quiz</Button>
                  </CardContent>
                </Card>
              )) : <p className="col-span-full text-center text-muted-foreground py-10">No practice quizzes available yet.</p>}
            </div>
          )}

          {activeTab === "papers" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {papers.length > 0 ? papers.map((paper) => (
                <Card key={paper.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <Badge className="w-fit">{paper.year}</Badge>
                    <CardTitle className="text-lg font-outfit mt-2">{paper.title}</CardTitle>
                    <CardDescription>{paper.mcq_count} MCQs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">Practice Paper</Button>
                  </CardContent>
                </Card>
              )) : <p className="col-span-full text-center text-muted-foreground py-10">Past papers are being uploaded.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;