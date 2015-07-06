import SettingsStore from '../stores/settings';
import listener      from '../mixins/listener';

export default function(stringToGet) {
	listener(SettingsStore)
	return SettingsStore.getSetting('locale').stringToGet;

}