import React      from 'react/addons';
import Hammer     from 'hammerjs';
import TweenState from 'react-tween-state';

import gridify   from '../utils/gridify';
import doubletap from '../utils/doubletap';

import Ticket       from '../models/ticket';
import TicketAction from '../actions/ticket';

import DraggableMixin   from '../mixins/draggable';
import EditTicketDialog from '../components/dialog/edit-ticket';

/**
 * Tickets are those movable little things on the board.
 */
export default React.createClass({
	mixins: [DraggableMixin, TweenState.Mixin ],

	propTypes: {
		ticket: (props) => {
			if(!props.ticket instanceof Ticket) throw new Error();
		},
		snap:  React.PropTypes.bool,
		board: React.PropTypes.string.isRequired
	},

	getDefaultProps() {
		return { snap: false }
	},

	getInitialState() {
		return {
			x: this.props.ticket.position.x,
			y: this.props.ticket.position.y,
			showEditDialog: false
		}
	},

	componentDidMount() {
		this.hammer = doubletap(this.getDOMNode());
		this.hammer.on('doubletap', this.toggleEditDialog);

		this.draggable.on('dragEnd', () => {
			let position = this.draggable.position;

			if(this.state.x === position.x && this.state.y === position.y) {
				return;
			}

			// Snap the position if necessary...
			position = this.props.snap ? gridify(position) : position;

			// If we are snapping the ticket, we 'tween' the position to the
			// end value, else we just set the state directly.
			if(this.props.snap) {
				this.tween(position, this.draggable.position, 100);
			}
			else this.setState({ x: position.x, y: position.y });

			TicketAction.update({ id: this.props.board }, {
				id:       this.props.ticket.id,
				position: { x: this.state.x, y: this.state.y }
			});
		});
	},

	componentWillUnmount() {
		this.hammer.destroy();
		this.hammer = null;
	},

	componentWillReceiveProps(next) {
		// Prevent tweening, if there is a 'drag' currently going on.
		if(this.state.isDragging) return;

		// Prevent unnecessary tweening.
		if(this.state.x === next.ticket.position.x &&
		   this.state.y === next.ticket.position.y) {
			return;
		}
		return this.tween(next.ticket.position);
	},

	toggleEditDialog() {
		this.setState({ showEditDialog: !this.state.showEditDialog });
	},

	/**
	 *
	 */
	tween(to, from, duration) {
		['x', 'y'].map((axis) => {
			let tweeningOpts = {
				duration:   duration || 500,
				endValue:   to[axis],
				beginValue: from ? from[axis] : null,
			}
			return this.tweenState(axis, tweeningOpts);
		});
	},

	render() {
		// console.debug('component/ticket::render');

		let style = {
			ticket: {
				top:    this.getTweeningValue('y'),
				left:   this.getTweeningValue('x'),
				zIndex: this.props.ticket.position.z
			},
			color: {
				backgroundColor: this.props.ticket.color
			}
		}

		let editTicketDialog = !this.state.showEditDialog ? null : (
			<EditTicketDialog board={this.props.board} ticket={this.props.ticket}
				onDismiss={this.toggleEditDialog} />
		);

		return (
			<div className="ticket" style={style.ticket}>
				<div className="color" style={style.color} />
				<div className="content">
					{this.props.ticket.content}
				</div>
				{editTicketDialog}
			</div>
		);
	},
});
