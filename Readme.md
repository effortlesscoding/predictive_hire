# Switching to the Right Node Version (Important)

Please use nvm and type "nvm use" to use the node version from .nvmrc.

If you use older Node, the application will not run because it is using some of the latest Javascript features.

# Configuring database access

Please have your own mongodb somewhere, and modify the config/database.js with your username and password. By default, it is trying to read them from environmental variables PH_DB_USERNAME and PH_DB_PASSWORD.

# Populating Database

node tasks/packages.js

# Running testss

npm test

# Running the application

npm start

# Sample endpoint

http(s)://{Your URL + PORT}/api/v1/orders/options?code=5%20CF

Ex.: http://localhost:3000/api/v1/orders/options?code=5%20CF

Example response:
```json
{"options":[[{"productCode":"CF","size":3,"priceCents":595,"quantity":0},{"productCode":"CF","size":5,"priceCents":995,"quantity":1},{"productCode":"CF","size":9,"priceCents":1699,"quantity":0}]]}
```
