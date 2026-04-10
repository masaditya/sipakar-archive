<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Pengawasan Kearsipan</title>
    <style>
        @page {
            margin: 20mm 15mm;
        }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        .title {
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 5px;
        }

        .subtitle {
            text-align: center;
            margin-bottom: 10px;
        }

        .section-title {
            margin-top: 10px;
            margin-bottom: 5px;
            font-weight: bold;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
        }

        th, td {
            border: 1px solid #000;
            padding: 4px 5px;
            vertical-align: middle;
        }

        th { text-align: center; }

        .no-border td {
            border: none;
            padding: 3px 0;
        }

        .footer-table td {
            border: none !important;
            padding-top: 20px;
            text-align: center;
        }

        table.rekap {
            table-layout: fixed;
            width: 100%;
            word-wrap: break-word;
        }

        table.rekap th, table.rekap td {
            border: 1px solid #000;
            padding: 6px 6px;
        }

        .blue { background-color: #00AEEF; text-align: center; }
        .blue.thin { font-weight: normal; }
        .yellow { background-color: #FFD966; }
        .left { text-align: left; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .summary { background-color: #FFD966; font-weight: bold; text-align: right; }
        .capitalize { text-transform: capitalize; }
    </style>
</head>

<body style="margin:0; padding:0;">

    <div class="title">BAB III</div>
    <div class="title">KESIMPULAN DAN REKOMENDASI</div>

    <p style="text-indent: 3em; text-align:justify; line-height:1.5;">
        Berdasarkan hasil penilaian pengawasan kearsipan internal pada {{ $inputs['up_name'] }} dan Sekretariat {{ $inputs['opd_name'] }}, diperoleh hasil sebagai berikut:
    </p>

    @php
        function getKategori($nilai) {
            if ($nilai > 90) return 'AA (Sangat Memuaskan)';
            if ($nilai > 80) return 'A (Memuaskan)';
            if ($nilai > 70) return 'BB (Sangat Baik)';
            if ($nilai > 60) return 'B (Baik)';
            if ($nilai > 50) return 'CC (Cukup)';
            if ($nilai > 30) return 'C (Kurang)';
            return 'D (Sangat Kurang)';
        }

        function removeBrackets($text) {
            return trim(preg_replace('/\[.*?\]\s*/', '', $text));
        }
    @endphp

    <!-- ======= BAGIAN UP ======= -->
    <div class="section-title">A. {{ strtoupper($inputs['up_name']) }}</div>

    <table class="rekap">
        <tr>
            <th class="blue" style="width:5%;">NO</th>
            <th class="blue" style="width:30%;">ASPEK/SUB ASPEK</th>
            <th class="blue" style="width:10%;">Nilai Standar </th>
            <th class="blue" style="width:8%;">Nilai </th>
            <th class="blue" style="width:12%;">Bobot Sub Aspek</th>
            <th class="blue" style="width:12%;">Nilai Sub Aspek</th>
            <th class="blue" style="width:11%;">Bobot Aspek</th>
            <th class="blue" style="width:12%;">Skor Aspek</th>
        </tr>
        <tr>
            <th class="blue thin center">(1)</th>
            <th class="blue thin center">(2)</th>
            <th class="blue thin center">(3)</th>
            <th class="blue thin center">(4)</th>
            <th class="blue thin center">(5)</th>
            <th class="blue thin center">(6)=(4)/(3)×(5)×100</th>
            <th class="blue thin center">(7)</th>
            <th class="blue thin center">(8)=(6)×(7)</th>
        </tr>

        @php $total_skor_up = 0; $up_index = 0; @endphp
        @foreach ($aspects as $aspect_up)
            @php
                $upSubAspects = $aspect_up->subAspects->where('type', 'UP');
                if ($upSubAspects->isEmpty()) continue;
                $up_index++;

                $allQuestions = $upSubAspects->flatMap->questions;
                $nilaiStandar = $allQuestions->count() * 100;
                
                $nilai = 0;
                foreach($allQuestions as $q) {
                    $ans = $q->answers->first();
                    if ($ans && $ans->status === 'completed' && $ans->option) {
                        $nilai += $ans->option->score;
                    }
                }

                $bobotAspek = $aspect_up->score_weight;
                $subSkorSum = 0;

                foreach ($upSubAspects as $sub) {
                    $subQuestions = $sub->questions;
                    $subNilaiStandar = $subQuestions->count() * 100;
                    
                    $subNilai = 0;
                    foreach($subQuestions as $q) {
                        $ans = $q->answers->first();
                        if ($ans && $ans->status === 'completed' && $ans->option) {
                            $subNilai += $ans->option->score;
                        }
                    }

                    $subBobot = $sub->score_weight ?? 0;
                    $subSkor = $subNilaiStandar > 0 ? ($subNilai / $subNilaiStandar) * $subBobot : 0;
                    $subSkorSum += $subSkor;
                }

                $nilaiSubAspek = $subSkorSum;
                $kategoriAkhir = $nilaiSubAspek * ($bobotAspek / 100);
                
                $total_skor_up += $kategoriAkhir;
            @endphp

            <tr>
                <td class="yellow center bold">{{ $up_index }}</td>
                <td class="yellow left bold">{{ removeBrackets($aspect_up->name) }}</td>
                <td class="center yellow bold">{{ $nilaiStandar }}</td>
                <td class="center blue bold">{{ $nilai }}</td>
                <td class="center yellow"></td>
                <td class="center yellow bold">{{ number_format($nilaiSubAspek, 2) }}</td>
                <td class="center yellow bold">{{ $bobotAspek }}%</td>
                <td class="center yellow bold">{{ number_format($kategoriAkhir, 2) }}</td>
            </tr>

            @foreach ($upSubAspects as $subAspect)
                @php
                    $subQuestions = $subAspect->questions;
                    $subNilaiStandar = $subQuestions->count() * 100;
                    
                    $subNilai = 0;
                    foreach($subQuestions as $q) {
                        $ans = $q->answers->first();
                        if ($ans && $ans->status === 'completed' && $ans->option) {
                            $subNilai += $ans->option->score;
                        }
                    }

                    $subBobot = $subAspect->score_weight;
                    $subSkor = $subNilaiStandar > 0 ? ($subNilai / $subNilaiStandar) * ($subBobot / 100) * 100 : 0;
                @endphp
                <tr>
                    <td class="center">{{ $up_index }}.{{ $loop->iteration }}</td>
                    <td class="left">{{ removeBrackets($subAspect->name) }}</td>
                    <td class="center">{{ $subNilaiStandar }}</td>
                    <td class="center">{{ $subNilai }}</td>
                    <td class="center">{{ $subBobot }}%</td>
                    <td class="center">{{ number_format($subSkor, 2) }}</td>
                    <td class="center"></td>
                    <td class="center"></td>
                </tr>
            @endforeach
        @endforeach
        <tr>
            <td class="summary" colspan="7">Nilai Hasil Pengawasan</td>
            <td class="center bold">{{ number_format($total_skor_up, 2) }}</td>
        </tr>
        <tr>
            <td class="summary" colspan="7">Kategori</td>
            <td class="center bold">{{ getKategori($total_skor_up) }}</td>
        </tr>
    </table>


    <!-- ======= BAGIAN UK ======= -->
    <div class="section-title" style="margin-top: 20px;">B. SEKRETARIAT {{ strtoupper($inputs['opd_name'])}}</div>

    <table class="rekap">
        <tr>
            <th class="blue" style="width:5%;">NO</th>
            <th class="blue" style="width:30%;">ASPEK/SUB ASPEK</th>
            <th class="blue" style="width:10%;">Nilai Standar </th>
            <th class="blue" style="width:8%;">Nilai </th>
            <th class="blue" style="width:12%;">Bobot Sub Aspek</th>
            <th class="blue" style="width:12%;">Nilai Sub Aspek</th>
            <th class="blue" style="width:11%;">Bobot Aspek</th>
            <th class="blue" style="width:12%;">Skor Aspek</th>
        </tr>
        <tr>
            <th class="blue thin center">(1)</th>
            <th class="blue thin center">(2)</th>
            <th class="blue thin center">(3)</th>
            <th class="blue thin center">(4)</th>
            <th class="blue thin center">(5)</th>
            <th class="blue thin center">(6)=(4)/(3)×(5)×100</th>
            <th class="blue thin center">(7)</th>
            <th class="blue thin center">(8)=(6)×(7)</th>
        </tr>

        @php $total_skor_uk = 0; $uk_index = 0; @endphp
        @foreach ($aspects as $aspect_uk)
            @php
                $ukSubAspects = $aspect_uk->subAspects->where('type', 'UK');
                if ($ukSubAspects->isEmpty()) continue;
                $uk_index++;

                $allQuestions = $ukSubAspects->flatMap->questions;
                $nilaiStandar = $allQuestions->count() * 100;
                
                $nilai = 0;
                foreach($allQuestions as $q) {
                    $ans = $q->answers->first();
                    if ($ans && $ans->status === 'completed' && $ans->option) {
                        $nilai += $ans->option->score;
                    }
                }

                $bobotAspek = $aspect_uk->score_weight;
                $subSkorSum = 0;

                foreach ($ukSubAspects as $sub) {
                    $subQuestions = $sub->questions;
                    $subNilaiStandar = $subQuestions->count() * 100;
                    
                    $subNilai = 0;
                    foreach($subQuestions as $q) {
                        $ans = $q->answers->first();
                        if ($ans && $ans->status === 'completed' && $ans->option) {
                            $subNilai += $ans->option->score;
                        }
                    }

                    $subBobot = $sub->score_weight ?? 0;
                    $subSkor = $subNilaiStandar > 0 ? ($subNilai / $subNilaiStandar) * $subBobot : 0;
                    $subSkorSum += $subSkor;
                }

                $nilaiSubAspek = $subSkorSum;
                $kategoriAkhir = $nilaiSubAspek * ($bobotAspek / 100);
                
                $total_skor_uk += $kategoriAkhir;
            @endphp

            <tr>
                <td class="yellow center bold">{{ $uk_index }}</td>
                <td class="yellow left bold">{{ removeBrackets($aspect_uk->name) }}</td>
                <td class="center yellow bold">{{ $nilaiStandar }}</td>
                <td class="center blue bold">{{ $nilai }}</td>
                <td class="center yellow"></td>
                <td class="center yellow bold">{{ number_format($nilaiSubAspek, 2) }}</td>
                <td class="center yellow bold">{{ $bobotAspek }}%</td>
                <td class="center yellow bold">{{ number_format($kategoriAkhir, 2) }}</td>
            </tr>

            @foreach ($ukSubAspects as $subAspect)
                @php
                    $subQuestions = $subAspect->questions;
                    $subNilaiStandar = $subQuestions->count() * 100;
                    
                    $subNilai = 0;
                    foreach($subQuestions as $q) {
                        $ans = $q->answers->first();
                        if ($ans && $ans->status === 'completed' && $ans->option) {
                            $subNilai += $ans->option->score;
                        }
                    }

                    $subBobot = $subAspect->score_weight;
                    $subSkor = $subNilaiStandar > 0 ? ($subNilai / $subNilaiStandar) * ($subBobot / 100) * 100 : 0;
                @endphp
                <tr>
                    <td class="center">{{ $uk_index }}.{{ $loop->iteration }}</td>
                    <td class="left">{{ removeBrackets($subAspect->name) }}</td>
                    <td class="center">{{ $subNilaiStandar }}</td>
                    <td class="center">{{ $subNilai }}</td>
                    <td class="center">{{ $subBobot }}%</td>
                    <td class="center">{{ number_format($subSkor, 2) }}</td>
                    <td class="center"></td>
                    <td class="center"></td>
                </tr>
            @endforeach
        @endforeach
        <tr>
            <td class="summary" colspan="7">Nilai Hasil Pengawasan</td>
            <td class="center bold">{{ number_format($total_skor_uk, 2) }}</td>
        </tr>
        <tr>
            <td class="summary" colspan="7">Kategori</td>
            <td class="center bold">{{ getKategori($total_skor_uk) }}</td>
        </tr>
    </table>


    <!-- ======= RESUME KESELURUHAN ======= -->
    @php
        $nilai_akhir = ($total_skor_up + $total_skor_uk) / 2;
        $kategori_akhir = getKategori($nilai_akhir);
    @endphp

    <p style="text-indent: 3em; text-align:justify; line-height:1.5; margin-top:20px;">
        Berdasarkan hasil penilaian pengawasan kearsipan internal setiap unit pengolah dan unit kearsipan di lingkungan {{ strtoupper($inputs['opd_name']) }}, dapat disimpulkan bahwa penyelenggaraan kearsipan pada {{ strtoupper($inputs['opd_name']) }} secara keseluruhan memperoleh nilai <strong>{{ number_format($nilai_akhir, 2) }} ({{ $inputs['terbilang_nilai_akhir'] }})</strong> atau kategori <strong>“{{ $kategori_akhir }}”</strong>. Adapun hasil pengawasan kearsipan internal dapat disampaikan sebagai berikut:
    </p>

    <table class="rekap">
        <tr>
            <th class="blue" style="width:5%;">No</th>
            <th class="blue" style="width:45%;">Nama Unit / Sub Bagian</th>
            <th class="blue" style="width:25%;">Nilai Hasil Pengawasan</th>
            <th class="blue" style="width:25%;">Kategori</th>
        </tr>
        <tr>
            <td style="text-align: center;">1</td>
            <td style="width:50%;">{{ strtoupper($inputs['up_name']) }}</td>
            <td style="text-align: center;">{{ number_format($total_skor_up, 2) }}</td>
            <td style="text-align: center;">{{ getKategori($total_skor_up) }}</td>
        </tr>
        <tr>
            <td style="text-align: center;">2</td>
            <td>SEKRETARIAT {{ strtoupper($inputs['opd_name']) }}</td>
            <td style="text-align: center;">{{ number_format($total_skor_uk, 2) }}</td>
            <td style="text-align: center;">{{ getKategori($total_skor_uk) }}</td>
        </tr>
        <tr>
            <td></td>
            <td style="font-weight: bold; padding: 10px; text-align: center;">NILAI PENGAWASAN KEARSIPAN INTERNAL (NILAI
UP DITAMBAH NILAI UK DIBAGI 2)</td>
            <td style="font-weight: bold; text-align: center; font-size: 14px;">{{ number_format($nilai_akhir, 2) }}</td>
            <td style="font-weight: bold; text-align: center; font-size: 14px;">{{ $kategori_akhir }}</td>
        </tr>
    </table>

    <table class="footer-table" style="margin-top:35px; width:100%;">
        <tr>
            <td style="width:50%; line-height:1.5;">
                Mengetahui<br>
                {{ strtoupper($inputs['ttd1_jabatan']) }}<br><br><br><br><br><br>

                <b><u>{{ $inputs['ttd1_nama'] }}</u></b><br>
                {{ $inputs['ttd1_pangkat'] }}<br>
                NIP. {{ $inputs['ttd1_nip'] }}
            </td>

            <td style="width:50%; line-height:1.5;">
                Bojonegoro, {{ $inputs['tanggal'] }} <br>
                {{ strtoupper($inputs['ttd2_jabatan']) }}<br><br><br><br><br><br>

                <b><u>{{ $inputs['ttd2_nama'] }}</u></b><br>
                {{ $inputs['ttd2_pangkat'] }}<br>
                NIP. {{ $inputs['ttd2_nip'] }}
            </td>
        </tr>
    </table>

    <table style="margin-top:40px; width:100%;">
        <tr style="border:none;">
            <td style="width:50%; border:none;"></td>
            <td style="width:50%; border:none;">
                <table style="width:100%; font-size: 11px;">
                    <tr>
                        <th colspan="2" class="blue">KETERANGAN KATEGORI</th>
                    </tr>
                    <tr>
                        <td>&gt; 90 - 100</td>
                        <td>AA (SANGAT MEMUASKAN)</td>
                    </tr>
                    <tr>
                        <td>&gt; 80 - 90</td>
                        <td>A (MEMUASKAN)</td>
                    </tr>
                    <tr>
                        <td>&gt; 70 - 80</td>
                        <td>BB (SANGAT BAIK)</td>
                    </tr>
                    <tr>
                        <td>&gt; 60 - 70</td>
                        <td>B (BAIK)</td>
                    </tr>
                    <tr>
                        <td>&gt; 50 - 60</td>
                        <td>CC (CUKUP)</td>
                    </tr>
                    <tr>
                        <td>&gt; 30 - 50</td>
                        <td>C (KURANG)</td>
                    </tr>
                    <tr>
                        <td>&gt; 0 - 30</td>
                        <td>D (SANGAT KURANG)</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>
</html>
