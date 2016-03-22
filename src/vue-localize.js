import { kebabCase, replace, join, split, each, has, get, set, unset, clone, cloneDeep } from 'lodash'
import { currentLanguage, routeLocalized } from './getters'
import Vue from 'vue'

Vue.mixin({
  vuex: {
    getters: {
      currentLanguage: currentLanguage,
      routeLocalized: routeLocalized
    }
  }
})

/**
 * Recursive renaming subrouts
 */
const _localizeSubroutes = function (subroutes, lang, routesRegistry) {
  each(subroutes, function (route, path) {
    if (has(route, 'name')) {
      set(routesRegistry.initial, route.name, path)
      route.originalName = route.name
      route.name = lang + '_' + route.name
      set(routesRegistry.localized, route.name, lang)
    }

    if (has(route, 'subRoutes')) {
      var objSubs = clone(route.subRoutes)
      unset(route, 'subRoutes')

      var subs = cloneDeep(objSubs)
      var subroutesLocalized = _localizeSubroutes(subs, lang, routesRegistry)
      route.subRoutes = subroutesLocalized
    }
  })

  return subroutes
}

/**
 * Adding components objects into the routes config
 */
const _addComponents = function (routes, components) {
  each(routes, function (route, path) {
    var componentName = route.component
    route.component = get(components, componentName)

    if (has(route, 'subRoutes')) {
      _addComponents(route.subRoutes, components)
    }
  })

  return routes
}

/**
 * Localization of routes
 * @todo by Saymon: suspicion that we have different instatnces of the same component when calling clone/cloneDeep
 * if it's true, need to remove component objects before cloning and then map its after
 */
export const localizeRoutes = function (routes, langConfig, components) {
  var routesRegistry = { initial: {}, localized: {} }
  each(routes, function (routeConfig, path) {
    if (!has(routeConfig, 'localized')) {
      return
    }

    if (has(routeConfig, 'name')) {
      set(routesRegistry.initial, routeConfig.name, path)
    }

    var objRoute = clone(routeConfig)
    unset(routes, path)

    if (has(objRoute, 'subRoutes')) {
      var objSubs = clone(objRoute.subRoutes)
      unset(objRoute, 'subRoutes')
    }

    each(langConfig.list, function (config, lang) {
      if (!config.enabled) {
        return
      }

      var newNode = clone(objRoute)
      var suffix = ''
      if (path[0] === '/' && path.length === 1) {
        suffix = ''
      } else if (path[0] === '/' && path.length > 1) {
        suffix = path
      } else if (path[0] !== '/') {
        suffix = '/' + path
      }

      var prefix = lang
      if (langConfig.defaultLanguageRoute === false) {
        prefix = langConfig.defaultLanguage !== lang ? lang : ''
      }

      var newPath = '/' + prefix + suffix
      newNode.lang = lang

      var subs = cloneDeep(objSubs)
      var subroutesLocalized = _localizeSubroutes(subs, lang, routesRegistry)
      newNode.subRoutes = subroutesLocalized
      set(routes, newPath, newNode)
    })
  })

  /* IF DEBUG
  console.log(routesRegistry)
  console.log(JSON.stringify(routes, null, ' '))
  if (true) {
    throw new Error()
  }
  /* IF DEBUG */

  _addComponents(routes, components)

  return {
    map: routes,
    routesRegistry: routesRegistry
  }
}

/**
 * @Vue     {Object} -
 * @options {Object} - plugin options
 */
