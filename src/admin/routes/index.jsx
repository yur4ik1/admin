import {createFileRoute} from '@tanstack/react-router'
import {protectedRoute} from "../utils/auth.jsx";
import MainLayout from "../components/layouts/main-layout/main-layout.jsx";
import Header from "../components/header/header.jsx";
import Sidebar from "../components/sidebar/sidebar.jsx";
import {useEffect, useState} from "react";
import Loading from "../components/loading/Loading.jsx";
import {getCompany} from "../utils/fetches/account-settings/getCompany.js";
import {getAllUsers} from "../utils/fetches/account-settings/getAllUsers.js";
import {saveSettings} from "../utils/fetches/account-settings/saveSettings.js";
import {performSearch} from "../utils/fetches/positions/search.js";

export const Route = createFileRoute('/')({
    beforeLoad: ({context, location}) => {
        protectedRoute({location});
    },
    component: Home,
})

function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);

    const [company, setCompany] = useState({});
    const [countries, setCountries] = useState([]);
    const [users, setUsers] = useState([{}]);

    const [selectedUser, setSelectedUser] = useState(null);
    const [isUserSelectActive, setIsUserSelectActive] = useState(false);
    const [isCountrySelectActive, setIsCountrySelectActive] = useState(false);

    const [searchCountryResult, setSearchCountryResult] = useState('');

    const [isFormChanged, setIsFormChanged] = useState(false);
    const [initialCompany, setInitialCompany] = useState({});


    const [searchCountry, setSearchCountry] = useState('')


    useEffect(() => {
        const isDirty = JSON.stringify(company) !== JSON.stringify(initialCompany);
        setIsFormChanged(isDirty);
    }, [company, initialCompany]);


    const undoBotton = () => {
        setCompany(initialCompany);
        setIsFormDirty(false);
    }

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

    const handleCountrySelect = (country) => {
        setCompany({
            ...company,
            country: country.name
        });
        document.getElementById('countryInput').value = '';
        setSearchCountry(country.name);
        setIsCountrySelectActive(false)
        setSearchCountryResult('');
    }

    const handleUserSelect = (user) => {
        console.log(user)
        window.localStorage.setItem("accountOwner", `${user.firstname} ${user.lastname}`)
        setSelectedUser(user);
        setIsUserSelectActive(false);
    };

    const handleSearchCountry = (search) => {
        setSearchCountry(search)
        if (search === '') {
            setSearchCountryResult('');
        }
        setSearchCountryResult(search);
    }
    const filterCountry = () => {
        if (searchCountryResult === '') {
            return countries;
        } else {
            return countries.filter((country) => country.name.toLowerCase().startsWith(searchCountryResult.toLowerCase()));
        }
    };

    useEffect(() => {
        getCompany().then((data) => {
            setCompany(data.data.company[0]);
            setIsLoading(false);
            setInitialCompany(data.data.company[0]);
            setSearchCountry(data.data.company[0].country)
        });
        getAllUsers().then((data) => {
            setUsers(data.data.users);
            setIsLoading(false);
        });
        const getCountry = async () => {
            try {
                const response = await fetch('src/utils/static_data/country.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const jsonData = await response.json();
                setCountries(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        getCountry();
    }, []);

    return (
        <MainLayout>
            <div className="account-settings">
                <Header/>

                <section className="another__wrapper">
                    <Sidebar/>

                    <section className="content">
                        <div className="leaves"></div>
                        <h2>ACCOUNT SETTING</h2>

                        <form className="account-setting" id="account-setting" action="#">
                            <div className="account-owner">
                                <label>Account Owner
                                    <div className="new__custom-select-wrapper">
                                        <div
                                            className={`new__custom-select ownerField ${isUserSelectActive && 'open'}`}>
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
                            </div>

                            <div className="company-info">
                                <div className="left">
                                    <h4>Company Information</h4>
                                    <label>Company Name
                                        <input onChange={(e) => setCompany(
                                            {
                                                ...company,
                                                name: e.target.value
                                            }
                                        )} type="text" placeholder="Company" id="companyName"
                                               defaultValue={company.name}/>
                                    </label>
                                    <label>Country
                                        <div className="new__custom-select-wrapper">
                                            {/*className={`new__custom-select ${isUserSelectActive ? 'open' : ''}`}*/}
                                            <div onClick={() => setIsCountrySelectActive(prevState => !prevState)}>
                                                <div className="arrow"></div>
                                                <input
                                                    // defaultValue={company.country}
                                                    placeholder={'Country'}
                                                    value={searchCountry}
                                                    // defaultValue={searchCountry !== "" ? searchCountry : company.country}
                                                    id={"countryInput"}
                                                    onChange={(e) => {
                                                        handleSearchCountry(e.target.value)
                                                    }}
                                                />
                                                {isCountrySelectActive && (
                                                    countries.length > 0 && (
                                                        <div className="new__custom-option-inputs">
                                                            {filterCountry().map((country, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="new__custom-option"
                                                                    onClick={() => handleCountrySelect(country)}
                                                                >
                                                                    {country.name}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </label>

                                    <label>
                                        <div>State <span className="lable-span">(Optional)</span></div>
                                        <input onChange={(e) => setCompany(
                                            {
                                                ...company,
                                                cstate: e.target.value
                                            }
                                        )} type="text" placeholder="DE" id="state" defaultValue={company.cstate}/>
                                    </label>
                                </div>
                                <div className="right">
                                    <label>
                                        <div>Ninjable URL <span className="lable-span">(Optional)</span></div>
                                        <input
                                            onChange={(e) => setCompany(
                                                {
                                                    ...company,
                                                    url: e.target.value
                                                })}
                                            type="text"
                                            placeholder="Company.Ninjable.io"
                                            id="ninjableUrl"
                                            defaultValue={company.url}
                                            readOnly={true}
                                        />
                                    </label>
                                    <label>
                                        <div>City <span className="lable-span">(Optional)</span></div>
                                        <input onChange={(e) => setCompany(
                                            {
                                                ...company,
                                                city: e.target.value
                                            }
                                        )} type="text" placeholder="Wilmington" id="city" defaultValue={company.city}/>
                                    </label>
                                    <label>
                                        <div>Zip <span className="lable-span">(Optional)</span></div>
                                        <input onChange={(e) => setCompany(
                                            {
                                                ...company,
                                                zip: e.target.value
                                            })}
                                               type="text"
                                               placeholder="123456"
                                               id="zip"
                                               defaultValue={company.zip}/>
                                    </label>
                                </div>
                            </div>
                            <div className="company-info address">
                                <label>
                                    <div>Address 1 <span className="lable-span">(Optional)</span></div>
                                    <input onChange={(e) => setCompany(
                                        {
                                            ...company,
                                            address1: e.target.value
                                        }
                                    )} type="text" placeholder="Enter your address" id="address1"
                                           defaultValue={company.address1}/>
                                </label>
                                <label>
                                    <div>Address 2 <span className="lable-span">(Optional)</span></div>
                                    <input
                                        onChange={(e) => setCompany(
                                            {
                                                ...company,
                                                address2: e.target.value
                                            })}
                                        type="text"
                                        placeholder="Enter your address"
                                        defaultValue={company.address2}/>
                                </label>
                            </div>
                            <div className="save-btn">
                                <button
                                    type={'reset'}
                                    className={`undo-button ${btnLoading && 'btn-loading'}`}
                                    onClick={undoBotton}
                                    style={{display: isFormChanged ? 'block' : 'none'}}
                                >
                                    Undo
                                </button>
                                <button onClick={handleSave} className={`btn ${btnLoading && 'btn-loading'}`}
                                        type="submit">
                                    Save Changes
                                </button>
                            </div>

                            {isLoading && (
                                <Loading/>
                            )}
                        </form>
                    </section>
                </section>
            </div>
        </MainLayout>
    )
}