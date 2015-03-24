import React     from 'react/addons';
import immutable from 'immutable';

import Ticket       from '../../models/ticket';
import TicketAction from '../../actions/ticket';

import Dialog      from '../../components/dialog';
import ColorSelect from '../../components/color-select';

/**
 *
 */
export default React.createClass({
	mixins: [ React.addons.LinkedStateMixin ],

	propTypes: {
		ticket: (props) => {
			if(!props.ticket instanceof Ticket) throw new Error();
		},
		board:     React.PropTypes.string.isRequired,
		onDismiss: React.PropTypes.func.isRequired
	},

	// shouldComponentUpdate(props, state) {

	// },

	getInitialState() {
		return {
			color:   this.props.ticket.color,
			content: this.props.ticket.content,
		}
	},

	remove() {
		TicketAction.delete({ id: this.props.board }, {
			id: this.props.ticket.id
		});
		return this.props.onDismiss();
	},

	update() {
		TicketAction.update({ id: this.props.board }, {
			id:      this.props.ticket.id,
			color:   this.state.color,
			content: this.state.content
		});
		return this.props.onDismiss();
	},

	render() {
		return (
			<Dialog className="edit-ticket-dialog" onDismiss={this.props.onDismiss}>
				<section className="dialog-header">
					<ColorSelect color={this.linkState('color')} />
				</section>
				<section className="dialog-content">
					<textarea valueLink={this.linkState('content')} />
				</section>
				<section className="dialog-footer">
					<button className="btn-danger" onClick={this.remove}>
						Delete
					</button>
					<button className="btn-primary" onClick={this.update}>
						Done
					</button>
				</section>
			</Dialog>
		);
	}
});
