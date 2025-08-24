import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, TrendingUp } from 'lucide-react';

type ContentData = {
  overallCoverage: number;
  keyPointsCovered: number;
  totalKeyPoints: number;
  missedTopics: string[];
};

interface ContentDashboardProps {
  data: ContentData | null; 
}

export default function ContentDashboard({ data }: ContentDashboardProps) {
  // Placeholder data for the dashboard
  const mockData = {
    overallCoverage: 75,
    keyPointsCovered: 8,
    totalKeyPoints: 12,
    missedTopics: ['Introduction summary', 'Conclusion remarks', 'Supporting evidence', 'Call to action']
  };
  const metrics = data || mockData;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Content Coverage Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Coverage</span>
            <span>{metrics.overallCoverage}%</span>
          </div>
          <Progress value={metrics.overallCoverage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-success">{metrics.keyPointsCovered}</div>
            <div className="text-sm text-muted-foreground">Points Covered</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-muted-foreground">{metrics.totalKeyPoints - metrics.keyPointsCovered}</div>
            <div className="text-sm text-muted-foreground">Points Missed</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Areas for Improvement
          </h4>
          <ul className="space-y-1">
            {metrics.missedTopics.map((topic, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                • {topic}
              </li>
            ))}
          </ul>
        </div>

        
      </CardContent>
    </Card>
  );
}