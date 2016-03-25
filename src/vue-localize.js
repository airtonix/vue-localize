import { kebabCase, replace, join, split, each, has, get, set, unset, clone, cloneDeep } from 'lodash'
import { currentLanguage } from './vuex-getters'

// @todo by Saymon: pick out into config
var localStorageKey = 'currentLanguage'

function saveLanguageToLocalStorage (lang) {
  window.localStorage.setItem(localStorageKey, lang)
}

function getFromLocalStorage () {
  return window.localStorage.getItem(localStorageKey)
}

//
// ******************************************************************
//                          VUEX STORE MODULE                      //
// ******************************************************************
//

/**
 * Mutation for switching applcation language
 */
const SET_APP_LANGUAGE = 'SET_APP_LANGUAGE'

const state = {
  currentLanguage: null
}

const mutations = {
  /**
   * @state {Object}
   * @lang {String}
   */
  [SET_APP_LANGUAGE] (state, lang, saveToLocalStorage = true) {
    state.currentLanguage = lang
    if (saveToLocalStorage) {
      saveLanguageToLocalStorage(lang)
    }
  }
}

/**
 * Export Vuex store module
 */
export const vueLocalizeVuexStoreModule = {
  state,
  mutations
}

//
// ******************************************************************
//                               PLUGIN                            //
// ******************************************************************
//

/**
 * @Vue     {Object} - Vue
 * @options {Object} - plugin options
 */
function install (Vue, options) {
  /**
   * @store           {Object} - an instance of a vuex storage
   * @config          {Object} - config object
   * @routesRegistry  {Object} - registry of a routes (with initial names and localized names)
   */
  var { store, config, router, routes } = options
  const VARIABLES_REGEXP = /%[a-z]*%/g
  const {
    bind
  } = Vue.util

  Vue.mixin({
    vuex: {
      getters: {
        currentLanguage: currentLanguage
      }
    }
  })

  store.dispatch('SET_APP_LANGUAGE', config.defaultLanguage, false)

  var idIncrement = 0
  var routesComponents = {}
  var routesRegistry = {initial: {}, localized: {}}

  /**
   * Returns current selected application language
   * @return {String}
   */
  function _currentLanguage () {
    return store.state.vueLocalizeVuexStoreModule.currentLanguage
  }

  /**
   * Recursive renaming subrouts
   */
  function _localizeSubroutes (subroutes, lang, routesRegistry) {
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
   * Recursive action call
   */
  function _recursively (object, action, isRoot = true) {
    each(object, function (value, key) {
      if (isRoot === true && !has(value, 'localized')) {
        return
      }

      action(key, value)
      if (has(value, 'subRoutes')) {
        _recursively(value.subRoutes, action, false)
      }
    })
  }

  /**
   * Assign route id
   */
  function _identicateRoutes (path, routeConfig) {
    set(routeConfig, 'vueLocalizeId', idIncrement)
    idIncrement++
  }

  /**
   * Add component into separate object by previously assigned route id
   */
  function _collectComponents (path, routeConfig) {
    set(routesComponents, routeConfig.vueLocalizeId, {})
    set(routesComponents[routeConfig.vueLocalizeId], 'component', routeConfig.component)
  }

  /**
   * Detach component from route
   */
  function _detachComponents (path, routeConfig) {
    unset(routeConfig, 'component')
  }

  function _attachComponents (path, routeConfig) {
    set(routeConfig, 'component', routesComponents[routeConfig.vueLocalizeId].component)
  }

  /**
   * Localization of routes
   */
  function localizeRoutes (routes, config) {
    _recursively(routes, _identicateRoutes)
    _recursively(routes, _collectComponents)
    _recursively(routes, _detachComponents)

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

      each(config.languages, function (langConfig, lang) {
        if (!langConfig.enabled) {
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
        if (config.defaultLanguageRoute === false) {
          prefix = config.defaultLanguage !== lang ? lang : ''
        }

        var newPath = '/' + prefix + suffix
        newNode.lang = lang

        var subs = cloneDeep(objSubs)
        var subroutesLocalized = _localizeSubroutes(subs, lang, routesRegistry)
        newNode.subRoutes = subroutesLocalized
        set(routes, newPath, newNode)
      })
    })

    _recursively(routes, _attachComponents)

    return routes
  }

  var routesMap = localizeRoutes(routes, config)
  router.map(routesMap)

  router.beforeEach(function (transition) {
    if (transition.to.localized) {
      /* prevent unnecessary mutation call  */
      if (_currentLanguage() !== transition.to.lang) {
        store.dispatch('SET_APP_LANGUAGE', transition.to.lang, config.resaveOnLocalizedRoutes)
      }
    } else if (transition.from.localized === true && !config.resaveOnLocalizedRoutes) {
      // Restore memorized language from local storage for not localized routes
      var localStoredLanguage = getFromLocalStorage()
      if (localStoredLanguage && /* prevent unnecessary mutation call  */ transition.from.lang !== localStoredLanguage) {
        store.dispatch('SET_APP_LANGUAGE', localStoredLanguage, false)
      }
    }

    transition.next()
  })

  function init (route) {
    var initialLanguage = has(route, 'localized') ? route.lang : getFromLocalStorage()
    if (initialLanguage) {
      store.dispatch('SET_APP_LANGUAGE', initialLanguage, config.resaveOnLocalizedRoutes)
    }
  }
  Vue.prototype['$vueLocalizeInit'] = init

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
   */
  function localizeRoute (name, lang = null) {
    if (!has(routesRegistry.initial, name)) {
      return name
    }

    var prefix = (lang || _currentLanguage()) + '_'
    return prefix + name
  }
  Vue.prototype['$localizeRoute'] = localizeRoute

  function localizeRoutePath (route, newLang) {
    var path = route.path
    var name = route.name

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
  Vue.prototype['$localizeRoutePath'] = localizeRoutePath

  function isJustLanguageSwitching(transition) {
    return transition.from.originalName === transition.to.originalName
  }
  Vue.prototype['$isJustLanguageSwitching'] = isJustLanguageSwitching

  /**
   * Object with VueLocalize config
   */
  Vue.prototype['$localizeConf'] = config

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
      this.unwatch = vm.$watch('$store.state.vueLocalizeVuexStoreModule.currentLanguage', bind(this.updateContent, this))
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
