import page            from 'page';
import UserAction      from '../../actions/user';
import BroadcastAction from '../../actions/broadcast';
import SettingsStore   from '../../stores/settings';
/*
 *
 */

export default {
		stateVariables: [
			'oldPassword',
			'newPassword',
			'newPasswordAgain',
			'name',
			'currentView',
			'avatar',
			'locale'
		],
		loginSettings: {
			title: SettingsStore.getSetting('locale').PROFILE_SETTINGS,
			fields: [
				{
					name:     'oldPassword',
					type:     'password',
					label:    SettingsStore.getSetting('locale').PROFILE_CURRENTPW,
					pattern:  '.{8,}',
					required: true
				},
				{
					name:     'newPassword',
					type:     'password',
					label:    SettingsStore.getSetting('locale').PROFILE_NEWPW,
					pattern:  '.{8,}',
					required: true
				},
				{
					name:     'newPasswordAgain',
					type:     'password',
					label:    SettingsStore.getSetting('locale').PROFILE_CONFPW,
					pattern:  '.{8,}',
					required: true
				},
				{
					name:     'submitPassword',
					type:     'submit',
					className: 'btn-primary',
					text:    SettingsStore.getSetting('locale').DONEBUTTON
				}
			],
			submit: (state) => {
				return UserAction.updatePassword(state.newPassword, state.oldPassword).then(() => {
					BroadcastAction.add({
						type:    'broadcast',
						content: SettingsStore.getSetting('locale').SUCCESS
					});
				}).catch(() => {});
			}
		},
		profileSettings: {
			title: SettingsStore.getSetting('locale').PROFILE_INFO,
			fields: [
				{
					name:     'avatar',
					type:     'avatar',
					title:    SettingsStore.getSetting('locale').PROFILE_YOURAVATAR,
					label:    SettingsStore.getSetting('locale').PROFILE_ENTERURL,
				},
				{
					type:     'myEmail',
					title:    SettingsStore.getSetting('locale').PROFILE_YOURNAME,
				},
				{
					name:     'name',
					type:     'text',
					label:    SettingsStore.getSetting('locale').PROFILE_ENTERNAME,
				},
				{
					name:     'submitProfile',
					type:     'submit',
					className: 'btn-primary',
					text:    SettingsStore.getSetting('locale').DONEBUTTON,
				}
			],
			submit: (state) => {
				return UserAction.updateUser(state.name, state.avatar).then(() => {
					BroadcastAction.add({
						type:    'broadcast',
						content: SettingsStore.getSetting('locale').SUCCESS
					});
				}).catch(() => {});
			}
		},
	linkItems: [
			{
				activeWhile: '',
				icon: 'arrow-left',
				name: SettingsStore.getSetting('locale').PROFILE_WORKSPACE,
				onClick: () => {
					return page.show('/boards');
				}
			},
			{
				activeWhile: 'profileSettings',
				name: SettingsStore.getSetting('locale').PROFILE_INFO,
				onClick: () => {
					return page.show('/profile');
				}
			},
			{
				activeWhile: 'loginSettings',
				name: SettingsStore.getSetting('locale').PROFILE_SETTINGS,
				onClick: () => {
					return page.show('/profile/login');
				}
			}
	]
}