import React, { Component } from 'react';
import { connect } from 'react-redux';

class Diagnostics extends Component {
    render() {
        return (
            <div>
                Tu będzie diagnostyka
                <canvas />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        audioContext: state.audio.audioContext
    }
}

export default connect(mapStateToProps)(Diagnostics);