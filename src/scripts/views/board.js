import page from 'page';
import React from 'react/addons';

import User  from '../models/user';
import Board from '../models/board';

import UserStore     from '../stores/user';
import BoardStore    from '../stores/board';
import SettingsStore from '../stores/settings';

import BoardAction     from '../actions/board';
import SettingsAction  from '../actions/settings';
import BroadcastAction from '../actions/broadcast';

import listener from '../mixins/listener';

import Control         from '../components/control';
import Scrollable      from '../components/scrollable';
import Navigation      from '../components/navigation';
import Broadcaster     from '../components/broadcaster';
import BoardComponent  from '../components/board';

import EditBoardDialog   from '../components/dialog/edit-board';
import ExportBoardDialog from '../components/dialog/export-board.js';
import ShareBoardDialog  from '../components/dialog/share-board';
import ReviewView        from '../components/dialog/review-view';

/**
 * Fix issues with iOS and IScroll not working together too well...
 */
function preventDefault(event) {
	return event.preventDefault();
}

/**
 *
 */
export default React.createClass({
	propTypes: {
		id: React.PropTypes.string.isRequired,
		user: (props) => {
			if(!props.user instanceof User) throw new Error();
		}
	},

	mixins: [
           listener(UserStore, BoardStore, SettingsStore)
	],

	onChange() {
		return this.setState(this.getState());
	},

	getState() {
		return {
			board:       BoardStore.getBoard(this.props.id) || new Board(),
			snapToGrid:  SettingsStore.getSetting('snap-to-grid'),
			showMinimap: SettingsStore.getSetting('show-minimap')
		}
	},

	getInitialState() {
		return Object.assign(this.getState(), {
			showEditBoardDialog:   false,
			showExportBoardDialog: false,
			showShareBoardDialog:  false,
			reviewActive:          false,
			selectMode:            false,
			reviewTickets:         [],
			pollHandle:            null
		});
	},

	componentWillMount() {
		this.setUserActivity({isActive: true, isPoll: false});
	},

	componentDidMount() {
		BoardAction.load(this.props.id);
		document.addEventListener('touchmove', preventDefault);

		// Poll server every 10 seconds to indicate we're still alive!
		let self = this;
		let handle = setInterval(function() {
                self.setUserActivity({isActive:true, isPoll:true})
                }, 10000);
		this.setState({pollHandle: handle});
	},

	// The componentWillUnmount handles exiting the board via the back button.
	componentWillUnmount() {
		if (this.state.pollHandle) {
			clearInterval(this.state.pollHandle);
		}
		this.setUserActivity({isActive: false, isPoll: false});
		document.removeEventListener('touchmove', preventDefault);
	},

	toggleEditBoardDialog() {
		this.setState({
			showEditBoardDialog: !this.state.showEditBoardDialog
		});
	},

	toggleExportBoardDialog() {
		this.setState({
			showExportBoardDialog: !this.state.showExportBoardDialog
		});
	},

	toggleReview() {
		if(this.sendTicketsForReview().length !== 0){
			this.setState({ reviewActive: !this.state.reviewActive });
		}
		else {
			BroadcastAction.add({
				type:    'broadcast',
				content: 'You do not have any tickets to review!'
			});
		}
	},

	toggleShareBoardDialog() {
		this.setState({
			showShareBoardDialog: !this.state.showShareBoardDialog
		});
	},
	setUserActivity(isActive, isPoll) {
		BoardAction.setUserBoardActivity(this.props.id, isActive, isPoll);
	},

	setReviewClosingButton(mode) {
		this.setState({
			reviewActive: mode
		})
	},

	setReviewTickets(ticket, setForReview) {
		let newArray = this.state.reviewTickets.slice();
		newArray.push(ticket);
		if(newArray.length > 0 && !setForReview){
			newArray = newArray.filter((item) => {
				return item.id !== ticket.id;
			})
		}
		this.setState({
			reviewTickets: newArray
		});
	},

	sendTicketsForReview() {
		let ticketsToFilter = this.state.reviewTickets.length !== 0 ?
			this.state.reviewTickets : BoardStore.getTickets(this.props.id).toJS();
			return ticketsToFilter.filter ((item) => {
				return item.content !== "" || item.heading !== "" || item.comments.length !== 0
			});
	},

	render() {
		let boardDialog = null;
		let reviewDialog = null;

		if(this.state.showEditBoardDialog) {
			boardDialog = <EditBoardDialog board={this.state.board}
                                    onDismiss={this.toggleEditBoardDialog} />
		} else if(this.state.showExportBoardDialog) {
			boardDialog = <ExportBoardDialog board={this.state.board}
                                    onDismiss={this.toggleExportBoardDialog} />

		} else if(this.state.showShareBoardDialog) {
			boardDialog = <ShareBoardDialog board={this.state.board}
                                    onDismiss={this.toggleShareBoardDialog} />
		}

		if(!this.state.reviewActive) {
			reviewDialog = null;
		} else {
			reviewDialog = <ReviewView tickets = {this.sendTicketsForReview()}
			onDismiss = { this.toggleReview } />;
		}

		return (
			<div className="view view-board">
				<Broadcaster />
				<Navigation reviewActive={this.state.reviewActive}
					killReview={this.setReviewClosingButton}
					showHelp={true} title={this.state.board.name}
					showBoardMembers={true} board={this.state.board} />
				<div className="content">
					<Scrollable board={this.state.board}
							minimap={this.state.showMinimap}>
						<BoardComponent selectMode={this.state.selectMode}
						setReviewTickets={this.setReviewTickets} board={this.state.board}
							snap={this.state.snapToGrid} />
					</Scrollable>
				</div>
				{boardDialog}
				{reviewDialog}
				{this.renderControls()}
			</div>
		);
	},

	/**
	 * TODO This is a mess, clean up the controls somehow?
	 * TODO Use immutable data to prevent constantly re-rendering the controls.
	 */
	renderControls() {
		let controls = [
			{
				icon:    'eye',
				active:  this.state.reviewActive,
				onClick: this.toggleReview
			},
			{
				icon:    'download',
				active:  this.state.showExportBoardDialog,
				onClick: this.toggleExportBoardDialog
			},
			{
				onClick: () => {
					SettingsAction.setSetting('snap-to-grid',
						!this.state.snapToGrid);
				},
				icon:   'magnet',
				active: this.state.snapToGrid
			},
			{
				onClick: () => {
					this.setState({
						selectMode: !this.state.selectMode
					});
				},
				icon:   'user',
				active: this.state.selectMode
			},
			{
				onClick: () => {
					SettingsAction.setSetting('show-minimap',
						!this.state.showMinimap);
				},
				icon:   'globe',
				active: this.state.showMinimap
			}
		];

		let userOnlyControls = [
			{
				onClick: () => {
					return page.show('/boards')
				},
				icon: 'arrow-left'
			}
			];

			let adminOnlyControls = [
			{
				icon:    'pencil',
				active:  this.state.showEditBoardDialog,
				onClick: this.toggleEditBoardDialog
			},
			{
				icon:    'share-alt',
				active:  this.state.showShareBoardDialog,
				onClick: this.toggleShareBoardDialog
			}


		];
		if(this.props.user.type === User.Type.User) {
			let currentRole    = BoardStore.getUserRole(this.state.board.id, this.props.user.id);
			if (currentRole === "admin") {
				controls = adminOnlyControls.concat(controls);
			}

			controls = userOnlyControls.concat(controls);

		}
		return (
			<div className="controls">
				{controls.map((control) => {
					return <Control key={control.icon} {...control} />;
				})}
			</div>
		);
	}
});
