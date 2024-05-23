import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getRoute } from "../../utils/routes/getRoute";

const Header = () => {
    const [profilePopup, setProfilePopup] = useState(false);
    const navigate = useNavigate();

    const toggleProfilePopup = (event) => {
        event.preventDefault();
        setProfilePopup(!profilePopup);
    }

    const handleLogOut = (event) => {
        event.preventDefault();
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate({ to: getRoute('/login') });
    }

    return (
        <header className="header">
            <div className="container">
                <a className="header__logo" href="/">
                    <img src="/img/header-logo.svg" alt="logo" />
                </a>
                <div className="header__profile">
                    <a onClick={toggleProfilePopup} className="header__avatar" href="#">
                        <div className="avatar-img">
                            <img src="/img/avatar.svg" alt="avatar" />
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