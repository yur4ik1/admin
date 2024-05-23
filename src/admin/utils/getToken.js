export function getToken() {
    return document.cookie.split(';').find((cookie) => cookie.includes('token')).split('=')[1];
}