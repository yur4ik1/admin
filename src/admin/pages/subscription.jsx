import {createFileRoute} from '@tanstack/react-router'
import {protectedRoute} from "../utils/auth.jsx";
import Header from "../components/header/header.jsx";
import Sidebar from "../components/sidebar/sidebar.jsx";
import MainLayout from "../components/layouts/main-layout/main-layout.jsx";
import {useEffect, useState} from "react";
import Loading from "../components/loading/Loading.jsx";
import {getUsers} from "../utils/fetches/subsciption/getUsers.js";
import SubscriptionPopup from "../components/popups/subscription-popup.jsx";
import CloseSubscriptionPopup from "../components/popups/close-subsciption-popup.jsx";

export const Route = createFileRoute('/subscription')({
    beforeLoad: ({context, location}) => {
        protectedRoute({location});
    },
    component: () => <Subscription/>
})

const Subscription = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState(0);
    
    const [isUpgradePopupActive, setIsUpgradePopupActive] = useState(false);
    const [isCloseSubscriptionPopupActive, setIsCloseSubscriptionPopupActive] = useState(false);
    
    const handleUpgradePopup = (event) => {
        event.preventDefault()
        setIsUpgradePopupActive(!isUpgradePopupActive);
    }
    
    if (isUpgradePopupActive === true) {
        document.body.style.overflow = 'hidden';
    }

    const handleCloseSubscriptionPopup = (event) => {
        event.preventDefault();
        setIsCloseSubscriptionPopupActive(!isCloseSubscriptionPopupActive);
    }
    
    useEffect(() => {
        getUsers().then((data) => {
            setUsers(data.data.users_aggregate.aggregate.count);
            setIsLoading(false);
        });
    }, []);
    
    return (
        <MainLayout>
            <div className="subscription-page">
                <Header/>
                
                <section className="another__wrapper">
                    <Sidebar/>
                    
                    <section className="content subscription">
                        {isLoading && <Loading/>}
                        <h2>SUBSCRIPION</h2>
                        <div className="content__section">
                            <h3 className="content__section-title">Subscription Summary</h3>
                            <div className="content__block">
                                <div className="summary">
                                    <p className="number" id="userCount">
                                        {users}
                                    </p>
                                    <p className="text">Licensed Users</p>
                                </div>
                            </div>
                            <div className="content__block pro">
                                <div className="summary">
                                    {/* <p className="number">Light</p> */}
                                    <p className="number">Free</p>
                                    <p className="text">Current Plan</p>
                                    <div className="summary__btns">
                                        <a onClick={handleUpgradePopup} className="downgrade__btn btn" href="#">Downgrade</a>
                                        <a onClick={handleUpgradePopup} className="upgrade__btn btn">Upgrade</a>
                                    </div>
                                </div>
                            </div>
                            <div className="subscription__content-bottom">
                                <p className="zone">Danger Zone</p>
                                <a onClick={handleCloseSubscriptionPopup} className="zone__btn" href="#">Cancel Subscription</a>
                                {
                                    isCloseSubscriptionPopupActive && <CloseSubscriptionPopup handler={handleCloseSubscriptionPopup}/>
                                }
                            </div>
                        </div>
                    </section>
                </section>
                
                {isUpgradePopupActive && <SubscriptionPopup handler={handleUpgradePopup}/>}
            </div>
        </MainLayout>
    );
};

export default Subscription;