import page            from 'page';
import React           from 'react';
import Action          from '../../actions';
import UserAction      from '../../actions/user';
import BroadcastAction from '../../actions/broadcast';

import SettingsStore   from '../../stores/settings';
import UserStore       from '../../stores/user';

const API_URL = process.env.API_URL || 'http://localhost:9002/api';
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
					label:    SettingsStore.getSetting('locale').EMAIL,
					required: true
				},
				{
					name:     'passwordRegister',
					type:     'password',
					label:    SettingsStore.getSetting('locale').PASSWORD,
					title:    'Minimum of 8 characters required.',
					pattern:  '.{8,}',
					required: true
				},
				{
					name:     'passwordAgain',
					type:     'password',
					label:    SettingsStore.getSetting('locale').PROFILE_CONFPW,
					title:    SettingsStore.getSetting('locale').LOGIN_PASSWORDLENGTH,
					pattern:  '.{8,}',
					required: true
				}
			],
			buttons: [
				{
					type: 'primary',
					text: SettingsStore.getSetting('locale').LOGIN_REGISTER,
					action: (state, props) => {
						if(state.passwordRegister === state.passwordAgain) {
							return UserAction.register(state).then(() => {
								return UserAction.login(state).then(() => {
									BroadcastAction.add({
										type:    'broadcast',
										content: 'Welcome!'
									});
									return page.show('/boards');
								});
							});
						}
						else {
							BroadcastAction.add({
								type:    'Error',
								content: SettingsStore.getSetting('locale').PASSWORDMISMATCH,
							});
							return event.preventDefault();
						}
					},
					help:   SettingsStore.getSetting('locale').LOGIN_PASSWORDLENGTH,
				},
				{
					type: 'secondary',
					text: SettingsStore.getSetting('locale').LOGIN_LOGIN,
					description: 'Already registered?',
					action: () => {
						return page.show('/login');
					}
				}
			],
			onEachFrame: (state, props) => {
				if(state.passwordAgain === '' && state.passwordRegister === '' || state.passwordAgain.length < 8) {
					return <span></span>;
				}
				return state.passwordAgain !== state.passwordRegister ?
					<span className="fa fa-times mismatch">
						{SettingsStore.getSetting('locale').PASSWORDMISMATCH}
					</span>
					: <span className="fa fa-check match">
						{SettingsStore.getSetting('locale').PASSWORDMATCH}
					</span>;
			}
		},
		loginForm: {
			fields: [
				{
					name:     'email',
					type:     'email',
					label:    SettingsStore.getSetting('locale').EMAIL,
					required: true
				},
				{
					name:     'password',
					type:     'password',
					label:    SettingsStore.getSetting('locale').PASSWORD,
					required: true
				}
			],
			buttons: [
				{
					type: 'primary',
					text: SettingsStore.getSetting('locale').LOGIN_LOGIN,
					action: (state, props) => {
						return UserAction.login(state).then(() => {
							return page.show('/boards');
						});
					}
				},
				{
					type: 'secondary',
					text: SettingsStore.getSetting('locale').LOGIN_REGISTER,
					description: 'Not registered?',
					action: () => {
						return page.show('/register');
					}
				},
			],
			socials: [
				{
					header: 'Google',
					url: API_URL + '/auth/google/login',
					logo: '/dist/assets/img/providers/google.png'
				}
			]
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
		buttons: [
			{
				type: 'primary',
				text: 'Login as Guest',
				action: (state, props) => {
					let credentials = Object.assign(state, {
						boardID:    props.boardID,
						accessCode: props.accessCode
					});
					return UserAction.login(credentials, true).then(() => {
						return page.show(`/boards/${boardID}`);
					}, (err) => {});
				}
			},
			{
				type: 'secondary',
				text: 'Login/Register',
				description: 'Got an account?',
				action: (state, props) => {
					if(UserStore.getToken()) {
						return UserAction.giveBoardAccess(props.boardID, props.accessCode).then(() => {
							return page.show(`/boards/${boardID}`);
						}, (err) => {console.log(err)});
					}
					else {
						return page.show(`/userlogin/boards/${boardID}/access/${accessCode}`);
					}
				}
			}
		]
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
		buttons: [
			{
				type: 'primary',
				text: SettingsStore.getSetting('locale').LOGIN_LOGIN,
				action: (state, boardID, accessCode) => {
					return UserAction.login(state).then(() => {
						return UserAction.giveBoardAccess(boardID, accessCode).then(() => {
							localStorage.removeItem('share_board');
							localStorage.removeItem('share_accessCode');
							return page.show(`/boards/${boardID}`);
						}, (err) => {console.log(err)});
					}, (err) => {
						return page.redirect(`/boards/${boardID}/access/${accessCode}`)
					});
				}
			}
		]
	}
}
