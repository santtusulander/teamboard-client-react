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
			title: 'PROFILE_SETTINGS',
			fields: [
				{
					name:     'oldPassword',
					type:     'password',
					label:    'PROFILE_CURRENTPW',
					pattern:  '.{8,}',
					required: true
				},
				{
					name:     'newPassword',
					type:     'password',
					label:    'PROFILE_NEWPW',
					pattern:  '.{8,}',
					required: true
				},
				{
					name:     'newPasswordAgain',
					type:     'password',
					label:    'PROFILE_CONFPW',
					pattern:  '.{8,}',
					required: true
				},
				{
					name:     'submitPassword',
					type:     'submit',
					className: 'btn-primary',
					text:    'DONEBUTTON'
				}
			],
			submit: (state) => {
				return UserAction.updatePassword(state.newPassword, state.oldPassword).then(() => {
					BroadcastAction.add({
						type:    'broadcast',
						content: 'SUCCESS'
					});
				}).catch(() => {});
			}
		},
		profileSettings: {
			title: 'PROFILE_INFO',
			fields: [
				{
					name:     'avatar',
					type:     'avatar',
					title:    'PROFILE_YOURAVATAR',
					label:    'PROFILE_ENTERURL',
				},
				{
					type:     'myEmail',
					title:    'PROFILE_YOURNAME',
				},
				{
					name:     'name',
					type:     'text',
					label:    'PROFILE_ENTERNAME',
				},
				{
					name:     'submitProfile',
					type:     'submit',
					className: 'btn-primary',
					text:    'DONEBUTTON',
				}
			],
			submit: (state) => {
				return UserAction.updateUser(state.name, state.avatar).then(() => {
					BroadcastAction.add({
						type:    'broadcast',
						content: 'SUCCESS'
					});
				}).catch(() => {});
			}
		},
	linkItems: [
			{
				activeWhile: '',
				icon: 'arrow-left',
				name: 'PROFILE_WORKSPACE',
				onClick: () => {
					return page.show('/boards');
				}
			},
			{
				activeWhile: 'profileSettings',
				name: 'PROFILE_INFO',
				onClick: () => {
					return page.show('/profile');
				}
			},
			{
				activeWhile: 'loginSettings',
				name: 'PROFILE_SETTINGS',
				onClick: () => {
					return page.show('/profile/login');
				}
			}
	]
}