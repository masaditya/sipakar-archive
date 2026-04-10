import { Head, Link } from '@inertiajs/react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, FileText, Percent } from 'lucide-react';

export default function QuestionList({ aspects }: any) {
    return (
        <>
            <Head title="Daftar Kuisioner" />
            <div className="flex flex-col gap-10 p-8 max-w-[1400px] mx-auto w-full">
                <div className="flex flex-col gap-2 border-b pb-6">
                    <h1 className="text-4xl font-black tracking-tight text-foreground/90 uppercase italic">Pelaksanaan Audit</h1>
                    <p className="text-muted-foreground font-medium">Monitor pengawasan internal kearsipan Anda. Bobot nilai per aspek telah ditentukan sesuai regulasi.</p>
                </div>

                <div className="space-y-20">
                    {aspects.map((aspect: any) => (
                        <div key={aspect.id} className="space-y-10 group">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-4 border-primary pl-6 py-2 transition-all group-hover:border-l-8">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black tracking-tight uppercase text-foreground/90">{aspect.name}</h2>
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-2xl">{aspect.description}</p>
                                </div>
                                <div className="shrink-0 flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20">
                                    <Percent className="size-4 text-primary" />
                                    <span className="text-sm font-black text-primary uppercase tracking-widest">Bobot: {aspect.score_weight}%</span>
                                </div>
                            </div>

                            <div className="space-y-12">
                                {aspect.sub_aspects.map((sub: any) => (
                                    <div key={sub.id} className="ml-8 space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-muted pb-3">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="px-3 py-1 font-black bg-primary/5 text-primary border-primary/20 text-[10px] tracking-widest uppercase rounded-lg">
                                                    UNIT {sub.type === 'UP' ? 'PENGELOLA' : 'KEARSIPAN'}
                                                </Badge>
                                                <h3 className="font-black text-xl text-foreground/70 tracking-tight">{sub.name}</h3>
                                            </div>
                                            <div className="flex items-center gap-2 bg-orange-100/50 text-orange-600 px-3 py-1 rounded-xl border border-orange-200 text-[10px] font-black uppercase tracking-widest w-fit">
                                                <Percent className="size-3" />
                                                Bobot Sub: {sub.score_weight}%
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {sub.questions.map((q: any, idx: number) => {
                                                const answer = q.answers && q.answers[0];
                                                const isAnswered = !!answer;
                                                const status = answer?.status || 'none';
                                                
                                                const statusMap: any = {
                                                    'submitted': { label: 'Diajukan', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-amber-500/5' },
                                                    'revision': { label: 'Perlu Revisi', color: 'bg-destructive/10 text-destructive border-destructive/20 shadow-destructive/5' },
                                                    'completed': { label: 'Diterima', color: 'bg-primary/10 text-primary border-primary/20 shadow-primary/5' },
                                                    'none': { label: 'Kosong', color: 'bg-muted/50 text-muted-foreground border-muted-foreground/10' }
                                                };

                                                return (
                                                    <Link 
                                                        key={q.id} 
                                                        href={`/questionnaire/${q.id}`}
                                                        className="group/card transition-all duration-300 hover:-translate-y-2"
                                                    >
                                                        <Card className={`h-full border-none shadow-xl transition-all group-hover/card:shadow-2xl cursor-pointer overflow-hidden ${isAnswered ? 'bg-gradient-to-br from-background to-primary/[0.03]' : 'bg-background'}`}>
                                                            <div className={`h-1.5 w-full ${statusMap[status].color} border-none opacity-60`} />
                                                            <CardHeader className="p-6 pb-2">
                                                                <div className="flex justify-between items-start gap-2">
                                                                    <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-muted/40 text-[10px] font-black uppercase text-muted-foreground/80 tracking-[0.2em]">
                                                                        <FileText className="w-3" />
                                                                        ID: {idx + 1}
                                                                    </div>
                                                                    <div className={`px-3 py-1 border rounded-lg text-[9px] font-black uppercase tracking-[0.1em] shadow-sm ${statusMap[status].color}`}>
                                                                        {statusMap[status].label}
                                                                    </div>
                                                                </div>
                                                            </CardHeader>
                                                            <CardContent className="p-6 pt-2">
                                                                <p className="text-[15px] font-bold leading-relaxed text-foreground/80 group-hover/card:text-primary transition-colors line-clamp-3">
                                                                    {q.text}
                                                                </p>
                                                                <div className="mt-6 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover/card:opacity-100 transition-all translate-x-[-10px] group-hover/card:translate-x-0">
                                                                    Isi Jawaban <ChevronRight className="size-4" />
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
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
            title: 'Audit Internal',
            href: '/questionnaire',
        },
    ],
};
