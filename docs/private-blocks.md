### How can I add private custom blocks?

Just add your custom blocks into **wp-content/gutenberg-blocks/** folder.

File structure must look like following:

```
wp-content/gutenberg-blocks
              │
              ├── block-one
              │     ├── build
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

You can use any build tool you like, or simply write your blocks in plain css and vanilla javascript. But the block files must be under **/your-private-block/build/** folder and follow naming convention.