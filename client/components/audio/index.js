import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

let BUFF_SIZE_RENDERER = 16384,
    audioInput = null,
    inputStream = null,
    gainNode = null,
    scriptProcessorNode = null,
    scriptProcessorAnalysisNode = null,
    analyserNode = null;

class Audio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentVolume: 0.5
        }
        this.captureAudio(this.props.audioContext);
    }  

    captureAudio(audioContext) {
        if (!navigator.getUserMedia)
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia || navigator.msGetUserMedia;

        if (navigator.getUserMedia) {
            navigator.getUserMedia({ audio: true },
                (stream) => {
                    this.startInput(audioContext, stream);
                },
                (error) => {
                    alert('Error capturing audio.');
                }
            );
        } else { alert('getUserMedia not supported in this browser.'); }
    }

    startInput(audioContext, stream) {
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        inputStream = audioContext.createMediaStreamSource(stream);
        inputStream.connect(gainNode);
        this.changeVolume();
    }

    changeVolume() {
        document.getElementById('volume').addEventListener('change', (event) => {
            const currentVolume = event.target.value;
            this.setState({ currentVolume });
            gainNode.gain.value = this.state.currentVolume;
        });
    }

    processInputBuffer(event) {
        let i, N, inp, inputOutputBuffer;
        inputOutputBuffer = event.inputBuffer.getChannelData(0);
    }

    showSomeData(givenTypedArray, numRowToDisplay, label) {
        const sizeBuffer = givenTypedArray.length;
        let index = 0;
        // console.log("__________ " + label);
        if (label === "time") {
            for (; index < numRowToDisplay && index < sizeBuffer; index += 1) {
                let currValueTime = (givenTypedArray[index] / 128) - 1.0;
                // console.log(currValueTime);
            }
        } else if (label === "frequency") {
            for (; index < numRowToDisplay && index < sizeBuffer; index += 1) {
                // console.log(givenTypedArray[index]);
            }
        } else {
            throw new Error("ERROR - must pass time or frequency");
        }
    }

    render() {
        return (
            <div>
                <p>Volume</p>
                <input id="volume" type="range" min="0" max="1" step="0.01" defaultValue="0.5" />
            </div>
        );
    }
}

Audio.propTypes = {
    audioContext: PropTypes.object,
}

const mapStateToProps = (state) => {
    return {
        audioContext: state.audio.audioContext
    }
}

export default connect(mapStateToProps)(Audio);