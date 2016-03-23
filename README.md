# vue-localize

> Localization plugin for vue.js based applications with Vuex and VueRouter

## Important
You can NOT use this plugin without Vuex

You CAN use this plugin without VueRouter

## Lnks

- Webpack
- VueRouter
- Vuex

## Functionality and features
- Easy integration in your application in just two places
- Current language is a Vuex state changed only via mutations
- Saving selected language in local storage
- Fallback language support
- Automatic routes localization (adding leading language part into routes paths): ```/about ===> /en/about, /ru/about,...``` (only with official VueRouter)
- Wrapper for route name for using in v-link for proper navigation: ``` v-link="{name: $localizeRoute('about')}" ```
- Translating page title
- Route path translating tool: ``` $translateRoutePath($route.path, $route.name, lang) ```
- Option for excluding language part from route path for default language
- Option for custom name of the key in local storage
- Global mixin for getting current language in Vue components via Vuex getter "currentLanguage"
- Translating phrases via Vue filter: ```{{ phrase | translate }}```
- Translating phrases via direct call of plugin method: ``` {{ $translate(phrase) }} or v-text="$translate(phrase)" ```
- Translating phrases via Vue directive: ``` v-localize="{path: 'header.nav.home'}" ```
- Injection of custom variables into translations: ``` {{ $translate(phrase, objVars) }} ```
- Translating to exact language regardless of current selected: ``` {{ $translate(phrase, null, 'en') }} ```
- Reactive UI translating via language selector
- Flexible context-based translations structure
- Language selector inplementation tutorial
- Separate NPM package

## Installation

In your project folder (where is package.json)

```bash
$ npm install vue-localize --save
```

## Integration

Full-featured example of integration in app with Vuex and VueRouter

##### In your entry point (usually index.js or main.js)
```js
import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

var router = new VueRouter({
  // your set of options options
})

import routes from './config/routes'                            // Import routes config obejct
import vlConfig from './config/vue-localize-conf'               // Import plugin config
import store from './vuex/store'                                // Import vuex store (required by vue-localize)
import VueLocalize from 'vue-localize'                          // Import VueLocalize plugin

Vue.use(VueLocalize, {
  store,
  config: vlConfig,
  router: router,
  routes: routes
})

import App from './App'                                         // Import App component - root Vue instance

router.start(App, '#app')                                       // Application start
```
Pay attention (!) there is no line with ```router.map(routes)```.
When using automatic routes localization, plugin will rebiulds your initial routes config and VueRouter will use already  rebuilded by VueLocalize routes config. So it's built into the plugin

##### In your Vuex store file
Note that VueLocalize contains built-in Vuex store module, so if you are using Vuex...
```js

```


Plugin importing and Vuex module registration

## Configuration options and config tutorial

## Translations file tutorial

## Automatic routes localization


