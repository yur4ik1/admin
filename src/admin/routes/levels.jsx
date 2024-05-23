import {createFileRoute} from '@tanstack/react-router'
import {Helmet} from "react-helmet";
import Header from "../components/header/header.jsx";
import Sidebar from "../components/sidebar/sidebar.jsx";
import MainLayout from "../components/layouts/main-layout/main-layout.jsx";
import {useEffect, useState} from "react";
import Loading from "../components/loading/Loading.jsx";
import {getLevels} from "../utils/fetches/levels/getLevels.js";
import {protectedRoute} from "../utils/auth.jsx";
import ArchiveConfirmation from "../components/popups/archive-confirmation.jsx";
import {toArchive} from "../utils/fetches/levels/toArchive.js";
import LevelsPopup from "../components/popups/levels-popup.jsx";

export const Route = createFileRoute('/levels')({
    beforeLoad: ({context, location}) => {
        protectedRoute({location});
    },
    component: () => <Levels/>
})

const Levels = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState('asc');
    
    const [levels, setLevels] = useState([]);
    
    const [isArchivePopupActiveId, setIsArchivePopupActiveId] = useState(0);
    
    const [isModifyPopupActive, setIsModifyPopupActive] = useState(false);
    
    const handleChangeOrder = () => {
        setOrder(order === 'asc' ? 'desc' : 'asc');
        setIsLoading(true);
    }
    
    const handleArchive = (id) => {
        toArchive(id).then(() => {
            setIsLoading(true);
            
            getLevels(order).then((data) => {
                setLevels(data.data.levels);
                setIsLoading(false);
            });
        });
        setIsArchivePopupActiveId(0);
    }
    
    const handleSave = () => {
        setIsModifyPopupActive(false);
        setIsLoading(true);
        
        getLevels(order).then((data) => {
            setLevels(data.data.levels);
            setIsLoading(false);
        });
    }
    
    useEffect(() => {
        getLevels(order).then((data) => {
            setLevels(data.data.levels);
            setIsLoading(false);
        });
    }, [order]);
    
    return (
        <MainLayout>
            {
                <Helmet>
                    <link rel="stylesheet" href="/css/levels.css"/>
                </Helmet>
            }
            
            <div className="levels-page">
                <Header/>
                
                <section className="another__wrapper">
                    <Sidebar/>
                    
                    <section className="content levels">
                        <h2>LEVELS</h2>
                        <div className="add__level-wrapper">
                            <button onClick={() => setIsModifyPopupActive(true)} className="add-level btn">Modify Level</button>
                        </div>
                        <div className="content__section">
                            {isLoading && <Loading/>}
                            <table className="table table-wrapper" id="table">
                                <tr className="row row-header">
                                    <th onClick={handleChangeOrder} className="cell id">ID</th>
                                    <th className="cell">Title Level</th>
                                    <th className="cell">Color</th>
                                    <th className="cell">Actions</th>
                                </tr>
                                
                                <tbody id="cellid">
                                {levels.map((level) => (
                                    <tr key={level.id} className="row row-item">
                                        <td className="cell id">{level.id}</td>
                                        <td className="cell name">{level.title}</td>
                                        
                                        <td className="cell color">
                                            <div className="span-color__center">
                                                <span className={level.color}>{level.color} - {level.color} Ninja</span>
                                            </div>
                                        </td>
                                        <td className="cell actions">
                                            <span onClick={() => setIsArchivePopupActiveId(level.id)} className="archive"></span>
                                        </td>
                                        
                                        {isArchivePopupActiveId === level.id && (<ArchiveConfirmation handlerConfirm={() => handleArchive(level.id)} handlerReject={() => setIsArchivePopupActiveId(0)} />)}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            
                            {/*<div className="entrecomp">
                                <h3>EntreComp Framework</h3>
                                <table className="table table-wrapper">
                                    <tr className="row row-header">
                                        <th className="cell id">ID</th>
                                        <th className="cell">Seniority</th>
                                        <th className="cell">Color</th>
                                        <th className="cell">Skill Level</th>
                                        <th className="cell">Actions</th>
                                    </tr>
                                    
                                    <tbody>
                                    <tr className="row row-item">
                                        <td className="cell id">1</td>
                                        <td className="cell name">Junior</td>
                                        
                                        <td className="cell color">
                                            <div className="span-color__center">
                                                <span className="white">White - White Ninja</span>
                                            </div>
                                        </td>
                                        <td className="cell skill-level name">Foundation (Discover)</td>
                                        <td className="cell actions">
                                            <span className="archive" data-id="${da.id}"></span>
                                        </td>
                                    </tr>
                                    <tr className="row row-item">
                                        <td className="cell id">2</td>
                                        <td className="cell name">Junior</td>
                                        
                                        <td className="cell color">
                                            <div className="span-color__center">
                                                <span className="white">White - White Ninja</span>
                                            </div>
                                        </td>
                                        <td className="cell skill-level name">Foundation (Explore)</td>
                                        <td className="cell actions">
                                            <span className="archive" data-id="${da.id}"></span>
                                        </td>
                                    </tr>
                                    <tr className="row row-item">
                                        <td className="cell id">3</td>
                                        <td className="cell name">Middle</td>
                                        
                                        <td className="cell color">
                                            <div className="span-color__center">
                                                <span className="yellow">Yellow - Yellow Ninja</span>
                                            </div>
                                        </td>
                                        <td className="cell skill-level name">Intermediate (Experiment)</td>
                                        <td className="cell actions">
                                            <span className="archive" data-id="${da.id}"></span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>*/}
                        </div>
                    </section>
                </section>
                
                {isModifyPopupActive && (<LevelsPopup handleSave={handleSave} handleClose={() => setIsModifyPopupActive(!isModifyPopupActive)} />)}
            </div>
        </MainLayout>
    );
};

export default Levels;