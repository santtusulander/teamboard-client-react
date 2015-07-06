import React		from 'react/addons';
import Carousel		from 'nuka-carousel';
import Dialog		from '../../components/dialog';
import TextBoxes	from './text-box';
import Dropdown 	from '../dropdown';

import SettingsStore   from '../../stores/settings';

/**
 *
 */

export default React.createClass({
	mixins: [ Carousel.ControllerMixin ],
	getInitialState(){
		return { currentSlide: null }
	},

	componentDidMount() {
		localStorage.setItem('infovisited', true);
		this.el = document.getElementById('application');
		this.el.className = 'info-view-active';
		this.avatar = document.getElementById('avatar');
		this.infobutton = document.getElementById('info');
		this.infobutton.className = 'infobutton active';
	},

	componentWillUnmount() {
		this.el.className = '';
	},

	componentDidUpdate(){
		this.el.className =
			`info-view-active slide-${this.state.carousels.carousel.state.currentSlide}`;
	},

	render() {
		let dropitems = [
			{ icon: 'user',     content: SettingsStore.getSetting('locale').DROPDOWN_PROFILE },
			{ icon: 'language', content: SettingsStore.getSetting('locale').DROPDOWN_LOCALE  },
			{ icon: 'bullhorn', content: SettingsStore.getSetting('locale').DROPDOWN_FEEDBACK  },
			{ icon: 'sign-out', content: SettingsStore.getSetting('locale').DROPDOWN_LOGOUT  }
		];

		/*
		Second layer arrays represent the slides. First one of the
		third layer arrays contain anything other than textbox-components
		while the second ones contain the textboxes' props.
		*/
		let objects = [
			[
				[ <Dropdown className='infodrop' show={true} items={dropitems} /> ],
				[
					{ content: SettingsStore.getSetting('locale').INFO_TOWS, className: 'pos-back' },
					{ content: SettingsStore.getSetting('locale').INFO_EDITBOARD, className:'pos-edit' },
					{ content: SettingsStore.getSetting('locale').INFO_SHAREBOARD, className:'pos-share' },
					{ content: SettingsStore.getSetting('locale').INFO_EXPORTBOARD, className:'pos-export' },
					{ content: SettingsStore.getSetting('locale').INFO_SNAP, className:'pos-magnet' },
					{ content: SettingsStore.getSetting('locale').INFO_MINIMAP, className:'pos-minimap' },
					{ content: SettingsStore.getSetting('locale').INFO_PROFILE, className:'pos-profile' },
					{ content: SettingsStore.getSetting('locale').INFO_LOCALE, className:'pos-localization' },
					{ content: SettingsStore.getSetting('locale').INFO_FEEDBACK, className:'pos-feedback' },
					{ content: SettingsStore.getSetting('locale').INFO_LOGOUT, className:'pos-logout' }
				]
			],
			[
				[ <img draggable="false" className="imgTicket" src="/dist/assets/img/ticket.png"/>,
				<img draggable="false" className="imgEditTicket" src="/dist/assets/img/edit-ticket.png"/> ],
				[
					{ content: SettingsStore.getSetting('locale').INFO_TAPBOARD, className: 'pos-click' },
					{ content: SettingsStore.getSetting('locale').INFO_TAPTICKET, className:'pos-ticket' },
					{ content: SettingsStore.getSetting('locale').INFO_TICKETCOLOR, className:'pos-color' },
					{ content: SettingsStore.getSetting('locale').INFO_EDITTICKET, className:'pos-content' }
				]
			],
			[
				[ <img draggable="false" className="imgInfo" src="/dist/assets/img/edit-board.png"/> ],
				[
					{ content: SettingsStore.getSetting('locale').INFO_EDITNAME, className: 'pos-boardname' },
					{ content: SettingsStore.getSetting('locale').INFO_PREVIEWBOARD, className:'pos-boardpreview' },
					{ content: SettingsStore.getSetting('locale').INFO_EDITBG, className:'pos-boardbg' },
					{ content: SettingsStore.getSetting('locale').INFO_CHANGESIZE, className:'pos-boardmeasures' }
				]
			],
			[
				[ <img draggable="false" className="imgInfo" src="/dist/assets/img/share-board.png"/> ],
				[
					{ content: SettingsStore.getSetting('locale').INFO_SHAREURL, className: 'pos-format' }
				]
			],
			[
				[ <img draggable="false" className="imgInfo" src="/dist/assets/img/export-board.png"/> ],
				[
					{ content: SettingsStore.getSetting('locale').INFO_GETEXPORT, className: 'pos-format' }
				]
			]
		];

		return (
			<Dialog className="info" viewProfile="info"
					onDismiss={this.props.onDismiss}>
				<Carousel ref="carousel" className="infocarousel"
					data={this.setCarouselData.bind(this, 'carousel')}>

					{objects.map((item) => {
					return (
					<div>
						<TextBoxes items={item[1]} objects={item[0]}/>
					</div>
					);
				})}
				</Carousel>
			</Dialog>
		);
	}
});
