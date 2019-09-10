const layouts = (state = {}, action) => {
    switch (action.type) {
        case 'RECEIVE_PYXLEY_LAYOUT':
            return {
                ...state,
                layouts: action.layouts
            }
        default:
            return state
    }
}

export {layouts}
