import { SET_LANGUAGE } from "../constants"

export const setLanguage = (data) => {
    return {
        type: SET_LANGUAGE,
        payload: { ...data }
    }
}