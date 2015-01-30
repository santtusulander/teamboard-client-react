'use strict';

var React  = require('react/addons');
var Hammer = require('hammerjs');

var SettingActions = require('../actions/setting');

var Setting = React.createClass({
	propTypes: {
		/**
		 * The 'icon' property indicates which Font Awesome icon to use.
		 */
		icon: React.PropTypes.string,

		/**
		 * The 'value' property is a simple on-off toggle for this control.
		 */
		value: React.PropTypes.bool.isRequired,
	},

	componentDidMount: function() {
		var key = this._currentElement.key;

		this.hammer = new Hammer(this.getDOMNode());

		this.hammer.on('tap', function toggle() {
			SettingActions.set(key, !(this.props.value));
		}.bind(this));
	},

	componentWillUnmount: function() {
		this.hammer.destroy();
		this.hammer = null;
	},

	render: function() {
		var classes = React.addons.classSet({
			'option': true,
			'active': this.props.value,
		});

		return (
			<div className={classes}>
				<i className={"fa fa-" + this.props.icon + " fa-fw fa-lg"} />
			</div>
		);
	}
});

module.exports = Setting;