# vue-localize

> Localization plugin for vue.js based applications with Vuex and VueRouter

## Important
You can NOT use this plugin without Vuex

You can NOT use this plugin without VueRouter, but it will be possible in the next versions (newer than 1.0.2).

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

## Integration in 2 places

Full-featured example of integration in app with Vuex and VueRouter

##### Place 1. Importing and registering VueLocalize plugin
> In your entry point (usually it's index.js or main.js)

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

Vue.use(VueLocalize, {// All four options is required
  store,
  config: vlConfig,
  router: router,
  routes: routes
})

// Import App component - root Vue instance for application
import App from './App'

// Application start
router.start(App, '#app')
```
Pay attention (!) there is no line with ```router.map(routes)```.
When using automatic routes localization, VueLocalize will transform your initial routes config and VueRouter will use it already transformed. So this line of code is built into the plugin.

##### Place 2. Adding Vuex store module

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

#### Config file

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
  defaultLanguageRoute: true,
  resaveOnLocalizedRoutes: false,
  defaultContextName: 'global',
  fallbackOnNoTranslation: false,
  fallbackLanguage: 'en',
  supressWarnings: false
}
```
#### Options description
...
...

#### Translations file example
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

#### Example of routes config for automatic routes localization
> Example below assumes an application of a website, that consists of the public and administrative sections and assumes that the public section should working with localized routes paths and the administrative section shouldn't.

```js
import SiteLayout from './components/SiteLayout'
import HomePage from './components/HomePage'
import SiteLayout from './components/AboutPage'
import SiteLayout from './components/ContactsPage'
import SiteLayout from './components/AdminLayout'
// ... importing other components

export default {
    // the parent route for public section of your application
    '/': {
      // (!!!) the only thing you have to add for localize this route and all nested routes recursively
      localized: true,
      component: SiteLayout,
      subRoutes: {
        '/': {
          name: 'home-page',
          component: 'HomePage'
        },
        '/about': {
          name: 'about-page',
          component: 'AboutPage'
        },
        '/contacts': {
          name: 'contacts-page',
          component: 'ContactsPage'
        },
      }
    },
    '/admin': {
        component: AdminLayout
        subRoutes: {
          // administration area subroutes
        }
    }
})
 
```
Pay attention to the ```localized: true``` option of the parent route for public section of application. This is really only thing you have to add to internationalize path of this and all nested routes recursively. And you have to add this option only into a parent (root-level) routes and no into any sub routes.

What will happen?

If use the above described routes config as is, we'll have the following paths of public section:
```
yourdomain.com/
yourdomain.com/about
yourdomain.com/contacts
```

VueLocalize will transform initial config automatically and in the end we'll have the following set of paths:

```
yourdomain.com/en
yourdomain.com/en/about
yourdomain.com/en/contacts
yourdomain.com/ru
yourdomain.com/ru/about
yourdomain.com/ru/contacts
```

Transitions between routes e.g. ```yourdomain.com/en/about``` and ```yourdomain.com/ru/about``` (when switching languages via language selector) will reuse the same component. So if you have any data at the page (in the component binded to the current route), and the switching to another language, data will not be affected despite the fact that the route has been actually changed. VueLocalize simply performs reactive translation of all the phrases at the page.

###### Excluding leading language part from routes for default language
Note that it's easy to exclude leading language part from routes for default language if needed.
E.g. English is defined as default application language, so only thing we have to do for - set to ```false``` ```defaultLanguageRoute``` option in the config. Then we'll have the following set of paths:

```
yourdomain.com/
yourdomain.com/about
yourdomain.com/contacts
yourdomain.com/ru
yourdomain.com/ru/about
yourdomain.com/ru/contacts
```
And the dump of the transformed routes config below helps to understand better what will happen with initial routes config and how exactly it will be transformed.
```js
export default {
    '/en': {
      localized: true,
      lang: 'en',
      component: SiteLayout,
      subRoutes: {
        '/': {
          name: 'en_home-page',
          component: 'HomePage'
        },
        '/about': {
          name: 'en_about-page',
          component: 'AboutPage'
        },
        '/contacts': {
          name: 'en_contacts-page',
          component: 'ContactsPage'
        },
      }
    },
    '/ru': {
      localized: true,
      lang: 'ru',
      component: SiteLayout,
      subRoutes: {
        '/': {
          name: 'ru_home-page',
          component: 'HomePage'
        },
        '/about': {
          name: 'ru_about-page',
          component: 'AboutPage'
        },
        '/contacts': {
          name: 'ru_contacts-page',
          component: 'ContactsPage'
        },
      }
    },
    '/admin': {
        component: AdminLayout
        subRoutes: {
          // ...
        }
    }
})
```
As you can see
- root-level routes (only which have ```localized: true ``` option) will be cloned from initial one recursively
- leading parts with language codes will be added into the paths of root-level routes
- names for all sub routes will be changed recursively by adding prefixes with language code
- option ```lang``` with language code in value will be added into root-level routes only

There is two important things you should consider when using this plugin:
- option ```lang``` added into the root-level routes. Just keep it in mind.
- changing names of the routes. And there is the special global method of the VueLocalize plugin for wrapping initial route name in ```v-link``` directive. To implement navigation for multilingual routes with VueLocalize, just do the following:
```html
<a v-link="{name: $localizeRoute('about')}"></a>
```
Method ```$localizeRoute()``` works only with names of routes, but not with paths, so routes used in navigation links should be named. And, please, don't use unnamed routes / sub-routes to avoid unexpected behaviour. This case (using unnamed routes with this plugin) is not tested yet.



