import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X, FileText, Type } from 'lucide-react';

export default function ScriptUpload() {
  const [scriptContent, setScriptContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('type');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setScriptContent(content);
        setActiveTab('type'); // Switch to type tab to show the content
      };
      reader.readAsText(file);
    }
  };

  const clearScript = () => {
    setScriptContent('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Reference Script (Optional)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="type" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Type Script
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload File
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="type" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter your reference script:</label>
              <Textarea
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                className="min-h-[150px]"
                placeholder="Type or paste your reference script here. This will be used to compare against your spoken recording for content coverage analysis..."
              />
            </div>
            {scriptContent && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearScript}
                  className="flex items-center gap-2"
                >
                  <X className="h-3 w-3" />
                  Clear
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <Button
                variant="outline"
                onClick={triggerFileInput}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Script (.txt)
              </Button>

              {fileName && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{fileName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearScript}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {!scriptContent && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Upload a .txt file containing your reference script</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {scriptContent && (
          <div className="text-xs text-center text-muted-foreground bg-accent/30 p-3 rounded">
            Script ready for comparison ({scriptContent.length} characters)
          </div>
        )}
      </CardContent>
    </Card>
  );
}