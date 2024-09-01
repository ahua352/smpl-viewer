# SMPL Viewer

This repository allows you to viauslise SMPL motion from a specified json file. Place your JSON files in the `src/data` directory. The data should be formatted as an object containing `result` and `quant` properties, where `result` is an array of arrays of 72 numbers. Every 3 numbers within the inner array represents the x, y, z coordinates of the respective joint.

Instructions:
1. Run `npm install` to install dependencies
2. Modify the import data pathname in `App.tsx` to point to your JSON file
3. Run `npm run dev` to run the webpage

When you navigate to the link, you should see a page with a Three.js scene displaying the motion through a stick figure.
