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

## Integration
To use full set of VueLocalize features you need to do following simple steps:
- Integrate plugin in 2 places
- create and adjust the configuration file
- create file with translations
- add option ```localized: true``` into root-level routes, which need to become internationalized

### Integration in 2 places

> Full-featured example of integration in app with Vuex and VueRouter.

#### Place 1. Importing and registering VueLocalize plugin
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

#### Place 2. Adding Vuex store module

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
#### Options explanation
...
...

#### Translations file structure, contextes and global context

Translations structure is just a tree, so you can to structure translations as you want.

```js
export default {
  // global context
  'global': {
    'project-name': {
      en: 'Name of the project in English',
      ru: 'Название проекта на Русском'
    },
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
      // context for translations for anchors in nav menu
      'nav': {
        // key of the anchor of the link to homepage
        'home': {
          // translation of the anchor of the link to homepage into the English
          en: 'Home',
          ru: 'Главная'
        },
        // key of the anchor of the link to about page
        'about': {
          en: 'About',
          ru: 'О проекте'
        },
        // key of the anchor of the link to contacts page
        'contacts': {
          en: 'Contacts',
          ru: 'Контакты'
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
To get the translation of the anchor of the link to homepage into the current language, you should to pass the path to the phrase key into translation mechanism. In this case ```site.header.nav.home``` is the path, the ```site.header.nav``` part of this path is the "context" and ```home``` is the key of a phrase.
So path to the any node of this tree which is not contains leafs is a context, each node which contains leafs is a key of a phrase and each leaf is the translation into an exact language.
#### Global context
Global context is the root-level key, defined in the corresponding option of the VueLocalize configuration file. The feature of the global context is that you don't need include its name in the path which passing into translation method/filter/directive. E.g. to translate phrase with path ```global.project-name``` you can write just ```{{ 'project-name' | translate }}``` instead of full path ```global.project-name```.

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

##### Excluding leading language part from routes for default language
Note that it's easy to exclude leading language part from routes for default language if needed.
E.g. English is defined as default application language, so only thing we have to do for - set to ```false``` ```defaultLanguageRoute``` option in the config. Then we'll have the following set of paths:

```
# for English
yourdomain.com/
yourdomain.com/about
yourdomain.com/contacts
# for Russian
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

## Language selector example
Simple selector with bootstrap dropdown
```html
<template>
  <li class="dropdown" :class="{'open': opened}">
    <a href="javascript:;" @click="toggle">{{ currentLanguage | uppercase }} <span class="caret"></span></a>
    <ul class="dropdown-menu">
      <li v-for="(code, config) in $localizeConf.list" v-if="code !== currentLanguage && config.enabled !== false">
          <a href="{{ $translateRoutePath($route.path, $route.name, code) }}" @click.prevent="changeLanguage(code)">
            {{ code | uppercase }} | {{ 'global.lang.' + config.key | translate null code }}<br />
            <small class="text-muted">{{ 'global.lang.' + config.key | translate null currentLanguage }}</small>
          </a>
      </li>
    </ul>
  </li>
</template>
<script>
import { replace } from 'lodash'
export default {
  data () {
    return {
      opened: false
    }
  },
  methods: {
    toggle: function () {
      this.opened = !this.opened
    },
    changeLanguage: function (code) {
      this.toggle()
      if (!this.$route.localized) {
        this.$store.dispatch('SET_APP_LANGUAGE', code)
      } else {
        var oldRouteName = this.$route.name
        var routeName = replace(oldRouteName, /^[a-z]{2}/g, code)
        this.$router.go({name: routeName})
      }
    }
  }
}
</script>
```
The example above uses the following features:
- $localizeConf - global property of the VueLocalize plugin, which contains the configuration object from the VueLocalize config file
- currentLanguage - global mixin which is just the proxy to Vuex getter for accessing reactive state of current language in Vuex store
- $translateRoutePath() - global method of the VueLocalize plugin for translating path of the route to another language

Read more about these features in the "API" section below.

## Usage

### Translating

VueLocalize provides three ways for translating phrases:
- via Vue filter
- via direct call of the plugin method
- via Vue directive ```v-localize```

Ultimately in all these cases translation will be performed by the same internal mechanism of the plugin, which is just a function with following three arguments: ```(path, [vars], [lang])```

- *path* - (required) - the path to key of a phrase in the json object with translations (explained slightly above).
- *vars* - (optional) - variables to inject into the complete translation (explained slightly below)
- *lang* - (optional) - exact language for translation

Let's look at examples of usage listed above different translating methods

#### Translating via Vue filter

Just a translating into the current (selected) language
```html
<span>{{ 'site.header.nav.home' | translate }}</span>
```

Translating into exact language, e.g. English
```html
<span>{{ 'site.header.nav.home' | translate null 'en' }}</span>
```

#### Translating via direct method call

Translating into current language 
```html
<span>{{ $translate('site.header.nav.home') }}</span>
or
<span v-text="{{ $translate('site.header.nav.home') }}"></span>
```

Translating into exact language, e.g. English
```html
<span>{{ $translate('site.header.nav.home', null, 'en') }}</span>
```

#### Translating via ```v-localize``` directive

Translating into current language
```html
<span v-localize="{path: 'site.header.nav.home'}"></span>
```

Translating into exact language, e.g. English
```html
<span v-localize="{path: 'site.header.nav.home', lang: 'en'}"></span>
```

#### Injection custom variables into complete translation

## API
VueLocalize provides some global methods, one global property, one global mixin, one filter, one directive and one mutation for switching languages

### Global properties and methods
- $localizeConf
- $translate(path, [vars] = null, [lang] = null)
- $vueLocalizeInit($route)
- $localizeRoute(name, [lang = null])
- $translateRoutePath(path, name, lang)

### Filters
- translate

### Directives
- v-localize

### Mixins
- currentLanguage

### Mutations
- 'SET_APP_LANGUAGE'
