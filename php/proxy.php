<?php
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $_GET['get']);
curl_setopt($curl, CURLOPT_HEADER, false);
if (!curl_exec($curl)) {
    echo curl_error($curl);
}
curl_close($curl);
?>