import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, TrendingUp } from 'lucide-react';

export default function ContentDashboard() {
  // Placeholder data for the dashboard
  const mockData = {
    overallCoverage: 75,
    keyPointsCovered: 8,
    totalKeyPoints: 12,
    missedTopics: ['Introduction summary', 'Conclusion remarks', 'Supporting evidence', 'Call to action']
  };

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
            <span>{mockData.overallCoverage}%</span>
          </div>
          <Progress value={mockData.overallCoverage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-success">{mockData.keyPointsCovered}</div>
            <div className="text-sm text-muted-foreground">Points Covered</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-muted-foreground">{mockData.totalKeyPoints - mockData.keyPointsCovered}</div>
            <div className="text-sm text-muted-foreground">Points Missed</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Areas for Improvement
          </h4>
          <ul className="space-y-1">
            {mockData.missedTopics.map((topic, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                • {topic}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-xs text-center text-muted-foreground bg-muted/50 p-3 rounded">
          This dashboard will show real content analysis once audio is processed
        </div>
      </CardContent>
    </Card>
  );
}