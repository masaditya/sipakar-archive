<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">

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

        th,
        td {
            border: 1px solid #000;
            padding: 4px 5px;
            vertical-align: middle;
        }

        th {
            text-align: center;
        }

        .no-border td {
            border: none;
            padding: 3px 0;
        }

        .footer-table td {
            border: none !important;
            padding-top: 20px;
            text-align: center;
        }

        .flex-between {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-top: 10px;
        }

        .box50 {
            width: 48%;
        }

        table.rekap {
            width: 100%;
            border-collapse: collapse;
            font-family: "Arial", sans-serif;
        }

        table.rekap th,
        table.rekap td {
            border: 1px solid #000;
            padding: 6px 6px;
        }

        /* HEADER BIRU */
        .blue {
            background-color: #00AEEF;
            text-align: center;
        }

        .blue-small {
            background-color: #00AEEF;
            font-size: 10px;
            text-align: center;
        }

        /* BAR KUNING */
        .yellow {
            background-color: #FFD966;
        }

        /* TEKS RATA KIRI */
        .left {
            text-align: left;
        }

        /* TEKS TENGAH */
        .center {
            text-align: center;
        }

        /* TEKS BOLD */
        .bold {
            font-weight: bold;
        }

        /* BAGIAN NILAI TOTAL */
        .summary {
            background-color: #FFD966;
            font-weight: bold;
            text-align: right;
        }

        .thin {
            font-weight: normal;
        }

        .capitalize {
            text-transform: capitalize;
        }
    </style>
</head>

