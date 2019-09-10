
import {actions} from '../actions/index'
import {fetchData, postData} from '../utils/fetch'
const receiveChartData = actions.receiveChartData;
const receiveChartDataError = actions.receiveChartDataError;
const receiveFilterData = actions.receiveFilterData;
const receiveFilterDataError = actions.receiveFilterDataError;
const selectFilterOption = actions.selectFilterOption;
const removeFilterOption = actions.removeFilterOption;

function getChartData(rootPath, params, dispatch, charts, prefix) {

    for(var i = 0; i < charts.length; i++){

        let id = prefix.concat(i)
        fetchData(
            rootPath.concat(charts[i].options.url),
            params,
            json => {dispatch(receiveChartData(id,json))},
            () => {dispatch(receiveChartDataError())}
        )
    }
}

function getFilterData(rootPath, params, dispatch, filters) {

    for (let _filter in filters){

        filters[_filter].map( f => {

            if (("url" in f.options) && (f.options.alias !== undefined)){

                fetchData(
                    rootPath.concat(f.options.url),
                    params,
                    json => {
                        dispatch(
                            receiveFilterData(f.options.alias,json.data)
                        )
                    },
                    () => {dispatch(receiveFilterDataError())}
                )
            }
        })
    }
}


function updateLocation(alias, value){
    let url = document.location.hash;

    if(url.length > 1) {
        url = url.slice(1)
    }

    // split on ?
    let tokens = url.replace(" & ", " + ").split("&")

    let query = ""
    let notFound = true
    let prefix = ""
    for (let i = 0; i < tokens.length; i++){
        if( tokens[i] !== "" ){
            // split on =
            let pairs = tokens[i].split("=")
            if( pairs.length > 1){
                if(pairs[0] === alias){
                    tokens[i] = pairs[0].concat("=", value)
                    notFound = false
                }
                prefix = query === "" ? "" : "&"
                query = query.concat(prefix, tokens[i])
            }
        }

    }
    if( notFound ){
        prefix = query === "" ? "" : "&"
        query = query.concat(prefix, alias, "=", value)
    }

    document.location.hash = query;
}

function updateFilterState(input, dispatch) {

    if(input.constructor === Array){
        input.map( t => {
            dispatch(selectFilterOption(t.alias, t.value))
        })
    }

}

function removeFilters(input, dispatch) {
    if(input.constructor === Array){
        input.map( t => {
            dispatch(removeFilterOption(t.alias))
        })
    }
}

function updateStateAndHash(input, dispatch) {

    if(input.constructor === Array){
        input.map( t => {
            dispatch(selectFilterOption(t.alias, t.value))
            updateLocation(t.alias, t.value)
        })
    }

}

const _gatherSelectedFilters = (input, ownProps) => {
    // input is a list of objects
    // ownProps should have a selected_filters attribute
    let params = {...ownProps.selected_filters}
    if( input === undefined) {
        return params;
    }
    input.forEach( item => {
        params[item.alias] = item.value;
    })
    return params;
}


const _onClick = (dispatch, input, ownProps) => {

    let params = _gatherSelectedFilters(input, ownProps);

    updateFilterState(input, dispatch);

    let { path, charts, filters, chart_prefix } = ownProps;
    if( charts !== undefined ) {
        getChartData(path, params, dispatch, charts, chart_prefix);
    };
    getFilterData(path, params, dispatch, filters);

}


const mapLayoutDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: (input) => {
            _onClick(dispatch, input, ownProps)}
    };
}

const mapFilterStateToProps = (state, ownProps) => {

    let output = {value: null, items: []};
    let id = ownProps.options.alias;
    if( id in state.filters){
        if ("value" in state.filters[id]) {
            output.value = state.filters[id].value;
        };
    };

    if( id in state.filter_data ){

        if ("data" in state.filter_data[id]) {
            output.options = ownProps.options;
            output.items = state.filter_data[id].data;
        };
    };

    return output;
}

const mapChartStateToProps = (state, ownProps) => {

    let newvalue = {result: []};
    let id = ownProps.id;

    if( id in state.charts){

        if ("data" in state.charts[id]) {
            newvalue = state.charts[id].data;
        };
    };

    return {
        data: newvalue
    };
}

const mapLayoutStateToProps = (state, ownProps) => {

    // get selected filter data
    let selected_filters = {};
    let filter_data = {};
    for(let filterId in state.filters) {
        let _filter_data = state.filters[filterId] || {};
        if("value" in _filter_data) {
            selected_filters[filterId] = state.filters[filterId].value;
            filter_data[filterId] = {
                value: state.filters[filterId].value
            };
        };
    }
    // get chart data
    let chart_data = {};
    for(let chartId in state.charts) {
        chart_data[chartId] = state.charts[chartId].data
    };

    // get filter data
    let { filters } = ownProps;
    filters['pyxley-filter'].forEach( (fprop, index) => {
        let filterId = ownProps.filter_prefix.concat(index);
        let _filter_data = state.filter_data[filterId] || {};
        if("data" in _filter_data) {
            filter_data[filterId] = {
                ...state.filter_data[filterId],
                options: fprop.options,
                items: state.filter_data[filterId].data
            };
        };
    });

    return {
        selected_filters: selected_filters,
        data: chart_data,
        filter_data: filter_data
    };
};




const utils = {
    getChartData: getChartData,
    getFilterData: getFilterData,
    removeFilters: removeFilters,
    updateFilterState: updateFilterState,
    updateStateAndHash: updateStateAndHash,
    mapFilterStateToProps: mapFilterStateToProps,
    mapChartStateToProps: mapChartStateToProps,
    mapLayoutStateToProps: mapLayoutStateToProps,
    mapLayoutDispatchToProps: mapLayoutDispatchToProps
}

export {utils}
