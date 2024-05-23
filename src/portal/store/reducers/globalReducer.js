import { HIDE_OVERLAY, SHOW_OVERLAY } from "../constants"

const initialState = {
    overlayOpen: false
}

export const globalReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_OVERLAY:
            return {
                ...state,
                overlayOpen: true
            }
        case HIDE_OVERLAY:
            return {
                ...state,
                overlayOpen: false
            }


        default:
            return state
    }
}