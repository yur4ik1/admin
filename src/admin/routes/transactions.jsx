import {createFileRoute} from '@tanstack/react-router'
import {Helmet} from "react-helmet";
import Header from "../components/header/header.jsx";
import Sidebar from "../components/sidebar/sidebar.jsx";
import MainLayout from "../components/layouts/main-layout/main-layout.jsx";
import {protectedRoute} from "../utils/auth.jsx";

export const Route = createFileRoute('/transactions')({
    beforeLoad: ({context, location}) => {
        protectedRoute({location});
    },
    component: () => <Transactions />
})

const Transactions = () => {
    return (
        <MainLayout>
            <div className="users-page">
                <Header/>
                
                <section className="another__wrapper">
                    <Sidebar/>
                    
                    <section className="content users skills transactons">
                        <h2>TRANSACTIONS</h2>
                        <div className="content__section">
                            <div className="search__wrapper">
                                <span className="search-icon">
                                    <input className="search-input" type="text" placeholder="Joe Doe"/>
                                </span>
                                <div className="filter-select">
                                    <div className="select-selected">Select...</div>
                                    <span className="line"></span>
                                    <div className="select-items select-hide">
                                        <div className="select-option">
                                            <input type="checkbox" id="all"/>
                                            <label htmlFor="all">All</label>
                                        </div>
                                        <div className="select-option">
                                            <input type="checkbox" id="active"/>
                                            <label htmlFor="active">Active</label>
                                        </div>
                                        <div className="select-option">
                                            <input type="checkbox" id="archied"/>
                                            <label htmlFor="archied">Archied</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="table">
                                <div className="row row-header">
                                    <div className="cell id">ID</div>
                                    <div className="cell">Full Name</div>
                                    <div className="cell">Skill / Achievement</div>
                                    <div className="cell">Reward</div>
                                    <div className="cell">Created at</div>
                                    <div className="cell">Actions</div>
                                </div>
                                <div className="row row-item">
                                    <div className="cell id">1</div>
                                    <div className="cell name">Andrey Olishchuck</div>
                                    <div className="cell skill">Communication<br/>Middle PHP Mid</div>
                                    <div className="cell coins">50</div>
                                    <div className="cell">09/20/2021</div>
                                    <div className="cell actions">
                                        <span className="edit"></span>
                                        <span className="archive"></span>
                                    </div>
                                </div>
                                <div className="row row-item">
                                    <div className="cell id">2</div>
                                    <div className="cell name">Mila Pater</div>
                                    <div className="cell skill">Communication <br/>
                                        Junior PHP
                                    </div>
                                    <div className="cell coins">10</div>
                                    <div className="cell">09/20/2021</div>
                                    <div className="cell actions">
                                        <span className="edit"></span>
                                        <span className="archive archive-alert"></span>
                                    </div>
                                </div>
                                <div className="row row-item">
                                    <div className="cell id">3</div>
                                    <div className="cell name">Jasmin Morgan</div>
                                    <div className="cell skill">Photoshop<br/>Middle Mid</div>
                                    <div className="cell coins">150</div>
                                    <div className="cell">09/20/2021</div>
                                    <div className="cell actions">
                                        <span className="edit"></span>
                                        <span className="archive"></span>
                                    </div>
                                </div>
                                <div className="row row-item">
                                    <div className="cell id">4</div>
                                    <div className="cell name">Felix McCoy</div>
                                    <div className="cell skill">Crowned Eagle Mask</div>
                                    <div className="cell coins">20</div>
                                    <div className="cell">09/20/2021</div>
                                    <div className="cell actions">
                                        <span className="edit"></span>
                                        <span className="archive"></span>
                                    </div>
                                </div>
                                <div className="row row-item">
                                    <div className="cell id">5</div>
                                    <div className="cell name">Olga Grekova</div>
                                    <div className="cell skill">Java</div>
                                    <div className="cell coins">50</div>
                                    <div className="cell">09/20/2021</div>
                                    <div className="cell actions">
                                        <span className="edit"></span>
                                        <span className="archive"></span>
                                    </div>
                                </div>
                                <div className="row row-item">
                                    <div className="cell id">6</div>
                                    <div className="cell name">Samuel Bekele</div>
                                    <div className="cell skill">Indigo Sing</div>
                                    <div className="cell coins">10</div>
                                    <div className="cell">09/20/2021</div>
                                    <div className="cell actions">
                                        <span className="edit"></span>
                                        <span className="archive"></span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="navigation">
                                <span className="prev"></span>
                                <span className="page active">1</span>
                                <span className="page">2</span>
                                <span className="next"></span>
                            </div>
                        </div>
                    </section>
                </section>
            </div>
        </MainLayout>
    );
};

export default Transactions;