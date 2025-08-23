import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Mic2, Clock, Volume2, Zap } from 'lucide-react';

export default function DeliveryDashboard() {
  // Placeholder data for the dashboard
  const mockData = {
    fluencyScore: 82,
    speakingPace: 'Optimal',
    fillerWords: 7,
    clarity: 89,
    totalDuration: '2:34',
    averagePause: '0.8s',
    volumeConsistency: 91
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getPaceBadgeVariant = (pace: string) => {
    switch (pace) {
      case 'Optimal': return 'default';
      case 'Too Fast': return 'destructive';
      case 'Too Slow': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic2 className="h-5 w-5" />
          Delivery & Fluency Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Fluency Score</span>
              <span className={getScoreColor(mockData.fluencyScore)}>{mockData.fluencyScore}%</span>
            </div>
            <Progress value={mockData.fluencyScore} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Clarity</span>
              <span className={getScoreColor(mockData.clarity)}>{mockData.clarity}%</span>
            </div>
            <Progress value={mockData.clarity} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-muted rounded-lg">
            <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-lg font-semibold">{mockData.totalDuration}</div>
            <div className="text-xs text-muted-foreground">Duration</div>
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <Volume2 className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-lg font-semibold">{mockData.fillerWords}</div>
            <div className="text-xs text-muted-foreground">Filler Words</div>
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <Zap className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-lg font-semibold">{mockData.averagePause}</div>
            <div className="text-xs text-muted-foreground">Avg Pause</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Speaking Pace</span>
            <Badge variant={getPaceBadgeVariant(mockData.speakingPace)}>
              {mockData.speakingPace}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Volume Consistency</span>
              <span className={getScoreColor(mockData.volumeConsistency)}>{mockData.volumeConsistency}%</span>
            </div>
            <Progress value={mockData.volumeConsistency} className="h-2" />
          </div>
        </div>

        <div className="text-xs text-center text-muted-foreground bg-muted/50 p-3 rounded">
          This dashboard will show real delivery metrics once audio is processed
        </div>
      </CardContent>
    </Card>
  );
}