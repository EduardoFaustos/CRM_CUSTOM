<?php

// Simple router for Laravel development server
$requested = $_SERVER['REQUEST_URI'];
$file = __DIR__ . $requested;

// If the requested file/directory actually exists, serve it
if (is_file($file)) {
    return false;
}

// Otherwise, route to index.php
require_once 'index.php';

