<?php

/** 
 * Author: Emmanuel @galide
 */

// 1) we need info about counties (e.g.: population)
if (($handle = fopen("counties.csv", 'r')) === false) {
    throw new \Exception("file not found"); 
}

$headers = fgetcsv($handle, 1024, ',');

$counties = array(); 
while ($row = fgetcsv($handle, 1024, ',')) {
    $counties[$row[0]] = array_combine($headers, $row);
}

fclose($handle);


// 2) we load reference file
$string = file_get_contents("input.js");
$array = json_decode($string, TRUE); 
 
// 3) we normalise the data
foreach($array as $k => $record){
	// we work out min and max values for each quarter, to be used 
	// to normalise values
	if (!isset($counties[$record["county"]])) continue; 

	foreach ($record as $key => $value){ 
		// we filter Quaterly data
		if (!strstr($key," Q")) continue; 

		$normalised = round(( $value / $counties[$record["county"]]['population'] ), 4);

		if (!isset($max[$key]) || $normalised >= $max[$key]) $max[$key] = $normalised;
		if (!isset($min[$key]) || $normalised <= $min[$key]) $min[$key] = $normalised; 
	} 	
}

// 4) we replace current values with normalised data
foreach($array as $k => $record){
	// discard any discrepancies between file listing counties & reference file
	// counties may be spelt differently for instance
	if (!isset($counties[$record["county"]])) {
		unset($array[$k]);
		continue(1);  
	}

	$array[$k]['population'] = str_replace(",", "", $counties[$record["county"]]['population']); 

	foreach ($record as $key => $value){
		// we filter Quaterly data
		if (!strstr($key," Q")) continue;

		// first normalisation, to take county's population into account
		$normalised = round(( $value / $counties[$record["county"]]['population'] ), 4);

		if ($max[$key] == $min[$key]) {
			$array[$k][$key] = 1;	
		} else {
			// second normalisation,to convert value into an index (min=0, max=1)
			$array[$k][$key] = round(1 - round(( ($normalised - $min[$key])/($max[$key] - $min[$key]) ), 4),4); 
		}

	}
	// not used at the moment
	$array[$k]['density'] = $counties[$record["county"]]['density'];
	$array[$k]['superficy'] = $counties[$record["county"]]['superficy'];
}

// 5) we convert the array back to json
echo json_encode($array, false);

