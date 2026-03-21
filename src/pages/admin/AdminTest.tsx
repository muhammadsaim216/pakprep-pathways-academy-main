import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, BookOpen, Search, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  subject: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  test_type: string;
  created_at: string;
}

const AdminTest = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]); // Dynamic subjects
  const [entranceTests, setEntranceTests] = useState<any[]>([]); // Dynamic tests
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    subject: "",
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "a",
    test_type: ""
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Questions
      const { data: qData, error: qError } = await supabase
        .from("questions")
        .select("*")
        .order('created_at', { ascending: false });

      // 2. Fetch Subjects from Settings
      const { data: sData, error: sError } = await supabase
        .from("subjects")
        .select("*")
        .order('name', { ascending: true });

      // 3. Fetch Entrance Tests from Settings
      const { data: tData, error: tError } = await supabase
        .from("entrance_tests")
        .select("*")
        .order('name', { ascending: true });

      if (qError) throw qError;
      if (sError) throw sError;
      if (tError) throw tError;

      setQuestions(qData || []);
      setSubjects(sData || []);
      setEntranceTests(tData || []);

      // Set default form values if metadata exists
      setFormData(prev => ({
        ...prev,
        subject: sData?.[0]?.name || "physics",
        test_type: tData?.[0]?.name || "ecat"
      }));

    } catch (error: any) {
      toast({ 
        title: "Fetch Error", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    const { data } = await supabase
      .from("questions")
      .select("*")
      .order('created_at', { ascending: false });
    setQuestions(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("questions").insert([formData]);
      
      if (error) throw error;

      toast({ 
        title: "Question Added", 
        description: "The MCQ has been successfully saved." 
      });
      
      setFormData({ 
        ...formData, 
        question_text: "", 
        option_a: "", 
        option_b: "", 
        option_c: "", 
        option_d: "" 
      });
      
      fetchQuestions();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this MCQ?")) return;
    
    try {
      const { error } = await supabase.from("questions").delete().eq("id", id);
      if (error) throw error;
      
      toast({ title: "Deleted", description: "Question removed from bank." });
      fetchQuestions();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-outfit font-bold flex items-center gap-2 text-slate-800">
          <BookOpen className="text-primary w-6 h-6" /> Question Bank Manager
        </h1>
        <p className="text-muted-foreground text-sm font-inter">
          Create and organize practice MCQs for Pak-Prep Pathways.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* MCQ Entry Form */}
        <Card className="lg:col-span-5 h-fit shadow-md border-t-4 border-t-primary sticky top-24">
          <CardHeader>
            <CardTitle className="text-lg font-outfit">Create New Question</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Subject</label>
                  <select 
                    className="w-full p-2 border rounded-md bg-background text-sm focus:ring-2 focus:ring-primary transition-all"
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name.toLowerCase()}>{s.name}</option>
                    ))}
                    {subjects.length === 0 && <option value="physics">Physics (Default)</option>}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Test Type</label>
                  <select 
                    className="w-full p-2 border rounded-md bg-background text-sm focus:ring-2 focus:ring-primary transition-all"
                    value={formData.test_type}
                    onChange={e => setFormData({...formData, test_type: e.target.value})}
                  >
                    {entranceTests.map((t) => (
                      <option key={t.id} value={t.name.toLowerCase()}>{t.name}</option>
                    ))}
                    {entranceTests.length === 0 && <option value="ecat">ECAT (Default)</option>}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">Question Content</label>
                <Textarea 
                  placeholder="Enter the MCQ question..." 
                  className="min-h-[100px] font-inter text-sm"
                  value={formData.question_text}
                  onChange={e => setFormData({...formData, question_text: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {['a', 'b', 'c', 'd'].map((opt) => (
                  <div key={opt} className="space-y-1">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Option {opt.toUpperCase()}</label>
                    <Input 
                      placeholder={`Choice ${opt.toUpperCase()}`}
                      className="font-inter text-sm"
                      value={(formData as any)[`option_${opt}`]}
                      onChange={e => setFormData({...formData, [`option_${opt}`]: e.target.value})}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Select Correct Answer</label>
                <div className="grid grid-cols-4 gap-2">
                  {['a', 'b', 'c', 'd'].map((opt) => (
                    <Button
                      key={opt}
                      type="button"
                      variant={formData.correct_option === opt ? "default" : "outline"}
                      className={`uppercase font-bold ${formData.correct_option === opt ? "bg-primary shadow-sm" : ""}`}
                      onClick={() => setFormData({...formData, correct_option: opt})}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full font-inter font-bold h-11 shadow-md">
                <Plus className="w-5 h-5 mr-2" /> Save to Database
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Question List View */}
        <Card className="lg:col-span-7 shadow-md border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-slate-50/50">
            <CardTitle className="text-lg font-outfit">Recent Questions</CardTitle>
            <div className="relative w-48">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search MCQs..." 
                className="pl-8 h-9 text-xs font-inter bg-white" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="animate-spin text-primary w-8 h-8" />
                <p className="text-sm text-muted-foreground">Loading bank...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow>
                      <TableHead className="font-bold text-slate-700">Question & Answer</TableHead>
                      <TableHead className="font-bold text-slate-700">Category</TableHead>
                      <TableHead className="text-right font-bold text-slate-700 pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuestions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-10 text-muted-foreground font-inter">
                          No questions found. Start adding some!
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredQuestions.map((q) => (
                        <TableRow key={q.id} className="group hover:bg-slate-50 transition-colors">
                          <TableCell className="max-w-[300px] py-4">
                            <p className="font-medium text-sm font-inter line-clamp-2 mb-1 text-slate-800">
                              {q.question_text}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Ans: {q.correct_option}
                              </span>
                              <span className="text-[9px] text-muted-foreground font-mono">
                                ID: {q.id.slice(0, 8)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge variant="secondary" className="text-[9px] uppercase w-fit px-2 py-0 font-bold tracking-tight">
                                {q.subject}
                              </Badge>
                              <Badge variant="outline" className="text-[9px] uppercase w-fit px-2 py-0 opacity-70 border-slate-300">
                                {q.test_type}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right pr-4">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => deleteQuestion(q.id)}
                              className="text-destructive hover:bg-red-50 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTest;