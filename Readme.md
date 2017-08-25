# Switching to the Right Node Version (Important)

Please use nvm and type "nvm use" to use the node version from .nvmrc.

If you use older Node, the application will not run because it is using some of the latest Javascript features.

# Configuring packages

The app does not use a database, so the data is stored in samples/packages.js. Feel free to play around with it.

# Running the app

Type in "npm start" which is a shorthand for "node apps/predictive_hire"

# Sample Input Output

The app reads from console.

```javascript
13 CF
13 CF $25.85
  1 x 3 $5.95
  2 x 5 $9.95
14 MB11
14 MB11 $53.80
  2 x 2 $9.95
  2 x 5 $16.95
10 VS5
10 VS5 $17.98
  2 x 5 $8.99
```
