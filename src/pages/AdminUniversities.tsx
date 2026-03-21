import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; 
import { Loader2, Plus, Trash2, School, MapPin } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";

interface University {
  id: string;
  name: string;
  location: string;
  ranking: string;
  cutoff: string;
  seats: string;
  category: string;
  test_type: string;
}

const AdminUniversities = () => {
  const [unis, setUnis] = useState<University[]>([]);
  const [entranceTests, setEntranceTests] = useState<any[]>([]); // Dynamic tests from DB
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    location: "",
    ranking: "",
    cutoff: "",
    seats: "",
    category: "Public",
    test_type: "" // Initialized as empty for dynamic selection
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Universities
      const { data: uniData, error: uniError } = await supabase
        .from("universities")
        .select("*")
        .order('name', { ascending: true });
      
      // 2. Fetch Entrance Tests from Settings
      const { data: testData, error: testError } = await supabase
        .from("entrance_tests")
        .select("*")
        .order('name', { ascending: true });

      if (uniError) throw uniError;
      if (testError) throw testError;

      setUnis(uniData || []);
      setEntranceTests(testData || []);
      
      // Set default test type if tests exist
      if (testData && testData.length > 0) {
        setFormData(prev => ({ ...prev, test_type: testData[0].name }));
      }
      
    } catch (err: any) {
      toast({ title: "Fetch Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchUnis = async () => {
    const { data } = await supabase.from("universities").select("*").order('name', { ascending: true });
    setUnis(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("universities").upsert([formData]);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `${formData.name} has been saved.` });
      setFormData({ 
        id: "", 
        name: "", 
        location: "", 
        ranking: "", 
        cutoff: "", 
        seats: "", 
        category: "Public", 
        test_type: entranceTests[0]?.name || "" 
      });
      fetchUnis();
    }
  };

  const deleteUni = async (id: string) => {
    if (!confirm("Are you sure you want to delete this university?")) return;
    
    const { error } = await supabase.from("universities").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "University removed successfully." });
      fetchUnis();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-outfit font-bold flex items-center gap-2 text-slate-800">
            <School className="text-primary" /> University Database
          </h1>
          <p className="text-muted-foreground text-sm">Manage institutions for ECAT, MDCAT, and NET.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <Card className="lg:col-span-1 shadow-sm h-fit sticky top-24">
          <CardHeader>
            <CardTitle className="text-lg">Add New Institution</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Short ID (Unique)</label>
                <Input placeholder="e.g., nust-h12" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value.toLowerCase()})} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">University Name</label>
                <Input placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <Input placeholder="Location (e.g., Islamabad)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Ranking (Top 1)" value={formData.ranking} onChange={e => setFormData({...formData, ranking: e.target.value})} />
                <Input placeholder="Cutoff (e.g. 78%)" value={formData.cutoff} onChange={e => setFormData({...formData, cutoff: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Entrance Test Required</label>
                <select 
                  className="w-full p-2 border rounded-md text-sm bg-background transition-all focus:ring-2 focus:ring-primary/20"
                  value={formData.test_type}
                  onChange={e => setFormData({...formData, test_type: e.target.value})}
                  required
                >
                  <option value="" disabled>Select a test</option>
                  {entranceTests.map((test) => (
                    <option key={test.id} value={test.name}>
                      {test.name}
                    </option>
                  ))}
                  {entranceTests.length === 0 && <option disabled>No tests found. Add some in Settings!</option>}
                </select>
              </div>

              <Button type="submit" className="w-full mt-2 font-inter shadow-sm">
                <Plus className="mr-2 w-4 h-4" /> Save University
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* List Card */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-lg">Current List ({unis.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow>
                      <TableHead className="font-bold">University</TableHead>
                      <TableHead className="font-bold">Test</TableHead>
                      <TableHead className="text-right font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unis.length === 0 ? (
                      <TableRow><TableCell colSpan={3} className="text-center py-10 text-muted-foreground">No universities added yet.</TableCell></TableRow>
                    ) : (
                      unis.map((u) => (
                        <TableRow key={u.id} className="group hover:bg-slate-50 transition-colors">
                          <TableCell>
                            <div className="font-bold text-sm text-slate-800">{u.name}</div>
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <MapPin className="w-3 h-3" /> {u.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="uppercase text-[9px] font-bold tracking-tight px-2 py-0">
                              {u.test_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:bg-red-50 h-8 w-8"
                              onClick={() => deleteUni(u.id)}
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

export default AdminUniversities;