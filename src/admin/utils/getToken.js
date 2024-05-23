export function getToken() {

    let rawRootData = localStorage.getItem(import.meta.env.VITE_APP_STORAGE_KEY)
    if (rawRootData) {
        const rootData = JSON.parse(rawRootData)
        const rawauth = rootData.auth

        if (rawauth) {
            const auth = JSON.parse(rawauth)
            return auth.token
        }
    }

    return null
    // return document.cookie.split(';').find((cookie) => cookie.includes('token')).split('=')[1];
}
