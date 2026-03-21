import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, MapPin, Star, TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface University {
  id: string;
  name: string;
  location: string;
  ranking: string;
  cutoff: string;
  seats: string;
  category: string;
}

interface UniversitySelectorProps {
  stream?: string;
  test?: string;
  onUniversitySelect?: (university: string) => void;
  onBack?: () => void;
}

const UniversitySelector = ({ 
  stream = "Engineering", 
  test = "ecat", 
  onUniversitySelect = (id) => console.log("Selected:", id), 
  onBack = () => window.history.back() 
}: UniversitySelectorProps) => {
  const [testUniversities, setTestUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      setIsLoading(true);
      try {
        // Querying your existing 'universities' table
        // We filter by 'test_type' to show only relevant unis (e.g., ecat, mdcat)
        const { data, error } = await supabase
          .from("universities")
          .select("*")
          .eq("test_type", test);

        if (error) throw error;
        if (data) setTestUniversities(data);
      } catch (error) {
        console.error("Error fetching universities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUniversities();
  }, [test]);

  const testTitle = test.toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="font-inter">
          ← Back
        </Button>
        <div>
          <h2 className="text-3xl font-outfit font-bold text-foreground">
            Target Universities for {testTitle}
          </h2>
          <p className="text-muted-foreground font-inter">
            Choose your dream institution
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground font-inter">Fetching university data...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {testUniversities.length > 0 ? (
            testUniversities.map((university) => (
              <Card 
                key={university.id}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-primary"
                onClick={() => onUniversitySelect(university.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={`${
                            university.ranking === "Top 1" ? "bg-yellow-500" :
                            university.ranking === "Top 2" ? "bg-gray-400" :
                            university.ranking === "Top 3" ? "bg-orange-600" :
                            "bg-primary"
                          } text-white font-inter`}
                        >
                          <Star className="w-3 h-3 mr-1" />
                          {university.ranking}
                        </Badge>
                        <Badge variant="outline" className="font-inter">
                          {university.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-outfit font-bold">
                        {university.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 font-inter">
                        <MapPin className="w-4 h-4" />
                        {university.location}
                      </CardDescription>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-accent rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Cutoff</span>
                      </div>
                      <p className="text-lg font-bold text-green-600">{university.cutoff}</p>
                    </div>
                    <div className="text-center p-3 bg-accent rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="text-sm font-medium">Seats</span>
                      </div>
                      <p className="text-lg font-bold text-primary">{university.seats}</p>
                    </div>
                  </div>
                  
                  <Button variant="default" className="w-full font-inter font-medium">
                    Set as Target University
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              No university data found in the database for {testTitle}.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UniversitySelector;