import { useState } from "react";
import headerLogo from "/img-admin/header-logo.svg"
import avatarImg from "/img-admin/avatar.svg"
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../portal/store/actions/user";
import { showOverlay } from "../../../portal/store/actions/global";

const Header = () => {
    const [profilePopup, setProfilePopup] = useState(false);
    const dispatch = useDispatch()

    const toggleProfilePopup = (event) => {
        event.preventDefault();
        setProfilePopup(!profilePopup);
    }

    const handleLogOut = (event) => {
        event.preventDefault();
        // document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        dispatch(showOverlay())
        dispatch(logoutUser())
        window.location.replace(`${import.meta.env.VITE_APP_AUTH_DOMAIN}/login`)
    }

    return (
        <header className="header">
            <div className="container">
                <Link className="header__logo" to={'/'}>
                    <img src={headerLogo} alt="logo" />
                </Link>
                <div className="header__profile">
                    <a onClick={toggleProfilePopup} className="header__avatar" href="#">
                        <div className="avatar-img">
                            <img src={avatarImg} alt="avatar" />
                        </div>
                    </a>
                    {profilePopup && (
                        <div className="header__profile-popup active">
                            <p>My Profile</p>
                            <ul className="header__profile-menu">
                                <li className="profile__menu-item">
                                    <a href="#">Leaderboard</a>
                                </li>
                                <li className="profile__menu-item">
                                    <a href="#">Reports</a>
                                </li>
                                <li className="profile__menu-item">
                                    <a href="#">Settings</a>
                                </li>
                                <li className="profile__menu-item">
                                    <a href="#">Approvals</a>
                                </li>
                                <li className="profile__menu-item">
                                    <a href="#">Rewards</a>
                                </li>
                                <li onClick={handleLogOut} className="profile__menu-item">
                                    <a href="#">Log Out</a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;