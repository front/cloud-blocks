# Cloud Blocks

## Description

**IMPORTANT: THIS PLUGIN IS IN BETA UNTIL WP 5.0**

**Gutenberg Cloud: Your online library of blocks!** Cloud Blocks is the only plugin you need to browse and install new blocks:

- Discover and install custom blocks with a click
- Install only the blocks you need – no huge plugin collections needed
- Reuse blocks between WordPress and Drupal
- Serve the blocks from a CDN

### Why use Gutenberg Cloud?
Installing an actual plugin for each block or block collection easily leads to managing lots of code that you don’t really need. It’s like having one app for each website you visit, instead of just installing a web browser. With the block manager, you have a growing library at your fingertips, without the bloat. 

### Get started
Install the plugin, and look for the cloud icon in the main menu. Browse around and activate a few blocks. Voila – these are now available to you in the Gutenberg editor!

### How it works under the hood
Gutenberg Cloud is a service that fetches Open Source Gutenberg blocks hosted on NPM. The assets from these are served from CloudFlare using unpkg.com. The Cloud Blocks plugin provides an interface in WordPress for Gutenberg Cloud.

Code once, use everywhere: Since the blocks are JS/CSS only, they are CMS agnostic. This means you can develop a block for a Drupal site, and reuse it later on a WordPress blog.

## Installation
Install it as any other plugin, but note that you need Gutenberg activated for it to work.

To install individual blocks, look for the cloud icon in the left side menu. Click it, and browse away!

## Frequently Asked Questions

### How do I migrate a block collection plugin to Gutenberg Cloud?
Glad you asked! This simply means removing some PHP, adding some meta data and publishing on NPM. [Follow these simple steps](https://github.com/front/cloud-blocks/blob/master/docs/migrate-block.md).

### How do I create a custom block for Gutenberg Cloud?
Gutenberg Cloud blocks are really just normal Gutenberg blocks, without the PHP. [Follow these steps to do it](https://github.com/front/cloud-blocks/blob/master/docs/create-block.md)!

### How do I disable CSS for a single block?
This is useful for letting your theme control your block styles. There’s a hook for this, [documented here](https://github.com/front/cloud-blocks/blob/master/docs/hooks.md).

### Why is the plugin called Cloud Blocks?
We wanted to name it Gutenberg Cloud, but since it’s not possible to name a plugin starting with the name of another plugin (i.e. Gutenberg), we ended up calling it Cloud Blocks. Makes sense though, doesn’t it?

### Are the blocks really served from "the cloud"?
Indeed, they are! The source code for each block is on NPM, but the JS/CSS is served by a CDN. No local downloads!

### Can I add private custom blocks?
Sure! Just add your custom blocks into **wp-content/gutenberg-blocks/** folder. [Here is how file structure must look like](https://github.com/front/cloud-blocks/blob/master/docs/private-blocks.md)!


## Changelog

#### 1.0.4
* **Fix**: Fix translations variable name in javascript files
* **Change**: Update readme

#### 1.0.3
* **Change**: Update readme
* **Add**: More docs

#### 1.0.2
* **Change**: Some translation fixes
* **Change**: Better documentation and screenshot
* **Added**: Italian translation. (Thanks to [cipo28](https://github.com/front/cloud-blocks/pull/1))

#### 1.0.1
* **Fix**: is_plugin_active() undefined fix
* **Fix**: Change strings functions to static

#### 1.0.0
* Initial plugin
