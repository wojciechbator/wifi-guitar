import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { initializeAudioContext, storeInputStream } from '../redux/actions/audioActions';
import AudioNodes from './AudioNodes';

class AudioInitializer extends Component {
    constructor(props) {
        super(props);
        this.captureAudio = this.captureAudio.bind(this);
        this.state = {
            audioContext: new (window.AudioContext || window.webkitAudioContext)
        }
        this.props.initializeAudioContext(this.state.audioContext);
        this.captureAudio();
    }

    captureAudio() {
        if (!navigator.mediaDevices.getUserMedia)
            navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia ||
                navigator.mediaDevices.mozGetUserMedia || navigator.mediaDevices.msGetUserMedia;
        if (navigator.mediaDevices.getUserMedia) {
            return navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                const inputStream = this.state.audioContext.createMediaStreamSource(stream);
                this.props.storeInputStream(inputStream);
                return inputStream;
            }).catch(error => {
                alert('Error capturing audio.');
                return new Error(error);
            });
        } else {
            alert('getUserMedia is not supported in this browser.');
            return new Error();
        }
    }

    render() {
        return <AudioNodes audioContext={this.state.audioContext} />;
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({ initializeAudioContext, storeInputStream }, dispatch);

export default connect(null, mapDispatchToProps)(AudioInitializer);