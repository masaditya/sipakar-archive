import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, ImageIcon, MonitorPlay, FileSpreadsheet, FileCode } from "lucide-react";
import { renderAsync } from "docx-preview";
import * as XLSX from "xlsx";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface FilePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileUrl: string | null;
    fileName?: string;
}

function DocxPreview({ url }: { url: string }) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (url && containerRef.current) {
            setLoading(true);
            fetch(url)
                .then((res) => res.arrayBuffer())
                .then((buffer) => {
                    if (containerRef.current) {
                        containerRef.current.innerHTML = "";
                        renderAsync(buffer, containerRef.current, undefined, {
                            className: "docx-container",
                        }).then(() => setLoading(false));
                    }
                })
                .catch((err) => {
                    console.error("Error rendering docx:", err);
                    setLoading(false);
                });
        }
    }, [url]);

    return (
        <div className="w-full h-full overflow-auto bg-white rounded-xl p-4 md:p-8 relative">
            {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Menyiapkan Dokumen...</p>
                </div>
            )}
            <div ref={containerRef} className="docx-preview-wrapper max-w-4xl mx-auto shadow-2xl bg-white min-h-full" />
            <style dangerouslySetInnerHTML={{ __html: `
                .docx-preview-wrapper .docx-container {
                    padding: 0 !important;
                    background-color: white !important;
                    min-height: 100% !important;
                }
                .docx-preview-wrapper section.docx {
                    margin-bottom: 2rem !important;
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
                }
            `}} />
        </div>
    );
}

function XlsxPreview({ url }: { url: string }) {
    const [data, setData] = React.useState<any[][]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (url) {
            setLoading(true);
            fetch(url)
                .then((res) => res.arrayBuffer())
                .then((buffer) => {
                    const workbook = XLSX.read(buffer, { type: "array" });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    setData(jsonData as any[][]);
                })
                .catch((err) => {
                    console.error("Error reading xlsx:", err);
                })
                .finally(() => setLoading(false));
        }
    }, [url]);

    if (loading) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-xl">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Memuat Spreadsheet...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-auto bg-white rounded-xl p-4 border shadow-inner">
            <Table>
                <TableBody>
                    {data.map((row, i) => (
                        <TableRow key={i} className="hover:bg-muted/50 transition-colors">
                            {row.map((cell, j) => (
                                <TableCell key={j} className="border text-[10px] sm:text-xs py-2 px-3 whitespace-nowrap font-medium">
                                    {cell !== null && cell !== undefined ? String(cell) : ""}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export function FilePreviewModal({ isOpen, onClose, fileUrl, fileName }: FilePreviewModalProps) {
    if (!fileUrl) return null;

    const getExtension = (value: string) => {
        const clean = value.split("?")[0];
        const parts = clean.split(".");
        return parts.length > 1 ? parts.pop()?.toLowerCase() : undefined;
    };

    const getFileType = (url: string, name?: string) => {
        const ext = (name ? getExtension(name) : undefined)
            ?? (url.startsWith("blob:") ? undefined : getExtension(url));

        if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) return "image";
        if (["mp4", "webm", "ogg", "mov"].includes(ext || "")) return "video";
        if (ext === "pdf") return "pdf";
        if (ext === "docx") return "docx";
        if (ext === "xlsx" || ext === "xls" || ext === "csv") return "xlsx";
        return "other";
    };

    const fileType = getFileType(fileUrl, fileName);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-7xl w-[98vw] h-[96vh] p-0 overflow-hidden flex flex-col rounded-2xl border-none shadow-2xl bg-background/95 backdrop-blur-xl transition-all duration-500 ease-in-out">
                <DialogHeader className="p-4 md:p-6 border-b bg-muted/20 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shadow-sm">
                            {fileType === "image" && <ImageIcon className="w-5 h-5" />}
                            {fileType === "video" && <MonitorPlay className="w-5 h-5" />}
                            {fileType === "pdf" && <FileText className="w-5 h-5" />}
                            {fileType === "docx" && <FileCode className="w-5 h-5" />}
                            {fileType === "xlsx" && <FileSpreadsheet className="w-5 h-5" />}
                            {fileType === "other" && <FileText className="w-5 h-5" />}
                        </div>
                        <div className="flex flex-col">
                            <DialogTitle className="text-sm md:text-base font-black truncate max-w-[250px] sm:max-w-xl uppercase tracking-tighter">
                                {fileName || "Pratinjau File"}
                            </DialogTitle>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                {fileType === 'docx' ? 'Microsoft Word' : fileType === 'xlsx' ? 'Microsoft Excel' : fileType.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 bg-black/5 flex items-center justify-center p-4 md:p-8 overflow-auto scrollbar-hide">
                    {fileType === "image" && (
                        <img
                            src={fileUrl}
                            alt={fileName}
                            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-500"
                        />
                    )}
                    {fileType === "video" && (
                        <video
                            src={fileUrl}
                            controls
                            autoPlay
                            className="max-w-full max-h-full rounded-2xl shadow-2xl"
                        />
                    )}
                    {fileType === "pdf" && (
                        <iframe
                            src={`${fileUrl}#toolbar=0`}
                            className="w-full h-full rounded-2xl border-none bg-white shadow-2xl"
                            title={fileName}
                        />
                    )}
                    {fileType === "docx" && <DocxPreview url={fileUrl} />}
                    {fileType === "xlsx" && <XlsxPreview url={fileUrl} />}
                    {fileType === "other" && (
                        <div className="flex flex-col items-center gap-6 p-12 bg-background border-4 border-dashed rounded-[3rem] text-center max-w-md mx-auto shadow-xl">
                            <div className="p-8 bg-muted rounded-4xl text-muted-foreground shadow-inner">
                                <FileText className="w-16 h-16" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-black uppercase text-base tracking-tight">Format Tidak Didukung</h3>
                                <p className="text-xs text-muted-foreground font-bold leading-relaxed px-4">
                                    Pratinjau langsung tidak tersedia untuk format ini. Silakan unduh file untuk melihat kontennya.
                                </p>
                            </div>
                            <a
                                href={fileUrl}
                                download
                                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/25"
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
