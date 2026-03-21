import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Microscope, Settings, ChevronRight } from "lucide-react";

interface StreamSelectorProps {
  onStreamSelect: (stream: string) => void;
}

const StreamSelector = ({ onStreamSelect }: StreamSelectorProps) => {
  const streams = [
    {
      id: "pre-med",
      title: "Pre-Medical",
      description: "MDCAT, NET, and Medical Universities",
      icon: Microscope,
      subjects: ["Biology", "Chemistry", "Physics", "English"],
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconColor: "text-blue-600"
    },
    {
      id: "pre-engg",
      title: "Pre-Engineering", 
      description: "ECAT, NET, and Engineering Universities",
      icon: Settings,
      subjects: ["Mathematics", "Physics", "Chemistry", "English"],
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      iconColor: "text-green-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-outfit font-bold text-foreground mb-2">
          Choose Your Academic Stream
        </h2>
        <p className="text-muted-foreground font-inter">
          Select your field of study to access personalized content
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {streams.map((stream) => {
          const IconComponent = stream.icon;
          return (
            <Card 
              key={stream.id}
              className="relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-primary"
              onClick={() => onStreamSelect(stream.id)}
            >
              <div className={`absolute inset-0 ${stream.bgColor} opacity-50`} />
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg bg-background shadow-sm ${stream.iconColor}`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-xl font-outfit font-semibold">
                  {stream.title}
                </CardTitle>
                <CardDescription className="font-inter">
                  {stream.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Core Subjects:</p>
                  <div className="flex flex-wrap gap-2">
                    {stream.subjects.map((subject) => (
                      <span 
                        key={subject}
                        className="px-3 py-1 bg-background/80 text-foreground text-xs rounded-full border"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                  <Button variant="card" className="w-full mt-4 font-inter font-medium">
                    Select {stream.title}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StreamSelector;