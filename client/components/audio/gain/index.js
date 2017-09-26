import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Subject, Observable } from 'rxjs';
import Gain from './presentation';
import { gainValuesCreator, addNodeCreator } from '../../../redux/actions/audioActions';
import audioChain from '../../../utils/audioChain';
import 'rxjs/add/operator/debounceTime';

class GainNode extends Component {
    constructor(props) { 
        super(props);
        this.gainValueObserver = new Subject();
        this.state = {
            gainValue: this.props.audioContext.createGain()
        }
        
        this.onVolumeChange = this.onVolumeChange.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.setState({ gainValue: {gain: { value: 0.5 } } });
        this.props.gainValuesCreator(this.state.gainValue.gain.value);
        this.props.addNodeCreator(this.state.gainValue.gain.value);
        audioChain(this.props.currentChain[this.props.currentChain.indexOf(this.state.gainValue.gain.value) - 1], 
                    this.state.gainValue, 
                    this.props.currentChain[this.props.currentChain.indexOf(this.state.gainValue.gain.value) + 1], 
                    true, 
                    true, 
                    this.props.audioContext);
    }
    
    onVolumeChange(event) {
        this.setState({ gainValue: {gain: { value: event.value / 100 } } });
        return Observable.of(this.state.gainValue.gain.value);
    }

    onChange(event) {
        let observer = this.onVolumeChange(event).debounceTime(300);
        observer.subscribe(value => this.gainValueObserver.next(this.props.gainValuesCreator(value)));
    }
    
    render() {
        return (
            <div>
                <Gain type='GAIN' volume={Math.round(this.state.gainValue.gain.value * 100)} onVolumeChange={this.onChange} />
            </div>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        gainValue: {
            gain: {
                value: store.audio.gainNode.volume
            }
        }
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({gainValuesCreator, addNodeCreator}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GainNode);