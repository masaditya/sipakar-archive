import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

// Reusable Percentage Calculator Component
export default function PercentageCalculator({ numeratorLabel = 'Pembilang', denominatorLabel = 'Penyebut' }) {
    const [numerator, setNumerator] = useState(0);
    const [denominator, setDenominator] = useState(0);

    const percentage = denominator > 0 ? ((numerator / denominator) * 100).toFixed(2) : '0.00';

    return (
        <Card className="w-full rounded-xl p-4">
            <CardContent>
                <div className="grid gap-4">
                    <div>
                        <Label>{numeratorLabel}</Label>
                        <Input type="number" value={numerator} onChange={(e) => setNumerator(parseFloat(e.target.value) || 0)} />
                    </div>

                    <div>
                        <Label>{denominatorLabel}</Label>
                        <Input type="number" value={denominator} onChange={(e) => setDenominator(parseFloat(e.target.value) || 0)} />
                    </div>
                    <hr />

                    <div className="mt-4 text-center">
                        <p className="text-xl font-bold">{percentage}%</p>
                        <p className="text-sm text-gray-500">Hasil Persentase</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
