import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Calendar, Users, Award } from "lucide-react";

interface TestSelectorProps {
  stream: string;
  onTestSelect: (test: string) => void;
  onBack: () => void;
}

const TestSelector = ({ stream, onTestSelect, onBack }: TestSelectorProps) => {
  const tests = {
    "pre-med": [
      {
        id: "mdcat",
        title: "MDCAT",
        description: "Medical & Dental College Admission Test",
        difficulty: "High",
        duration: "210 min",
        sections: ["Biology", "Chemistry", "Physics", "English", "Logical Reasoning"],
        popularity: "Most Popular",
        universities: ["KEMU", "CMH", "Aga Khan", "Dow University"]
      },
      {
        id: "net-med",
        title: "NET (Medical)",
        description: "National Entrance Test for Medical",
        difficulty: "High", 
        duration: "180 min",
        sections: ["Biology", "Chemistry", "Physics", "English"],
        popularity: "Popular",
        universities: ["NUMS", "Military Medical Colleges"]
      }
    ],
    "pre-engg": [
      {
        id: "ecat",
        title: "ECAT",
        description: "Engineering College Admission Test",
        difficulty: "High",
        duration: "150 min", 
        sections: ["Mathematics", "Physics", "Chemistry", "English"],
        popularity: "Most Popular",
        universities: ["UET", "NUST", "GIKI", "FAST"]
      },
      {
        id: "net-engg",
        title: "NET (Engineering)",
        description: "National Entrance Test for Engineering",
        difficulty: "High",
        duration: "180 min",
        sections: ["Mathematics", "Physics", "Chemistry", "English"],
        popularity: "Popular", 
        universities: ["NUST", "PIEAS", "Military Colleges"]
      }
    ]
  };

  const streamTests = tests[stream as keyof typeof tests] || [];
  const streamTitle = stream === "pre-med" ? "Pre-Medical" : "Pre-Engineering";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="font-inter">
          ← Back
        </Button>
        <div>
          <h2 className="text-3xl font-outfit font-bold text-foreground">
            {streamTitle} Entrance Tests
          </h2>
          <p className="text-muted-foreground font-inter">
            Choose your target entrance examination
          </p>
        </div>
      </div>

      <div className="grid gap-6 max-w-4xl mx-auto">
        {streamTests.map((test) => (
          <Card 
            key={test.id}
            className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-primary"
            onClick={() => onTestSelect(test.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-2xl font-outfit font-bold">
                      {test.title}
                    </CardTitle>
                    {test.popularity === "Most Popular" && (
                      <Badge className="bg-primary text-primary-foreground font-inter">
                        <Award className="w-3 h-3 mr-1" />
                        {test.popularity}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-base font-inter">
                    {test.description}
                  </CardDescription>
                </div>
                <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-medium">Duration:</span>
                      <span className="text-muted-foreground">{test.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="font-medium">Level:</span>
                      <span className="text-muted-foreground">{test.difficulty}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium text-sm mb-2">Test Sections:</p>
                    <div className="flex flex-wrap gap-2">
                      {test.sections.map((section) => (
                        <span 
                          key={section}
                          className="px-3 py-1 bg-accent text-accent-foreground text-xs rounded-full font-inter"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-sm mb-2">Target Universities:</p>
                  <div className="flex flex-wrap gap-2">
                    {test.universities.map((uni) => (
                      <span 
                        key={uni}
                        className="px-3 py-1 bg-primary-light text-primary text-xs rounded-full font-inter font-medium"
                      >
                        {uni}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button variant="default" className="w-full mt-4 font-inter font-medium">
                Prepare for {test.title}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestSelector;