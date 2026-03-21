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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    subject: "physics",
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "a",
    test_type: "ecat"
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setQuestions(data || []);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("questions").insert([formData]);
      
      if (error) throw error;

      toast({ 
        title: "Question Added", 
        description: "The MCQ has been successfully saved." 
      });
      
      // Reset only the question and options, keep subject/test_type for faster entry
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
        <h1 className="text-2xl font-outfit font-bold flex items-center gap-2">
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
                    className="w-full p-2 border rounded-md bg-background text-sm focus:ring-2 focus:ring-primary"
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                  >
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="math">Mathematics</option>
                    <option value="english">English</option>
                    <option value="biology">Biology</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Test Type</label>
                  <select 
                    className="w-full p-2 border rounded-md bg-background text-sm focus:ring-2 focus:ring-primary"
                    value={formData.test_type}
                    onChange={e => setFormData({...formData, test_type: e.target.value})}
                  >
                    <option value="ecat">ECAT</option>
                    <option value="mdcat">MDCAT</option>
                    <option value="net">NUST NET</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">Question Content</label>
                <Textarea 
                  placeholder="Enter the MCQ question..." 
                  className="min-h-[100px] font-inter"
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
                      className="uppercase font-bold"
                      onClick={() => setFormData({...formData, correct_option: opt})}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full font-inter font-bold h-11">
                <Plus className="w-5 h-5 mr-2" /> Save to Database
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Question List View */}
        <Card className="lg:col-span-7 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-outfit">Recent Questions</CardTitle>
            <div className="relative w-48">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search MCQs..." 
                className="pl-8 h-9 text-xs font-inter" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="animate-spin text-primary w-8 h-8" />
                <p className="text-sm text-muted-foreground">Loading bank...</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-outfit">Question & Answer</TableHead>
                      <TableHead className="font-outfit">Category</TableHead>
                      <TableHead className="text-right font-outfit">Action</TableHead>
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
                        <TableRow key={q.id} className="group hover:bg-muted/10 transition-colors">
                          <TableCell className="max-w-[300px]">
                            <p className="font-medium text-sm font-inter line-clamp-2 mb-1">
                              {q.question_text}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Ans: {q.correct_option}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                ID: {q.id.slice(0, 8)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge variant="secondary" className="text-[10px] uppercase w-fit px-2">
                                {q.subject}
                              </Badge>
                              <Badge variant="outline" className="text-[9px] uppercase w-fit px-1 opacity-70">
                                {q.test_type}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => deleteQuestion(q.id)}
                              className="text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
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