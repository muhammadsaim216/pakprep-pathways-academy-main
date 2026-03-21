import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Search, FileText, Download, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";

const NotesPage = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notes")
      .select("*, courses(name)")
      .order("created_at", { ascending: false });

    if (!error) setNotes(data || []);
    setLoading(false);
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.courses?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-outfit font-bold text-slate-900">Study Vault</h1>
            <p className="text-slate-500 font-inter">Access all your course notes and prep material</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search notes or courses..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.length > 0 ? filteredNotes.map((note) => (
              <Card key={note.id} className="group hover:border-primary/50 transition-all shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-50">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 capitalize">
                      {note.courses?.name || "General"}
                    </Badge>
                    <FileText className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-xl font-outfit leading-tight">{note.title}</CardTitle>
                  <CardDescription>
                    Uploaded {new Date(note.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 bg-white flex gap-2">
                  <Button 
                    className="flex-1 font-inter" 
                    onClick={() => window.open(note.file_url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" /> View
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    onClick={() => window.open(note.file_url, '_blank')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full text-center py-20 bg-white rounded-xl border-2 border-dashed">
                <p className="text-slate-400 font-inter">No notes matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;