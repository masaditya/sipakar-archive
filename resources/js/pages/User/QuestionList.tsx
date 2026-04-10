import { Head, Link } from '@inertiajs/react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, FileText, Percent } from 'lucide-react';

export default function QuestionList({ aspects }: any) {
    return (
        <>
            <Head title="Daftar Kuisioner" />
            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col gap-1 border-b pb-4">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground/90">Pelaksanaan Audit</h1>
                    <p className="text-sm text-muted-foreground">Monitor pengawasan internal kearsipan Anda. Bobot nilai per aspek telah ditentukan sesuai regulasi.</p>
                </div>

                <div className="space-y-12">
                    {aspects.map((aspect: any) => (
                        <div key={aspect.id} className="space-y-6 group">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 border-primary pl-4 py-1 transition-all group-hover:border-l-8">
                                <div className="space-y-1">
                                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground/90 uppercase">{aspect.name}</h2>
                                    {aspect.description && <p className="text-xs text-muted-foreground max-w-2xl">{aspect.description}</p>}
                                </div>
                                <div className="shrink-0 flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20 w-fit">
                                    <Percent className="size-3.5 text-primary" />
                                    <span className="text-[11px] font-bold text-primary uppercase tracking-widest">Bobot: {aspect.score_weight}%</span>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {aspect.sub_aspects.map((sub: any) => (
                                    <div key={sub.id} className="ml-0 sm:ml-6 space-y-4">
                                        <div className="flex flex-wrap items-center gap-3 border-b border-muted pb-2">
                                            <Badge variant="outline" className="px-2 py-0.5 font-bold bg-primary/5 text-primary border-primary/20 text-[9px] tracking-widest uppercase rounded shrink-0">
                                                UNIT {sub.type === 'UP' ? 'PENGELOLA' : 'KEARSIPAN'}
                                            </Badge>
                                            <h3 className="font-bold text-sm sm:text-base text-foreground/80 tracking-tight">{sub.name}</h3>
                                            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md border border-amber-500/20 text-[9px] font-bold uppercase tracking-widest sm:ml-auto">
                                                <Percent className="size-2.5" />
                                                Bobot Sub: {sub.score_weight}%
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2 sm:gap-3">
                                            {sub.questions.map((q: any, idx: number) => {
                                                const answer = q.answers && q.answers[0];
                                                const isAnswered = !!answer;
                                                const status = answer?.status || 'none';
                                                
                                                const statusMap: any = {
                                                    'submitted': { label: 'Diajukan', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', borderTop: 'border-t-amber-500/80' },
                                                    'revision': { label: 'Perlu Revisi', color: 'bg-destructive/10 text-destructive border-destructive/20', borderTop: 'border-t-destructive/80' },
                                                    'completed': { label: 'Diterima', color: 'bg-primary/10 text-primary border-primary/20', borderTop: 'border-t-primary' },
                                                    'none': { label: 'Kosong', color: 'bg-muted/50 text-muted-foreground border-muted/50', borderTop: 'border-t-muted/30' }
                                                };

                                                return (
                                                    <Link 
                                                        key={q.id} 
                                                        href={`/questionnaire/${q.id}`}
                                                        className="group/card transition-all duration-200 outline-none block w-full"
                                                    >
                                                        <Card className={`h-full border shadow-sm cursor-pointer gap-2 overflow-hidden group-focus-visible/card:ring-1 ring-primary flex flex-col border-t-4 ${statusMap[status].borderTop} ${isAnswered ? 'bg-linear-to-br from-background to-primary/2' : 'bg-background'}`}>
                                                            <CardHeader className="p-3 pb-1.5 space-y-0 text-xs">
                                                                <div className="flex justify-between items-center gap-2">
                                                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border bg-muted/30 text-[8px] font-bold uppercase text-muted-foreground tracking-wider">
                                                                        <FileText className="w-2.5 h-2.5" />
                                                                        ID: {idx + 1}
                                                                    </div>
                                                                    <div className={`px-1.5 py-0.5 border rounded opacity-90 text-[7px] font-bold uppercase tracking-widest ${statusMap[status].color}`}>
                                                                        {statusMap[status].label}
                                                                    </div>
                                                                </div>
                                                            </CardHeader>
                                                            <CardContent className="p-3 pt-0 flex flex-col justify-between flex-1">
                                                                <p className="text-xs font-medium leading-snug text-foreground/80 group-hover/card:text-primary transition-colors line-clamp-2 mt-0.5">
                                                                    {q.text}
                                                                </p>
                                                                <div className="mt-2 text-right opacity-0 group-hover/card:opacity-100 transition-opacity">
                                                                    <span className="text-[8px] font-bold uppercase tracking-widest text-primary flex items-center justify-end gap-0.5">
                                                                        Buka <ChevronRight className="size-2.5" />
                                                                    </span>
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
