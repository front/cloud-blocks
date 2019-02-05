# Cloud Blocks

## Description

**Gutenberg Cloud: Your online library of blocks!** Cloud Blocks is the only plugin you need to browse and install new blocks:

- Discover and install custom blocks with a click
- Install only the blocks you need – no huge plugin collections needed
- Reuse blocks between WordPress and Drupal
- Serve the blocks from a CDN

### Why use Gutenberg Cloud?
Installing an actual plugin for each block or block collection easily leads to managing lots of code that you don’t really need. It’s like having one app for each website you visit, instead of just installing a web browser. With the block manager, you have a growing library at your fingertips, without the bloat. 

## Getting started
1. Install the plugin
2. Click the new cloud icon in the main menu
3. Browse around and click a block to see description, version and bigger screenshot
4. Activate a few blocks. Voila – these are now available to you in the Gutenberg editor!

### How it works under the hood
Gutenberg Cloud is a service that fetches Open Source Gutenberg blocks hosted on NPM. The assets from these are served from CloudFlare using jsdelivr.com. The Cloud Blocks plugin provides an interface in WordPress for Gutenberg Cloud.

Code once, use everywhere: Since the blocks are JS/CSS only, they are CMS agnostic. This means you can develop a block for a Drupal site, and reuse it later on a WordPress blog.

## Installation
Install it as any other plugin, but note that you need Gutenberg activated for it to work.

To install individual blocks, look for the cloud icon in the left side menu. Click it, and browse away!

## Frequently Asked Questions

**Is it secure to run blocks from other people?**

All blocks go through a manual code review before they are published. Waiting for a code review? Email perandre@front.no.

**How do I migrate a block collection plugin to Gutenberg Cloud?**

This simply means removing some PHP, adding some meta data and publishing on NPM. [Follow these simple steps](https://github.com/front/cloud-blocks/blob/master/docs/migrate-block.md).

**How do I create a custom block for Gutenberg Cloud?**

Gutenberg Cloud blocks are really just normal Gutenberg blocks, without the PHP. [Follow these steps to do it](https://github.com/front/cloud-blocks/blob/master/docs/create-block.md)!

**How do I disable CSS for a single block?**

This is useful for letting your theme control your block styles. There’s a hook for this, [documented here](https://github.com/front/cloud-blocks/blob/master/docs/hooks.md).

**Why is the plugin called Cloud Blocks?**

We wanted to name it Gutenberg Cloud, but since it’s not possible to name a plugin starting with the name of another plugin (i.e. Gutenberg), we ended up calling it Cloud Blocks. Makes sense though, doesn’t it?

**Are the blocks really served from "the cloud"?**

Indeed, they are! The source code for each block is on NPM, but the JS/CSS is served by a CDN. No local downloads!

**Can I add private custom blocks?**

Sure! Just add your custom blocks into **wp-content/uploads/gutenberg-blocks/** folder. All your private blocks will be listed under `Local` tab in block explorer which you can activate/deactivate them. In order for your block to be active in the Gutenberg panel, it should be installed in Gutenberg Cloud. [This is what the folder structure should look like](https://github.com/front/cloud-blocks/blob/master/docs/private-blocks.md)!


## Changelog

Since changelog is getting too long to fit here, we moved it into its own file [here](https://github.com/front/cloud-blocks/blob/master/docs/changelog.md).
