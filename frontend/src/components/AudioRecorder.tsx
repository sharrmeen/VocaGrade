import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Square, Play, Pause, Download } from 'lucide-react';
import { Dispatch, SetStateAction } from "react";
import { cn } from '@/lib/utils';

interface AudioRecorderProps {
  onAudioReady?: (blob: Blob) => void;
  theme: string;                      
  setTheme: Dispatch<SetStateAction<string>>;
}



export default function AudioRecorder({ onAudioReady,theme,setTheme }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);


  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onAudioReady?.(blob);
        
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, [onAudioReady]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  const togglePlayback = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  const downloadAudio = useCallback(() => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `voicegrade-recording-${new Date().getTime()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [audioUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Audio Recorder</h3>
          {isRecording && (
            <div className="text-sm text-muted-foreground">
              Recording: {formatTime(recordingTime)}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          {!isRecording ? (
            <Button
              size="lg"
              onClick={startRecording}
              className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90"
            >
              <Mic className="h-6 w-6" />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={stopRecording}
              className="w-16 h-16 rounded-full bg-recording hover:bg-recording/90"
            >
              <Square className="h-6 w-6" />
            </Button>
          )}
        </div>

        {audioUrl && (
          <div className="space-y-3">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={downloadAudio}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-xs text-center text-muted-foreground">
              Audio recorded successfully
            </div>
          </div>
        )}

        {isRecording && (
          <div className={cn(
            "w-4 h-4 rounded-full mx-auto animate-pulse",
            "bg-recording"
          )} />
        )}
        <div className="space-y-2 mt-6" style={{marginTop:'50px'}}>
        <label className="text-sm font-medium">Enter a theme (optional)</label>
        <input
          
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="theme-input"
          placeholder="e.g. Climate Change, AI Ethics..."
        />
        </div>

        
      </CardContent>
      
    </Card>
  );
}