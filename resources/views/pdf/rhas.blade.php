<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>RHAS {{ $inputs['type'] }} - {{ $user->organization->name ?? $user->name }}</title>
    <style>
        @page {
            margin: 15mm 10mm;
        }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            -webkit-font-smoothing: antialiased;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 15px;
        }

        .header h1 {
            font-size: 14px;
            font-weight: bold;
            margin: 0;
            text-transform: uppercase;
        }

        .header h2 {
            font-size: 12px;
            font-weight: bold;
            margin: 5px 0 0 0;
            text-transform: uppercase;
        }

        .info-table {
            width: 100%;
            margin-bottom: 15px;
            border: none;
        }

        .info-table td {
            padding: 2px 0;
            border: none;
        }

        .info-table .label {
            width: 130px;
            font-weight: bold;
        }

        .info-table .separator {
            width: 10px;
        }

        table.main-table {
            width: 100%;
            border-collapse: collapse;
        }

        table.main-table th, table.main-table td {
            border: 1px solid #000;
            padding: 4px;
            word-wrap: break-word;
            vertical-align: middle;
        }

        table.main-table th {
            background-color: #ffffff;
            text-align: center;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 12px;
        }

        .center { text-align: center; }
        .bold { font-weight: bold; }
        .bg-gray { background-color: #f3f4f6; }
        
        .footer-table {
            width: 100%;
            margin-top: 25px;
            border: none;
        }

        .footer-table td {
            width: 50%;
            text-align: center;
            border: none;
            padding-top: 5px;
        }

        .signature-space {
            height: 50px;
        }

        @php
            function removeBrackets($text) {
                return trim(preg_replace('/\[.*?\]\s*/', '', $text));
            }

            function getLevel($score) {
                if ($score >= 100) return 4;
                if ($score >= 70) return 3;
                if ($score >= 50) return 2;
                if ($score >= 20) return 1;
                return 0;
            }
        @endphp
    </style>
</head>
<body>

    <div class="header">
        <h1>RISALAH HASIL AUDIT SEMENTARA (RHAS)</h1>
        <h2>PENGAWASAN KEARSIPAN INTERNAL TAHUN {{ date('Y') }}</h2>
    </div>

    <table class="info-table">
        <tr>
            <td class="label">Objek Pengawasan</td>
            <td class="separator">:</td>
            <td>{{ strtoupper($inputs['opd_name']) }}</td>
        </tr>
        <tr>
            <td class="label">Unit {{ $inputs['type'] == 'UP' ? 'Pengolah' : 'Kearsipan' }}</td>
            <td class="separator">:</td>
            <td>{{ strtoupper($inputs['up_name']) }}</td>
        </tr>
        <tr>
            <td class="label">Tanggal Review</td>
            <td class="separator">:</td>
            <td>{{ $inputs['tanggal'] }}</td>
        </tr>
    </table>

    <table class="main-table">
        <thead>
            <tr>
                <th style="width: 1%; white-space: nowrap;">NO</th>
                <th>ASPEK/PERNYATAAN</th>
                <th style="width: 280px;">KONDISI FAKTUAL</th>
                <th style="width: 1%; white-space: nowrap;">LEVEL</th>
                <th style="width: 220px;">CATATAN TIM PENGAWAS</th>
            </tr>
        </thead>
        <tbody>
            @foreach($aspects as $aspect)
                @php $aspectIndex = $loop->iteration; @endphp
                <tr class="bold">
                    <td class="center">{{ $aspectIndex }}.</td>
                    <td colspan="4">{{ strtoupper(removeBrackets($aspect->name)) }}</td>
                </tr>
                
                @foreach($aspect->subAspects as $sub)
                    @php $subIndex = $loop->iteration; @endphp
                    <tr class="bold">
                        <td class="center">{{ $aspectIndex }}.{{ $subIndex }}.</td>
                        <td colspan="4">SUB-ASPEK {{ strtoupper(removeBrackets($sub->name)) }}</td>
                    </tr>

                    @php
                        $questions = $sub->questions;
                        $elektronik = $questions->filter(fn($q) => str_contains($q->text, '[BAGIAN ELEKTRONIK]'));
                        $konvensional = $questions->filter(fn($q) => str_contains($q->text, '[BAGIAN KONVENSIONAL]'));
                        $others = $questions->reject(fn($q) => str_contains($q->text, '[BAGIAN ELEKTRONIK]') || str_contains($q->text, '[BAGIAN KONVENSIONAL]'));
                    @endphp

                    @if($elektronik->isNotEmpty())
                        <tr class="bold">
                            <td class="center">A.</td>
                            <td colspan="4">BAGIAN ELEKTRONIK</td>
                        </tr>
                        @foreach($elektronik as $q)
                            @php $ans = $q->answers->first(); @endphp
                            <tr>
                                <td class="center">{{ $loop->iteration }}.</td>
                                <td>{{ removeBrackets($q->text) }}</td>
                                <td>{{ $ans && $ans->option ? $ans->option->text : '-' }}</td>
                                <td class="center">{{ $ans && $ans->option ? getLevel($ans->option->score) : '0' }}</td>
                                <td>{{ $ans && $ans->notes ? $ans->notes : '' }}</td>
                            </tr>
                        @endforeach
                    @endif

                    @if($konvensional->isNotEmpty())
                        @php $prefix = $elektronik->isNotEmpty() ? 'B.' : 'A.'; @endphp
                        <tr class="bold">
                            <td class="center">{{ $prefix }}</td>
                            <td colspan="4">BAGIAN KONVENSIONAL</td>
                        </tr>
                        @foreach($konvensional as $q)
                            @php $ans = $q->answers->first(); @endphp
                            <tr>
                                <td class="center">{{ $loop->iteration }}.</td>
                                <td>{{ removeBrackets($q->text) }}</td>
                                <td>{{ $ans && $ans->option ? $ans->option->text : '-' }}</td>
                                <td class="center">{{ $ans && $ans->option ? getLevel($ans->option->score) : '0' }}</td>
                                <td>{{ $ans && $ans->notes ? $ans->notes : '' }}</td>
                            </tr>
                        @endforeach
                    @endif

                    @if($others->isNotEmpty())
                        @foreach($others as $q)
                            @php $ans = $q->answers->first(); @endphp
                            <tr>
                                <td class="center">{{ $loop->iteration }}.</td>
                                <td>{{ removeBrackets($q->text) }}</td>
                                <td>{{ $ans && $ans->option ? $ans->option->text : '-' }}</td>
                                <td class="center">{{ $ans && $ans->option ? getLevel($ans->option->score) : '0' }}</td>
                                <td>{{ $ans && $ans->notes ? $ans->notes : '' }}</td>
                            </tr>
                        @endforeach
                    @endif

                @endforeach
            @endforeach
        </tbody>
    </table>

    <table class="footer-table">
        <tr>
            <td>
                Mengetahui/Menyetujui,<br>
                {{ $inputs['ttd2_jabatan'] }}<br>
                <div class="signature-space"></div>
                <strong><u>{{ $inputs['ttd2_nama'] ?: '..........................................' }}</u></strong><br>
                NIP. {{ $inputs['ttd2_nip'] ?: '..........................................' }}
            </td>
            <td>
                Bojonegoro, {{ $inputs['tanggal'] }}<br>
                Tim Pengawas,<br>
                <div class="signature-space"></div>
                <strong><u>{{ $inputs['ttd1_nama'] }}</u></strong><br>
                NIP. {{ $inputs['ttd1_nip'] }}
            </td>
        </tr>
    </table>

</body>
</html>
