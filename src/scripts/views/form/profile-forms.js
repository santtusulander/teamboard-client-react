import page            from 'page';
import UserAction      from '../../actions/user';
import BroadcastAction from '../../actions/broadcast';
import listener        from '../../mixins/listener';
import SettingsStore   from '../../stores/settings';
/*
 *
 */

export default {
		mixins: [listener(SettingsStore)],
		fieldNames: [
			'oldPassword',
			'newPassword',
			'newPasswordAgain',
			'name',
			'currentView',
			'avatar'
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
					action:    SettingsStore.getSetting('locale').DONEBUTTON
				}
			],
			submit: (state) => {
				return UserAction.updatePassword(state.newPassword, state.oldPassword).then(() => {
					BroadcastAction.add({
						type:    'broadcast',
						content: 'Success!'
					});
				}).catch(() => {});
			},
			action: 'Save changes'
		},
		profileSettings: {
			title: SettingsStore.getSetting('locale').PROFILE_INFO,
			fields: [
				{
					name:     'avatar',
					type:     'avatar',
					title:    'Your avatar:',
					label:    'Enter an URL to an image',
				},
				{
					type:     'email',
					title:    'Your username:'
				},
				{
					name:     'name',
					type:     'text',
					label:    'Enter a username'
				},
				{
					name:     'submitProfile',
					type:     'submit',
					className: 'btn-primary',
					action:    'Modify Profile'
				}
			],
			submit: (state) => {
				return UserAction.updateUser(state.name, state.avatar).then(() => {
					BroadcastAction.add({
						type:    'broadcast',
						content: 'Success!'
					});
				}).catch(() => {});
			},
			action: 'Save changes'
		},
	linkItems: [
			{
				activeWhile: '',
				icon: 'arrow-left',
				name: 'Workspace',
				onClick: () => {
					return page.show('/boards');
				}
			},
			{
				activeWhile: 'profileSettings',
				name: 'Profile settings',
				onClick: () => {
					return page.show('/profile');
				}
			},
			{
				activeWhile: 'loginSettings',
				name: 'Password',
				onClick: () => {
					return page.show('/profile/login');
				}
			}
	]
}