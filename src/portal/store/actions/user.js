import { ADD_USER_DATA, LOGOUT_USER } from "../constants"

export const addUSerDetail = (key, value) => {
    return {
        type: ADD_USER_DATA,
        payload: { key, value }
    }
}

export const logoutUser = () => {
    return {
        type: LOGOUT_USER
    }
}