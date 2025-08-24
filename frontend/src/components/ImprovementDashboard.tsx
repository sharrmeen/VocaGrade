import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, FileText, Mic2, Zap } from 'lucide-react';

type ImprovementData = {
  contentSuggestions: string[];
  deliverySuggestions: string[];
  generalSuggestions: string[];
};

interface ImprovementDashboardProps {
  data: ImprovementData | null; 
}

export default function ImprovementDashboard({ data }: ImprovementDashboardProps) {
  const mockData: ImprovementData = {
    contentSuggestions: [
      "Add a clear summary at the beginning to establish context.",
      "Include more supporting evidence to strengthen arguments.",
      "End with a strong call-to-action to leave a lasting impression."
    ],
    deliverySuggestions: [
      "Reduce long pauses to maintain listener engagement.",
      "Vary vocal pitch to avoid a monotonous tone.",
      "Slow down slightly when explaining complex points."
    ],
    generalSuggestions: [
      "Rehearse with a timer to better control pacing.",
      "Record yourself and listen for filler words.",
      "Practice deep breathing to improve clarity and projection."
    ]
  };

  const metrics = data || mockData;

  const sections = [
    { title: "Content Suggestions", icon: FileText, tips: metrics.contentSuggestions },
    { title: "Delivery Suggestions", icon: Mic2, tips: metrics.deliverySuggestions },
    { title: "General Suggestions", icon: Zap, tips: metrics.generalSuggestions },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Improvement Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div
                key={idx}
                className="w-full p-4 bg-muted rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-blue-400/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">{section.title}</span>
                </div>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {section.tips.map((tip, tipIdx) => (
                    <li key={tipIdx}>{tip}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="text-xs text-center text-muted-foreground bg-muted/50 p-3 rounded">
          AI-generated improvement tips based on your content and delivery metrics.
        </div>
      </CardContent>
    </Card>
  );
}
