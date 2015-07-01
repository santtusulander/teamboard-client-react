import page            from 'page';
import Action          from '../../actions';
import UserAction      from '../../actions/user';
import BroadcastAction from '../../actions/broadcast';

import SettingsStore   from '../../stores/settings';
import UserStore       from '../../stores/user';
/**
 *
 */
export default
	{
		registerForm: {
			fields: [
				{
					name:     'email',
					type:     'email',
					label:    SettingsStore.getSetting('locale').AUTH_LABEL_EMAIL,
					required: true
				},
				{
					name:     'passwordRegister',
					type:     'password',
					label:    SettingsStore.getSetting('locale').AUTH_LABEL_PASSWORD,
					title:    'Minimum of 8 characters required.',
					pattern:  '.{8,}',
					required: true
				},
				{
					name:     'passwordAgain',
					type:     'password',
					label:    SettingsStore.getSetting('locale').AUTH_LABEL_PWCONFIRM,
					title:    'Minimum of 8 characters required.',
					pattern:  '.{8,}',
					required: true
				}
			],
			secondary: {
				submit: () => {
					return page.show('/login');
				},
				action:      SettingsStore.getSetting('locale').AUTH_HEADER_LOGIN,
				description: SettingsStore.getSetting('locale').AUTH_MESSAGE_ALREADYREGISTERED
			},
			submit: (state) => {
				return UserAction.register(state).then(() => {
					return UserAction.login(state).then(() => {
						BroadcastAction.add({
							type:    'broadcast',
							content: 'Welcome!'
						});
						return page.show('/boards');
					});
				});
			},
			help:   'Passwords must be at least 8 characters long.',
			action: SettingsStore.getSetting('locale').AUTH_LABEL_REGISTER
		},
		loginForm: {
			fields: [
				{
					name:     'email',
					type:     'email',
					label:    SettingsStore.getSetting('locale').AUTH_LABEL_EMAIL,
					required: true
				},
				{
					name:     'password',
					type:     'password',
					label:    SettingsStore.getSetting('locale').AUTH_LABEL_PASSWORD,
					required: true
				}
			],
			secondary: {
				submit: () => {
					return page.show('/register');
				},
				action:      SettingsStore.getSetting('locale').AUTH_HEADER_REGISTER,
				description: SettingsStore.getSetting('locale').AUTH_MESSAGE_NOTREGISTERED
			},
			submit: (state) => {
				return UserAction.login(state).then(() => {
					return page.show('/boards');
				});
			},
			action: SettingsStore.getSetting('locale').AUTH_HEADER_LOGIN
		},
	guestLoginForm: {
		fields: [
			{
				name:     'username',
				type:     'text',
				label:    SettingsStore.getSetting('locale').AUTH_LABEL_USERNAME,
				title:    'Username must be at least 3 characters.',
				pattern:  '.{3,}',
				required: true
			}
		],
		secondary: {
			submit: (formType, boardID, accessCode) => {

				if(UserStore.getToken()) {
					return UserAction.giveBoardAccess(boardID, accessCode).then(() => {
						return page.show(`/boards/${boardID}`);
					}, (err) => {console.log(err)});
				}
				else {
					return page.show(`/userlogin/boards/${boardID}/access/${accessCode}`);
				}
			},
			action:      SettingsStore.getSetting('locale').AUTH_LABEL_LOGIN,
			description: SettingsStore.getSetting('locale').AUTH_MESSAGE_ALREADYREGISTERED
		},
		submit: (state, boardID, accessCode) => {
			let credentials = Object.assign(state, {
				boardID:    boardID,
				accessCode: accessCode
			});
			return UserAction.login(credentials, true).then(() => {
				return page.show(`/boards/${boardID}`);
			}, (err) => {});
		},
		action: 'Login as Guest'
	},
	userAccessForm: {
		fields: [
			{
				name:     'email',
				type:     'email',
				label:    SettingsStore.getSetting('locale').AUTH_LABEL_EMAIL,
				required: true
			},
			{
				name:     'password',
				type:     'password',
				label:    SettingsStore.getSetting('locale').AUTH_LABEL_PASSWORD,
				required: true
			}
		],
		submit: (state, boardID, accessCode) => {
			return UserAction.login(state).then(() => {
				return UserAction.giveBoardAccess(boardID, accessCode).then(() => {
					return page.show(`/boards/${boardID}`);
				}, (err) => {console.log(err)});

			}, (err) => {
				return page.redirect(`/boards/${boardID}/access/${accessCode}`)
			});

		},
		action: SettingsStore.getSetting('locale').AUTH_HEADER_LOGIN
	}
	}

