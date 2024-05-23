import { showOverlay } from "../../portal/store/actions/global"
import { addUSerDetail, logoutUser } from "../../portal/store/actions/user"
import { store } from "../../portal/store/store"

export const authenticateUser = async (successCallback = () => { }) => {

    const token = store.getState().auth.token

    if (!token) {
        logoutCurrentUser()
    }

    const sessionTime = store.getState().auth.sessionTime
    if (!sessionTime) {
        logoutCurrentUser()
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresIn = Number(store.getState().auth.expiresIn);

    const expirationTime = sessionTime + expiresIn;
    const timeUntilExpiration = expirationTime - now;

    const isExpired = timeUntilExpiration < 60;

    if (isExpired) {
        console.log("Session Expired")
        const refreshToken = store.getState().auth.refreshToken

        if (refreshToken) {
            console.log("Session Expired")

            const refreshToken = store.getState().auth.refreshToken

            const response = await fetch("https://securetoken.googleapis.com/v1/token?key=" + import.meta.env.VITE_APP_FIREBASE_KEY, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    grant_type: "refresh_token",
                    refresh_token: refreshToken,
                }),
            })
            const data = await response.json();
            if (data.id_token) {
                const now = Math.floor(Date.now() / 1000);
                store.dispatch(addUSerDetail("token", data.id_token))
                store.dispatch(addUSerDetail("sessionTime", now))
                store.dispatch(addUSerDetail("expiresIn", data.expires_in))

                successCallback()
            }

        } else {
            logoutCurrentUser()
        }
    } 
}

const logoutCurrentUser = () => {
    store.dispatch(showOverlay())
    store.dispatch(logoutUser())
    window.location.replace(`${import.meta.env.VITE_APP_AUTH_DOMAIN}/login`)
}