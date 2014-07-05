<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: must-revalidate, pre-check=0, no-store, no-cache, max-age=0, post-check=0');

require_once("ayah.php");
$ayah = new AYAH();

if (!empty($_POST)) {

    // Use the AYAH object to see if the user passed or failed the PlayThru.
    $score = $ayah->scoreResult();

    // Check the score to determine what to do.
    if ($score) {
        echo "Hello " . $_POST['name'] . ", You are a human!";
    } else {
        echo "Hello " . $_POST['name'] . ", You NOT are a human!";
    }
} else {
//Echoing HTML renderer
    echo $ayah->getPublisherHTML();
}
?>
