<?php 
 $siswa = array("majid", "konon", "pondra", "ilham", "rifki");
 echo "".count($siswa). "<br>";

 echo "". $siswa["0"]. "<br>";
 echo "".$siswa["1"]. "<br>";

for ($a=0; $a < count($siswa); $a++) { 
echo "".$siswa[$a]."<br>";
	}


$nama = array("nama" => "kekok", "rumah" =>"jakarta" );
echo $nama["nama"];
echo $nama["rumah"];



  $nama = array('candra' => '80', 'diky' => '90');


$nama['aldi'] = '100';
$nama['zaid'] = '20';

echo " Total data " . count($nama) . "<br>";

echo "Nilai diky " . $nama['diky'] . "<br>";
echo "Nilai zaid " . $nama['zaid'] . "<br>";


//mengurutkan data value dari yang terkecil
//sort($nama);
//mengurutkan data dari key yang terbesar ke terkecil
//ksort($nama); 
//mengurutkan data value dari yang terbesar 
//arsort($nama);
//mengurutkan data key dari data terbesar
krsort($nama);


//menampilkan  seluruh data
  foreach ($nama as $Key => $value) {
		echo "Nilai data dengan kunci " . $Key ."
		adalah " .$value . "<br>";

		//if ($value == '100'	){
			//break;
		//}

	}

$hewan = array('cacing', 'domba', 'ayam', 'bebek', 'elang', 'flamingo', 'gajah');

rsort($hewan);
// dari terkecil ke terbesar
rsort($hewan);
for ($i=0; $i < count($hewan); $i++) { 
	echo $hewan[$i] . "<br>";
	# code...
}

 ?>


