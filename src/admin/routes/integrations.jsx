import { createFileRoute } from '@tanstack/react-router'
import Header from "../components/header/header.jsx";
import Sidebar from "../components/sidebar/sidebar.jsx";
import MainLayout from "../components/layouts/main-layout/main-layout.jsx";
import {Helmet} from "react-helmet";
import {protectedRoute} from "../utils/auth.jsx";

export const Route = createFileRoute('/integrations')({
    beforeLoad: ({context, location}) => {
        protectedRoute({location});
    },
  component: () => <Integrations/>
})

const Integrations = () => {
    return (
        <MainLayout>
            {
                <Helmet><link rel="stylesheet" href="/css/integrations.css"/></Helmet>
            }
            
            <div className="account-settings">
                <Header/>
                
                <section className="another__wrapper">
                    <Sidebar/>
                    
                    <section className="content integrations overlay">
                        <h2>INTEGRATIONS</h2>
                        
                        <div className="company-section">
                            <h3>Task Manager</h3>
                            <div className="task__list">
                                <div className="task__list-item">
                                    <div className="logo">
                                        <img width="102" height="68" src="/img/company-logo-1.jpg" alt=""/>
                                    </div>
                                    <div className="info">
                                        <h4>Asana</h4>
                                        <p>
                                            Mobile and web application for project management in teams. Convenient
                                            planning of
                                            work
                                            processes, projects.
                                        </p>
                                    </div>
                                    <a className="btn disabled" href="#">Connect</a>
                                </div>
                                <div className="task__list-item">
                                    <div className="logo">
                                        <img width="73" height="72" src="/img/company-logo-2.jpg" alt=""/>
                                    </div>
                                    <div className="info">
                                        <h4>Jira</h4>
                                        <p>
                                            A commercial bug tracking system designed to organize interaction with
                                            users, it is
                                            also
                                            used for project
                                            management.
                                        </p>
                                    </div>
                                    <a className="btn connected disabled" href="#">Connected</a>
                                </div>
                                <div className="task__list-item">
                                    <div className="logo">
                                        <img width="217" height="35" src="/img/company-logo-3.jpg" alt=""/>
                                    </div>
                                    <div className="info">
                                        <h4>Clubhouse</h4>
                                        <p>
                                            The intuitive and powerful project management platform loved by software
                                            teams of
                                            all
                                            sizes.
                                        </p>
                                    </div>
                                    <a className="btn disabled" href="#">Connect</a>
                                </div>
                                <div className="task__list-item">
                                    <div className="logo">
                                        <img width="192" height="44" src="/img/company-logo-4.jpg" alt=""/>
                                    </div>
                                    <div className="info">
                                        <h4>Monday</h4>
                                        <p>
                                            Monday.com’s task tracker works with features for project management, and
                                            workflow
                                            automation.
                                        </p>
                                    </div>
                                    <a className="btn disabled" href="#">Connect</a>
                                </div>
                                <div className="task__list-item">
                                    <div className="logo">
                                        <img width="133" height="44" src="/img/company-logo-5.jpg" alt=""/>
                                    </div>
                                    <div className="info">
                                        <h4>Trello</h4>
                                        <p>
                                            A cloud-based project management software for small teams. Trello uses
                                            kanban
                                            boards.
                                        </p>
                                    </div>
                                    <a className="btn disabled" href="#">Connect</a>
                                </div>
                            </div>
                        </div>
                        
                        <div className="company-section">
                            <h3>Messenger</h3>
                            <div className="task__list messenger">
                                <div className="task__list-item slack">
                                    <div className="logo">
                                        <img src="/img/company-logo-6.jpg" alt=""/>
                                    </div>
                                    <div className="info">
                                        <h4>Slack</h4>
                                        <p>
                                            Slack is a new way for your team to communicate. Slack is faster, more
                                            convenient,
                                            and safer than email.
                                        </p>
                                    </div>
                                    <a className="btn connected disabled" href="#">Connected</a>
                                </div>
                                <div className="task__list-item">
                                    <div className="logo">
                                        <img src="/img/company-logo-7.jpg" alt=""/>
                                    </div>
                                    <div className="info">
                                        <h4>Microsoft Teams</h4>
                                        <p>
                                            Enterprise platform that brings together chat,
                                            appointments, notes and attachments in the workspace.
                                        </p>
                                    </div>
                                    <a className="btn disabled" href="#">Connect</a>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            </div>
        </MainLayout>
    );
};

export default Integrations;