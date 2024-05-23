import {createContext, useContext} from "react";
import {redirect} from "@tanstack/react-router";

const AuthContext = createContext({
    isAuthenticated: false,
    token: '',
    setAuth: () => {},
});

// eslint-disable-next-line react/prop-types
export default function AuthContextProvider({children}) {
    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export function protectedRoute({location}) {
    const token = document.cookie.split(';').find((cookie) => cookie.includes('token'));

    if (!token) {
        throw redirect({
            to: '/login',
            search: {
                redirect: location.href,
            },
        });
    }
}