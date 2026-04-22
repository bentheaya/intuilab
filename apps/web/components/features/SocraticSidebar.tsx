import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useSocraticChat } from '@/hooks/use-intuilab';

import { Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';


export function SocraticSidebar({ lessonId }: { lessonId?: string }) {
  const { messages, sendMessage, isTyping } = useSocraticChat(lessonId);
  const [input, setInput] = useState('');


  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/50 border-l border-white/5 backdrop-blur-xl">
      <div className="p-4 border-bottom border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium tracking-tight">Socratic Tutor</span>
        </div>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse-slow">
          Guardrail Active
        </Badge>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex flex-col max-w-[85%]",
                  msg.role === 'student' ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                <div
                  className={cn(
                    "px-4 py-3 rounded-2xl",
                    msg.role === 'student'
                      ? "bg-blue-600 text-white student-bubble"
                      : "bg-zinc-900 border border-white/5 text-zinc-100 mentor-bubble"
                  )}
                >
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{msg.content}</ReactMarkdown>
                </div>

                <span className="text-[10px] text-zinc-500 mt-1 px-1">
                  {msg.role === 'mentor' ? 'Mentor' : 'You'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className="flex gap-1 p-2">
              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/5 bg-zinc-950/80">
        <div className="relative">
          <Textarea
            placeholder="Ask a question..."
            className="min-h-[80px] bg-zinc-900/50 border-white/10 focus:border-blue-500/50 resize-none pr-12"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            size="icon"
            className="absolute bottom-2 right-2 h-8 w-8 bg-blue-600 hover:bg-blue-500"
            onClick={handleSend}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-zinc-500 mt-2 text-center">
          The Mentor uses Socratic questioning to guide your intuition.
        </p>
      </div>
    </div>
  );
}
