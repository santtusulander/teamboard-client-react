import React from 'react/addons';

import Board       from '../../models/board';
import BoardAction from '../../actions/board';
import Dialog      from '../../components/dialog';
import SettingsStore from '../../stores/settings';

/**
 *
 */
export default React.createClass({
    mixins: [ React.addons.PureRenderMixin, React.addons.LinkedStateMixin ],

    propTypes: {
        board: (props) => {
            if(!props.board instanceof Board) throw new Error();
        },
        onDismiss: React.PropTypes.func.isRequired
    },

    submit(event) {
        event.preventDefault();
        return this.props.onDismiss();
    },

    hide() {
        BoardAction.revokeAccessCode({ id: this.props.board.id });
    },

    share() {
        BoardAction.generateAccessCode({ id: this.props.board.id });

        window.setTimeout(this.highlight, 50);
    },

    highlight() {
        let input = this.refs.shareInput.getDOMNode();
        input.setSelectionRange(0, input.value.length);
    },

    render() {
        let id   = this.props.board.id;
        let code = this.props.board.accessCode;

        let sharedURL = code !== null && code.length > 0
            ? location.host + '/boards/' + id + '/access/' + code + ''
            : '';

        let shareButtonClass = sharedURL.length > 0 ? 'neutral' : 'secondary';
        let shareButtonClick = sharedURL.length > 0 ? this.hide : this.share;

        let shareButton = (
            <button className={`btn-${shareButtonClass}`}
                    onClick={shareButtonClick}>
                { sharedURL.length > 0 ?
                    SettingsStore.getSetting('locale').SHARE_HIDE :
                    SettingsStore.getSetting('locale').SHARE_SHOW }
            </button>
        );

        return (
            <Dialog className="dialog-edit-board"
                    onDismiss={this.props.onDismiss}>
                <section className="dialog-header">
                    {SettingsStore.getSetting('locale').SHARE_TITLE}
                </section>
                <section className="dialog-content">

                    <label htmlFor="board-share">
                        {SettingsStore.getSetting('locale').SHARE_LINK}
                    </label>
                    <section className="input-group">
                        <input ref="shareInput"
                               onClick={this.highlight}
                               name="board-share" placeholder={SettingsStore.getSetting('locale').SHARE_LINK}
                               readOnly={true} value={sharedURL} tabIndex={-1}/>
                        {shareButton}
                    </section>

                </section>
                <section className="dialog-footer">
                    <button className="btn-primary" onClick={this.submit}>
                      {SettingsStore.getSetting('locale').DONEBUTTON}
                    </button>
                </section>
            </Dialog>
        );
    }
});
