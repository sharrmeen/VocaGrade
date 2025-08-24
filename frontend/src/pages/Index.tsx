import { useState } from 'react';
import AudioRecorder from '@/components/AudioRecorder';
import ScriptUpload from '@/components/ScriptUpload';
import ThemeSelector from '@/components/ThemeSelector';
import ContentDashboard from '@/components/ContentDashboard';
import ImprovementsDashboard from '@/components/ImprovementDashboard';
import DeliveryDashboard from '@/components/DeliveryDashboard';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [audioFile, setAudioFile] = useState<Blob | null>(null);
  const [scriptText, setScriptText] = useState<string>('');
  const [theme, setTheme] = useState<string>('');
  const [contentData, setContentData] = useState(null);
  const [deliveryData, setDeliveryData] = useState(null);
  const [improvementData, setImprovementData] = useState(null);
  

  const handleAudioReady = (blob: Blob) => {
    setAudioFile(blob);
    console.log('Audio recorded:', blob);
    console.log('Audio size:', blob.size, 'bytes');
    console.log('Audio type:', blob.type);
    
    toast({
      title: "Audio Recorded",
      description: `Successfully recorded ${(blob.size / 1024).toFixed(1)}KB audio file`,
    });
  };

   // Called when script changes
  const handleScriptChange = (text: string) => {
    setScriptText(text);
  };

  // Upload both audio + script to backend
  const uploadData = async () => {
    if (!audioFile) return;
  
    const formData = new FormData();
    formData.append("audio", audioFile, "recording.webm");
    if (scriptText.trim()) formData.append("script", scriptText);
    if (theme.trim()) formData.append("theme", theme);
  
    try {
      const res = await fetch("http://localhost:8000/api/process-audio", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();

      console.log("Backend response:", data);
      setContentData(data.content_analysis);
      setDeliveryData(data.delivery_analysis);
      setImprovementData(data?.content_analysis?.improvements || {
        contentSuggestions: [],
        deliverySuggestions: [],
        generalSuggestions: []
      });

      toast({ title: "Upload Complete", description: "Data sent for analysis" });
    } catch (error) {
      console.error(error);
      toast({ title: "Upload Failed", description: "Check backend" });
    }
  };
  

  const isReadyToAnalyze = !!audioFile;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">VocaGrade</h1>
              <p className="text-muted-foreground">Evaluate spoken answers with AI-powered analysis</p>
            </div>
            <ThemeSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Recording Section */}
          <section className="text-center space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Record Your Answer</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Click the microphone button to start recording your spoken answer. 
                You can optionally upload a reference script for comparison.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              <AudioRecorder onAudioReady={handleAudioReady} 
              theme={theme} 
              setTheme={setTheme} />
              
              <ScriptUpload onScriptReady={handleScriptChange}/>
            </div>
            <button
              onClick={uploadData}
              disabled={!isReadyToAnalyze}
              className="w-full max-w-xs mx-auto mt-4 button"
            >
              Analyze
            </button>

            {!scriptText && audioFile && (
              <p className="text-xs text-muted-foreground text-center">
                If no reference script provided — analysis will use audio only
              </p>
            )}
          </section>

          <Separator className="my-8" />

          {/* Analysis Dashboards */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Analysis Results</h2>
              <p className="text-muted-foreground">
                Comprehensive evaluation of your spoken content and delivery
              </p>
            </div>
            
            <div className="grid gap-6 lg:grid-cols-2">
              <ContentDashboard data={contentData}/>
              <DeliveryDashboard data={deliveryData}/>
              <ImprovementsDashboard data={improvementData}/>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>VocaGrade</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
