export default {

  // ------------------------------------------------------------------------- GLOBAL
  'global': {

    projectName: {
      en: 'VueJS SPA sample',
      ru: 'Шаблон VueJS SPA'
    },

    defaultTitle: {
      en: '*en*',
      ru: '*ru*'
    },

    // ----------------------------------------------------------------------- GLOBAL . LANG
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

  // ------------------------------------------------------------------------- PUBPLIC
  public: {

    // ----------------------------------------------------------------------- PUBPLIC . HEADER
    header: {
      nav: {
        home: {
          en: 'Home',
          ru: 'Главная'
        },
        about: {
          en: 'About',
          ru: 'О проекте'
        },
        features: {
          en: 'Features',
          ru: 'Возможности'
        }
      },
      signIn: {
        en: 'Sign In',
        ru: 'Вход'
      },
      signUp: {
        en: 'Sign Up',
        ru: 'Регистрация'
      },
      account: {
        en: 'Account',
        ru: 'Кабинет'
      },
      unauth: {
        en: 'Without authentication',
        ru: 'Без аутентификации'
      }
    },

    // ----------------------------------------------------------------------- PUBPLIC . INDEX
    index: {
      title: {
        en: 'VueJS SPA Sample',
        ru: 'Шаблон SPA на VueJS'
      },
      jdesc: {
        en: 'This is an index page of the VueJS SPA boilerplate',
        ru: 'Это главная страница шаблона одностраничного приложения на Vue.js'
      },
      jp1: {
        en: 'This boilerplate implements such features as authentication, localization, routing, and other basic things, which are so essential in almost all modern applications',
        ru: 'В шаблоне реализованы такие функции как аутентификация, поддержка мультиязычности, роутинг, и многие другие базовые механизмы, необходимые практически во всех современных приложениях'
      },
      jp2: {
        en: 'Complete list of the features and ways of implementation %features_link%',
        ru: 'С подробным списком функций и предложенными вариантами реализации можно ознакомиться в разделе %features_link%'
      },
      jp3: {
        en: 'Click button below to login',
        ru: 'Воспользуйтесь кнопкой ниже чтобы перейти к форме входа'
      },
      jbtn: {
        en: 'Sign In',
        ru: 'Войти'
      }
    },

    // ----------------------------------------------------------------------- PUBPLIC . ABOUT
    about: {
      title: {
        en: 'About this sample',
        ru: 'Об этом шаблоне'
      }
    },

    // ----------------------------------------------------------------------- PUBPLIC . FEATURES
    features: {
      title: {
        en: 'Features',
        ru: 'Возможности'
      }
    },

    // ----------------------------------------------------------------------- PUBPLIC . ERROR_404
    err404: {
      title: {
        en: '404 - Not page found',
        ru: '404 - Страница не найдена'
      }
    },

    // ----------------------------------------------------------------------- PUBPLIC . ERROR_404
    signIn: {
      title: {
        en: 'Sign in',
        ru: 'Вход'
      }
    },

    // ----------------------------------------------------------------------- PUBPLIC . FEATURES_LIST
    ftr: {
      appStructure: {
        en: 'Application structure',
        ru: 'Структура приложения'
      },
      routing: {
        en: 'Routing',
        ru: 'Роутинг',

        transition: {
          en: 'Performing transition between pages vie VueRouter',
          ru: 'Осуществление переходов между страницами при помощи VueRouter'
        },
        page404error: {
          en: '404 error pages and redirecting',
          ru: 'Страницы 404 ошибки и редиректы'
        },
        navHighlighting: {
          en: 'Nav menu highlighting',
          ru: 'Подсветка навигационных меню'
        },
        titleChanging: {
          en: 'Page title changing (considering current language)',
          ru: 'Смена title страницы при при переходе (должно учитывать текущий язык)'
        },
        authRequiredCheck: {
          en: 'Check is it possible to go to the page which requires authentication. Redirect to login if no.',
          ru: 'Проверка возможности перехода к странице, требующей аутентификации. Редирект на форму входа при необходимости.'
        },
        goOutOpportunityCheck: {
          // en: '',
          ru: 'Проверка возможности ухода со страницы, например если есть какие-то незавершенные процессы или другие ситуации при которых нежелательно покидать страницу. Механизмы блокировки перехода и нотификации о нежелательном уходе'
        },
        languagePartInRoute: {
          en: 'Including language into route URI for indexing public section by searchengines',
          ru: 'Включение языкового параметра в URI роута для индексации поисковиками публичной части веб-проекта'
        },
        loadingDataFromServer: {
          en: 'Loading data for the page from server',
          ru: 'Загрузка данных с сервера при переходе на страницу'
        }
      },
      multilingual: {
        en: 'Multilingual',
        ru: 'Мультиязычность',

        plugin: {
          en: 'Wrapping localization support in a separate plugin "vue-localize" for VueJS',
          ru: 'Обертка поддержки мультиязычности в плагин "vue-localize" для VueJS'
        },
        languageSelector: {
          en: 'Language selector',
          ru: 'Селектор языка'
        },
        currLangAsVuexState: {
          en: 'Storing current language as an application-level state in a Vuex store',
          ru: 'Хранение текущего языка в хранилище состояний приложения Vuex'
        },
        fallbackLanguage: {
          en: 'Defining a fallback language for using if no translation',
          ru: 'Определение fallback языка для использования в случае отсутствия перевода на выбраный'
        },
        rememberInLocalStorage: {
          en: 'Remember selected language in a local storage of a browser',
          ru: 'Запоминание выбранного языка в локальном хранилище браузера'
        },
        currLangVuexGetter: {
          en: 'Getting current language inside vue component',
          ru: 'Получение кода текущего языка внутри компонеты Vue'
        },
        useFitler: {
          en: 'Translating phrases with a Vue filter',
          ru: 'Перевод фраз при помощи фильтра Vue'
        },
        useDirectCall: {
          en: 'Translating phrases with a direct call of plugin method',
          ru: 'Перевод фраз при помощи вызова метода плагина'
        },
        useDirective: {
          en: 'Translating phrases with a directive',
          ru: 'Перевод фраз при помощи директивы'
        },
        injectionVariables: {
          en: 'Injection passed variables into translation',
          ru: 'Внедрение в перевод значений переданных  переменных'
        },
        reactivePageTitleTranslation: {
          en: 'Reactive page title translation on language changing',
          ru: 'Реактивный перевод тайтла страницы при смене языка'
        },
        vueLocalizeNpm: {
          en: 'Pick out the VueLocalize plugin in a separate NPM package',
          ru: 'Вынести плагин VueLocalize в отдельный NPM пакет'
        }
      },
      authentication: {
        en: 'Authentication',
        ru: 'Аутентификация'
      },
      connectionCheck: {
        en: 'Internet connection control',
        ru: 'Контроль интернет соединения'
      },
      localStorageAndVuex: {
        en: 'Local storage + Vuex',
        ru: 'Local storage + Vuex'
      },
      apiRequestsQueue: {
        en: 'API requests queue',
        ru: 'Очередь запросов к API'
      },
      webSockets: {
        en: 'WebSockets',
        ru: 'Веб-сокеты'
      },
      apiClient: {
        en: 'API Client',
        ru: 'API клиент'
      }
    }
  },

  // ------------------------------------------------------------------------- ACCOUNT
  account: {

    // ----------------------------------------------------------------------- ACCOUNT . NAV
    nav: {
      home: {
        en: 'Home',
        ru: 'Главная'
      },
      profile: {
        en: 'Profile',
        ru: 'Профайл'
      },
      help: {
        en: 'Help',
        ru: 'Помощь'
      }
    },

    // ----------------------------------------------------------------------- ACCOUNT . HOME
    home: {
      title: {
        en: 'Dashboard',
        ru: 'Обзор'
      },
      helloText: {
        en: 'Hello! This is your account dashboard.',
        ru: 'Привет! Это гавная страница личного кабинета.'
      }
    },

    // ----------------------------------------------------------------------- ACCOUNT . PROFILE
    profile: {
      title: {
        en: 'User profile',
        ru: 'Профайл пользователя'
      }
    },

    // ----------------------------------------------------------------------- ACCOUNT . HELP
    help: {
      title: {
        en: 'Help',
        ru: 'Помощь'
      },
      variablesInjectionTest: {
        en: 'Some text in English, %foo%, and then the %bar% variable',
        ru: 'А теперь некоторый текст на русском, переменная %bar% и затем переменная %foo%'
      }
    }

  },

  // Features stauses
  fts: {
    backlog: {
      en: 'Backlog',
      ru: 'В очереди'
    },
    inwork: {
      en: 'In work',
      ru: 'В работе'
    },
    done: {
      en: 'Done!',
      ru: 'Готово!'
    }
  }

}
