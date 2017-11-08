import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Search from '../search';
import { addNodeCreator } from '../../redux/actions/audioActions';

import './player.css';

class Player extends Component {
    constructor(props) {
        super(props);
        this.defaultData = {
            source: null,
            startedAt: null,
            pausedAt: null,
            paused: true
        }
        this.state = {
            audioContext: new (window.AudioContext || window.webkitAudioContext)
        }
        this.playAudio = this.playAudio.bind(this);
        this.pauseAudio = this.pauseAudio.bind(this);
        this.loadAudio = this.loadAudio.bind(this);
        this.loadAudioUsingFileAPI = this.loadAudioUsingFileAPI.bind(this);
        this.decodeMp3FromBufferAndPlay = this.decodeMp3FromBufferAndPlay.bind(this);
    }

    playAudio(event) {
        event.stopPropagation();
        const fileInput = document.getElementById('audio_file');
        if (fileInput.files.length > 0 && ['audio/mpeg', 'audio/mp3'].includes(fileInput.files[0].type)) {
            this.loadAudioUsingFileAPI(fileInput.files[0], (mp3BytesArray) => {
                this.decodeMp3FromBufferAndPlay(mp3BytesArray);
            });
        } else {
            alert('Could not play, check if You loaded audio properly');
        }
    }

    pauseAudio() {
        this.defaultData.source.stop(0);
        this.defaultData.pausedAt = this.props.audioContext.currentTime - this.defaultData.startedAt;
        this.defaultData.paused = true;
    }

    loadAudio() {
        const audioFile = document.getElementById('audio_file');
        const audioPlayer = document.getElementById('audio_player');
        const file = URL.createObjectURL(audioFile.files[0]);        
        audioPlayer.src = file;
    }

    loadAudioFromAutocomplete() {

    }

    loadAudioUsingFileAPI(selectedFile, callback) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const mp3AudioBufferArray = reader.result;
            callback(mp3AudioBufferArray);
        }
        reader.readAsArrayBuffer(selectedFile);
    }

    decodeMp3FromBufferAndPlay(mp3AudioBufferArray) {
        this.state.audioContext.decodeAudioData(mp3AudioBufferArray, (decodedAudioBuffer) => {
            this.defaultData.source = this.state.audioContext.createBufferSource();
            this.defaultData.source.buffer = decodedAudioBuffer;
            this.defaultData.source.connect(this.state.audioContext.destination);
            // this.props.addNodeCreator(this.defaultData.source);
            this.defaultData.paused = false;
            if (this.defaultData.pausedAt) {
                this.defaultData.startedAt = this.props.audioContext.currentTime - this.defaultData.pausedAt;
                this.defaultData.source.start(0, this.defaultData.pausedAt / 1000);
            }
            else {
                this.defaultData.startedAt = this.props.audioContext.currentTime;
                this.defaultData.source.start(0);
            }
        });
    } 

    render() {
        return (
            <div>
                <div className='player-module'>
                    <div className='player-header'>Playback</div>
                    <div className='player-control-buttons'>
                        <label htmlFor='audio_file' className='fa fa-upload file-upload'>
                            <input id='audio_file' className='ui-button' type='file' onChange={this.loadAudio} accept='audio/*' />
                        </label>
                        <audio id='audio_player' />
                        <button className='class="ui-button ui-widget ui-state-default ui-corner-all control-button ui-button-text-only' onClick={this.playAudio}><i className="fa fa-play"></i></button>
                        <button className='class="ui-button ui-widget ui-state-default ui-corner-all control-button ui-button-text-only' onClick={this.pauseAudio}><i className="fa fa-pause"></i></button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (store) => {
    return {
        currentChain: store.audio.currentChain,
        audioContext: store.audio.audioContext
    } 
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ addNodeCreator }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Player);