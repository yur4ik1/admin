import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from "react";
import { fireBaseKey } from "../utils/constants.js";
import { useAuth } from "../utils/auth.jsx";
import Loading from "../components/loading/Loading.jsx";
import { Helmet } from "react-helmet";
import { getRoute } from '../utils/routes/getRoute.js';

export const Route = createFileRoute('/login')({
    component: () => <Login />,
})

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault()
        event.stopPropagation()

        setLoading(true)

        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + fireBaseKey,
            {
                method: 'post',

                headers: {
                    'Content-Type': 'text/plain'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );
        const json = await response.json();
        if (json?.error) {
            setError(json.error?.message);
        } else {
            let KEY = json.idToken;
            let expiresIn = parseInt(json.expiresIn) * 1000;

            auth.isAuthenticated = true;
            auth.token = KEY;

            const currentDate = new Date();
            const expireDate = new Date(currentDate.getTime() + expiresIn);

            document.cookie = `token=${KEY}; expires=${expireDate.toUTCString()}; path=/`;

            navigate({ to: getRoute('/') });
        }
        setLoading(false)
    }

    return (
        <div className="login-page">
            {<Helmet>
                <link rel="stylesheet" href="/css/login.css" />
            </Helmet>}

            <section className='login' id='login'>
                <div className='head'>
                    <h1 className='company'>Ninjable Admin</h1>
                </div>
                {error && (<p className='msg' id="msg-login">{error}</p>)}
                <div className='form'>
                    <form onSubmit={handleLogin}>
                        <input type="text" placeholder='Email' className='text' id='email'
                            onChange={(event) => setEmail(event.target.value)} required /><br />
                        <input type="password" placeholder='••••••••••••••' className='password'
                            onChange={(event) => setPassword(event.target.value)} id="password"
                            required /><br />
                        <button className='btn-login' id='do-login' type="submit">Login</button>
                    </form>
                </div>
                {
                    loading && (
                        <Loading />
                    )
                }
            </section>
            <footer>
                <p>Made with <span className='heart'>&hearts;</span> by Ninjable</p>
            </footer>
        </div>
    )
}