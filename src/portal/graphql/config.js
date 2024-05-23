import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { onError } from "@apollo/client/link/error";
import { authenticateUser } from "../../utils/auth/authenticateUser";
import { store } from "../store/store"

const httpLink = createHttpLink({
    uri: import.meta.env.VITE_APP_BASE_URL,
})

const authLink = setContext((_, { headers }) => {
    const token = store.getState().auth.token
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
})

const errorLink = onError(({ graphQLErrors, forward, operation }) => {

    if (graphQLErrors) {
        graphQLErrors.forEach(async ({ extensions }) => {
            if (extensions && extensions.code === "access-denied") {

                authenticateUser(() => {
                    return forward(operation);
                })


                // const token = store.getState().auth.token

                // if (!token) {
                //     logoutCurrentUser()
                // }

                // const sessionTime = store.getState().auth.sessionTime
                // if (!sessionTime) {
                //     logoutCurrentUser()
                // }

                // const now = Math.floor(Date.now() / 1000);
                // const expiresIn = Number(localStorage.getItem("expiresIn"));

                // const expirationTime = sessionTime + expiresIn;
                // const timeUntilExpiration = expirationTime - now;

                // const isExpired = timeUntilExpiration < 60;

                // if (isExpired) {
                //     console.log("Session Expired")
                //     const refreshToken = store.getState().auth.refreshToken

                //     if (refreshToken) {
                //         console.log("Session Expired")

                //         const refreshToken = store.getState().auth.refreshToken

                //         const response = await fetch("https://securetoken.googleapis.com/v1/token?key=" + import.meta.env.VITE_APP_FIREBASE_KEY, {
                //             method: "post",
                //             headers: {
                //                 "Content-Type": "application/json",
                //             },
                //             body: JSON.stringify({
                //                 grant_type: "refresh_token",
                //                 refresh_token: refreshToken,
                //             }),
                //         })
                //         const data = await response.json();
                //         if (data.id_token) {
                //             const now = Math.floor(Date.now() / 1000);
                //             store.dispatch(addUSerDetail("token", data.id_token))
                //             store.dispatch(addUSerDetail("sessionTime", now))
                //             store.dispatch(addUSerDetail("expiresIn", data.expires_in))

                //             return forward(operation);
                //         }

                //     } else {
                //         logoutCurrentUser()
                //     }
                // } else {
                //     console.log("Something went wrong")
                // }


            }
        })
    }
})


export const client = new ApolloClient({
    link: errorLink.concat(authLink.concat(httpLink)),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    }
})

// const logoutCurrentUser = () => {
//     store.dispatch(showOverlay())
//     store.dispatch(logoutUser())
//     window.location.replace(import.meta.env.VITE_APP_AUTH_DOMAIN)
// }