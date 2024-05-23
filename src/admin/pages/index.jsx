import { createFileRoute } from '@tanstack/react-router'
import { protectedRoute } from "../utils/auth.jsx";
import MainLayout from "../components/layouts/main-layout/main-layout.jsx";
import Header from "../components/header/header.jsx";
import Sidebar from "../components/sidebar/sidebar.jsx";
import { useEffect, useState } from "react";
import Loading from "../components/loading/Loading.jsx";
import { getCompany } from "../utils/fetches/account-settings/getCompany.js";
import { getAllUsers } from "../utils/fetches/account-settings/getAllUsers.js";
import { saveSettings } from "../utils/fetches/account-settings/saveSettings.js";

export const Route = createFileRoute('/')({
    beforeLoad: ({ context, location }) => {
        protectedRoute({ location });
    },
    component: Home,
})

function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);

    const [company, setCompany] = useState({});
    console.log(company)
    const [users, setUsers] = useState([{}]);

    const [selectedUser, setSelectedUser] = useState(null);
    const [isUserSelectActive, setIsUserSelectActive] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setBtnLoading(true);
        setIsLoading(true);

        const updatedCompany = {
            ...company,
            company_owner: selectedUser,
        };

        saveSettings(company).then(() => {
            setBtnLoading(false);
            setIsLoading(false);
        });
    }

    useEffect(() => {
        getCompany().then((data) => {
            setCompany(data.data.company[0]);

            setIsLoading(false);
            /*defaultValue={company.company_owner.firstname + ' ' + company.company_owner.lastname}*/
        });

        getAllUsers().then((data) => {
            setUsers(data.data.users);

            setIsLoading(false);
        });
    }, []);

    const handleUserSelect = (user) => {
        console.log(user)
        window.localStorage.setItem("accountOwner", `${user.firstname} ${user.lastname}`)
        setSelectedUser(user);
        setIsUserSelectActive(false);
    };


    return (
        <MainLayout>
            <div className="account-settings">
                <Header />

                <section className="another__wrapper">
                    <Sidebar />

                    <section className="content">
                        <div className="leaves"></div>
                        <h2>ACCOUNT SETTING</h2>

                        <form className="account-setting" id="account-setting" action="#">
                            <div className="account-owner">
                                <label>
                                    * Account Owner
                                    <div className="new__custom-select-wrapper">
                                        <div
                                            className={`new__custom-select ownerField ${isUserSelectActive && 'open'}`}>
                                            <span className="line"></span>
                                            <div className="arrow"></div>
                                            <div onClick={() => setIsUserSelectActive(!isUserSelectActive)}
                                                className={`new__custom-select__trigger ${company.company_owner && 'selected-select-custom'}`}
                                                id="searchInput" suppressContentEditableWarning={true}>
                                                {/*{company.company_owner ? (`${company.company_owner.firstname} ${company.company_owner.lastname}`) : 'Type here to search for Owner...'}*/}
                                                {selectedUser ? (`${selectedUser.firstname} ${selectedUser.lastname}`) : window.localStorage.getItem("accountOwner")}

                                            </div>
                                            {isUserSelectActive && (
                                                users.length > 0 && (
                                                    <>
                                                        <div className="new__custom-options" id="selectOwner">
                                                            {users.map((user, index) => (
                                                                <div key={index}
                                                                    className="new__custom-option"
                                                                    data-value={user.id}
                                                                    onClick={() => handleUserSelect(user)}
                                                                >
                                                                    {user.firstname} {user.lastname}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="ownerscroll"></div>
                                                    </>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </label>
                                <button type="submit">Change</button>
                            </div>

                            <div className="company-info">
                                <div className="left">
                                    <h4>Company Information</h4>
                                    <label>* Company Name
                                        <input onChange={(e) => setCompany(
                                            {
                                                ...company,
                                                name: e.target.value
                                            }
                                        )} type="text" placeholder="Company" id="companyName"
                                            defaultValue={company.name} />
                                    </label>
                                    <div className="country">
                                        <label>* Country
                                            <div className="new__custom-select-wrapper">
                                                <div className="new__custom-select">
                                                    <input
                                                        onChange={(e) => setCompany(
                                                            {
                                                                ...company,
                                                                country: e.target.value
                                                            })}
                                                        className="new__custom-select__trigger selected-select-custom"
                                                        id="country"
                                                        type="text"
                                                        placeholder="Country"
                                                        defaultValue={company.country}
                                                    />

                                                    {/*<div className="arrow"></div>*/}

                                                    {/*<div className="new__custom-options">
                                                    </div>
                                                    <div className="custom-scrollbar"></div>*/}
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                    <label>
                                        State
                                        <input onChange={(e) => setCompany(
                                            {
                                                ...company,
                                                cstate: e.target.value
                                            }
                                        )} type="text" placeholder="DE" id="state" defaultValue={company.cstate} />
                                    </label>
                                </div>
                                <div className="right">
                                    <label>
                                        Ninjable URL
                                        <input
                                            onChange={(e) => setCompany(
                                                {
                                                    ...company,
                                                    url: e.target.value
                                                })}
                                            type="text"
                                            placeholder="Company.Ninjable.io"
                                            id="ninjableUrl"
                                            defaultValue={company.url} />
                                    </label>
                                    <label>
                                        City
                                        <input onChange={(e) => setCompany(
                                            {
                                                ...company,
                                                city: e.target.value
                                            }
                                        )} type="text" placeholder="Wilmington" id="city" defaultValue={company.city} />
                                    </label>
                                    <label>
                                        Zip
                                        <input onChange={(e) => setCompany(
                                            {
                                                ...company,
                                                zip: e.target.value
                                            }
                                        )} type="text" placeholder="123456" id="zip" defaultValue={company.zip} />
                                    </label>
                                </div>
                            </div>
                            <div className="company-info address">
                                <label>
                                    Address 1
                                    <input onChange={(e) => setCompany(
                                        {
                                            ...company,
                                            address1: e.target.value
                                        }
                                    )} type="text" placeholder="Gorodetskaya street, 8A" id="address1"
                                        defaultValue={company.address1} />
                                </label>
                                <label>
                                    Address 2
                                    <input onChange={(e) => setCompany(
                                        {
                                            ...company,
                                            address2: e.target.value
                                        }
                                    )} type="text" placeholder="Gorodetskaya street, 8A" id="address2"
                                        defaultValue={company.address2} />
                                </label>
                            </div>
                            <div className="save-btn">
                                <button onClick={handleSave} className={`btn ${btnLoading && 'btn-loading'}`}
                                    type="submit" id="btnSave">Save
                                </button>
                            </div>

                            {isLoading && (
                                <Loading />
                            )}
                        </form>
                    </section>
                </section>
            </div>
        </MainLayout>
    )
}

export default Home