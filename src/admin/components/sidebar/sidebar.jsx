import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { getRoute } from "../../utils/routes/getRoute";

const Sidebar = () => {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

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
                { title: 'Account Settings', link: getRoute('/') },
                { title: 'Branding', link: getRoute('/branding') },
                { title: 'Subscription', link: getRoute('/subscription') },
                { title: 'Billing', link: getRoute('/billing') },
            ],
        },
        {
            title: 'Directory',
            subMenu: [
                { title: 'Users', link: getRoute('/users') },
                { title: 'Positions', link: getRoute('/positions') },
                { title: 'Levels', link: getRoute('/levels') },
                { title: 'Skills', link: getRoute('/skills') },
                { title: 'Achievements', link: getRoute('/achievements') },
                { title: 'Transactions', link: getRoute('/transactions') },
            ],
        },
        {
            title: 'Rewards',
            subMenu: [
                { title: 'Inventory', link: getRoute('/inventory') },
                { title: 'Requests', link: getRoute('/requests') },
            ],
        },
        {
            title: 'Integrations',
            link: getRoute('/integrations'),
            soon: true,
        },
    ];

    return (
        <section className="sidebar">
            <ul className="sidemenu">
                {menuItems.map((item, index) => (
                    <li key={index} className={`sidemenu__item ${item.subMenu && item.subMenu.some(subItem => currentPath === subItem.link) && 'active'} ${currentPath === item.link && 'active'}`}>
                        {item.link ? (
                            <Link className={`sidemenu__item-link ${item.soon && 'soon'}`} to={item.link}>
                                {item.soon ? (<p>{item.title} <br /><span>Coming soon</span></p>) : (item.title)}
                            </Link>
                        ) : (
                            <Link className={`sidemenu__item-link ${item.soon && 'soon'}`} to={item.link}>
                                {item.soon ? (<p>{item.title} <br /><span>Coming soon</span></p>) : (item.title)}
                            </Link>
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
