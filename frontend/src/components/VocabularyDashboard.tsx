import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, List, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type VocabularyData = {
  vocabularyScore: number;
  uniqueWordCount: number;
  wordRepetition: string[];
  wordChoiceSuggestions: string[];
  toneAssessment: string;
};

interface VocabularyDashboardProps {
  data: VocabularyData | null;
}

export default function VocabularyDashboard({ data }: VocabularyDashboardProps) {
  const mockData: VocabularyData = {
    vocabularyScore: 78,
    uniqueWordCount: 150,
    wordRepetition: ['actually', 'very', 'basically'],
    wordChoiceSuggestions: [
      "Use more precise adjectives to enhance clarity.",
      "Replace filler words with stronger nouns or verbs.",
      "Vary sentence starters to avoid monotony."
    ],
    toneAssessment: "Friendly and approachable, but slightly informal."
  };

  const metrics = data || mockData;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Vocabulary Score */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Vocabulary Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Vocabulary Score</span>
            <span className={getScoreColor(metrics.vocabularyScore)}>
              {metrics.vocabularyScore}%
            </span>
          </div>
          <Progress value={metrics.vocabularyScore} className="h-2" />
        </CardContent>
      </Card>

      {/* Word Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-success">{metrics.uniqueWordCount}</div>
          <div className="text-sm text-muted-foreground">Unique Words</div>
        </Card>

        <Card className="p-4 bg-muted rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Hash className="h-4 w-4" />Frequently Repeated Words
          </div>
          <div className="flex flex-wrap gap-2">
            {metrics.wordRepetition.map((word, idx) => (
              <Badge key={idx} variant="destructive">{word}</Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Word Choice Suggestions */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" /> Word Choice Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            {metrics.wordChoiceSuggestions.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Tone Assessment */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Tone Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground text-center">
          {metrics.toneAssessment}
        </CardContent>
      </Card>
    </div>
  );
}
