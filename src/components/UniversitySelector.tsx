import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, MapPin, Star, TrendingUp } from "lucide-react";

interface UniversitySelectorProps {
  stream: string;
  test: string;
  onUniversitySelect: (university: string) => void;
  onBack: () => void;
}

const UniversitySelector = ({ stream, test, onUniversitySelect, onBack }: UniversitySelectorProps) => {
  const universities = {
    mdcat: [
      {
        id: "kemu",
        name: "King Edward Medical University",
        location: "Lahore",
        ranking: "Top 1",
        cutoff: "89%",
        seats: "250",
        category: "Public"
      },
      {
        id: "aku",
        name: "Aga Khan University",
        location: "Karachi", 
        ranking: "Top 2",
        cutoff: "85%",
        seats: "100",
        category: "Private"
      },
      {
        id: "cmh",
        name: "CMH Medical College",
        location: "Lahore",
        ranking: "Top 5",
        cutoff: "83%",
        seats: "150",
        category: "Semi-Govt"
      },
      {
        id: "dow",
        name: "Dow University of Health Sciences",
        location: "Karachi",
        ranking: "Top 3",
        cutoff: "86%",
        seats: "200",
        category: "Public"
      }
    ],
    ecat: [
      {
        id: "nust",
        name: "National University of Sciences & Technology",
        location: "Islamabad",
        ranking: "Top 1",
        cutoff: "85%",
        seats: "800",
        category: "Public"
      },
      {
        id: "fast",
        name: "FAST National University",
        location: "Multiple Cities",
        ranking: "Top 2", 
        cutoff: "82%",
        seats: "600",
        category: "Public"
      },
      {
        id: "giki",
        name: "Ghulam Ishaq Khan Institute",
        location: "Topi, KPK",
        ranking: "Top 3",
        cutoff: "80%",
        seats: "400",
        category: "Private"
      },
      {
        id: "uet",
        name: "University of Engineering & Technology",
        location: "Lahore",
        ranking: "Top 4",
        cutoff: "78%",
        seats: "1000",
        category: "Public"
      }
    ],
    "net-med": [
      {
        id: "nums",
        name: "National University of Medical Sciences",
        location: "Rawalpindi",
        ranking: "Top 1",
        cutoff: "88%",
        seats: "200",
        category: "Public"
      }
    ],
    "net-engg": [
      {
        id: "pieas",
        name: "Pakistan Institute of Engineering & Applied Sciences",
        location: "Islamabad",
        ranking: "Top 1",
        cutoff: "90%",
        seats: "150",
        category: "Public"
      }
    ]
  };

  const testUniversities = universities[test as keyof typeof universities] || [];
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

      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {testUniversities.map((university) => (
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
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium">Cutoff</span>
                  </div>
                  <p className="text-lg font-bold text-success">{university.cutoff}</p>
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
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UniversitySelector;