import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, ImageIcon, MonitorPlay, X } from "lucide-react";

interface FilePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileUrl: string | null;
    fileName?: string;
}

export function FilePreviewModal({ isOpen, onClose, fileUrl, fileName }: FilePreviewModalProps) {
    if (!fileUrl) return null;

    const getFileType = (url: string) => {
        const ext = url.split('.').pop()?.toLowerCase();
        console.log(ext)
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
        if (['mp4', 'webm', 'ogg', 'mov'].includes(ext || '')) return 'video';
        if (ext === 'pdf') return 'pdf';
        return 'other';
    };

    const fileType = getFileType(fileUrl);
    console.log(fileType)

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col rounded-3xl border-none shadow-2xl bg-background/95 backdrop-blur-xl">
                <DialogHeader className="p-4 border-b bg-muted/20 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            {fileType === 'image' && <ImageIcon className="w-5 h-5" />}
                            {fileType === 'video' && <MonitorPlay className="w-5 h-5" />}
                            {fileType === 'pdf' && <FileText className="w-5 h-5" />}
                            {fileType === 'other' && <FileText className="w-5 h-5" />}
                        </div>
                        <DialogTitle className="text-sm font-black truncate max-w-[300px] sm:max-w-md uppercase tracking-tight">
                            {fileName || 'Pratinjau File'}
                        </DialogTitle>
                    </div>
                </DialogHeader>
                
                <div className="flex-1 bg-black/5 flex items-center justify-center p-4 overflow-auto scrollbar-hide">
                    {fileType === 'image' && (
                        <img 
                            src={fileUrl} 
                            alt={fileName} 
                            className="max-w-full max-h-full object-contain rounded-lg shadow-lg animate-in zoom-in-95 duration-300" 
                        />
                    )}
                    {fileType === 'video' && (
                        <video 
                            src={fileUrl} 
                            controls 
                            autoPlay
                            className="max-w-full max-h-full rounded-lg shadow-lg" 
                        />
                    )}
                    {fileType === 'pdf' && (
                        <iframe 
                            src={`${fileUrl}#toolbar=0`} 
                            className="w-full h-full rounded-lg border-none bg-white shadow-inner"
                            title={fileName}
                        />
                    )}
                    {fileType === 'other' && (
                        <div className="flex flex-col items-center gap-4 p-12 bg-background border-2 border-dashed rounded-4xl text-center max-w-sm mx-auto">
                            <div className="p-6 bg-muted rounded-3xl text-muted-foreground">
                                <FileText className="w-12 h-12" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-black uppercase text-sm">Format Tidak Didukung</h3>
                                <p className="text-xs text-muted-foreground font-medium">Pratinjau langsung tidak tersedia untuk format ini. Silakan unduh file untuk melihat kontennya.</p>
                            </div>
                            <a 
                                href={fileUrl} 
                                download 
                                className="w-full py-3 bg-primary text-primary-foreground rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                            >
                                Unduh File
                            </a>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
