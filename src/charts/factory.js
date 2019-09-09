import React from 'react';
import {PlotlyAPI} from './plotly/base.js';
import {AntTable} from './antdesign/base.js';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

var ChartFactory = function(type) {

    if (typeof ChartFactory[type] != 'function'){
        throw new Error(type + ' is not a valid chart type.');
    }

    return ChartFactory[type];
};

ChartFactory.PlotlyAPI = PlotlyAPI;
ChartFactory.AntTable = AntTable;

class Chart extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var Z = this.props.factory(this.props.type);
        return (
            <Z
                id={this.props.id}
                data={this.props.data}
                options={this.props.options} />
        );
    }
}
Chart.defaultProps = {
    type: PropTypes.string,
    factory: ChartFactory,
    options: PropTypes.object

};


function mapChartStateToProps(state, ownProps) {

    let newvalue = {result: []}
    let id = ownProps.id

    if( id in state.charts){

        if ("data" in state.charts[id]) {
            newvalue = state.charts[id].data
        }
    }

    return {
        data: newvalue
    };
}


export {Chart, ChartFactory, mapChartStateToProps};

