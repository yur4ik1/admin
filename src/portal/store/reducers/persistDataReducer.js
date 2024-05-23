import { SET_LANGUAGE } from "../constants"

const initialState = {
    language: import.meta.env.VITE_APP_DEFAULT_LANGUAGE ?? 'en'
}

export const persistDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LANGUAGE:
            return {
                ...state,
                language: action.payload.language
            }

        default:
            return state
    }
}