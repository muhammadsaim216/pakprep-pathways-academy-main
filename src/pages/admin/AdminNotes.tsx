import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, Trash2, Globe, Check, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminNotes = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [driveLink, setDriveLink] = useState("");
  const [formData, setFormData] = useState({ title: "", subject: "physics" });
  const { toast } = useToast();

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    const { data } = await supabase.from("notes").select("*").order("created_at", { ascending: false });
    setNotes(data || []);
  };

  // Extracts ID from: https://drive.google.com/file/d/FILE_ID/view
  const extractDriveId = (url: string) => {
    const match = url.match(/\/d\/(.+?)\/(edit|view|copy)/);
    return match ? match[1] : null;
  };

  const handlePublish = async () => {
    const fileId = extractDriveId(driveLink);
    if (!fileId || !formData.title) {
      return toast({ title: "Invalid Data", description: "Ensure Title and Drive Link are correct.", variant: "destructive" });
    }

    // Check if file is already published
    if (notes.some(n => n.file_url.includes(fileId))) {
      return toast({ title: "Duplicate", description: "This file is already published." });
    }

    const { error } = await supabase.from("notes").insert([{
      title: formData.title,
      subject: formData.subject,
      file_url: fileId // We store just the ID
    }]);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Published!", description: "Note is now live for students." });
      setDriveLink("");
      setFormData({ ...formData, title: "" });
      fetchNotes();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-outfit font-bold">Drive Content Manager</h1>
      
      <Card className="border-t-4 border-t-blue-500">
        <CardHeader><CardTitle className="text-sm">Publish from Google Drive</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input 
              placeholder="Note Title" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
            <select 
              className="p-2 border rounded-md text-sm bg-background" 
              onChange={e => setFormData({...formData, subject: e.target.value})}
            >
              <option value="physics">Physics</option>
              <option value="math">Math</option>
              <option value="chemistry">Chemistry</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="Paste Google Drive Link here..." 
              value={driveLink}
              onChange={e => setDriveLink(e.target.value)} 
            />
            <Button onClick={handlePublish} className="bg-blue-600 hover:bg-blue-700">
              Publish Note
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground italic">
            Note: Ensure the Drive file is set to "Anyone with the link can view".
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map(note => (
          <Card key={note.id} className="p-4 flex items-center justify-between bg-white border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800">{note.title}</p>
                <p className="text-[10px] uppercase text-blue-500 font-bold">{note.subject}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-destructive hover:bg-red-50">
              <Trash2 className="w-4 h-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminNotes;