import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const TestTypeForm = () => {
  const [testName, setTestName] = useState("");
  const [category, setCategory] = useState("");
  const [universities, setUniversities] = useState<any[]>([]);
  const [selectedUnis, setSelectedUnis] = useState<string[]>([]);

  useEffect(() => {
    const fetchUnis = async () => {
      const { data } = await supabase.from('universities').select('id, name');
      if (data) setUniversities(data);
    };
    fetchUnis();
  }, []);

  const handleSaveTest = async () => {
    if (!testName || !category) return toast.error("Fill all fields");
    const { data: testData, error: testError } = await supabase
      .from('test_types')
      .insert([{ name: testName, student_category: category }])
      .select().single();

    if (testError) return toast.error("Error saving");

    const mappings = selectedUnis.map(uniId => ({ test_id: testData.id, university_id: uniId }));
    await supabase.from('test_university_mapping').insert(mappings);
    toast.success("Test Type added!");
    setTestName("");
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200">
      <h2 className="text-2xl font-bold mb-6">Entry Test Management</h2>
      <div className="space-y-4 max-w-md">
        <Input value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="Test Name (e.g. NET)" />
        <Select onValueChange={setCategory}>
          <SelectTrigger><SelectValue placeholder="Select Stream" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="PE">Pre-Engineering</SelectItem>
            <SelectItem value="PM">Pre-Medical</SelectItem>
            <SelectItem value="ICS">Computer Science (ICS)</SelectItem>
          </SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-2 border p-3 rounded-md">
          {universities.map((uni) => (
            <div key={uni.id} className="flex items-center space-x-2">
              <Checkbox onCheckedChange={(c) => setSelectedUnis(prev => c ? [...prev, uni.id] : prev.filter(id => id !== uni.id))} />
              <label className="text-xs">{uni.name}</label>
            </div>
          ))}
        </div>
        <Button onClick={handleSaveTest} className="w-full">Save Module</Button>
      </div>
    </div>
  );
};

export default TestTypeForm;