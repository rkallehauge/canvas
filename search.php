<?php
    require 'credentials.php';
    
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
    
    if(isset($_GET['query']) && !empty($_GET['query'])){
        $query = urlencode($_GET['query']);
        $url = "https://www.googleapis.com/customsearch/v1?key=" . $key . "&cx=" . $engineId . "&searchType=image&q=" . $query;
        $str = file_get_contents($url);
        // echo "//" . $url;
       $json = json_decode($str);

        $res = $json->items;
        echo $res[0]->link;
    }