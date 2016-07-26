import { Translator } from './libs/translate'
import { localizeVueDirective } from './directive';
import { has } from './libs/utils';
import { Storage } from './libs/storage';
import * as getters from './store/getters';
import * as actions from './store/actions';
import LanguageStore from './store';

export const Store = LanguageStore;
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
	const { store, config } = options;

	Vue.mixin({
		vuex: {
			actions,
			getters
		}
	});

	store.dispatch(types.SET_LANGUAGE, config.defaultLanguage, false);


	// Setup Translator Class
	const translator = new Translator(config, () => store.state.LocaleStore.currentLanguage);

	// Adding global filter and global method $translate
	const helpers = { translate: translator.translate };
	Object.keys(helpers)
		.forEach( (name) => {
			Vue.filter(name, helpers[name]);
			Vue.prototype['$' + name] = helpers[name];
		});

	// Make Translator Class available as a directive
	Vue.directive('localize', localizeVueDirective(translator));
}
