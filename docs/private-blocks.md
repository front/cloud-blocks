### How can I add private custom blocks?

Just add your custom blocks into **wp-content/uploads/gutenberg-blocks/** folder and install in Gutenberg Cloud.

File structure must look like following:

```
wp-content/uploads/gutenberg-blocks
                    │
                    ├── block-one
                    │     ├─ package.json
                    │     ├── build
                    │     │     ├── screenshot.(png|jpg|gif)
                    │     │     ├── style.css
                    │     │     ├── editor.css (optional)
                    │     │     └── index.js
                    │     │
                    │     ├── your source files
                    │     ...
                    │
                    ├── block-two
                    │     │
                    ...   ...
```

**Note:** package.json file content must contain `gutenbergCloud` object like followig example:

```json
{
  "gutenbergCloud": {
    "js": "build/index.js",
    "css": "build/style.css",
    "screenshot": "screenshot.png"
  }
}
```

You can use any build tool you like, or simply write your blocks in plain css and vanilla javascript. But the block files must be under **/your-private-block/build/** folder and follow naming convention.

#### Added in version 1.0.7

You can now upload your block as a zip file within Cloud Blocks UI for local hosting.