<body style="margin:0; padding:0;">

    <div class="title">BAB III</div>
    <div class="title">KESIMPULAN DAN REKOMENDASI</div>


    <p style="text-indent: 3em; text-align:justify; line-height:1.5;">
        Berdasarkan hasil penilaian pengawasan kearsipan internal pada {{ $operatingUnit->name }} dan Sekretariat {{ $department->name }}, diperoleh hasil sebagai berikut:
    </p>

    <div class="section-title">A. {{ strtoupper($operatingUnit->name) }}</div>

    <table class="rekap">

        <!-- ROW HEADER UTAMA -->
        <tr>
            <th class="blue" style="width:30px;">NO</th>
            <th class="blue">ASPEK/SUB ASPEK</th>
            <th class="blue" style="width:70px;">Nilai Standar </th>
            <th class="blue" style="width:60px;">Nilai </th>
            <th class="blue" style="width:60px;">Bobot Sub Aspek</th>
            <th class="blue" style="width:85px;">Nilai Sub Aspek</th>
            <th class="blue" style="width:60px;">Bobot Aspek</th>
            <th class="blue" style="width:65px;">Kategori</th>
        </tr>
        <tr>
            <th class="blue thin" style="width:30px;">(1)</th>
            <th class="blue thin">(2)</th>
            <th class="blue thin" style="width:70px;">(3)</th>
            <th class="blue thin" style="width:60px;">(4)</th>
            <th class="blue thin" style="width:60px;">(5)</th>
            <th class="blue thin" style="width:85px;">(6)=(4)/(3)×(5)×100</th>
            <th class="blue thin" style="width:60px;">(7)</th>
            <th class="blue thin" style="width:65px;">(8)=(6)×(7)</th>
        </tr>

        <!-- ============================= -->
        <!--       1. PENGELOLAAN ARSIP    -->
        <!-- ============================= -->

        @foreach ($aspects_up as $aspect_up)
            @php
                // Ambil semua statements dalam aspect UK ini
                $allStatements = $aspect_up->subAspects->flatMap->statements;

                // (3) Nilai standar = jumlah statements × 100
                $nilaiStandar = $allStatements->count() * 100;

                // (4) Nilai = total score semua auditResponses
                $nilai = $allStatements->flatMap(fn($st) => $st->auditResponses->pluck('score'))->sum();

                // (5) Bobot Sub Aspek
                $bobotSubAspek = $aspect_up->score_weight; // dalam persen, misal 35

                // (6) Nilai Sub Aspek = (4)/(3) × (5) × 100
                // ----------------------------
                // HITUNG SUB-ASPEK & SUB-SKOR
                // ----------------------------
                $subSkorSum = 0;
                // siapkan array optional untuk menampilkan subSkor pada rendering sub-aspek
                $computedSub = [];

                foreach ($aspect_up->subAspects as $sub) {
                    $subStatements = $sub->statements;
                    $subNilaiStandar = $subStatements->count() * 100;
                    $subNilai = $subStatements->flatMap(fn($st) => $st->auditResponses->pluck('score'))->sum();

                    // Bobot sub-aspek (dalam persen)
                    $subBobot = $sub->score_weight ?? 0;

                    // Rumus subSkor: (subNilai / subNilaiStandar) * subBobot
                    // (sederhanakan dari (subNilai/subNilaiStandar) * (subBobot/100) * 100)
                    $subSkor = $subNilaiStandar > 0 ? ($subNilai / $subNilaiStandar) * $subBobot : 0;

                    $subSkorSum += $subSkor;

                    // simpan agar dapat ditampilkan nanti tanpa menghitung ulang
                    $computedSub[] = [
                        'title' => $sub->title,
                        'standar' => $subNilaiStandar,
                        'nilai' => $subNilai,
                        'bobot' => $subBobot,
                        'skor' => $subSkor,
                    ];
                }

                // (6) Nilai Sub Aspek (kolom 6) = SUM(subSkor)  <--- perbaikan penting
                $nilaiSubAspek = $subSkorSum;

                // (7) Bobot Aspek = nilaiSubAspek × bobot
                // Kalau aspek UK punya bobot, sesuaikan
                $bobotAspek = $nilaiSubAspek * ($bobotSubAspek / 100);

                // (8) Kategori akhir = (6) × (7)
                $kategoriAkhir = $nilaiSubAspek * ($bobotSubAspek / 100);
            @endphp

            <tr>
                <td class="yellow center bold">{{ $loop->iteration }}</td>
                <td class="yellow left bold">{{ substr($aspect_up->title, 5) }}</td>

                <td class="center yellow bold">{{ $nilaiStandar }}</td> {{-- (3) --}}
                <td class="center blue bold">{{ $nilai }}</td> {{-- (4) --}}
                <td class="center yellow"></td> {{-- (5) --}}
                <td class="center yellow bold">{{ number_format($nilaiSubAspek, 2) }}</td> {{-- (6) --}}
                <td class="center yellow bold">{{ $bobotSubAspek }}%</td> {{-- (7) --}}
                <td class="center yellow bold">{{ number_format($kategoriAkhir, 2) }}</td> {{-- (8) --}}
            </tr>


            {{-- SUB-ASPEK --}}
            @foreach ($aspect_up->subAspects as $subAspect)
                @php
                    $subStatements = $subAspect->statements;

                    $subNilaiStandar = $subStatements->count() * 100;

                    $subNilai = $subStatements->flatMap(fn($st) => $st->auditResponses->pluck('score'))->sum();

                    $subBobot = $subAspect->score_weight;

                    $subSkor = $subNilaiStandar > 0 ? ($subNilai / $subNilaiStandar) * ($subBobot / 100) * 100 : 0;
                @endphp

                <tr>
                    <td class="center">{{ $loop->parent->iteration }}.{{ $loop->iteration }}</td>
                    <td class="left">{{ substr($subAspect->title, 5) }}</td>
                    <td class="center">{{ $subNilaiStandar }}</td>
                    <td class="center">{{ $subNilai }}</td>
                    <td class="center">{{ $subBobot }}%</td>
                    <td class="center">{{ number_format($subSkor, 2) }}</td>
                    <td class="center"></td>
                    <td class="center"></td>
                </tr>
            @endforeach
        @endforeach
        <!-- SUMMARY NILAI -->
        <tr>
            <td class="summary" colspan="7">Nilai Hasil Pengawasan Kearsipan</td>
            <td class="center bold">{{ $nilai_hasil_up }}</td>
        </tr>
        <!-- BAR KATEGORI -->
        <tr>
            <td class="summary" colspan="7">Kategori</td>
            <td class="center bold">{{ $kategori_bidang }}</td>
        </tr>
    </table>




    <!-- ============================ -->
    <!--     SEKRETARIAT DINAS       -->
    <!-- ============================ -->

    <div class="section-title" style="margin-top: 15px;">B. SEKRETARIAT {{ strtoupper($department->name) }}</div>

    <table class="rekap">

        <!-- ROW HEADER UTAMA -->
        <tr>
            <th class="blue" style="width:30px;">NO</th>
            <th class="blue">ASPEK/SUB ASPEK</th>
            <th class="blue" style="width:70px;">Nilai Standar </th>
            <th class="blue" style="width:60px;">Nilai </th>
            <th class="blue" style="width:60px;">Bobot Sub Aspek</th>
            <th class="blue" style="width:85px;">Nilai Sub Aspek</th>
            <th class="blue" style="width:60px;">Bobot Aspek</th>
            <th class="blue" style="width:65px;">Kategori</th>
        </tr>
        <tr>
            <th class="blue thin" style="width:30px;">(1)</th>
            <th class="blue thin">(2)</th>
            <th class="blue thin" style="width:70px;">(3)</th>
            <th class="blue thin" style="width:60px;">(4)</th>
            <th class="blue thin" style="width:60px;">(5)</th>
            <th class="blue thin" style="width:85px;">(6)=(4)/(3)×(5)×100</th>
            <th class="blue thin" style="width:60px;">(7)</th>
            <th class="blue thin" style="width:65px;">(8)=(6)×(7)</th>
        </tr>

        <!-- ============================= -->
        <!--       1. PENGELOLAAN ARSIP    -->
        <!-- ============================= -->

        @foreach ($aspects_uk as $aspect_uk)
            @php
                // Ambil semua statements dalam aspect UK ini
                $allStatements = $aspect_uk->subAspects->flatMap->statements;

                // (3) Nilai standar = jumlah statements × 100
                $nilaiStandar = $allStatements->count() * 100;

                // (4) Nilai = total score semua auditResponses
                $nilai = $allStatements->flatMap(fn($st) => $st->auditResponses->pluck('score'))->sum();

                // (5) Bobot Sub Aspek
                $bobotSubAspek = $aspect_uk->score_weight; // dalam persen, misal 35

                // (6) Nilai Sub Aspek = (4)/(3) × (5) × 100
                // ----------------------------
                // HITUNG SUB-ASPEK & SUB-SKOR
                // ----------------------------
                $subSkorSum = 0;
                // siapkan array optional untuk menampilkan subSkor pada rendering sub-aspek
                $computedSub = [];

                foreach ($aspect_uk->subAspects as $sub) {
                    $subStatements = $sub->statements;
                    $subNilaiStandar = $subStatements->count() * 100;
                    $subNilai = $subStatements->flatMap(fn($st) => $st->auditResponses->pluck('score'))->sum();

                    // Bobot sub-aspek (dalam persen)
                    $subBobot = $sub->score_weight ?? 0;

                    // Rumus subSkor: (subNilai / subNilaiStandar) * subBobot
                    // (sederhanakan dari (subNilai/subNilaiStandar) * (subBobot/100) * 100)
                    $subSkor = $subNilaiStandar > 0 ? ($subNilai / $subNilaiStandar) * $subBobot : 0;

                    $subSkorSum += $subSkor;

                    // simpan agar dapat ditampilkan nanti tanpa menghitung ulang
                    $computedSub[] = [
                        'title' => $sub->title,
                        'standar' => $subNilaiStandar,
                        'nilai' => $subNilai,
                        'bobot' => $subBobot,
                        'skor' => $subSkor,
                    ];
                }

                // (6) Nilai Sub Aspek (kolom 6) = SUM(subSkor)  <--- perbaikan penting
                $nilaiSubAspek = $subSkorSum;

                // (7) Bobot Aspek = nilaiSubAspek × bobot
                // Kalau aspek UK punya bobot, sesuaikan
                $bobotAspek = $nilaiSubAspek * ($bobotSubAspek / 100);

                // (8) Kategori akhir = (6) × (7)
                $kategoriAkhir = $nilaiSubAspek * ($bobotSubAspek / 100);
            @endphp

            <tr>
                <td class="yellow center bold">{{ $loop->iteration }}</td>
                <td class="yellow left bold">{{ substr($aspect_uk->title, 5) }}</td>

                <td class="center yellow bold">{{ $nilaiStandar }}</td> {{-- (3) --}}
                <td class="center blue bold">{{ $nilai }}</td> {{-- (4) --}}
                <td class="center yellow"></td> {{-- (5) --}}
                <td class="center yellow bold">{{ number_format($nilaiSubAspek, 2) }}</td> {{-- (6) --}}
                <td class="center yellow bold">{{ $bobotSubAspek }}%</td> {{-- (7) --}}
                <td class="center yellow bold">{{ number_format($kategoriAkhir, 2) }}</td> {{-- (8) --}}
            </tr>


            {{-- SUB-ASPEK --}}
            @foreach ($aspect_uk->subAspects as $subAspect)
                @php
                    $subStatements = $subAspect->statements;

                    $subNilaiStandar = $subStatements->count() * 100;

                    $subNilai = $subStatements->flatMap(fn($st) => $st->auditResponses->pluck('score'))->sum();

                    $subBobot = $subAspect->score_weight;

                    $subSkor = $subNilaiStandar > 0 ? ($subNilai / $subNilaiStandar) * ($subBobot / 100) * 100 : 0;
                @endphp

                <tr>
                    <td class="center">{{ $loop->parent->iteration }}.{{ $loop->iteration }}</td>
                    <td class="left">{{ substr($subAspect->title, 5) }}</td>
                    <td class="center">{{ $subNilaiStandar }}</td>
                    <td class="center">{{ $subNilai }}</td>
                    <td class="center">{{ $subBobot }}%</td>
                    <td class="center">{{ number_format($subSkor, 2) }}</td>
                    <td class="center"></td>
                    <td class="center"></td>
                </tr>
            @endforeach
        @endforeach
        <!-- SUMMARY NILAI -->
        <tr>
            <td class="summary" colspan="7">Nilai Hasil Pengawasan Kearsipan</td>
            <td class="center bold">{{ $nilai_hasil_uk }}</td>
        </tr>
        <!-- BAR KATEGORI -->
        <tr>
            <td class="summary" colspan="7">Kategori</td>
            <td class="center bold">{{ $kategori_sekretariat }}</td>
        </tr>
    </table>


    <p style="text-indent: 3em; text-align:justify; line-height:1.5;">
        Berdasarkan hasil penilaian pengawasan kearsipan internal setiap unit pengolah dan unit kearsipan di
        lingkungan {{ $department->name }} dapat disimpulkan bahwa penyelenggaraan kearsipan pada
        {{ $department->name }}
        secara keseluruhan memperoleh nilai <strong class="capitalize">{{ $nilai_akhir }} ({{ $nilai_akhir_terbilang }})</strong> atau
        kategori <strong>“{{ $kategori_akhir }}”</strong>. Adapun hasil pengawasan kearsipan internal dapat disampaikan sebagai berikut :
    </p>

    <table class="rekap">
        <tr>
            <th class="blue">No</th>
            <th class="blue">Nama Unit Kerja</th>
            <th class="blue">Nilai Hasil Pengawasan Kearsipan</th>
            <th class="blue">Kategori</th>
        </tr>
        <tr>
            <td style="text-align: center;">1</td>
            <td style="width:50%;">BIDANG {{ strtoupper($operatingUnit->name) }}</td>
            <td style="text-align: center;">{{ number_format($nilai_hasil_up, 2) }}</td>
            <td style="text-align: center;">{{ $kategori_bidang }}</td>
        </tr>
        <tr>
            <td style="text-align: center;">2</td>
            <td>SEKRETARIAT {{ strtoupper($department->name) }}</td>
            <td style="text-align: center;">{{ number_format($nilai_hasil_uk, 2) }}</td>
            <td style="text-align: center;">{{ $kategori_sekretariat }}</td>
        </tr>
        <tr style="">
            <td></td>
            <td style="font-weight: bold; padding: 20px 10px; text-align: center;">NILAI PENGAWASAN KEARSIPAN INTERNAL
                (NILAI UP DITAMBAH NILAI UK DIBAGI 2)</td>
            <td style="font-weight: bold; text-align: center;">{{$nilai_akhir}}</td>
            <td style="font-weight: bold; text-align: center;">{{ $kategori_akhir }}</td>
        </tr>
    </table>


    <!-- ============================ -->
    <!--         TANDA TANGAN         -->
    <!-- ============================ -->
    <p style="text-indent: 3em; text-align:justify; line-height:1.5;">Hasil pengawasan kearsipan internal tahun 2025
        menggambarkan kondisi pengelolaan arsip dinamis pada
        {{ $department->name }} Kabupaten Bojonegoro. Hal tersebut diperlukan untuk menentukan kebijakan kedepannya.
    </p>
    <table class="footer-table" style="margin-top:35px; width:100%;">
        <tr>
            <td style="width:50%; line-height:1.5;">
                Mengetahui<br>
                KEPALA DINAS PERPUSTAKAAN DAN KEARSIPAN<br><br><br><br><br><br>

                <b><u>{{ $ttd1_nama }}</u></b><br>
                {{ $ttd1_pangkat }}<br>
                NIP. {{ $ttd1_nip }}
            </td>

            <td style="width:50%; line-height:1.5;">
                Bojonegoro, {{ $tanggal_ttd }} <br>
                {{ strtoupper($signature->position) }}<br><br><br><br><br><br>

                <b><u>{{ $signature->user->name }}</u></b><br>
                {{ $signature->grade }}<br>
                NIP. {{ $signature->employee_number }}
            </td>
        </tr>
    </table>


    <table class="" style="margin-top:35px; width:100%;">
        <tr style="border:none;">
            <td style="width:50%; border:none;">

            </td>

            <td style="width:50%; border:none;">
                <table style="margin-top:65px;">
                    <tr>
                        <th colspan="2">KETERANGAN KATEGORI</th>
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
