import {createFileRoute} from '@tanstack/react-router'
import {protectedRoute} from "../utils/auth.jsx";
import {Helmet} from "react-helmet";
import Header from "../components/header/header.jsx";
import Sidebar from "../components/sidebar/sidebar.jsx";
import MainLayout from "../components/layouts/main-layout/main-layout.jsx";
import {useEffect, useState} from "react";
import Loading from "../components/loading/Loading.jsx";
import {getRewards} from "../utils/fetches/inventory/getRewards.js";
import {performSearch} from "../utils/fetches/inventory/search.js";
import ArchiveConfirmation from "../components/popups/archive-confirmation.jsx";
import {editRewardStatus} from "../utils/fetches/inventory/editRewardStatus.js";
import RewardPopup from "../components/popups/reward-popup.jsx";

export const Route = createFileRoute('/inventory')({
    beforeLoad: ({context, location}) => {
        protectedRoute({location});
    },
    component: () => <Inventory/>
})

const Inventory = () => {
    const [isLoading, setIsLoading] = useState(true);
    
    const [limit, setLimit] = useState();
    const [offset, setOffset] = useState(0);
    const [order, setOrder] = useState('asc');
    
    const [status, setStatus] = useState();
    
    const [rewards, setRewards] = useState([]);
    
    const [isStatusSelectActive, setIsStatusSelectActive] = useState(false);
    
    const [search, setSearch] = useState('');
    const [globalSearch, setGlobalSearch] = useState('');
    
    const [searchResults, setSearchResults] = useState([]);
    
    const [archivePopupRewardId, setArchivePopupRewardId] = useState();
    
    const [isAddRewardPopupActive, setIsAddRewardPopupActive] = useState(false);
    
    const [editRewardId, setEditRewardId] = useState(0);
    
    const handleChangeOrder = () => {
        setIsLoading(true);
        setOrder(order === 'asc' ? 'desc' : 'asc');
    }
    
    const handleStatusChanged = (status) => {
        setStatus(status);
        setIsLoading(true);
    }
    
    const handleSearch = (e) => {
        setSearch(e.target.value);
        
        if (e.target.value === '') {
            setGlobalSearch('');
            setSearchResults([]);
            return;
        }
        
        performSearch(search, status).then((data) => {
            setSearchResults(data.data.rewards);
        });
    }
    
    const handleGlobalSearch = (text) => {
        setGlobalSearch(text);
        document.getElementById('search-input').value = text;
        setIsLoading(true);
        setSearchResults([]);
    }
    
    const handleArchiveReward = (id, newStatus) => {
        editRewardStatus(id, newStatus).then(() => {
            setIsLoading(true);
            
            getRewards(limit, offset, order, status, globalSearch).then((data) => {
                setIsLoading(false);
                setRewards(data.data.rewards);
            });
        });
        setArchivePopupRewardId(0);
    }
    
    const resetSearch = () => {
        setSearch('');
        setGlobalSearch('');
        setSearchResults([]);
        document.getElementById('search-input').value = '';
    }
    
    const handleSave = () => {
        setIsLoading(true);
        setIsAddRewardPopupActive(!isAddRewardPopupActive);
        getRewards(limit, offset, order, status, globalSearch).then((data) => {
            setIsLoading(false);
            setRewards(data.data.rewards);
        });
    }
    
    const handleSaveEdit = () => {
        setIsLoading(true);
        setEditRewardId(0);
        getRewards(limit, offset, order, status, globalSearch).then((data) => {
            setIsLoading(false);
            setRewards(data.data.rewards);
        });
    }
    
    useEffect(() => {
        getRewards(limit, offset, order, status, globalSearch).then((data) => {
            setIsLoading(false);
            setRewards(data.data.rewards);
        });
    }, [globalSearch, limit, offset, order, status]);
    
    return (
        <MainLayout>
            {
                <Helmet>
                    <link rel="stylesheet" href="/css/inventory.css"/>
                </Helmet>
            }
            
            <div className="positions-page">
                <Header/>
                
                <section className="another__wrapper">
                    <Sidebar/>
                    
                    <section className="content acievements rewards">
                        <div id="anchor">
                            <h2>INVENTORY</h2>
                        </div>
                        
                        <div className="content__section">
                            <div className="add-badge">
                                <a onClick={() => setIsAddRewardPopupActive(!isAddRewardPopupActive)} className="add-revard-btn btn">Add Reward</a>
                            </div>
                            <div className="search__wrapper">
                                <span className="search-icon">
                                    <div className="search-input-block">
                                        <input onChange={handleSearch} className="search-input" id="search-input"
                                               type="text" placeholder="Type here to search for Reward..."
                                        />
                                        {globalSearch !== '' && (
                                            <button onClick={resetSearch} className="closeFilter">
                                                <img src="/img/subscription__popup-close.svg" alt=""/>
                                            </button>
                                        )}
                                        {searchResults.length > 0 && (
                                            <div className="search-input-selector">
                                                {searchResults.map((result) => (
                                                    <div key={result.id} className="search-input-option">
                                                        <label onClick={() => handleGlobalSearch(result.title)} className="found_acievements">{result.title}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </span>
                                <div className={`filter-select ${isStatusSelectActive && 'active'}`}>
                                    <div onClick={() => setIsStatusSelectActive(!isStatusSelectActive)}
                                         className={`select-selected ${isStatusSelectActive && 'select-arrow-active'}`}
                                         id="filterSelect">
                                        {status === undefined && 'All'}
                                        {status === true && 'Archived'}
                                        {status === false && 'Active'}
                                    </div>
                                    <span className="line"></span>
                                    {isStatusSelectActive && (
                                        <div className="select-items" id="selectItemsFilter">
                                            <div className="select-option">
                                                <input
                                                    type="checkbox"
                                                    id="all"
                                                    checked={status === undefined || status === null}
                                                    onClick={() => handleStatusChanged()}
                                                />
                                                <label htmlFor="all" className="filterLabel">All</label>
                                            </div>
                                            <div className="select-option">
                                                <input
                                                    type="checkbox"
                                                    id="Pending"
                                                    checked={status === true}
                                                    onClick={() => handleStatusChanged(true)}
                                                />
                                                <label htmlFor="Pending" className="filterLabel">Active</label>
                                            </div>
                                            <div className="select-option">
                                                <input
                                                    type="checkbox"
                                                    id="Approved"
                                                    checked={status === false}
                                                    onClick={() => handleStatusChanged(false)}
                                                />
                                                <label htmlFor="Approved" className="filterLabel">Archived</label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="table">
                                <div className="row row-header">
                                    <div onClick={handleChangeOrder} className="cell id" id="cellId">ID</div>
                                    <div className="cell">Photo</div>
                                    <div className="cell">Title</div>
                                    <div className="cell">Description</div>
                                    <div className="cell">Price</div>
                                    <div className="cell">Status</div>
                                    <div className="cell">Actions</div>
                                </div>
                                
                                {rewards.map((reward) => (
                                    <div className="row row-item" key={reward.id}>
                                        <div className="cell id" id="cellId"><span>{reward.id}</span></div>
                                        <div className="cell acievements-icon">
                                            <div className="acievements-bg">
                                                <img src="/img/rewards-img-1.jpg" alt=""/>
                                            </div>
                                        </div>
                                        <div className="cell name">{reward.title}</div>
                                        <div className="cell condition">
                                            <p>
                                                <span>{reward.description}</span> <br/>
                                                <span>Size: {reward.size}</span>
                                            </p>
                                        </div>
                                        <div className="cell">
                                            <p className="coins">{reward.price}</p>
                                        </div>
                                        <div className="cell">{reward.active !== true ? "Archived" : "Active"}</div>
                                        <div className="cell actions">
                                            <span onClick={() => setEditRewardId(reward.id)} className="edit"></span>
                                            <span onClick={() => setArchivePopupRewardId(reward.id)} className={`archive ${reward.active !== true && "deactivate"}`}></span>
                                            {archivePopupRewardId === reward.id && (
                                                <ArchiveConfirmation handlerConfirm={() => handleArchiveReward(reward.id, !reward.active)} handlerReject={() => setArchivePopupRewardId(0)} />
                                            )}
                                            {editRewardId === reward.id && <RewardPopup handler={handleSaveEdit} json={
                                                {
                                                    id: reward.id,
                                                    title: reward.title,
                                                    description: reward.description,
                                                    size: reward.size,
                                                    price: reward.price,
                                                    status: reward.active,
                                                    edit: true
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
            
            {isAddRewardPopupActive && <RewardPopup handler={handleSave} />}
        </MainLayout>
    );
};

export default Inventory;