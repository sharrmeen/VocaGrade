import { useState } from 'react';
import AudioRecorder from '@/components/AudioRecorder';
import ScriptUpload from '@/components/ScriptUpload';
import ThemeSelector from '@/components/ThemeSelector';
import ContentDashboard from '@/components/ContentDashboard';
import DeliveryDashboard from '@/components/DeliveryDashboard';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();

  const handleAudioReady = (blob: Blob) => {
    console.log('Audio recorded:', blob);
    console.log('Audio size:', blob.size, 'bytes');
    console.log('Audio type:', blob.type);
    
    // TODO: Send to FastAPI backend at /api/upload-audio
    toast({
      title: "Audio Recorded",
      description: `Successfully recorded ${(blob.size / 1024).toFixed(1)}KB audio file`,
    });
  };

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
              <AudioRecorder onAudioReady={handleAudioReady} />
              <ScriptUpload />
            </div>
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
              <ContentDashboard />
              <DeliveryDashboard />
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
