import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DataList } from 'primereact/components/datalist/DataList';
import { Fieldset } from 'primereact/components/fieldset/Fieldset';
import './nodesList.css';

class NodesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: this.props.currentChain
        }
    }

    render() {
        return (
            <div className="nodes-list">
                <DataList value={this.props.currentChain} header="Audio nodes">
                    {this.props.currentChain.map((element, i) => <div key={i} text={element} />)}
                </DataList>
            </div>
        );
    }
}

const mapStateToProps = (store) => {
    return {
        currentChain: store.audio.currentChain
    }
}

export default connect(mapStateToProps)(NodesList);