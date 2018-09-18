<?php

namespace GutenbergCloud;

use GutenbergCloud\Blocks;
use GutenbergCloud\Cloud;

/**
 * GutenbergCloud Class.
 *
 * This is main class called to initiate all functionalities this plugin provides.
 *
 */
class GutenbergCloud {

  public function __construct() {
    new Blocks;
    Cloud\Explore::init();
  }
}