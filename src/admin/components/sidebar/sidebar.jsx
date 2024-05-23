import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { router } from "../../../utils/routes";

const Sidebar = () => {
    const [currentPath] = useState(window.location.pathname);

    useEffect(() => {
        const sidemenuItem = document.querySelectorAll('.sidemenu__item');

        if (sidemenuItem) {
            sidemenuItem.forEach(menu => {
                menu.addEventListener('click', function () {
                    sidemenuItem.forEach(menu => menu.classList.remove('active'));
                    this.classList.add('active');
                });
            });
        }
    }, []);

    const menuItems = [
        {
            title: 'Company',
            subMenu: [
                { title: 'Account Settings', link: router.adminBase },
                { title: 'Branding', link: router.adminBranding },
                { title: 'Subscription', link: router.adminSubscription },
                { title: 'Billing', link: router.adminBilling },
            ],
        },
        {
            title: 'Directory',
            subMenu: [
                { title: 'Users', link: router.adminUsers },
                { title: 'Positions', link: router.adminPositions },
                { title: 'Levels', link: router.adminLevels },
                { title: 'Skills', link: router.adminSkills },
                { title: 'Achievements', link: router.adminAchievements },
                { title: 'Transactions', link: router.adminTransactions },
            ],
        },
        {
            title: 'Rewards',
            subMenu: [
                { title: 'Inventory', link: router.adminInventory },
                { title: 'Requests', link: router.adminRequests },
            ],
        },
        {
            title: 'Integrations', link: router.adminIntegrations, soon: true,
        },
    ];

    return (
        <section className="sidebar">
            <ul className="sidemenu">
                {menuItems.map((item, index) => (
                    <li key={index} className={`sidemenu__item ${item.subMenu && item.subMenu.some(subItem => currentPath === subItem.link) && 'active'} ${currentPath === item.link && 'active'}`}>
                        {item.link ? (
                            <>
                                <Link className={`sidemenu__item-link ${item.soon && 'soon'}`} to={item.link}>
                                    {item.soon ? (<p>{item.title} <br /><span>Coming soon</span></p>) : (item.title)}
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link className={`sidemenu__item-link ${item.soon && 'soon'}`} to={item.link}>
                                    {item.soon ? (<p>{item.title} <br /><span>Coming soon</span></p>) : (item.title)}
                                </Link>
                            </>
                        )}

                        {item.subMenu && (
                            <ul className="submenu">
                                {item.subMenu.map((subItem, subIndex) => (
                                    <li key={subIndex} className={`submenu__item ${currentPath === subItem.link && 'active'}`}>
                                        <Link className="submenu__item-link" to={subItem.link}>{subItem.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default Sidebar;
