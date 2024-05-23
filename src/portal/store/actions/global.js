import { HIDE_OVERLAY, SHOW_OVERLAY } from "../constants"

export const showOverlay = () => {
    return {
        type: SHOW_OVERLAY,
    }
}

export const hideOverlay = () => {
    return {
        type: HIDE_OVERLAY,
    }
}