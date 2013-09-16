<?php

class Parser {
	
	private $data;
	private $dir = "files";  

	function __construct(){}

	function exec($file){
		if (($handle = fopen($this->dir."/".$file, 'r')) === false) {
		    throw new \Exception("file not found"); 
		}

		$headers = fgetcsv($handle, 1024, ',');

		while ($row = fgetcsv($handle, 1024, ',')) {
		    $this->data[] = array_combine($headers, $row);
		}

		fclose($handle);

		return json_encode($this->data);
	}
}