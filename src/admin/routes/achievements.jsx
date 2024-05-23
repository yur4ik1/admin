import {createFileRoute} from '@tanstack/react-router'
import {protectedRoute} from "../utils/auth.jsx";
import Header from "../components/header/header.jsx";
import Sidebar from "../components/sidebar/sidebar.jsx";
import MainLayout from "../components/layouts/main-layout/main-layout.jsx";
import {Helmet} from "react-helmet";
import {useEffect, useState} from "react";
import Loading from "../components/loading/Loading.jsx";
import {getAchievements} from "../utils/fetches/achievements/getAchievements.js";
import {performSearch} from "../utils/fetches/achievements/search.js";
import ArchiveConfirmation from "../components/popups/archive-confirmation.jsx";
import {editBadgeStatus} from "../utils/fetches/achievements/editBadgeStatus.js";
import AchievementsPopup from "../components/popups/achievements-popup.jsx";

export const Route = createFileRoute('/achievements')({
    beforeLoad: ({context, location}) => {
        protectedRoute({location});
    },
    component: () => <Achievements />
})

const Achievements = () => {
    const [isLoading, setIsLoading] = useState(true);
    
    const [limit, setLimit] = useState();
    const [offset, setOffset] = useState(0);
    const [order, setOrder] = useState("asc");
    
    const [status, setStatus] = useState();
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    
    const [achievements, setAchievements] = useState([]);
    
    const [isFilterStatusActive, setIsFilterStatusActive] = useState(false);
    
    const [globalSearch, setGlobalSearch] = useState('');
    
    const [isArchiveConfirmationActive, setIsArchiveConfirmationActive] = useState(0);
    
    const [isAddAchievementPopupActive, setIsAddAchievementPopupActive] = useState(false);
    
    const [isEditAchievementPopupId, setIsEditAchievementPopupId] = useState(0);
    
    const handleOrderChange = () => {
        setOrder(order === "asc" ? "desc" : "asc");
        setIsLoading(true);
    }
    
    const handleChangeStatus = (status) => {
        setStatus(status);
        setIsLoading(true);
    }
    
    const handleSearch = (search) => {
        if (search === '') {
            setGlobalSearch('');
            setSearchResults([]);
            return;
        }
        
        setSearch(search);
        performSearch(search, status).then((data) => {
            setSearchResults(data.data.badges);
            setIsLoading(false);
        });
    }
    
    const handleGlobalSearch = (search) => {
        setGlobalSearch(search);
        setSearch('');
        setSearchResults([]);
        document.getElementById("search-input").value = search;
        setIsLoading(true);
    }
    
    const handleEditBadgeStatus = (id, newStatus) => {
        editBadgeStatus(id, newStatus).then(() => {
            setIsLoading(true);
            setIsArchiveConfirmationActive(0);
            
            getAchievements(limit, offset, order, status, globalSearch).then((data) => {
                setAchievements(data.data.badges);
                setIsLoading(false);
            });
        });
    }
    
    const resetSearch = () => {
        setGlobalSearch('');
        setSearch('');
        setSearchResults([]);
        document.querySelector("#search-input").value = '';
    }
    
    const handleAddAchievement = () => {
        setIsLoading(true);
        setIsAddAchievementPopupActive(false);
        
        getAchievements(limit, offset, order, status, globalSearch).then((data) => {
            setAchievements(data.data.badges);
            setIsLoading(false);
        });
    }
    
    const handleEditAchievement = () => {
        setIsLoading(true);
        setIsAddAchievementPopupActive(false);
        setIsEditAchievementPopupId(0);
        
        getAchievements(limit, offset, order, status, globalSearch).then((data) => {
            setAchievements(data.data.badges);
            setIsLoading(false);
        });
    }
    
    useEffect(() => {
        const achievementsTitleIco = document.querySelector(".acievements-info"),
            achievementsTitlePopup = document.querySelector(".acievements-title");
        achievementsTitleIco && achievementsTitlePopup && (achievementsTitleIco.addEventListener("click", ()=>{
            achievementsTitlePopup.classList.toggle("active")
        }));
        
        getAchievements(limit, offset, order, status, globalSearch).then((data) => {
            setAchievements(data.data.badges);
            setIsLoading(false);
        });
    }, [globalSearch, limit, offset, order, status]);
    return (
        <MainLayout>
            {
                <Helmet><link rel="stylesheet" href="/css/achievements.css"/></Helmet>
            }
            
            <div className="acievements-page">
                <Header/>
                
                <section className="another__wrapper">
                    <Sidebar/>
                    
                    <section className="content acievements">
                        <div id="anchor">
                            <h2>ACHIEVEMENTS <span className="acievements-info"></span></h2>
                        </div>
                        <div className="info-popup acievements-title">
                            <p>
                                You can have only 5 active challenges. <br/>
                                To have more, please visit upgrade your Plan.
                            </p>
                        </div>
                        
                        <div className="content__section">
                            <div className="add-badge">
                                <a onClick={() => setIsAddAchievementPopupActive(!isAddAchievementPopupActive)} className="add-badge-btn btn">Add Badge</a>
                            </div>
                            <div className="search__wrapper">
                                <span className="search-icon">
                                    <div className="search-input-block">
                                        <input onChange={(e) => handleSearch(e.target.value)} className="search-input" id="search-input" type="text"
                                               placeholder="Type here to search for Achievements..."/>
                                        {globalSearch !== '' && (
                                            <button onClick={resetSearch} className="closeFilter">
                                                <img src="/img/subscription__popup-close.svg" alt=""/>
                                            </button>
                                        )}
                                        {searchResults.length > 0 && (
                                            <div className="search-input-selector">
                                                {searchResults.map((result) => (
                                                    <label onClick={() => handleGlobalSearch(result.title)} key={result.id} className="found_acievements">
                                                        {result.title}
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </span>
                                <div className={`filter-select ${isFilterStatusActive && 'active'}`}>
                                    <div onClick={() => setIsFilterStatusActive(!isFilterStatusActive)} className={`select-selected ${isFilterStatusActive && 'select-arrow-active'}`} id="filterSelect">
                                        {status === undefined ? "All" : status ? "Active" : "Archived"}
                                    </div>
                                    <span className="line"></span>
                                    {isFilterStatusActive && (
                                        <div className="select-items" id="selectItemsFilter">
                                            <div className="select-option">
                                                <input type="checkbox" id="all" onClick={() => handleChangeStatus()} checked={status === undefined && true}/>
                                                <label htmlFor="all" className="filterLabel">All</label>
                                            </div>
                                            <div className="select-option">
                                                <input type="checkbox" id="active" onClick={() => handleChangeStatus(true)} checked={status === true && true}/>
                                                <label htmlFor="active" className="filterLabel">Active</label>
                                            </div>
                                            <div className="select-option">
                                                <input type="checkbox" id="Archived" onClick={() => handleChangeStatus(false)} checked={status === false && true}/>
                                                <label htmlFor="Archived" className="filterLabel">Archived</label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="table">
                                <div className="row row-header">
                                    <div onClick={handleOrderChange} className="cell id" id="cellId">ID</div>
                                    <div className="cell">Icon</div>
                                    <div className="cell">Name</div>
                                    <div className="cell">Condition</div>
                                    <div className="cell">Reward</div>
                                    <div className="cell">Status</div>
                                    <div className="cell">Actions</div>
                                </div>
                                
                                {achievements.map((achievement) => (
                                    <div className="row row-item" key={achievement.id}>
                                    <div className="cell id" id="cellId">{achievement.id}</div>
                                        <div className="cell acievements-icon">
                                            <div className="acievements-bg">
                                                <img src="/img/acievements-img-1.png" alt=""/>
                                            </div>
                                        </div>
                                        <div className="cell name">{achievement.title}</div>
                                        <div className="cell condition">
                                            <div>
                                                <span>{achievement.ctype}: {achievement.camount}</span><br/>
                                                <span>Period: {achievement.cperiod}</span><br/>
                                                <span>Badges Amount: {achievement.cbamount}</span><br/>
                                            </div>
                                        </div>
                                        <div className="cell">
                                            <p className="coins">{achievement.creward}</p>
                                        </div>
                                        <div className="cell">
                                            {achievement.active ? "Active" : "Inactive"}
                                        </div>
                                        <div className="cell actions">
                                            <span onClick={() => setIsEditAchievementPopupId(achievement.id)} className="edit"></span>
                                            <span className={`archive ${achievement.active ? "" : " deactivate"}`} onClick={() => setIsArchiveConfirmationActive(achievement.id)}></span>
                                            
                                            {isArchiveConfirmationActive === achievement.id && (
                                                <ArchiveConfirmation handlerReject={() => setIsArchiveConfirmationActive(0)} handlerConfirm={() => handleEditBadgeStatus(achievement.id, !achievement.active)} />
                                            )}
                                            
                                            {isEditAchievementPopupId === achievement.id && <AchievementsPopup handler={handleEditAchievement} json={
                                                {
                                                    edit: true,
                                                    id: achievement.id,
                                                    name: achievement.title,
                                                    type: achievement.ctype,
                                                    amount: achievement.camount,
                                                    period: achievement.cperiod,
                                                    badges: achievement.cbamount,
                                                    reward: achievement.creward,
                                                    status: achievement.active ? "Active" : "Inactive"
                                                }
                                            } />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {isLoading && <Loading/>}
                            
                            {/*<div className="navigation" id="navigation">
                                <span className="prev" id="btnPrev"></span>
                                <span className="page active" id="firstCircle">1</span>
                                <span className="page" id="secondCircle">2</span>
                                <span className="next" id="btnNext"></span>
                            </div>*/}
                        </div>
                    </section>
                </section>
            </div>
            
            {isAddAchievementPopupActive && <AchievementsPopup handler={handleAddAchievement} /> }
        </MainLayout>
    );
};

export default Achievements;