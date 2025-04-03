# vite-env-config
A Vite plugin to generate config.js from .env file


### Install

```shell
npm install vite-env-config
```

### Use config
Assuming you have two env configuration files for the development environment and the build environment

.env.development
```js
//.env.development
VITE_BASE_URL = /api
VITE_MODE = development
```
.env.production
```js
//.env.production
VITE_BASE_URL = https://domain.com
VITE_MODE = production
```

Use in vite.config.js
```js
import viteEnvConfig from 'vite-env-config'

export default defineConfig({
    plugins: [
        viteEnvConfig(['VITE_BASE_API'])
    ]
})
```
After building, a config. js file will be generated in the dist directory, with the following content.
```js
window.config = {BASE_API:'https://domain.com'}
```
Please use it in the following way in the code:
```js
let baseUrl = import.meta.env.MODE === 'production' ? window.config.BASE_API : import.meta.env.VITE_BASE_API;
```