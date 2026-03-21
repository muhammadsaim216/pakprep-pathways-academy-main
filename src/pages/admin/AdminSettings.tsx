import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings, BookOpen, Layers, Users, CreditCard, Plus, Loader2, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // States for data lists
  const [tests, setTests] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  
  // States for inputs
  const [newTest, setNewTest] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newCourse, setNewCourse] = useState({ name: "", subject_id: "", test_id: "" });
  const [newNote, setNewNote] = useState({ title: "", course_id: "", file_url: "" });

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    setLoading(true);
    try {
      // Fetching all metadata in parallel for better performance
      const [testRes, subjectRes, courseRes, notesRes] = await Promise.all([
        supabase.from("entrance_tests").select("*").order("name"),
        supabase.from("subjects").select("*").order("name"),
        supabase.from("courses").select(`
          id, 
          name, 
          subjects(name), 
          entrance_tests(name)
        `).order("name"),
        supabase.from("notes").select(`
          *,
          courses(name)
        `).order("created_at", { ascending: false })
      ]);

      if (testRes.error) throw testRes.error;
      if (subjectRes.error) throw subjectRes.error;
      if (courseRes.error) throw courseRes.error;
      // Notes table might be empty/new, so we handle it gracefully
      
      setTests(testRes.data || []);
      setSubjects(subjectRes.data || []);
      setCourses(courseRes.data || []);
      setNotes(notesRes.data || []);

    } catch (error: any) {
      console.error("Error fetching metadata:", error);
      toast({ 
        title: "Fetch Error", 
        description: error.message || "Failed to load platform configuration.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTest = async () => {
    if (!newTest) return;
    setLoading(true);
    const { error } = await supabase.from("entrance_tests").insert([{ name: newTest }]);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Entrance Test added." });
      setNewTest("");
      fetchMetadata();
    }
    setLoading(false);
  };

  const handleAddSubject = async () => {
    if (!newSubject) return;
    setLoading(true);
    const { error } = await supabase.from("subjects").insert([{ name: newSubject }]);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Subject added." });
      setNewSubject("");
      fetchMetadata();
    }
    setLoading(false);
  };

  const handleCreateCourse = async () => {
    if (!newCourse.name || !newCourse.subject_id) {
      toast({ title: "Validation Error", description: "Please provide a course name and subject.", variant: "destructive" });
      return;
    };
    setLoading(true);
    const { error } = await supabase.from("courses").insert([newCourse]);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Course created successfully." });
      setNewCourse({ name: "", subject_id: "", test_id: "" });
      fetchMetadata();
    }
    setLoading(false);
  };

  const handleAddNote = async () => {
    if (!newNote.title || !newNote.course_id) {
      toast({ title: "Validation Error", description: "Title and Course are required.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("notes").insert([newNote]);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Note added successfully." });
      setNewNote({ title: "", course_id: "", file_url: "" });
      fetchMetadata();
    }
    setLoading(false);
  };

  const deleteItem = async (table: string, id: string) => {
    if (!confirm("Are you sure? This may affect linked questions or data.")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      toast({ title: "Delete Error", description: error.message, variant: "destructive" });
    } else {
      fetchMetadata();
    }
  };

  if (loading && tests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-slate-500 font-inter animate-pulse">Syncing platform configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-outfit font-bold text-slate-800">Platform Configuration</h1>
      </div>

      <Tabs defaultValue="tests" className="w-full">
        <TabsList className="grid grid-cols-6 w-full bg-slate-100 p-1 mb-4">
          <TabsTrigger value="tests"><Layers className="w-4 h-4 mr-2" /> Tests</TabsTrigger>
          <TabsTrigger value="subjects"><BookOpen className="w-4 h-4 mr-2" /> Subjects</TabsTrigger>
          <TabsTrigger value="courses"><BookOpen className="w-4 h-4 mr-2" /> Courses</TabsTrigger>
          <TabsTrigger value="notes"><FileText className="w-4 h-4 mr-2" /> Notes</TabsTrigger>
          <TabsTrigger value="students"><Users className="w-4 h-4 mr-2" /> Entry</TabsTrigger>
          <TabsTrigger value="billing"><CreditCard className="w-4 h-4 mr-2" /> Billing</TabsTrigger>
        </TabsList>

        {/* 1. ENTRANCE TESTS */}
        <TabsContent value="tests">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base font-outfit">Manage Entrance Exams</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="New Test Name (e.g. NET)" 
                  value={newTest}
                  onChange={(e) => setNewTest(e.target.value)}
                />
                <Button onClick={handleAddTest} disabled={loading} className="font-inter">
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4 mr-2" />} 
                  Add Test
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {tests.map(t => (
                  <div key={t.id} className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 group">
                    {t.name}
                    <button onClick={() => deleteItem("entrance_tests", t.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. SUBJECTS */}
        <TabsContent value="subjects">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base font-outfit">Academic Subjects</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Subject Name (e.g. Physics)" 
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                />
                <Button onClick={handleAddSubject} disabled={loading} className="font-inter">
                   {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4 mr-2" />} 
                   Add Subject
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {subjects.map(s => (
                  <div key={s.id} className="bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 group">
                    {s.name}
                    <button onClick={() => deleteItem("subjects", s.id)} className="hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. COURSES */}
        <TabsContent value="courses" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base font-outfit">Create New Course</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
              <select 
                className="p-2 border rounded-md text-sm bg-white focus:ring-2 focus:ring-primary/20 outline-none"
                value={newCourse.subject_id}
                onChange={(e) => setNewCourse({...newCourse, subject_id: e.target.value})}
              >
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select 
                className="p-2 border rounded-md text-sm bg-white focus:ring-2 focus:ring-primary/20 outline-none"
                value={newCourse.test_id}
                onChange={(e) => setNewCourse({...newCourse, test_id: e.target.value})}
              >
                <option value="">Select Test (Optional)</option>
                {tests.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <Input 
                placeholder="Course Title (e.g. Optics)" 
                value={newCourse.name}
                onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
              />
              <Button onClick={handleCreateCourse} disabled={loading} className="font-inter font-bold">Create Course</Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm font-outfit">Existing Courses</CardTitle></CardHeader>
            <CardContent className="p-0">
               <Table>
                 <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Related Test</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                   {courses.length === 0 ? (
                     <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No courses defined.</TableCell></TableRow>
                   ) : (
                     courses.map((c) => (
                       <TableRow key={c.id}>
                         <TableCell className="font-bold text-sm">{c.name}</TableCell>
                         <TableCell className="text-xs">{c.subjects?.name || 'N/A'}</TableCell>
                         <TableCell className="text-xs uppercase font-medium">{c.entrance_tests?.name || '-'}</TableCell>
                         <TableCell className="text-right">
                           <Button variant="ghost" size="icon" onClick={() => deleteItem("courses", c.id)} className="h-8 w-8 text-destructive">
                             <Trash2 className="w-4 h-4" />
                           </Button>
                         </TableCell>
                       </TableRow>
                     ))
                   )}
                 </TableBody>
               </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. NOTES */}
        <TabsContent value="notes" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base font-outfit">Manage Study Notes</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
              <select 
                className="p-2 border rounded-md text-sm bg-white"
                value={newNote.course_id}
                onChange={(e) => setNewNote({...newNote, course_id: e.target.value})}
              >
                <option value="">Select Course</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <Input 
                placeholder="Note Title (e.g. Mechanics PDF)" 
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
              />
              <Input 
                placeholder="File URL (PDF/Link)" 
                value={newNote.file_url}
                onChange={(e) => setNewNote({...newNote, file_url: e.target.value})}
              />
              <Button onClick={handleAddNote} disabled={loading} className="font-inter font-bold">
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Note
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-0">
               <Table>
                 <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Associated Course</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                   {notes.length === 0 ? (
                     <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">No notes added yet.</TableCell></TableRow>
                   ) : (
                     notes.map((n) => (
                       <TableRow key={n.id}>
                         <TableCell className="font-medium">{n.title}</TableCell>
                         <TableCell className="text-sm">{n.courses?.name || 'N/A'}</TableCell>
                         <TableCell className="text-right">
                           <Button variant="ghost" size="icon" onClick={() => deleteItem("notes", n.id)} className="text-destructive h-8 w-8">
                             <Trash2 className="w-4 h-4" />
                           </Button>
                         </TableCell>
                       </TableRow>
                     ))
                   )}
                 </TableBody>
               </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. STUDENT ENTRY */}
        <TabsContent value="students">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base font-outfit">Manual Student Enrollment</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Full Name" />
                <Input placeholder="Email Address" />
              </div>
              <select className="w-full p-2 border rounded-md text-sm bg-white">
                <option value="">Select Course to Assign</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.subjects?.name})</option>)}
              </select>
              <Button variant="default" className="w-full font-inter font-bold">Register & Enroll Student</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. SUBSCRIPTIONS */}
        <TabsContent value="billing">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base font-outfit">Recent Subscriptions</CardTitle></CardHeader>
            <CardContent>
              <div className="text-center py-16 border-2 border-dashed rounded-lg bg-slate-50/50">
                <CreditCard className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500 font-medium font-inter">Payment Gateway Integration</p>
                <p className="text-xs text-muted-foreground mt-1 font-inter">Integration with JazzCash/EasyPaisa coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;