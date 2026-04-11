import React, { useState } from 'react';
import { HelpCircle, PlayCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface TutorialItem {
  id: string | number;
  title: string;
  description?: string;
  videoUrl: string;
}

interface HelpFloatingButtonProps {
  tutorials: TutorialItem[];
}

export default function HelpFloatingButton({ tutorials }: HelpFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState<TutorialItem | null>(null);

  if (!tutorials || tutorials.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {isOpen && (
          <div className="bg-background border shadow-2xl rounded-xl w-[calc(100vw-3rem)] max-w-[320px] overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
            <div className="p-4 border-b flex items-center justify-between bg-muted/40">
              <div>
                <h3 className="font-bold text-foreground">Pusat Bantuan</h3>
                <p className="text-xs text-muted-foreground">Tutorial panduan halaman ini</p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-muted" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
              {tutorials.map((tutorial) => (
                <button
                  key={tutorial.id}
                  onClick={() => {
                      setSelectedTutorial(tutorial);
                      setIsOpen(false);
                  }}
                  className="w-full text-left flex items-start gap-3 p-2.5 hover:bg-muted/60 rounded-lg transition-colors group"
                >
                  <div className="mt-0.5 bg-primary/10 p-2 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all shrink-0">
                    <PlayCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-foreground/90 group-hover:text-foreground">{tutorial.title}</h4>
                    {tutorial.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed opacity-80">{tutorial.description}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className="h-14 w-14 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 bg-primary text-primary-foreground"
        >
          {isOpen ? <X className="h-6 w-6" /> : <HelpCircle className="h-6 w-6" />}
        </Button>
      </div>

      <Dialog open={!!selectedTutorial} onOpenChange={(open) => !open && setSelectedTutorial(null)}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black border-none gap-0">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedTutorial?.title}</DialogTitle>
            <DialogDescription>Video tutorial untuk {selectedTutorial?.title}</DialogDescription>
          </DialogHeader>
          {selectedTutorial && (
            <div className="aspect-video w-full relative group/video bg-black/90">
              <div className="absolute top-0 inset-x-0 p-4 bg-linear-to-b from-black/80 to-transparent z-10 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-semibold shadow-black drop-shadow-md">{selectedTutorial.title}</h3>
              </div>
              <video
                src={selectedTutorial.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain outline-none ring-0"
              >
                Browser Anda tidak mendukung tag video.
              </video>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
