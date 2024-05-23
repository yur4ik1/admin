import { Link } from 'react-router-dom'
import logo from '/img/logo.svg'
import { useEffect, useState } from 'react'
import styles from './header.module.scss';
import PropTypes from 'prop-types';
import { GET_BALANCE, GET_MESSAGES, MARK_MESSAGES_AS_READ } from '../../queries/global';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useSelector } from 'react-redux';
import { logoutUser } from '../../store/actions/user';
import { useDispatch } from 'react-redux';
import { useClickOutside } from '../../utils/hooks/global';
import { useTranslation } from 'react-i18next';
import { showOverlay } from '../../store/actions/global';
import { router } from '../../../utils/routes';


const Header = ({ type }) => {

    const dispatch = useDispatch()
    const { t } = useTranslation()

    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [notificationOpen, setNotificationOpen] = useState(false)
    const [userBalance, setUserBalance] = useState({ coins: null, crystals: null })
    const [notificationData, setNotificationData] = useState({ count: 0, notifications: [] })
    const { userData } = useSelector((state) => state.auth)
    const [getBalanceRequest] = useLazyQuery(GET_BALANCE)
    const [getMessagesRequest] = useLazyQuery(GET_MESSAGES)
    const [markMessagesAsReadRequest] = useMutation(MARK_MESSAGES_AS_READ)


    const headerMenuRef = useClickOutside(() => {
        setUserMenuOpen(false)
    })

    const handleLogout = () => {
        dispatch(showOverlay())
        dispatch(logoutUser())
        window.location.replace(`${import.meta.env.VITE_APP_AUTH_DOMAIN}/login`)
    }


    useEffect(() => {
        if (type !== 'public' && userData.id) {
            getBalanceRequest({ variables: { user_id: userData.id } }).then((result) => {
                const data = {
                    coins: result.data?.balance[0]?.coins,
                    crystals: result.data?.balance[0]?.crystals
                }
                setUserBalance(data)
            }).catch((error) => {
                console.error('error', error)
            })

            getMessagesRequest({ variables: { user_id: userData.id } }).then((result) => {
                let tmpNotificationData = { count: 0, notifications: [] }
                if (result?.messages_aggregate?.aggregate?.count) {
                    tmpNotificationData = {
                        ...tmpNotificationData,
                        count: result?.messages_aggregate?.aggregate?.count ?? 0
                    }
                }

                if (result?.messages?.length > 0) {
                    tmpNotificationData = {
                        ...tmpNotificationData,
                        notifications: result.messages
                    }
                }

                setNotificationData(tmpNotificationData)
            }).catch((error) => {
                console.error('error', error)
            })

        }
    }, [type, userData?.id])

    useEffect(() => {
        if (notificationOpen === true && userData.id) {
            markMessagesAsReadRequest({ variables: { user_id: userData.id } }).then(() => {
            }).catch(() => {
                console.error('Something went wrong!')
            })
        }
    }, [notificationOpen, userData?.id])


    return (
        <>
            <header className={styles['header']}>
                <Link className={styles['header__logo']} to={router.skills}>
                    <img src={logo} alt="logo" />
                </Link>

                {
                    type !== 'public' && <>
                        <div className={styles['header__navigation']}>
                            {
                                userData?.role === 'admin' && <Link className={`${styles['header__admin-btn']} ${styles['btn']} btn`} to="/admin" >Admin</Link>
                            }
                            <div className={styles['resources']}>
                                <span className={styles['crystal']}>{userBalance.coins ?? '-'}</span>
                            </div>
                            <div
                                onClick={() => setNotificationOpen((prev) => !prev)}
                                className={styles['notification']}
                            >
                                {notificationData.count > 0 && <span>{notificationData.count}</span>}
                            </div>
                            <div className={styles['avatar']} onClick={() => setUserMenuOpen(!userMenuOpen)}>
                                <img src={`/img/${userData?.users_level?.slug}-avatar.svg`} alt="avatar" />
                            </div>
                        </div>


                        <div className={`${styles['header__popup-notification']} ${notificationOpen ? styles['active'] : ''} }`}>
                            <ul className={styles['notification__menu']}>
                                <>
                                    {
                                        notificationData.notifications.map((notification, index) => {
                                            return (
                                                <li
                                                    className={styles['notification__menu-item']}
                                                    key={index}
                                                >
                                                    <a href="#">{notification.text ?? ''}</a>
                                                </li>
                                            )
                                        })
                                    }
                                </>
                                <>
                                    {
                                        notificationData.notifications.length === 0 && <li className={styles['notification__menu-item-not-found']}>
                                            <a href="#">You do not have any unread Notifications!</a>
                                        </li>
                                    }
                                </>
                            </ul>
                        </div>

                        <div ref={headerMenuRef} className={`${styles['header__popup-menu']} ${userMenuOpen ? styles.active : ''}`}>
                            <ul className={styles['profile__menu']} onClick={() => setUserMenuOpen(false)}>
                                <li className={styles['profile__menu-item']} >
                                    <Link to="/my-profile">{t('header.myProfile')}</Link>
                                </li>

                                <li className={styles['profile__menu-item']}>
                                    <Link to="/settings">{t('header.settings')}</Link>
                                </li>

                                <li className={styles['profile__menu-item']} onClick={handleLogout}>
                                    <Link to="/" id="logout">{t('header.logout')}</Link>
                                </li>
                            </ul>
                        </div>
                    </>
                }

            </header>
        </>
    )
}

Header.propTypes = {
    type: PropTypes.string
}

export default Header