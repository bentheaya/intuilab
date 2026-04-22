import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface KnowledgeCheckProps {
  question: string;
  options: string[];
  correctAnswer: number;
}

export function KnowledgeCheck({ question, options, correctAnswer }: KnowledgeCheckProps) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

  const isCorrect = selected === options[correctAnswer];

  return (
    <Card className="bg-zinc-900/50 border-white/5 overflow-hidden">
      <CardHeader className="bg-white/5">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <span className="text-blue-400 text-xs font-mono uppercase tracking-widest">Knowledge Check</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-zinc-200 mb-6 leading-relaxed">{question}</p>
        
        <RadioGroup
          value={selected || ''}
          onValueChange={setSelected}
          disabled={submitted}
          className="space-y-3"
        >
          {options.map((option, idx) => (
            <div
              key={idx}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                submitted && idx === correctAnswer
                  ? "border-emerald-500/50 bg-emerald-500/10"
                  : submitted && selected === option && idx !== correctAnswer
                  ? "border-red-500/50 bg-red-500/10"
                  : selected === option
                  ? "border-blue-500/50 bg-blue-500/5"
                  : "border-white/5 hover:bg-white/5"
              }`}
            >
              <RadioGroupItem value={option} id={`q-${idx}`} className="border-zinc-700" />
              <Label htmlFor={`q-${idx}`} className="flex-1 cursor-pointer text-sm">
                {option}
              </Label>
              {submitted && idx === correctAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {submitted && selected === option && idx !== correctAnswer && <XCircle className="w-4 h-4 text-red-500" />}
            </div>
          ))}
        </RadioGroup>

        {!submitted ? (
          <Button
            className="w-full mt-6 bg-blue-600 hover:bg-blue-500"
            disabled={!selected}
            onClick={() => setSubmitted(true)}
          >
            Verify Intuition
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10"
          >
            <p className="text-sm text-zinc-400">
              {isCorrect 
                ? "Excellent. Your intuition aligns with the physical reality of this system." 
                : "Not quite. Consider how the variables interact in the simulation above."}
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
