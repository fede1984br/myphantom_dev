import React, { useState } from 'react';
import { Quest } from '@my-phantom/core'; 
import { invokeLLM } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuestStatusProps {
  quest: Quest;
}

const QuestStatus: React.FC<QuestStatusProps> = ({ quest }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  const handleGetStatusUpdate = async () => {
    setIsLoading(true);
    setAiResponse('');
    try {
      const prompt = `Generate a concise, one-sentence status update for the quest titled: "${quest.title}".`;
      const response = await invokeLLM(prompt);
      setAiResponse(response.text || 'No response from AI.');
    } catch (error) {
      console.error('Failed to get AI status update:', error);
      setAiResponse('Error fetching status update.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{quest.title || 'Quest Title'}</span>
          <Badge variant="outline">{quest.status || 'Active'}</Badge>
        </CardTitle>
        <CardDescription>{quest.description || 'Quest description goes here.'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={handleGetStatusUpdate} disabled={isLoading}>
            {isLoading ? 'Getting Update...' : 'Get AI Status Update'}
          </Button>
          {aiResponse && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">AI Update:</p>
              <p className="text-sm text-muted-foreground">{aiResponse}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestStatus;