# Migrating blocks from a plugin

**If you already have a plugin with a collection of custom blocks and would like to add them to Gutenberg Cloud, follow these 10 steps.**

## 1. Initiate a new package for NPM

First we should create our package structure, using [create-cloud-block](https://github.com/front/create-cloud-block).

```sh
$ npx create-cloud-block name-of-block
```

This step takes time, as it will also download a standalone editor for testing.

## 2. Add two keywords to package.json

Gutenberg Cloud looks for custom blocks in NPM repository, and it looks for the packages which have ‘gutenberg’ and ‘gutenberg-cloud’ keywords. So don’t forget to add these keywords in package.json.

```json
{
  "keywords": [
    "gutenberg",
    "gutenberg-cloud"
  ]
}
```

Since you used create-cloud-block, these are already there. **Without these, Gutenberg Cloud will ignore your block.**

Additionally, we recommend adding a couple of keywords describing what it does. Examples: social, map, hero, etc

## 3. Add gutenbergCloud object to package.json

After fetching available blocks, Cloud Blocks plugin allows the user to install blocks and make them available in the editor. In order to help Cloud Blocks know the block index, style, screenshot and name, you must add the `gutenbergCloud` object to block package.json.

```json
{
  "gutenbergCloud": {
    "js": "build/index.js",
    "css": "build/style.css",
    "screenshot": "screenshot.png",
    "name": "Hero section"
  }
}
```

Needless to say, the name is pretty important. Stay descriptive, but some originality might be good to set your block apart.

*Note: We are planning on adding more meta later, to allow for better filtering.*

## 4. Copy your plugin files into the new package

Not all of them – you don’t need the PHP files. Here are some typical files/folders you will need to copy:

  - block index        => /src/[block-name]/index.js
  - block style        => /src/[block-name]/style.scss
  - block editor style => /src/[block-name]/editor.scss (only if necessary)

Feel free to organize blocks files and dependencies as you prefer. This is only the suggestion the create-cloud-block tool gives us.

The most important here is to make sure the block entry point is in src folder. Webpack will look for an index.js file at that folder before compiling and generating the build files.

You are also free to change Webpack configuration if you feel comfortable with that, but at that point, we can’t ensure everything work as we planned and expected. If you will change Webpack configuration, make sure you also update file paths of `gutenbergCloud` object properties in package.json.

*Note: If you find that you have to use PHP, Cloud Blocks is not the solution for this block.*

## 5. Check that paths to assets are ok

This step is the most complex one. But if you are the plugin author, it should be quite easy!

Let’s pretend we are moving a block from the excellent [Stackable block collection](https://wordpress.org/plugins/stackable-ultimate-gutenberg-blocks/). After we have initiated the project, we moved *Image Box* block files to our package src folder, as well as all the remaining dependency files (icons.js and wp-imports.js).

```
stackable-image-box
  ├── build
  ├── node_modules
  │
  ├── src
  │     ├── stackable-image-box
  │     │     ├── deprecated.js
  │     │     ├── editor.scss
  │     │     ├── index.js
  │     │     └── style.scss
  │     ├── icons.js
  │     ├── index.js
  │     └── wp-imports.js
  │
  ├── .babelrc
  ├── .eslintrc
  ├── .gitignore
  ├── package-lock.json
  ├── package.json
  ├── README.md
  ├── screenshoot.png
  └── webpack.config.js

```

According our folder structure, we have to update relative paths for imports in 'src/stackable-image-box/index.js', like:

```js
import { PictureIcon } from '../icons';
import { ... } from '../wp-imports';
```

In this case, we also removed some dependencies *Image Box* doesn’t use from wp-imports.js file and added box, baseBlock and blockContentReset mixins to style.css.

## 6. Make the block register itself

Gutenberg provides several ways to register our custom blocks. Cloud Blocks expects custom blocks to be independent and autonomous: they must be able to register themself and for that they should use `registerBlockType` function.

The create-cloud-blocks command generates the src/index.js file which takes care of the registration process (category registration and block registration). All you have to do is to import your block settings and pass them to `registerBlockType` function ([official docs here](https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type/#registering-the-block)).

We recommend using the **Cloud Blocks** (`'cloudblocks'`) category instead of company name, so blocks and categories show up well organized in Insert Menu in the editor. The reason for this, is that people might install four cloud blocks – each from a different author. Then it makes sense to keep them all together.

## 7. Test your block outside of WordPress

Before you publish your block, make sure it works and that it looks nice across all platforms. Since you used create-cloud-block, you just do the following:

```sh
$ npm start
```

## 8. Test your block inside WordPress

1. Install the **[Cloud Blocks plugin](https://wordpress.org/plugins/cloud-blocks/)**
2. Add your block folder into /wp-content/gutenberg-blocks/ (this is only for testing, you can remove when published on NPM)
3. Click the cloud icon in admin and browse to see if you block is there. Activate it.
4. Test it in Gutenberg editor

## 9. Add the screenshot

Create a 1200*900 px png. Preferably, run it through [tinypng.com](https://tinypng.com/) before adding it to your package root. We recommend showing what the block actually looks like. But: Feel free to add your logo for shameless branding.

## 10. Publish to NPM

Make sure your README.md makes sense, and update the package.json values for `homepage`, `author` and `description`. Note that these will be visible in the UI when clicking to see More details. 

Next step:


```sh
$ npm run build
$ npm publish
```

or just `$ npm run deploy` if you used create-cloud-block tool.

That’s it! Your block will be available to Gutenberg Cloud after our review. Bravo!
