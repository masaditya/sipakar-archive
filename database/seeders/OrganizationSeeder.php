<?php

namespace Database\Seeders;

use App\Models\Organization;
use Illuminate\Database\Seeder;

class OrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organizations = [
            ['name' => 'Badan Kepegawaian, Pendidikan, Dan Pelatihan', 'type' => 'Badan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Badan Kesatuan Bangsa Dan Politik', 'type' => 'Badan', 'address' => 'Jl Trunojoyo No. 12', 'phone' => '(0353) 893526', 'head_name' => '', 'description' => ''],
            ['name' => 'Badan Penanggulangan Bencana Daerah', 'type' => 'Badan', 'address' => 'Jl.  A. Yani   No.  06.', 'phone' => '( 0353 )  881826', 'head_name' => '', 'description' => ''],
            ['name' => 'Badan Pendapatan Daerah', 'type' => 'Badan', 'address' => 'Jl P Mastumapel No 1 Bojonegoro', 'phone' => '881826', 'head_name' => '', 'description' => ''],
            ['name' => 'Badan Pengelolaan Keuangan Dan Aset Daerah', 'type' => 'Badan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Badan Perencanaan Pembangunan Daerah', 'type' => 'Badan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Kebudayaan Dan Pariwisata', 'type' => 'Dinas', 'address' => 'Jl. Teuku Umar No. 80 Bojonegoro', 'phone' => '(0353) 881571', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Kepemudaan Dan Olahraga', 'type' => 'Dinas', 'address' => 'Jl. Pattimura No. 36 Bojonegoro', 'phone' => '(0353) 881257', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Kependudukan Dan Pencatatan Sipil', 'type' => 'Dinas', 'address' => 'Jl. Patimura 26 A Bojonegoro WA', 'phone' => '(0353) 881256', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Kesehatan', 'type' => 'Dinas', 'address' => 'Jalan Dr. Cipto, Mojo Kampung, Mojokampung, Kabupaten Bojonegoro', 'phone' => '(0353) 881350', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Ketahanan Pangan dan Pertanian', 'type' => 'Dinas', 'address' => 'Jalan Raya Sukowati No. 412 Kapas, Bojonegoro', 'phone' => '(0353) 881410', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Komunikasi Dan Informatika', 'type' => 'Dinas', 'address' => 'Jl. P. Mas Tumapel No. 1 Bojonegoro Gedung Pemkab Lantai 3', 'phone' => '(0353) 881826', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Lingkungan Hidup', 'type' => 'Dinas', 'address' => 'Jl. Dr. Wahidin No.40 Bojonegoro - Jawa Timur', 'phone' => '(0353) 881826', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Pekerjaan Umum Bina Marga Dan Penataan Ruang', 'type' => 'Dinas', 'address' => 'Jl. Lettu Suyitno 39, Bojonegoro', 'phone' => '(0353) 881447', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Pekerjaan Umum Sumber Daya Air', 'type' => 'Dinas', 'address' => 'Jl Basuki Rahcmad no. 4a Bojonegoro', 'phone' => '(0353) 881491', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Pemadam Kebakaran', 'type' => 'Dinas', 'address' => 'Jl. Ahmad Yani No. 06 Bojonegoro', 'phone' => '(0353) 113', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Pemberdayaan Masyarakat Dan Desa', 'type' => 'Dinas', 'address' => 'Jln. Panglima Sudirman No. 161 Kelurahan Klangon Kecamatan Bojonegoro', 'phone' => '(0353) 881512', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Pemberdayaan Perempuan, Perlindungan Anak Dan Keluarga Berencana', 'type' => 'Dinas', 'address' => 'Jln. Patimura No. 01 Bojonegoro - Jawa Timur', 'phone' => '(0353) 889515', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Penanaman Modal Dan Pelayanan Terpadu Satu Pintu', 'type' => 'Dinas', 'address' => 'Mal Pelayanan Publik, Jl. Veteran No.227, Ngrowo, Kec. Bojonegoro', 'phone' => '0822-3309-9988', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Pendidikan', 'type' => 'Dinas', 'address' => 'Jl. Patimura No. 9 Bojonegoro', 'phone' => '(0353) 881580', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Perdagangan, Koperasi dan Usaha Mikro', 'type' => 'Dinas', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Perhubungan', 'type' => 'Dinas', 'address' => 'Jalan Pattimura No.36 A', 'phone' => '(0353) 885219', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Perindustrian Dan Tenaga Kerja', 'type' => 'Dinas', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Perpustakaan Dan Kearsipan', 'type' => 'Dinas', 'address' => 'Jl.Patimura Nomor 1A Kabupaten Bojonegoro', 'phone' => '08161433200', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Perumahan, Kawasan Permukiman Dan Cipta Karya', 'type' => 'Dinas', 'address' => 'Jalan Lettu Soeyitno Nomor 39b Bojonegoro', 'phone' => '(0353) 887444', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Peternakan Dan Perikanan', 'type' => 'Dinas', 'address' => 'Jl. Basuki Rahmad No. 02 - Kode Pos 62115 - Kab. Bojonegoro - Prov. Jawa Timur', 'phone' => '(0353) 881172', 'head_name' => '', 'description' => ''],
            ['name' => 'Dinas Sosial', 'type' => 'Dinas', 'address' => 'Jl. Dr Wahidin No. 40 Bojonegoro', 'phone' => '(0353) 888918', 'head_name' => '', 'description' => ''],
            ['name' => 'Satuan Polisi Pamong Praja', 'type' => 'Dinas', 'address' => 'Jl. P. Mas Tumapel No. 1 Bojonegoro', 'phone' => '082228911677', 'head_name' => '', 'description' => ''],
            ['name' => 'SEKDA', 'type' => 'Sekretariat', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Balen', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Baureno', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Bubulan', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Bojonegoro', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Kalitidu', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Gondang', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Dander', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Kanor', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Kapas', 'type' => 'Kecamatan', 'address' => 'Jl. Ahmad Yani No. 37 Desa Tikusan Kecamatan Kapas Kabupaten Bojonegoro', 'phone' => '(0353) 885080', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Kasiman', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Kedewan', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Kedungadem', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Kepohbaru', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Malo', 'type' => 'Kecamatan', 'address' => 'Jalan Brawijaya No. 277, Malo', 'phone' => '0353 511023', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Margomulyo', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Ngambon', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Ngasem', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Ngraho', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Padangan', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Purwosari', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Temayang', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Trucuk', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Tambakrejo', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Gayam', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Sumberrejo', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Sukosewu', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Sugihwaras', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Kecamatan Sekar', 'type' => 'Kecamatan', 'address' => '', 'phone' => '', 'head_name' => '', 'description' => ''],
            ['name' => 'Inspektorat', 'type' => 'Inspektorat', 'address' => 'Jl. Trunojoyo No. 12 Lt. 1 Bojonegoro', 'phone' => '(0353) 881336', 'head_name' => '', 'description' => ''],
            ['name' => 'RSUD Dr. R. Sosodoro Bojonegoro', 'type' => 'RSUD', 'address' => 'Jl.Veteran No 36 Bojonegoro', 'phone' => '(0353) 888118', 'head_name' => '', 'description' => ''],
            ['name' => 'RSUD SUMBERREJO KABUPATEN BOJONEGORO', 'type' => 'RSUD', 'address' => 'Jl. Raya No. 231 Sumberrejo Bojonegoro', 'phone' => '(0353) 331530', 'head_name' => '', 'description' => ''],
            ['name' => 'RSUD Padangan', 'type' => 'RSUD', 'address' => 'Jl. Dr. Soetomo No. 02 Padangan Bojonegoro', 'phone' => '(0353) 551166', 'head_name' => '', 'description' => ''],
            ['name' => 'RSUD Kepohbaru', 'type' => 'RSUD', 'address' => 'Jl. Raya Kepohbaru-Gunungsari No. 472 Kecamatan Kepohbaru', 'phone' => '(0353) 3418013', 'head_name' => '', 'description' => ''],
            ['name' => 'Sekretariat Dewan', 'type' => 'Sekretariat', 'address' => 'Bojonegoro', 'phone' => '08161433200', 'head_name' => '', 'description' => ''],
        ];

        foreach ($organizations as $org) {
            Organization::create($org);
        }
    }
}
