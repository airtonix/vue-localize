# vue-localize

> Localization plugin for vue.js based applications with Vuex and VueRouter

## Important
You can NOT use this plugin without Vuex

You can NOT use this plugin without VueRouter, however it will be possible in the next versions (newer than 1.0.2).

## Links

- [VueRouter](http://vuejs.github.io/vue-router/en/index.html)
- [Vuex](http://vuex.vuejs.org/en/index.html)

## Functionality and features
- Easy integration in your application
- Current language is a Vuex state changed only via mutations
- Saving selected language in local storage
- Fallback language support
- Automatic routes localization (adding leading language part into routes paths): ```/about ===> /en/about, /ru/about,...``` (only with official VueRouter)
- Wrapper for route name for using in v-link for proper navigation: ``` v-link="{name: $localizeRoute('about')}" ```
- Translating page title
- Route path translating: ``` $translateRoutePath($route.path, $route.name, lang) ```
- Option for excluding language part from route path for default language
- Option for custom name of the key in local storage
- Global mixin for getting current language in Vue components via Vuex getter "currentLanguage"
- Translating phrases via Vue filter: ```{{ phrase | translate }}```
- Translating phrases via direct call of plugin method: ``` {{ $translate(phrase) }} or v-text="$translate(phrase)" ```
- Translating phrases via Vue directive: ``` v-localize="{path: 'header.nav.home'}" ```
- Injection custom variables into translations: ``` {{ $translate(phrase, objVars) }} ```
- Translating into exact language regardless of current selected: ``` {{ $translate(phrase, null, 'en') }} ```
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
> Full-featured example of integration in app with Vuex and VueRouter.

To use full set of VueLocalize features you need to do following simple steps:
- Integrate plugin
  - Import and register plugin
  - Add Vuex store module
  - Setup initial state
- Create and adjust the configuration file
- Create file with translations
- Add option ```localized: true``` into root-level routes, which need to become internationalized

#### Importing and registering VueLocalize plugin
> In your entry point (usually it's index.js or main.js)

```js
import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

var router = new VueRouter({
  // your set of options
})

// Import router config obejct
import routes from './config/routes'

// Import plugin config
import vlConfig from './config/vue-localize-conf'

// Import vuex store (required by vue-localize)
import store from './vuex/store'

// Import VueLocalize plugin
import VueLocalize from 'vue-localize'

Vue.use(VueLocalize, {// All options is required
  store,
  config: vlConfig,
  router: router,
  routes: routes
})

// Import App component - root Vue instance of application
import App from './App'

// Application start
router.start(App, '#app')
```
Pay attention (!) there is no line with ```router.map(routes)``` in the code above.
When using automatic routes localization, VueLocalize will transform your initial router config and VueRouter will use it already transformed. So this line of code is built into the plugin. More detailed explanation below.

#### Adding Vuex store module

> Note that VueLocalize contains built-in Vuex store module, so if Vuex states and mutations in your application doesn't splitted in sub modules, it's time to do so. How how to split state and mutations into sub modules explaned here [http://vuex.vuejs.org/en/structure.html](http://vuex.vuejs.org/en/structure.html) 
Also note that it is important to use exact name of module ```vueLocalizeVuexStoreModule``` in your code.

Code for your store.js
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

#### Setting initial state
You can't know in advance, what exact route can initialize application. It can be either route with leading language part, either without. And VueLocalize must understand, what exact language it should set as initial. It can be language from route, or saved in local storage if there is no language part in route (e.g. in administrative section), or the default language.

And there is the global method ```$vueLocalizeInit($route)``` for this purpose. It's just a function which getting a route object as attribute.

We recommend place the call of this method on ready hook of the root Vue instance, which was passed in ```router.start()```
In our example it's the App.vue component.
```js
<script>
import store from '../vuex/store'
export default {
  // injecting Vuex store into the root Vue instance
  store,
  ready: function () {
    this.$vueLocalizeInit(this.$route)
  }
}
</script>

```

## Config file

```js
import translations from './vue-localize-translations'
export default {
  languages: {
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
- **languages** - The list of application languages. It's just a json object. The key of each root node is a language code. Each node is a configuration of the exact language and should contains two options:
  - **key** - phrase key in the translation file for translating language name into different languages, e.g. for using when render items in language selector
  - **enabled** - set to false if need to disable language, or true to enable


- **defaultLanguage** - Default language will be used if the language nowhere defined (together in current route, Vuex store and localStorage). Usually it works if user came for the first time

- **translations** - The object with translations of application phrases

- **defaultLanguageRoute** - Defines the behaviour of routes localization (adding language at the start of path of a routes). If false, disable leading language param for all routes with default language, or enable otherwise
- **resaveOnLocalizedRoutes** - Defines the policy for storing selected language in browser local storage for transiotions from localized routes to not localized and backwards. If false, transition from NOT localized route to localized will not update selected language in local storage, and it will be taken up when you'll back TO NOT localized route FROM LOCALIZED, even you have switched languages with language selector. It can be useful in cases when you need to remember the language selected in user account or administrative panel and switching languages at the public section of a site should not affect this choice. Set to true if you need transparent behaviour of application when switching languages and language must be changed for all application regargless of where exactly it was switched, in administration panel or at the public section of a site.

- **defaultContextName** - Name of the key for default context of translations

- **fallbackOnNoTranslation** - Set to true if you want to translate phrases which has no translation into the language defined in the option "fallbackLanguage" below. It may be usefull when you already need to publish your app, but you have no complete translations into all languages for all phrases.

- **fallbackLanguage** - Defines the fallback language for using in case described in comment for the option above

- **supressWarnings** - Suppress warnings emitted into browser console (concerns only translation process). Plugin can emit warnings during translation phrases process in the following cases:
  - phrase path doesn't exists in localization file (emitted always)
  - phrase path exists but there is no translation into current language (emitted only if "fallbackOnNoTranslation" is set to false)
  - phrase path exists, hasn't translation into current language and hasn't translation into fallback language (emitted only if "fallbackOnNoTranslation" is set to true)
  - output translation contains unprocessed variables which will shown to user  as is, e.g. %foo%

## Translations file structure, contextes and global context

Translations structure is just a json object, so you can to structure translations as you want.

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
E.g. to get the translation of the anchor of the link to homepage into the current language, you should to pass the path to the phrase key into translation mechanism. In this case ```site.header.nav.home``` is the path, the part ```site.header.nav``` of this path is the "context" and ```home``` is the key of a phrase.
So path to the any node which is not contains leafs is a context, each node which contains leafs is a key of a phrase and each leaf is the translation into an exact language.
#### Global context
Global context is the root-level key, defined in the corresponding option of the VueLocalize configuration file. The feature of the global context is that you don't need include its name in the path which passing into translation method/filter/directive. E.g. to translate phrase with path ```global.project-name``` you can write just ```{{ 'project-name' | translate }}``` instead of full path ```global.project-name```.

## Router config for automatic routes localization
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
          component: HomePage
        },
        '/about': {
          name: 'about-page',
          component: AboutPage
        },
        '/contacts': {
          name: 'contacts-page',
          component: ContactsPage
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

If use the above described router config as is, we'll have the following paths of public section:
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

##### Excluding leading language part from routes paths for default language
Note that it's easy to exclude leading language part from routes for default language if needed.
E.g. if English is defined as default application language, the only thing we have to do for - set to ```false``` the  ```defaultLanguageRoute``` option in the config. Then we'll have the following set of paths:

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
And the dump of the transformed router config below helps to understand better what will happen with initial router config and how exactly it will be transformed.
```js
export default {
    '/en': {
      localized: true,
      lang: 'en',
      component: SiteLayout,
      subRoutes: {
        '/': {
          name: 'en_home-page',
          component: HomePage
        },
        '/about': {
          name: 'en_about-page',
          component: AboutPage
        },
        '/contacts': {
          name: 'en_contacts-page',
          component: ContactsPage
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
          component: HomePage
        },
        '/about': {
          name: 'ru_about-page',
          component: AboutPage
        },
        '/contacts': {
          name: 'ru_contacts-page',
          component: ContactsPage
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
      <li v-for="(code, language) in $localizeConf.languages" v-if="code !== currentLanguage && language.enabled !== false">
          <a href="{{ $translateRoutePath($route.path, $route.name, code) }}" @click.prevent="changeLanguage(code)">
            {{ code | uppercase }} | {{ 'global.lang.' + language.key | translate null code }}<br />
            <small class="text-muted">{{ 'global.lang.' + language.key | translate null currentLanguage }}</small>
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
- ```$localizeConf``` - global property of the VueLocalize plugin, which contains the configuration object from the VueLocalize config file
- ```currentLanguage``` - global mixin which is just the proxy to Vuex getter for accessing reactive state of current language in Vuex store
- ```$translateRoutePath()``` - global method of the VueLocalize plugin for translating path of the route to another language
- ```this.$store.dispatch('SET_APP_LANGUAGE', code)``` - dispatch the mutation

Read more about these features in the "API" section below.
Pay attention that in the example above we dispatch mutation only for non localized routes, but if route has flag ```localized: true``` we perform ```router.go()``` and in this case mutation will be dispatched automatically inside the VueLocalize plugin

## Usage

#### Translating

VueLocalize provides three ways for translating phrases:
- via **Vue filter**
- via **direct call** of the plugin method
- via **Vue directive** ```v-localize```

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

## Injection custom variables into complete translation

Lets define some variables just for example
```js
export default {
  data () {
    return {
      vars: {
        '%foo%': 'Foo',
        '%bar%': 'Bar'
      }
    }
  }
}
```
and add the example phrase with translations into the global context:
```js
export default {
  // global context
  'global': {
    'project-name': {
      en: 'Name of the project in English',
      ru: 'Название проекта на Русском'
    },
    'injection-test': { // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< our phrase for injection test
      en: 'Some string in English contains %foo% and only then %bar%',
      ru: 'Перевод фразы на русский, содержащий наоборот сначала %bar% и только потом %foo%'
    },
    // ...
  },
  // ....
}
```

#### Injecting with Vue filter
```html
{{ 'injection-test' | translate vars }}
```
#### Injecting with direct call
```html
{{ $translate('injection-test', vars) }}
```
or
```html
<span v-text="$translate('injection-test', vars)"></span>
```
#### Injecting with directive
```html
<span v-localize="{path: 'injection-test', vars: vars}"></span>
```

# API

### Global properties and methods
- **$localizeConf** - global property of the VueLocalize plugin, which contains the configuration object from the VueLocalize config file. So you can access your config in your Vue component just via ```this.$localizeConf``` in models or via ```$localizeConf``` in templates.


- **$translate(path, [vars] = null, [lang] = null)** - global function for translating phrases
  - **path** - (required) - the path to key of a phrase in the json object with translations
  - **vars** - (optional) - variables to inject into the complete translation
  - **lang** - (optional) - exact translation language


- **$vueLocalizeInit($route)** - method for initialization Vuex state (current language) on page loading/reloading. Detailed explanation describet slightly above in [Setting initial state](#setting-initial-state)
  - **$route** - (required) - route object


- **$localizeRoute(name, [lang = null])** - method for routes names wrapping for proper navigation.
  - **name** - (required) - initial name of a route as defined in your router config


- **$translateRoutePath(path, name, lang)** - method for translating path of the current route to another language.
  - **path** - (required) - path of the route
  - **name** - (required) - name of the route
  - **lang** - (optional) - exact language (using current selected by default)


### Filters
- **translate**

### Directives
- **v-localize**

### Mixins
- **currentLanguage** - VueLocalize provides the global mixin for getting current selected language in your Vue components. Mixin is global so will be injected into **each Vue instance**

### Mutations
- 'SET_APP_LANGUAGE' - VueLocalize contains built-in Vuex submodule, which provides mutation ```SET_APP_LANGUAGE``` to performing language changing. Only you have to do for change the language from some method of your Vue components - dispatch the mutation. E.g.:
```js
//...
methods: {
  setLanguage: function (language) {
    this.$store.dispatch('SET_APP_LANGUAGE', language)
  }
},
//...

```
