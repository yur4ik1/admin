import { ADD_USER_DATA, LOGOUT_USER } from "../constants"

const initialState = {}

export const userReducer = (state = initialState, action) => {
    let { type, payload } = action
    switch (type) {
        case ADD_USER_DATA:
            return {
                ...state,
                [payload.key]: payload.value
            }

        case LOGOUT_USER:
            return initialState

        default:
            return state
    }
}