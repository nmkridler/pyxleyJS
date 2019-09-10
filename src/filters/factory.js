import React from 'react';
import {DownloadButton} from './DownloadButton';
import {InputDecimal, InputText} from './SimpleInput';
import {AntSelect, AntMultiSelect} from './AntSelect';
import {AntDatePicker, AntMonthRangePicker, AntDateSelect} from './AntDatePicker'
import {AntCheck} from './AntCheckbox'

var FilterFactory = function(type) {
    if (typeof FilterFactory[type] != 'function'){
        throw new Error(type + ' is not a valid filter.');
    }

    return FilterFactory[type];
};

FilterFactory.SelectButton = AntSelect;
FilterFactory.DownloadButton = DownloadButton;
FilterFactory.InputText = InputText;
FilterFactory.MultiSelect = AntMultiSelect;
FilterFactory.AntDatePicker = AntDatePicker;
FilterFactory.AntDateSelect = AntDateSelect;
FilterFactory.AntMonthRangePicker = AntMonthRangePicker;
FilterFactory.SimpleInput = InputDecimal;
FilterFactory.AntCheck = AntCheck;

class Filter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var Z = this.props.factory(this.props.type);

        return (
            <Z
                id={this.props.id}
                onChange={this.props.onChange}
                value={this.props.value}
                items={this.props.items}
                options={this.props.options} />
        );
    }
}

Filter.defaultProps = {
    factory: FilterFactory
};

export {Filter, FilterFactory}