function install (Vue, options) {
  /**
   * @store           {Object} - an instance of a vuex storage
   * @config          {Object} - config object
   * @routesRegistry  {Object} - registry of a routes (with initial names and localized names)
   */
  var { store, config, router, routes, components } = options
  const VARIABLES_REGEXP = /%[a-z]*%/g
  const {
    bind
  } = Vue.util

  const routesMap = localizeRoutes(routes, config, components)
  const routesRegistry = routesMap.routesRegistry

  router.map(routesMap.map)

  router.beforeEach(function (transition) {
    const currentLanguage = store.state.vueLocalize.currentLanguage
    if (transition.to.localized) {
      /* prevent unnecessary mutation call  */
      if (currentLanguage !== transition.to.lang) {
        store.dispatch('SET_APP_LANGUAGE', transition.to.lang, config.resaveOnLocalizedRoutes, 'main.js LOCALIZED')
      }
    } else if (transition.from.localized === true && !config.resaveOnLocalizedRoutes) {
      // Restore memorized language from local storage for not localized routes
      var localStoredLanguage = window.localStorage.getItem('currentLanguage')
      if (localStoredLanguage && /* prevent unnecessary mutation call  */ transition.from.lang !== localStoredLanguage) {
        store.dispatch('SET_APP_LANGUAGE', localStoredLanguage, false, 'main.js NOT LOCALIZED')
      }
    }
    transition.next()
  })

  /**
   * Returns current selected application language
   * @return {String}
   */
  function _currentLanguage () {
    return store.state[config.vuexStoreModuleName].currentLanguage
  }

  /**
   * Get the path of a phrase and translates it into the current
   * selected application language or into the language received in 'lang' param
   *
   * @param   {String} path
   * @param   {Object} vars
   * @param   {string} lang
   * @return  {String}
   */
  function translate (path, vars = null, lang = null) {
    var lc = _currentLanguage()
    var translateTo = lang || lc

    var phrasePathParts = split(path, '.')
    var isGlobal = phrasePathParts.length === 1
    var exactPath = isGlobal ? config.defaultContextName + '.' + path : path

    if (!has(config.translations, exactPath)) {
      if (!config.supressWarnings) {
        console.warn('[VueLocalize]. Undefined path: "' + exactPath + '"')
      }

      return exactPath
    }

    var translationPath = exactPath + '.' + translateTo
    var isTranslationExists = has(config.translations, translationPath)
    if (isTranslationExists) {
      var translationExpected = get(config.translations, translationPath)
      return _processVariables(translationExpected, vars, translationPath)
    }

    if (!config.fallbackOnNoTranslation) {
      if (!config.supressWarnings) {
        console.warn('[VueLocalize]. Undefined translation: "' + translationPath + '"')
      }

      return exactPath
    }

    var fallbackTranslationPath = exactPath + '.' + config.fallbackLanguage
    var isFallbackTranslationExists = has(config.translations, fallbackTranslationPath)

    if (translateTo === config.fallbackLanguage || !isFallbackTranslationExists) {
      if (!config.supressWarnings) {
        console.warn('[VueLocalize]. Undefined FALLBACK translation: "' + fallbackTranslationPath + '"')
      }

      return exactPath
    }

    var translationFallback = get(config.translations, fallbackTranslationPath)
    return _processVariables(translationFallback, vars, fallbackTranslationPath)
  }

  /**
   * Localize route name by adding prefix (e.g. 'en_') with language code.
   * @todo by Saymon: should to consider is route localized
   */
  function localizeRoute (name, lang = null) {
    if (!has(routesRegistry.initial, name)) {
      return name
    }

    var prefix = (lang || _currentLanguage()) + '_'
    return prefix + name
  }
  Vue.prototype['$localizeRoute'] = localizeRoute

  function translateRoutePath (path, name, newLang) {
    if (!has(routesRegistry.initial, name) && !has(routesRegistry.localized, name)) {
      return path
    }

    if (config.defaultLanguageRoute === true) {
      return replace(path, /^.{3}/g, '/' + newLang)
    }

    if (config.defaultLanguage === _currentLanguage()) {
      return '/' + newLang + path
    }

    if (newLang === config.defaultLanguage) {
      var newPath = replace(path, /^.{3}/g, '')
      if (!newPath.length) {
        newPath = '/'
      }

      return newPath
    }
  }
  Vue.prototype['$translateRoutePath'] = translateRoutePath

  /**
   * Object with VueLocalize config
   */
  const localizeConf = config
  Vue.prototype['$localizeConf'] = localizeConf

  /**
   * Injects variables values into already translated string by
   * replcaing their string keys with their real values
   *
   * @return {String}
   */
  function _processVariables (translation, vars, path) {
    var arrVars = translation.match(VARIABLES_REGEXP)
    if (!arrVars) {
      return translation
    }

    if (!vars) {
      _logUnreplacedVars(arrVars, path)
      return translation
    }

    each(vars, function (value, key) {
      translation = replace(translation, key, value)
    })

    var unreplacedVars = translation.match(VARIABLES_REGEXP)
    if (unreplacedVars) {
      _logUnreplacedVars(unreplacedVars, path)
    }

    return translation
  }

  /**
   * Logs warnings into console if the translation contains some unreplaced variable
   * @return {void}
   */
  function _logUnreplacedVars (vars, path) {
    if (!config.supressWarnings) {
      console.warn('VueLocalize. Unreplaced: ' + join(vars, ', ') + ' in "' + path + '"')
    }
  }

  // Adding global filter and global method $translate
  var helpers = { translate }
  each(helpers, function (helper, name) {
    Vue.filter(kebabCase(name), helper)
    Vue.prototype['$' + name] = helper
  })

  // Adding directive
  Vue.directive('localize', {

    deep: true,

    /**
     * Bind watcher for update translation on language changing
     */
    bind: function () {
      const vm = this.vm
      this.unwatch = vm.$watch('$store.state.' + config.vuexStoreModuleName + '.currentLanguage', bind(this.updateContent, this))
    },

    /**
     * Unbind watcher
     */
    unbind: function () {
      this.unwatch && this.unwatch()
    },

    /**
     * Render element with directive
     */
    update: function (target) {
      this.path = target.path
      this.vars = target.vars
      this.lang = target.lang
      var translateTo = target.lang || _currentLanguage()
      var translation = translate(target.path, target.vars, translateTo)
      this.el.innerHTML = translation
    },

    /**
     * Update element innerHTML on language changing
     */
    updateContent: function (newLang) {
      var translateTo = this.lang || newLang
      var translation = translate(this.path, this.vars, translateTo)
      this.el.innerHTML = translation
    }

  })
}

var plugin = {
  install
}

export default plugin
