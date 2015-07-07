import SettingsStore from '../stores/settings';
import listener      from '../mixins/listener';

export default {
	mixins: [ listener(SettingsStore) ],
	getString(stringToGet) {
		return SettingsStore.getSetting('locale').stringToGet;
	}
}