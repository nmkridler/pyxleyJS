
import React from 'react';

var LayoutFactory = function(type) {
    if (typeof LayoutFactory[type] != 'function'){
        throw new Error(type + ' is not a valid layout.');
    }

    return LayoutFactory[type];
};

class Layout extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var Z = this.props.layout_factory(this.props.type);
        return (
            <Z
                id={this.props.id}
                filters={this.props.filters}
                charts={this.props.charts} />
        );
    }
}

Layout.defaultProps = {
    layout_factory: LayoutFactory
};

export {Layout, LayoutFactory};
