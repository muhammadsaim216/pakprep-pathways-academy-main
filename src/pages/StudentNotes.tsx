import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen } from "lucide-react";

const StudentNotes = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await supabase.from("notes").select("*").order("subject");
      setNotes(data || []);
      setLoading(false);
    };
    fetchNotes();
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-outfit font-bold flex items-center gap-2 text-slate-800">
          <BookOpen className="text-primary" /> Study Library
        </h2>
        <p className="text-muted-foreground text-sm">Preview and study your notes directly here.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {notes.map((note) => (
          <Card key={note.id} className="overflow-hidden shadow-lg border-slate-200">
            <CardHeader className="bg-slate-50 border-b py-3 px-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-md font-outfit text-slate-700">{note.title}</CardTitle>
                <Badge variant="outline" className="mt-1 uppercase text-[9px]">{note.subject}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-video w-full bg-slate-100 relative">
                {/* Google Drive Preview Embed */}
                <iframe
                  src={`https://drive.google.com/file/d/${note.file_url}/preview`}
                  className="w-full h-[500px]"
                  allow="autoplay"
                  loading="lazy"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentNotes;