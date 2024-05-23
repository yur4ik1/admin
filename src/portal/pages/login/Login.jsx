import { useNavigate, useSearchParams } from 'react-router-dom'
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideOverlay, showOverlay } from '../../store/actions/global';
import { addUSerDetail } from '../../store/actions/user';
import { useLazyQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import Header from '../../components/header/Header';
import { GET_PROFILE } from '../../queries/auth';
import Language from '../../components/shared/language/Language';
import { router } from '../../../utils/routes';
// import { useTranslation } from 'react-i18next';


const Login = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const sessionId = searchParams.get('session_id')
    // const { t } = useTranslation()

    // const [isPassVisible, setIsPasVisible] = useState(false)
    const { userData } = useSelector((state) => state.auth)
    const [getProfile] = useLazyQuery(GET_PROFILE)


    // ==> Yup - Formik validations <==
    // const validationSchema = Yup.object().shape({
    //     email: Yup.string().email().required(),
    //     password: Yup.string().required()
    // })

    // const formik = useFormik({
    //     initialValues: {
    //         email: '',
    //         password: '',
    //     },
    //     validationSchema,
    //     onSubmit: async (values) => {
    //         dispatch(showOverlay())
    //         const response = await fetch(import.meta.env.VITE_APP_FIREBASE_URL + "/accounts:signInWithPassword?key=" + import.meta.env.VITE_APP_FIREBASE_KEY, {
    //             method: "post",
    //             headers: {
    //                 "Content-Type": "text/plain",
    //             },
    //             body: JSON.stringify({
    //                 email: values.email,
    //                 password: values.password,
    //                 returnSecureToken: true,
    //             }),
    //         })

    //         if (!response.ok) {
    //             toast.error('Wrong login or password')
    //             document.querySelector(".overlay").classList.remove("active");
    //             dispatch(hideOverlay())
    //             return;
    //         }

    //         const json = await response.json();

    //         const KEY = json.idToken;
    //         dispatch(addUSerDetail("token", KEY))

    //         if (json?.error) {
    //             toast.error(json.error?.message)
    //             dispatch(hideOverlay())
    //         } else {
    //             let localId = json.localId;
    //             let sessionTime = Date.now() / 1000;

    //             dispatch(addUSerDetail("authKey", localId))
    //             dispatch(addUSerDetail("sessionTime", sessionTime))
    //             dispatch(addUSerDetail("refreshToken", json.refreshToken))
    //             dispatch(addUSerDetail("expiresIn", json.expiresIn))

    //             let currentUserData = await profile(localId);

    //             if (Object.keys(currentUserData ?? {}).length === 0) {
    //                 toast.info('Please wait, technical work is in progress')
    //                 dispatch(hideOverlay())
    //                 return;
    //             }

    //             dispatch(hideOverlay())
    //             navigate(router.skills)
    //         }
    //     },
    // })
    // const { handleBlur, handleChange, submitForm, values, touched, errors } = formik


    // const togglePassVisibility = () => {
    //     setIsPasVisible((old) => !old)
    // }


    const profile = async (localId) => {
        const response = await getProfile({ variables: { ssoid: localId, } })

        let datas = response?.data?.users[0];
        dispatch(addUSerDetail("userData", datas ?? {}))
        // await fetchBalance(datas?.id);
        return datas
    }

    const getSessionData = async (sessionId) => {
        dispatch(showOverlay())

        const response = await fetch(import.meta.env.VITE_APP_SESSION_URL + "/session?session_id=" + sessionId, {
            method: "get",
            headers: {
                "x_njbl_key": import.meta.env.VITE_APP_SESSION_ACCESS_KEY,
            }
        })

        if (!response.ok) {
            toast.error('Something went wrong')
            dispatch(hideOverlay())
            return;
        }
        const parsedData = await response.json();

        const sessionData = parsedData?.credential?.token
        if (sessionData) {
            const KEY = sessionData.idToken;
            dispatch(addUSerDetail("token", KEY))

            if (sessionData.error) {
                toast.error(sessionData.error?.message)
                dispatch(hideOverlay())
            } else {
                let localId = sessionData.localId;
                let sessionTime = Date.now() / 1000;

                dispatch(addUSerDetail("authKey", localId))
                dispatch(addUSerDetail("sessionTime", sessionTime))
                dispatch(addUSerDetail("refreshToken", sessionData.refreshToken))
                dispatch(addUSerDetail("expiresIn", sessionData.expiresIn))

                let currentUserData = await profile(localId);

                if (Object.keys(currentUserData ?? {}).length === 0) {
                    toast.info('Please wait, technical work is in progress')
                    dispatch(hideOverlay())
                    return;
                }

                dispatch(hideOverlay())
                navigate(router.skills)
            }
        }
        dispatch(hideOverlay())
    }


    useEffect(() => {
        if (userData) {
            navigate(router.skills)
        }
    }, [userData])

    useEffect(() => {
        dispatch(showOverlay())
        if (sessionId) {
            getSessionData(sessionId)
        } else {
            if (userData) {
                navigate(router.skills)
            } else {
                window.location.replace(`${import.meta.env.VITE_APP_AUTH_DOMAIN}/login`)
            }
        }
    }, [sessionId, userData])


    return (
        <div className="wrapper">
            <Header type='public' />

            {/* <section className="login">
                <div className="container">
                    <div className="leaf"></div>
                    <div className="login__content">
                        <div className="login__content-left">
                            <h1>{t('login.signIn')}</h1>
                            <p>{t('login.noAccount')}<Link to="/signup" id="registerButton">{t('login.register')}</Link></p>
                        </div>
                        <div className="login__content-right">
                            <form className="login__content-form" action="#">
                                <div className="field">
                                    <p><span>*</span>{t('login.userName')}</p>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        id="email"
                                        name='email'
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {touched.email && errors.email && <span className="let-know active" id="emailNotification" >{t('login.fillField')}</span>}
                                </div>

                                <div className="field">
                                    <p><span>*</span>{t('login.password')}</p>
                                    <input
                                        type={isPassVisible ? 'text' : 'password'}
                                        id="password"
                                        placeholder="Password"
                                        name='password'
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {touched.password && errors.password && <span className="let-know active" id="passwordNotification">{t('login.fillField')}</span>}
                                    <span className={`password-icon ${isPassVisible ? 'active' : ''}`} onClick={togglePassVisibility}></span>
                                </div>

                                <div className="term">
                                    <div className="term-field">
                                        <input
                                            type="checkbox"
                                            id="emails"
                                        />
                                        <label htmlFor="emails" >{t('login.rememberMe')}</label>
                                    </div>
                                    <Link className="forgot" to="/forgot-password">{t('login.forgotPassword')}</Link>
                                </div>

                                <div className="form-bottom">
                                    <button
                                        className="btn login-btn"
                                        id="loginButton"
                                        type="button"
                                        onClick={submitForm}
                                    >
                                        {t('login.signIn')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section> */}

            <Language />
        </div>
    )
}

export default Login