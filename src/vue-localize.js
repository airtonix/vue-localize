import { kebabCase, replace, join, split, each, get, set, unset, clone, cloneDeep } from 'lodash'
import { currentLanguage } from './vuex-getters'
import { localizeVueDirective } from './vue-localize-directive'
import { has } from './libs/utils'

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
export default function install (Vue, options) {
  /**
   * @store           {Object} - an instance of a vuex storage
   * @config          {Object} - config object
   * @routesRegistry  {Object} - registry of a routes (with initial names and localized names)
   */
  var { store, config, router, routes } = options
  const VARIABLES_REGEXP = /%[a-zA-Z0-9_-]*%/g
  const { bind } = Vue.util

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
   * Recursive renaming subroutes
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

  /**
   * Object with VueLocalize config
   */
  Vue.prototype['$localizeConf'] = config

  Vue.prototype['$vueLocalizeInit'] = (route) => {
    var initialLanguage = has(route, 'localized') ? route.lang : getFromLocalStorage()
    if (initialLanguage) {
      store.dispatch('SET_APP_LANGUAGE', initialLanguage, config.resaveOnLocalizedRoutes)
    }
  }

  /**
   * Localize route name by adding prefix (e.g. 'en_') with language code.
   */
  Vue.prototype['$localizeRoute'] = (name, lang = null) => {
    if (!has(routesRegistry.initial, name)) {
      return name
    }

    var prefix = (lang || _currentLanguage()) + '_'
    return prefix + name
  }

  Vue.prototype['$localizeRoutePath'] = (route, newLang) => {
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

  Vue.prototype['$isJustLanguageSwitching'] = (transition) => {
    return transition.from.originalName === transition.to.originalName
  }

  const translator = new Translator(config, _currentLanguage)
  const translate = translator.translate
  // Adding global filter and global method $translate
  each({ translate }, function (helper, name) {
    Vue.filter(kebabCase(name), helper)
    Vue.prototype['$' + name] = helper
  })

  // Adding directive
  Vue.directive('localize', localizeVueDirective(translator))
}
