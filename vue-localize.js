import { kebabCase, replace, join, split, each } from 'lodash'

/*

@options explanation:

@storage                            - an instance of a vuex storage

@translations             - object  - an object with application phrases and their translations

@defaultContextName       - String  - name of the default context in object with translations

@fallbackLanguage         - string  - code of the language into which to translate
                                      if the translation to requested language wasn't found.
                                      If there is no translation to the fallback language, will be
                                      returned the "_uT_" prefix (undefined translation), concatenated
                                      with the phrase key. Example:
                                          for phrase {{ 'hello' | translate }} will bw returned "_uT_hello"

@fallbackOnNoTranslation  - boolean - defines the plugin behaviour if there are no translation for target language
                                      if true - will be returned the translation into fallback language, else -
                                      the string key concatenated from the prefix '_uT_' and the name of the phrase key.
                                      May be useful on production environment if there are incomplete translations into some languages

@supressWarnings          - boolean - set to true if need to disable warnings on development environment
                                      to prevent console littering. It is recommended to set this option to false when
                                      validating and testing application after development. It helps you to find
                                      places in code where something related to localization is missing
                                      (context, key or translation)

*/

function install (Vue, options) {
  var {
    store,
    translations,
    defaultContextName = 'global',
    fallbackLanguage = 'en',
    fallbackOnNoTranslation = false,
    supressWarnings = false
  } = options

  const {
    bind
  } = Vue.util

  /**
   * Translates the key into the current language or into the language received in 'lang' param
   *
   * @param   {String} key
   * @param   {String} context
   * @param   {Object} vars
   * @param   {string} lang
   * @return  {String}
   */
  function translate (key, context = defaultContextName, vars = null, lang = null) {
    var lc = store.state.i18n.languageCurrent
    var translateTo = lang || lc

    var isContext = translations.hasOwnProperty(context)
    if (!isContext) {
      if (!supressWarnings) {
        console.warn('VueLocalize. Undefined context: "' + context + '"')
      }

      return '_uC_' + key
    }

    var isKey = translations[context].hasOwnProperty(key)
    if (!isKey) {
      if (!supressWarnings) {
        console.warn('VueLocalize. Undefined key: "' + context + '.' + key + '"')
      }

      return '_uK_' + key
    }

    var isTranslation = translations[context][key].hasOwnProperty(translateTo)
    if (isTranslation) {
      var translation = translations[context][key][translateTo]
      var targetPath = context + '.' + key + '.' + translateTo
      return _processVariables(translation, vars, targetPath)
    }

    if (!supressWarnings) {
      console.warn('VueLocalize. Undefined translation: "' + context + '.' + key + '.' + translateTo + '"')
    }

    var keyToReturn = '_uT_' + key

    if (!fallbackOnNoTranslation) {
      return keyToReturn
    }

    if (translateTo === fallbackLanguage) {
      return keyToReturn
    }

    var isFallbackTranslation = translations[context][key].hasOwnProperty(fallbackLanguage)
    if (!isFallbackTranslation) {
      return keyToReturn
    }

    var fallbackTranslation = translations[context][key][fallbackLanguage]
    var fallbackPath = context + '.' + key + '.' + fallbackLanguage
    return _processVariables(fallbackTranslation, vars, fallbackPath)
  }

  function _processVariables (translation, vars, path) {
    var arrVars = translation.match(/%[a-z]*%/g)
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

    var unreplacedVars = translation.match(/%[a-z]*%/g)
    if (unreplacedVars) {
      _logUnreplacedVars(unreplacedVars, path)
    }

    return translation
  }

  function _logUnreplacedVars (vars, path) {
    if (!supressWarnings) {
      console.warn('VueLocalize. Unreplaced: ' + join(vars, ', ') + ' in "' + path + '"')
    }
  }

  var helpers = { translate }

  each(helpers, function (helper, name) {
    Vue.filter(kebabCase(name), helper)
    Vue.prototype['$' + name] = helper
  })

  Vue.directive('localize', {
    // twoWay: true,
    deep: true,
    bind: function () {
      const vm = this.vm
      this.unwatch = vm.$watch('$store.state.i18n.languageCurrent', bind(this.updateContent, this))
    },
    unbind: function () {
      this.unwatch && this.unwatch()
    },
    update: function (target) {
      var lc = store.state.i18n.languageCurrent
      // target.lang = lc

      if (target.path) {
        var pathParts = split(target.path, '.')
        this.key = pathParts[1]
        this.context = pathParts[0] || null
        var translation = translate(this.key, this.context, null, lc)
      }

      console.log(translation)
      // this.el.innerHTML = translations[context][key][lc]
      this.el.innerHTML = translation
      // translate('huy')
    },
    updateContent: function (c) {
      this.el.innerHTML = translations[this.context][this.key][c]
    }
  })
}

var plugin = {
  install
}

export default plugin
