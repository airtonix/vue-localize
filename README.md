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

##### Importing and registering VueLocalize plugin
> In your entry point (usually index.js or main.js)

```js
import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

var router = new VueRouter({
  // your set of options
})

// Import routes config obejct
import routes from './config/routes'

// Import plugin config
import vlConfig from './config/vue-localize-conf'

// Import vuex store (required by vue-localize)
import store from './vuex/store'

// Import VueLocalize plugin
import VueLocalize from 'vue-localize'

Vue.use(VueLocalize, {
  store,
  config: vlConfig,
  router: router,
  routes: routes
})

// Import App component - root Vue instance
import App from './App'

// Application start
router.start(App, '#app')
```
Pay attention (!) there is no line with ```router.map(routes)```.
When using automatic routes localization, plugin will rebiulds your initial routes config and VueRouter will use already  rebuilded by VueLocalize routes config. So it's built into the plugin

##### Adding Vuex store module

> Note that VueLocalize contains built-in Vuex store module, so if Vuex states and mutations in your application doesn't splitted in sub modules, it's time to do so.
Also note that it is important to use exact name of module ```vueLocalizeVuexStoreModule``` in your code.

So code for your store.js
```js
import Vuex from 'vuex'
import Vue from 'vue'
import { vueLocalizeVuexStoreModule } from 'vue-localize'
// import other Vuex modules

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    vueLocalizeVuexStoreModule,
    // other Vuex modules
  }
})
```

##### Config file

```js
import translations from './vue-localize-translations'
export default {
  list: {
    en: {
      key: 'eng',
      enabled: true
    },
    ru: {
      key: 'rus',
      enabled: true
    },
    de: {
      key: 'deu',
      enabled: false
    }
  },
  defaultLanguage: 'en',
  translations: translations,
  defaultLanguageRoute: false,
  resaveOnLocalizedRoutes: false,
  defaultContextName: 'global',
  fallbackOnNoTranslation: false,
  fallbackLanguage: 'en',
  supressWarnings: false
}
```
#####Options description
...
...

##### Translations file example
```js
export default {
  // global context
  'global': {
    // translations for language selector items
    lang: {
      eng: {
        en: 'English',
        ru: 'Английский'
      },
      rus: {
        en: 'Russian',
        ru: 'Русский'
      }
    }
  },
  // context for translations of frontend phrases (public section of your site)
  'site': {
    // context for translations of header
    'header': {
      // context for translations of anchors in nav menu
      'nav': {
        // translation of anchor for link to a home page
        'home': {
          en: 'Home',
          ru: 'Главная'
        },
        // translation of anchor for link to an about page
        'about': {
          en: 'Home',
          ru: 'Главная'
        },
        // translation of anchor for link to a contacts page
        'contacts': {
          en: 'Home',
          ru: 'Главная'
        },
        'loginbox': {
          // ...
        }
      }
    },
    'footer': {
      // translations of footer phrases
    }
  },
  'admin': {
    // translations of administration panel phrases
  }
}
```

##### Example of routes config for automatic routes localization
```js

export default {
    // the parent route
    '/': {
        component: SiteLayout
    },
    '/admin': {
        component: AdminLayout
    }
})
 
```


