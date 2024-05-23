import {createFileRoute} from "@tanstack/react-router";
import {protectedRoute} from "../utils/auth.jsx";
import Header from "../components/header/header.jsx";
import Sidebar from "../components/sidebar/sidebar.jsx";
import MainLayout from "../components/layouts/main-layout/main-layout.jsx";
import {Helmet} from "react-helmet";
import {useEffect, useState} from "react";
import Loading from "../components/loading/Loading.jsx";
import {getRequests} from "../utils/fetches/requests/getRequests.js";
import EditRequest from "../components/popups/edit-request.jsx";

export const Route = createFileRoute('/requests')({
    beforeLoad: ({context, location}) => {
        protectedRoute({location});
    },
    component: () => <Requests/>
})

const Requests = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterStatusOpen, setIsFilterStatusOpen] = useState(false);
    
    const [limit, setLimit] = useState();
    const [offset, setOffset] = useState(0);
    const [order, setOrder] = useState('asc');
    
    const [status, setStatus] = useState();
    
    const [requests, setRequests] = useState([]);
    
    const [isEditPopupActive, setIsEditPopupActive] = useState(false);
    
    const [editRequestId, setEditRequestId] = useState();
    const [editRequestComment, setEditRequestComment] = useState();
    const [editRequestStatus, setEditRequestStatus] = useState();
    
    const handleEditPopupActive = () => {
        setIsEditPopupActive(!isEditPopupActive);
        
        getRequests(limit, offset, order, status).then((data) => {
            setRequests(data.data.rewards_requests);
            setIsLoading(false);
        });
    }
    
    const handleEditPopup = (id, comment, status) => {
        setEditRequestId(id);
        setEditRequestComment(comment);
        setEditRequestStatus(status);
        handleEditPopupActive();
    }
    
    const handleOrderChanged = () => {
        setOrder(order === 'asc' ? 'desc' : 'asc');
        
        setIsLoading(true);
    }
    
    const handleStatusChanged = (status) => {
        setStatus(status);
        setIsLoading(true);
    }
    
    useEffect(() => {
        getRequests(limit, offset, order, status).then((data) => {
            setRequests(data.data.rewards_requests);
            setIsLoading(false);
        });
    }, [limit, offset, order, status]);
    
    return (
        <MainLayout>
            {
                <Helmet><link rel="stylesheet" href="/css/requests.css"/></Helmet>
            }
            
            <div className="requests-page">
                <Header/>
                
                <section className="another__wrapper">
                    <Sidebar/>
                    
                    <section className="content requests">
                        <div id="anchor">
                            <h2>REQUEST</h2>
                        </div>
                        <div className="content__section">
                            <div className="search__wrapper">
                                {/*<span className="search-icon hidden">
                                    <div className="search-input-block">
                                        <input className="search-input" id="search-input" type="text"
                                               placeholder="Type here to search for Reward..."/>
                                        <button className="closeFilter hidden">
                                            <img src="/img/subscription__popup-close.svg" alt=""/>
                                        </button>
                                        <div className="search-input-selector hidden">
                                        </div>
                                    </div>
                                </span>*/}
                                <div className={`filter-select ${isFilterStatusOpen && 'active'}`}>
                                    <div onClick={() => setIsFilterStatusOpen(!isFilterStatusOpen)} className={`select-selected ${isFilterStatusOpen && 'select-arrow-active'}`} id="filterSelect">
                                        {status === undefined && 'All'}
                                        {status === 0 && 'Pending'}
                                        {status === 1 && 'Approved'}
                                        {status === 2 && 'Rejected'}
                                    </div>
                                    <span className="line"></span>
                                    {isFilterStatusOpen && (
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
                                                    checked={status === 0}
                                                    onClick={() => handleStatusChanged(0)}
                                                />
                                                <label htmlFor="Pending" className="filterLabel">Pending</label>
                                            </div>
                                            <div className="select-option">
                                                <input
                                                    type="checkbox"
                                                    id="Approved"
                                                    checked={status === 1}
                                                    onClick={() => handleStatusChanged(1)}
                                                />
                                                <label htmlFor="Approved" className="filterLabel">Approved</label>
                                            </div>
                                            <div className="select-option">
                                                <input
                                                    type="checkbox"
                                                    id="Rejected"
                                                    checked={status === 2}
                                                    onClick={() => handleStatusChanged(2)}
                                                />
                                                <label htmlFor="Rejected" className="filterLabel">Rejected</label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="table">
                                <div className="row row-header">
                                    <div onClick={handleOrderChanged} className="cell id" id="cellId">ID</div>
                                    <div className="cell">Full Name</div>
                                    <div className="cell">Status</div>
                                    <div className="cell">Item</div>
                                    <div className="cell">Comment</div>
                                    <div className="cell">Actions</div>
                                </div>
                                
                                {requests.map((request, index) => (
                                    <div key={index} className="row row-item">
                                        <div className="cell id" id="cellId">{request.id}</div>
                                        <div className="cell">{request.requestee.firstname} {request.requestee.lastname}</div>
                                        <div className="cell status">{request.status === 0 ? "Pending" : request.status === 1 ? "Approved" : "Rejected"}</div>
                                        <div className="cell">{request.reward.title}</div>
                                        <div className="cell name">{request.comment}</div>
                                        <div className="cell actions">
                                            <span onClick={() => handleEditPopup(request.id, request.comment, request.status)} className="edit">
                                            </span>
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
                
                {
                    isEditPopupActive && <EditRequest id={editRequestId} comment={editRequestComment} status={editRequestStatus} handler={handleEditPopupActive}/>
                }
            </div>
        </MainLayout>
    )
}