
<?php
// example
// http://hackathonbrighton.dev/?data=possession1

error_reporting(0); 

require("inc/class.parser.php"); 

if (!isset($_GET["data"])){
	die(); 
}

switch ($_GET["data"]){

	case "possession1":
		$file = "Possessionclaimsissuedbylandlords.csv.csv"; 
		break;
	default: 
		die(); 

}

$parser = new Parser(); 
echo $parser->exec($file); 

?>
