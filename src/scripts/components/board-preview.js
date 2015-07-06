import page      from 'page';
import React     from 'react';
import immutable from 'immutable';

import Board        from '../models/board';
import BoardStore   from '../stores/board';
import UserStore    from '../stores/user';
import TicketAction from '../actions/ticket';

import Control           from '../components/control';
import Minimap           from '../components/minimap';
import EditBoardDialog   from '../components/dialog/edit-board';
import RemoveBoardDialog from '../components/dialog/remove-board';

/**
 *
 */
export default React.createClass({
	propTypes: {
		board: (props) => {
			if(!props.board instanceof Board) throw Error();
		}
	},

	getInitialState() {
		return {
			showEditBoardDialog:   false,
			showRemoveBoardDialog: false
		}
	},

	shouldComponentUpdate(nextProps, nextState) {
		let prevProps = this.props;
		let prevState = this.state;

		let havePropsChanged = (
			!immutable.is(prevProps.board, nextProps.board)
		);
		let hasStateChanged = (
			prevState.showEditBoardDialog   !== nextState.showEditBoardDialog ||
			prevState.showRemoveBoardDialog !== nextState.showRemoveBoardDialog
		);
		return havePropsChanged || hasStateChanged;
	},

	showBoard() {
		if(!this.props.board.id.startsWith('dirty_')) {
			return page.show(`/boards/${this.props.board.id}`);
		}
	},

	showDialog(dialog) {
		if(!this.props.board.id.startsWith('dirty_')) {
			this.setState({ [`show${dialog}`]: !this.state[`show${dialog}`] });
		}
	},

	render() {
		let board = this.props.board;

		let editBoardDialog = !this.state.showEditBoardDialog ? null : (
			<EditBoardDialog board={board}
				onDismiss={this.showDialog.bind(this, 'EditBoardDialog')} />
		);
		let removeBoardDialog = !this.state.showRemoveBoardDialog ? null : (
			<RemoveBoardDialog board={board}
				onDismiss={this.showDialog.bind(this, 'RemoveBoardDialog')} />
		);

		return (
			<div className="board-preview">
				<div className="minimap-container" onClick={this.showBoard}>
					<Minimap board={board} />
				</div>
				<div className="name" onClick={this.showBoard}>
					{board.name}
				</div>
				{editBoardDialog}
				{removeBoardDialog}
				{this.renderControls()}
			</div>
		);
	},

	renderControls() {
		let controls = [
			{
				icon:    'trash',
				active:  this.state.showRemoveBoardDialog,
				onClick: this.showDialog.bind(this, 'RemoveBoardDialog')
			},
			{
				icon:    'pencil',
				active:  this.state.showEditBoardDialog,
				onClick: this.showDialog.bind(this, 'EditBoardDialog')
			}
		];

		let boardAdmin = BoardStore.getBoardAdmin(this.props.board.id);
		let user       = UserStore.getUser();
		if (boardAdmin === undefined) {
			return;
		}
		if(boardAdmin && typeof boardAdmin.user === 'object' && typeof boardAdmin.user.get('id') !== 'undefined') {
			if(boardAdmin.user.get('id') === user.get('id'))  {
			return (
				<div className="controls">
					{controls.map(function(ctrl, index) {
						return <Control key={index} {...ctrl} />;
					})}
				</div>
			);
		}
		else {
			return (
				<div className="controls">
				<div className="ownedby">
					{'Owned by: ' + boardAdmin.user.get('username')}
				</div>
				</div>
			);
		}
		}
		else {
			return (
				<div className="controls">
					{controls.map(function(ctrl, index) {
						return <Control key={index} {...ctrl} />;
					})}
				</div>
			);
		}
	}
});
