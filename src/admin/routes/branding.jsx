import {createFileRoute} from '@tanstack/react-router'
import {protectedRoute} from "../utils/auth.jsx";
import Header from "../components/header/header.jsx";
import Sidebar from "../components/sidebar/sidebar.jsx";
import Loading from "../components/loading/Loading.jsx";
import MainLayout from "../components/layouts/main-layout/main-layout.jsx";
import {useEffect, useState} from "react";
import {getCompany} from "../utils/fetches/branding/getCompany.js";
import {Helmet} from "react-helmet";

export const Route = createFileRoute('/branding')({
    beforeLoad: ({context, location}) => {
        protectedRoute({location});
    },
    component: () => <Branding/>
})

const Branding = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [company, setCompany] = useState({});
    
    useEffect(() => {
        getCompany().then((data) => {
            setCompany(data.data.company[0]);
            
            setIsLoading(false);
        });
        
        document.querySelector('.remove-btn').addEventListener('click', () => {
            event.preventDefault()
            document.querySelectorAll('.branding__popup').forEach((e) => {
                e.classList.remove('active')
            })
            document.querySelector('.removePopup').classList.add('active')
        })
        
        document.getElementById('uploadFile').addEventListener('click', () => {
            event.preventDefault()
            document.querySelectorAll('.branding__popup').forEach((e) => {
                e.classList.remove('active')
            })
            document.querySelector('.uploadPopup').classList.add('active')
        })
        
        document.addEventListener('click', () => {
            if (!event.target.classList.contains('branding__popup') && !event.target.parentNode.classList.contains('upload__heading') && !event.target.classList.contains('alertPopup') && !event.target.parentNode.classList.contains('branding__popup')) {
                document.querySelectorAll('.branding__popup').forEach((e) => {
                    e.classList.remove('active')
                })
            }
            
            if (event.target.classList.contains('icon')) {
                document.querySelectorAll('.branding__popup').forEach((e) => {
                    e.classList.remove('active')
                })
                document.querySelector('.iconPopup').classList.add('active')
            }
            
            if (event.target.classList.contains('popupBtn')) {
                document.querySelectorAll('.branding__popup').forEach((e) => {
                    e.classList.remove('active')
                })
            }
        })
    }, []);
    
    return (
        <MainLayout>
            {
                <Helmet>
                    <link rel="stylesheet" href="/css/branding.css"/></Helmet>
            }
            
            <div className="branding">
                <Header/>
                
                <section className="another__wrapper">
                    <Sidebar/>
                    
                    <section className="content">
                        <h2>BRANDING</h2>
                        <div className="content__section">
                            <h3 className="content__section-title">Subdomain</h3>
                            <div className="content__block subdomain">
                                <a target="__blank" href={`https://${company.url}`} id="companyUrl">
                                    {company.url}
                                </a>
                                <p>Subdomain is given upon account signup and it is fixed. Submit a Ninjable support
                                    request to
                                    change it. This URL is where the users login
                                    to the portal or an app. Your custom brand elements such as logo and background
                                    image will
                                    appear on this page.
                                </p>
                            </div>
                        </div>
                        
                        <div className="content__section">
                            <h3 className="content__section-title icon alertPopup">Custom branding</h3>
                            <div className="content__block subdomain">
                                <p>With Custom branding enabled, your Ninjable account can be customized to reflect
                                    the visual
                                    personality of your organization.
                                </p>
                            </div>
                            <div style={{top: "2.352vw", left: "10.052vw"}} className="branding__popup iconPopup">
                                <p className="title">Upgrade Subscription</p>
                                <p className="desc">
                                    Available for Pro and <br/> Enterprise Subscription
                                </p>
                                <a href="/subscription" className="popupBtn">Upgrade</a>
                            </div>
                        </div>
                        
                        <div className="content__section">
                            <h3 className="content__section-title">Upload your Logo</h3>
                            <div className="content__block upload">
                                <form action="#">
                                    <div className="upload__heading">
                                        <img className="logo" src="/img/upload-logo.svg" alt=""/>
                                        <a className="remove-btn alertPopup" href="#">Remove</a>
                                    </div>
                                    <div style={{left: "20vw", top: "2vh"}} className="branding__popup removePopup">
                                        <p className="title">Upgrade Subscription</p>
                                        <p className="desc">
                                            Available for Pro and <br/> Enterprise Subscription
                                        </p>
                                        <a href="/subscription" className="popupBtn">Upgrade</a>
                                    </div>
                                    <div className="upload__icon-wrapper">
                                        <p className="title">Upload a new icon</p>
                                        <div className="upload__icon-input">
                                            <input type="file" id="upload__file"/>
                                            <label htmlFor="" id="uploadFile" className="alertPopup">Upload
                                                Icon</label>
                                            <p>Please, upload PNG, JPG or JPEG file</p>
                                        </div>
                                        <div style={{left: "1.02vw", top: "13.352vw"}} className="branding__popup uploadPopup">
                                            <p className="title">Upgrade Subscription</p>
                                            <p className="desc">
                                                Available for Pro and <br/> Enterprise Subscription
                                            </p>
                                            <a href="/subscription" className="popupBtn">Upgrade</a>
                                        </div>
                                    </div>
                                </form>
                                <div className="upload__info">
                                    <p className="title">For custom logos, we recommend one that:</p>
                                    <ul className="upload__info-list">
                                        <li> Is in .png format with a transparent background.</li>
                                        <li> Is landscape-oriented, with a maximum file size of 1MB.</li>
                                        <p className="desc">If you like the preview, select “Save” to apply changes.
                                            Your logo will
                                            appear on both the navigation header and login banner.</p>
                                    </ul>
                                    <img className="illustration" src="/img/illustration-1.jpg" alt=""/>
                                    <div className="illustration-info">
                                        Here you can replace the logo with your own
                                    </div>
                                    <img className="illustration" src="/img/illustration-2.jpg" alt=""/>
                                </div>
                            </div>
                        </div>
                        
                        <div className="content__section">
                            {isLoading && (
                                <Loading/>
                            )}
                            <h3 className="content__section-title">Colors</h3>
                            <div className="content__block">
                                <div className="colors">
                                    <div className="colors__item">
                                        <p className="name">Primary color</p>
                                        <p className="desc">
                                            Define a primary color that will be found on both the navigation
                                            header and login banner.
                                        </p>
                                        <div className="color-content">
                                            <div className="colors-block disabled">
                                                <span className="color"
                                                      style={{background: "linear-gradient(0deg, #2B3653, #2B3653), #1A2236"}}></span>
                                            </div>
                                            <p className="color-code">#0f1f37</p>
                                        </div>
                                    </div>
                                    <div className="colors__item">
                                        <p className="name">Accent color</p>
                                        <p className="desc">
                                            Define a accent color that will be found on buttons and interactive
                                            elements.
                                        </p>
                                        <div className="color-content">
                                            <div className="colors-block disabled">
                                                <span className="color"
                                                      style={{background: "linear-gradient(0deg, #7C9ECB, #7C9ECB), #1A2236"}}></span>
                                            </div>
                                            <p className="color-code">#7c9ecb</p>
                                        </div>
                                    </div>
                                </div>
                                <img className="illustration" src="/img/illustration-3.jpg" alt=""/>
                            </div>
                        </div>
                    </section>
                </section>
            </div>
        </MainLayout>
    );
};

export default Branding;