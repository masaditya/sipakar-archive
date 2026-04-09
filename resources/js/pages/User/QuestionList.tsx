import { Head, Link } from '@inertiajs/react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ChevronRight, HelpCircle, FileText } from 'lucide-react';

export default function QuestionList({ aspects }: any) {
    return (
        <>
            <Head title="Daftar Kuisioner" />
            <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                <div className="flex flex-col gap-2 border-b pb-4">
                    <h1 className="text-3xl font-bold tracking-tight">Daftar Pertanyaan</h1>
                    <p className="text-muted-foreground">Monitor pengawasan internal kearsipan Anda di sini. Pilih soal di bawah untuk mengisikan jawaban.</p>
                </div>

                <div className="space-y-12">
                    {aspects.map((aspect: any) => (
                        <div key={aspect.id} className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-1 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                <h2 className="text-2xl font-black tracking-tight uppercase text-foreground/90">{aspect.name}</h2>
                            </div>

                            {aspect.sub_aspects.map((sub: any) => (
                                <div key={sub.id} className="ml-4 space-y-4">
                                    <div className="flex items-center gap-3 border-b border-muted pb-2">
                                        <Badge variant="outline" className="px-2 py-0 font-bold bg-primary/5 text-primary border-primary/20 text-[10px]">
                                            {sub.type}
                                        </Badge>
                                        <h3 className="font-bold text-lg text-muted-foreground">{sub.name}</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {sub.questions.map((q: any, idx: number) => {
                                            const answer = q.answers && q.answers[0];
                                            const isAnswered = !!answer;
                                            const status = answer?.status || 'none';
                                            
                                            const statusMap: any = {
                                                'submitted': { label: 'Diajukan', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
                                                'revision': { label: 'Revisi', color: 'bg-destructive/10 text-destructive border-destructive/20' },
                                                'completed': { label: 'Selesai', color: 'bg-primary/10 text-primary border-primary/20' },
                                                'none': { label: 'Belum Terisi', color: 'bg-muted text-muted-foreground opacity-50' }
                                            };

                                            return (
                                                <Link 
                                                    key={q.id} 
                                                    href={`/questionnaire/${q.id}`}
                                                    className="group transition-transform hover:-translate-y-1 duration-200"
                                                >
                                                    <Card className={`h-full border transition-all hover:shadow-[0_15px_40px_rgba(var(--primary),0.08)] cursor-pointer overflow-hidden ${isAnswered ? 'bg-primary/5 border-primary/20' : 'bg-card border-muted-foreground/10 hover:border-primary/40'}`}>
                                                        <div className={`h-1 w-full ${statusMap[status].color} border-none opacity-40`} />
                                                        <CardHeader className="p-5 pb-2">
                                                            <div className="flex justify-between items-start gap-2">
                                                                <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest flex items-center gap-1.5 opacity-70">
                                                                    <FileText className="w-3" />
                                                                    NO. {idx + 1}
                                                                </span>
                                                                <Badge variant="outline" className={`px-2 py-0.5 border-none text-[8px] font-black uppercase tracking-tighter rounded-md ${statusMap[status].color}`}>
                                                                    {statusMap[status].label}
                                                                </Badge>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent className="p-5 pt-1">
                                                            <p className="text-[15px] font-bold leading-relaxed text-foreground/80 group-hover:text-primary transition-colors">
                                                                {q.text}
                                                            </p>
                                                        </CardContent>
                                                    </Card>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

QuestionList.layout = {
    breadcrumbs: [
        {
            title: 'Kuisioner',
            href: '/questionnaire',
        },
    ],
};
