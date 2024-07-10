[1mdiff --git a/package-lock.json b/package-lock.json[m
[1mindex 0be8a4b..2a7e9e0 100644[m
[1m--- a/package-lock.json[m
[1m+++ b/package-lock.json[m
[36m@@ -9,7 +9,7 @@[m
       "version": "0.1.0",[m
       "dependencies": {[m
         "axios": "^1.7.2",[m
[31m-        "media-filename-parser": "^0.1.4",[m
[32m+[m[32m        "media-filename-parser": "^0.2.5",[m
         "prop-types": "^15.8.1",[m
         "react": "^18.3.1",[m
         "react-dom": "^18.3.1",[m
[36m@@ -28,6 +28,26 @@[m
         "eslint-plugin-react-hooks": "^4.6.2"[m
       }[m
     },[m
[32m+[m[32m    "../media-filename-parser": {[m
[32m+[m[32m      "version": "0.2.5",[m
[32m+[m[32m      "extraneous": true,[m
[32m+[m[32m      "license": "ISC",[m
[32m+[m[32m      "devDependencies": {[m
[32m+[m[32m        "@babel/plugin-transform-modules-commonjs": "^7.23.3",[m
[32m+[m[32m        "@babel/preset-env": "^7.24.7",[m
[32m+[m[32m        "babel-loader": "^9.1.3",[m
[32m+[m[32m        "bump-pkg-json": "^0.1.3",[m
[32m+[m[32m        "eslint": "^8.53.0",[m
[32m+[m[32m        "eslint-config-airbnb-base": "^15.0.0",[m
[32m+[m[32m        "eslint-plugin-import": "^2.29.1",[m
[32m+[m[32m        "husky": "^9.0.11",[m
[32m+[m[32m        "jest": "^29.7.0",[m
[32m+[m[32m        "node-polyfill-webpack-plugin": "^4.0.0",[m
[32m+[m[32m        "terser-webpack-plugin": "^5.3.10",[m
[32m+[m[32m        "webpack": "^5.92.0",[m
[32m+[m[32m        "webpack-cli": "^5.1.4"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/@alloc/quick-lru": {[m
       "version": "5.2.0",[m
       "resolved": "https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.2.0.tgz",[m
[36m@@ -10396,9 +10416,9 @@[m
       "integrity": "sha512-iV3XNKw06j5Q7mi6h+9vbx23Tv7JkjEVgKHW4pimwyDGWm0OIQntJJ+u1C6mg6mK1EaTv42XQ7w76yuzH7M2cA=="[m
     },[m
     "node_modules/media-filename-parser": {[m
[31m-      "version": "0.1.4",[m
[31m-      "resolved": "https://registry.npmjs.org/media-filename-parser/-/media-filename-parser-0.1.4.tgz",[m
[31m-      "integrity": "sha512-gdXpc4PMQSIxrmW6Ycv2lCoB0AY/7Uv9aHpL8ex9ojuwTcqcaOpDhXdUsjKZO04eM1iVmBxdLmCf0EUBpPTRpQ=="[m
[32m+[m[32m      "version": "0.2.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/media-filename-parser/-/media-filename-parser-0.2.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-lHJem8RkYbskL8j496Na+vtFRBgIKHXPBAwmkTLALmOTLKMABqTsyf1N9l8PuYqzKxP42gsS91arL8b+KXoCsw=="[m
     },[m
     "node_modules/media-typer": {[m
       "version": "0.3.0",[m
[1mdiff --git a/package.json b/package.json[m
[1mindex f3eff6c..b34d0de 100644[m
[1m--- a/package.json[m
[1m+++ b/package.json[m
[36m@@ -5,7 +5,7 @@[m
   "main": "src/index.jsx",[m
   "dependencies": {[m
     "axios": "^1.7.2",[m
[31m-    "media-filename-parser": "^0.1.4",[m
[32m+[m[32m    "media-filename-parser": "^0.2.5",[m
     "prop-types": "^15.8.1",[m
     "react": "^18.3.1",[m
     "react-dom": "^18.3.1",[m
[1mdiff --git a/src/media-library/components/ListMedia/index.jsx b/src/media-library/components/ListMedia/index.jsx[m
[1mindex 6d87a70..abcb993 100644[m
[1m--- a/src/media-library/components/ListMedia/index.jsx[m
[1m+++ b/src/media-library/components/ListMedia/index.jsx[m
[36m@@ -31,7 +31,7 @@[m [mconst ListMedia = () => {[m
     if (tree) {[m
       const path = pathname.split('/').slice(2).map((val) => decodeURIComponent(val));[m
 [m
[31m-      const firstLib = Object.keys(tree)[0];[m
[32m+[m[32m      const firstLib = Object.keys(tree)[1];[m
       const target = path.reduce((acc, val) => {[m
         if (val) {[m
           return acc[val];[m
