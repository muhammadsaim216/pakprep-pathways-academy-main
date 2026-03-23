import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // For a smoother dynamic loading state

const TestTypeForm = () => {
  const [testName, setTestName] = useState("");
  const [category, setCategory] = useState("");
  const [universities, setUniversities] = useState<any[]>([]);
  const [selectedUnis, setSelectedUnis] = useState<string[]>([]);
  
  // Dynamic Academic Streams from Supabase
  const [streams, setStreams] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Universities for the mapping
        const { data: uniData } = await supabase
          .from('universities')
          .select('id, name')
          .order('name');
        
        if (uniData) setUniversities(uniData);

        // 2. Fetch Dynamic Academic Streams (PE, PM, ICS, etc.)
        const { data: streamData } = await supabase
          .from('academic_streams')
          .select('id, name')
          .eq('is_active', true)
          .order('display_order');

        if (streamData) setStreams(streamData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.error("Failed to load dynamic data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveTest = async () => {
    if (!testName || !category) return toast.error("Fill all fields");
    
    const { data: testData, error: testError } = await supabase
      .from('test_types')
      .insert([{ name: testName, student_category: category }])
      .select().single();

    if (testError) return toast.error("Error saving test type");

    if (selectedUnis.length > 0) {
      const mappings = selectedUnis.map(uniId => ({ 
        test_id: testData.id, 
        university_id: uniId 
      }));
      
      const { error: mapError } = await supabase.from('test_university_mapping').insert(mappings);
      if (mapError) toast.error("Test saved, but university mapping failed");
    }

    toast.success("Test Type added successfully!");
    setTestName("");
    setSelectedUnis([]);
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Entry Test Management</h2>
      
      <div className="space-y-6 max-w-md">
        {/* Test Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">Test Name</label>
          <Input 
            value={testName} 
            onChange={(e) => setTestName(e.target.value)} 
            placeholder="e.g. NET, ECAT, MDCAT" 
          />
        </div>

        {/* Dynamic Stream Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">Applicable Student Stream</label>
          <Select onValueChange={setCategory} disabled={loading}>
            <SelectTrigger className="w-full">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading streams...</span>
                </div>
              ) : (
                <SelectValue placeholder="Select Academic Stream" />
              )}
            </SelectTrigger>
            <SelectContent>
              {streams.map((stream) => (
                <SelectItem key={stream.id} value={stream.name}>
                  {stream.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* University Selection Grid */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600 text-nowrap">Link to Universities</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border p-4 rounded-lg bg-slate-50/50 max-h-48 overflow-y-auto">
            {universities.map((uni) => (
              <div key={uni.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={uni.id}
                  onCheckedChange={(c) => setSelectedUnis(prev => c ? [...prev, uni.id] : prev.filter(id => id !== uni.id))} 
                />
                <label htmlFor={uni.id} className="text-xs font-medium text-slate-600 cursor-pointer">
                  {uni.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleSaveTest} className="w-full font-bold h-11" disabled={loading}>
          Save Test Module
        </Button>
      </div>
    </div>
  );
};

export default TestTypeForm;