import {createFileRoute} from '@tanstack/react-router'
import Header from "../components/header/header.jsx";
import Sidebar from "../components/sidebar/sidebar.jsx";
import MainLayout from "../components/layouts/main-layout/main-layout.jsx";
import {useEffect, useState} from "react";
import Loading from "../components/loading/Loading.jsx";
import {getUsers} from "../utils/fetches/billing/getUsers.js";
import SubscriptionPopup from "../components/popups/subscription-popup.jsx";
import {protectedRoute} from "../utils/auth.jsx";
import subscriptionPopupIcon from "/img-admin/subscription__popup-close.svg"
import invoicesIcon from "/img-admin/invoices-icon.svg"
import paymentMethodIcon from "/img-admin/payment-method-icon.svg"
import paymentMethod1 from "/img-admin/payment-method-1.svg"
import paymentMethod2 from "/img-admin/payment-method-2.svg"
import paymentMethod3 from "/img-admin/payment-method-3.svg"

export const Route = createFileRoute('/billing')({
    beforeLoad: ({context, location}) => {
        protectedRoute({location});
    },
    component: () => <Billing/>
})

const Billing = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState(0);
    const [billingCycle, setBillingCycle] = useState(new Date());
    
    const [isBillingPopupActive, setIsBillingPopupActive] = useState(false);
    
    const toggleBillingPopup = () => {
        setIsBillingPopupActive(!isBillingPopupActive);
    }
    
    
    useEffect(() => {
        getUsers().then((data) => {
            setUsers(data.data.users_aggregate.aggregate.count);
            setBillingCycle(new Date(data.data.company[0].billing_cycle));
            setIsLoading(false);
        });
    }, []);
    
    return (
        <MainLayout>
            <div className="billing-page">
                <Header/>
                
                <section className="another__wrapper">
                    <Sidebar/>
                    
                    <section className="content billing">
                        <h2>BILLING</h2>
                        <div className="content__section">
                            <h3 className="content__section-title">Your Subscription</h3>
                            <div className="content__block subdomain">
                                <p>You are currently on the Core Monthly plan (monthly payments). </p>
                                <a onClick={toggleBillingPopup} href="#" id="upgradeBtn">Upgrade</a>
                            </div>
                            <div className="content__block">
                                <div className="subscription__info">
                                    <div className="subscription__info-item">
                                        <p className="info-title">Users:</p>
                                        <p className="info-number" id="userCount">{users} Users - $5 per month</p>
                                    </div>
                                    <div className="subscription__info-item">
                                        <p className="info-title">Monthly cost:</p>
                                        <p className="info-number" id='monthlyCost'>$ {(users * 5).toFixed(2).toString()}</p>
                                    </div>
                                    <div className="subscription__info-item">
                                        <p className="info-title">Next payment due:</p>
                                        <p className="info-number" id="nextPay">{billingCycle.getDate() + '-' + (billingCycle.toLocaleString('en-US', { month: 'short' })) + '-' + billingCycle.getFullYear()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="content__section">
                            {isLoading && <Loading/>}
                            <div className="invoices-title">
                                <h3 className="content__section-title">Invoices</h3>
                                <a className="invoices-btn disabled">
                                    <img src={invoicesIcon} alt=""/>
                                </a>
                            </div>
                            
                            <div className="content__block invoices">
                                <div className="invoices__table">
                                    <div className="invoices__table-header">
                                        <p>Invoice</p>
                                        <p>Date</p>
                                        <p>Amount</p>
                                        <p>Download</p>
                                    </div>
                                    {/* <!-- <div class="invoices__list">
                                    <div class="invoices__list-item">
                                        <p>#120587</p>
                                        <p>22/08/21</p>
                                        <p>$ 276.00</p>
                                        <a href="#">PDF File</a>
                                    </div>
                                    <div class="invoices__list-item">
                                        <p>#520211</p>
                                        <p>22/07/21</p>
                                        <p>$ 276.00</p>
                                        <a href="#">PDF File</a>
                                    </div>
                                    <div class="invoices__list-item">
                                        <p>#355899</p>
                                        <p>22/06/21</p>
                                        <p>$ 276.00</p>
                                        <a href="#">PDF File</a>
                                    </div>
                                </div> --> */}
                                </div>
                            </div>
                        </div>
                        <div className="content__section">
                            <div className="payment-method">
                                <h3 className="content__section-title">Payment Method</h3>
                                <a href="#" className="disabled">
                                    <img src={paymentMethodIcon} alt=""/>
                                </a>
                            </div>
                            
                            <div className="content__block payment-table">
                                <table className="payment__method-table">
                                    <thead className="payment__method-header">
                                    <tr>
                                        <td>Card</td>
                                        <td>Number</td>
                                        <td>Expires</td>
                                        <td>Active</td>
                                        <td>Actions</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {/*<!-- <tr class="payment__method-item row-item active">
                                    <td class="payment-cart-col">
                                        <img class="payment-icon" src={paymentMethod1} alt="">
                                    </td>
                                    <td class="payment-number">
                                        <p class="title">Ends with 0587</p>
                                        <p class="desc">added 3 years ago</p>
                                    </td>
                                    <td class="payment-expires">
                                        <p class="desc">12/22</p>
                                    </td>
                                    <td class="payment-active">
                                        <p class="sub">Active since</p>
                                        <p class="desc"> August 20, 2021</p>
                                    </td>
                                    <td class="payment-delete">
                                        <span class="delete-icon"></span>
                                    </td>
                                </tr>
                                <tr class="payment__method-item row-item">
                                    <td class="payment-cart-col">
                                        <img class="payment-icon" src={paymentMethod2} alt="">
                                    </td>
                                    <td class="payment-number">
                                        <p class="title">Ends with 0211</p>
                                        <p class="desc">added 1 year ago</p>
                                    </td>
                                    <td class="payment-expires">
                                        <p class="desc">10/23</p>
                                    </td>
                                    <td class="payment-active">
                                        <p class="sub">Active since</p>
                                        <p class="desc">August 20, 2021</p>
                                    </td>
                                    <td class="payment-delete">
                                        <span class="delete-icon"></span>
                                    </td>
                                </tr>
                                <tr class="payment__method-item row-item">
                                    <td class="payment-cart-col">
                                        <img class="payment-icon" src={paymentMethod3} alt="">
                                    </td>
                                    <td class="payment-number">
                                        <p class="title">Ends with 5899</p>
                                        <p class="desc">added 2 months ag</p>
                                    </td>
                                    <td class="payment-expires">
                                        <p class="desc">09/21</p>
                                    </td>
                                    <td class="payment-active">
                                        <p class="sub">Active since</p>
                                        <p class="desc"> August 20, 2021</p>
                                    </td>
                                    <td class="payment-delete">
                                        <span class="delete-icon"></span>
                                    </td>
                                </tr> -->*/}
                                    </tbody>
                                </table>
                            
                            </div>
                            <div className="payment__method-bottom">
                                <a className="payment-btn btn disabled" href="#">Switch active card</a>
                                <a className="cancel" href="#">Cancel</a>
                            </div>
                            
                            <div className="custom__period-popup">
                                <div className="custom__period-inner">
                                    <div className="custom__period-header">
                                        <span className="custom__period-close">
                                            <img src={subscriptionPopupIcon} alt=""/>
                                        </span>
                                        <div>
                                            <h4>CUSTOM PERIOD</h4>
                                            <p>5 Nov 2019 - Present Day</p>
                                        </div>
                                    </div>
                                    <div className="custom__period-content">
                                        <div className="date">
                                            <span className="date-btn active">11/05/2017</span>
                                            <span className="date-btn">mm/dd/yyyy</span>
                                        </div>
                                        <div className="date__list">
                                            <div className="date__list-item">
                                                <h4>From</h4>
                                                <div className="date__select-wrapper">
                                                    <div className="new__custom-select-wrapper date-select">
                                                        <div className="new__custom-select">
                                                            <div className="arrow"></div>
                                                            <div className="new__custom-select__trigger month">Month
                                                            </div>
                                                            <div className="new__custom-options">
                                                                <div className="new__custom-option"
                                                                     data-value="ua">January
                                                                </div>
                                                                <div className="new__custom-option"
                                                                     data-value="us">February
                                                                </div>
                                                                <div className="new__custom-option"
                                                                     data-value="ca">March
                                                                </div>
                                                                <div className="new__custom-option"
                                                                     data-value="mx">April
                                                                </div>
                                                                <div className="new__custom-option" data-value="br">May
                                                                </div>
                                                                <div className="new__custom-option" data-value="ua">June
                                                                </div>
                                                                <div className="new__custom-option" data-value="us">July
                                                                </div>
                                                                <div className="new__custom-option"
                                                                     data-value="ca">August
                                                                </div>
                                                                <div className="new__custom-option"
                                                                     data-value="mx">September
                                                                </div>
                                                                <div className="new__custom-option"
                                                                     data-value="br">October
                                                                </div>
                                                                <div className="new__custom-option"
                                                                     data-value="br">November
                                                                </div>
                                                                <div className="new__custom-option"
                                                                     data-value="br">December
                                                                </div>
                                                            </div>
                                                            <div className="custom-scrollbar"></div>
                                                        </div>
                                                        <div className="new__custom-select years">
                                                            <div className="arrow"></div>
                                                            <div className="new__custom-select__trigger years">Year
                                                            </div>
                                                            <div className="new__custom-options">
                                                                <div className="new__custom-option" data-value="ua">2023
                                                                </div>
                                                                <div className="new__custom-option" data-value="us">2024
                                                                </div>
                                                                <div className="new__custom-option" data-value="ca">2025
                                                                </div>
                                                                <div className="new__custom-option" data-value="us">2026
                                                                </div>
                                                                <div className="new__custom-option" data-value="ca">2027
                                                                </div>
                                                                <div className="new__custom-option" data-value="us">2028
                                                                </div>
                                                                <div className="new__custom-option" data-value="ca">2029
                                                                </div>
                                                                <div className="new__custom-option" data-value="ca">2030
                                                                </div>
                                                            </div>
                                                            <div className="custom-scrollbar"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="datepicker__calendar">
                                                    <table>
                                                        <thead className="datepicker__calendar-header">
                                                        <tr>
                                                            <td>Su</td>
                                                            <td>Mo</td>
                                                            <td>Tu</td>
                                                            <td>We</td>
                                                            <td>Th</td>
                                                            <td>Fr</td>
                                                            <td>Sa</td>
                                                        </tr>
                                                        </thead>
                                                        <tbody className="datepicker__calendar-content calendar-from">
                                                        <tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td>1</td>
                                                            <td>2</td>
                                                            <td>3</td>
                                                        </tr>
                                                        <tr>
                                                            <td>4</td>
                                                            <td className="active">5</td>
                                                            <td>6</td>
                                                            <td>7</td>
                                                            <td>8</td>
                                                            <td>9</td>
                                                            <td>10</td>
                                                        </tr>
                                                        <tr>
                                                            <td>11</td>
                                                            <td>12</td>
                                                            <td>13</td>
                                                            <td>14</td>
                                                            <td>15</td>
                                                            <td>16</td>
                                                            <td>17</td>
                                                        </tr>
                                                        <tr>
                                                            <td>18</td>
                                                            <td>19</td>
                                                            <td>20</td>
                                                            <td>21</td>
                                                            <td>22</td>
                                                            <td>23</td>
                                                            <td>24</td>
                                                        </tr>
                                                        <tr>
                                                            <td>25</td>
                                                            <td>26</td>
                                                            <td>27</td>
                                                            <td>28</td>
                                                            <td>29</td>
                                                            <td>30</td>
                                                            <td>31</td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            
                                            <div className="date__list-item">
                                                <h4>To</h4>
                                                <div className="date__select-wrapper">
                                                    <div className="new__custom-select-wrapper date-select">
                                                        <div className="new__custom-select">
                                                            <div className="arrow"></div>
                                                            <div className="new__custom-select__trigger month">Month
                                                            </div>
                                                            <div className="new__custom-options">
                                                                <div className="new__custom-option"
                                                                     data-value="ua">January
                                                                </div>
                                                                <div className="new__custom-option"
                                                                     data-value="us">February
                                                                </div>
                                                                <div className="new__custom-option"
                                                                     data-value="ca">March
                                                                </div>
                                                                <div className="new__custom-option"
                                                                     data-value="mx">April
                                                                </div>
                                                                <div className="new__custom-option" data-value="br">May
                                                                </div>
                                                                <div className="new__custom-option" data-value="ua">June
                                                                </div>
                                                                <div className="new__custom-option" data-value="us">July
                                                                </div>
                                                                <div className="new__custom-option"
                                                                     data-value="ca">August
                                                                </div>
                                                                <div className="new__custom-option"
                                                                     data-value="mx">September
                                                                </div>
                                                                <div className="new__custom-option"
                                                                     data-value="br">October
                                                                </div>
                                                                <div className="new__custom-option"
                                                                     data-value="br">November
                                                                </div>
                                                                <div className="new__custom-option"
                                                                     data-value="br">December
                                                                </div>
                                                            </div>
                                                            <div className="custom-scrollbar"></div>
                                                        </div>
                                                        
                                                        <div className="new__custom-select years">
                                                            <div className="arrow"></div>
                                                            <div className="new__custom-select__trigger years">Year
                                                            </div>
                                                            <div className="new__custom-options">
                                                                <div className="new__custom-option" data-value="ua">2023
                                                                </div>
                                                                <div className="new__custom-option" data-value="us">2024
                                                                </div>
                                                                <div className="new__custom-option" data-value="ca">2025
                                                                </div>
                                                                <div className="new__custom-option" data-value="us">2026
                                                                </div>
                                                                <div className="new__custom-option" data-value="ca">2027
                                                                </div>
                                                                <div className="new__custom-option" data-value="us">2028
                                                                </div>
                                                                <div className="new__custom-option" data-value="ca">2029
                                                                </div>
                                                                <div className="new__custom-option" data-value="ca">2030
                                                                </div>
                                                            </div>
                                                            <div className="custom-scrollbar"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="datepicker__calendar">
                                                    <table>
                                                        <thead className="datepicker__calendar-header">
                                                        <tr>
                                                            <td>Su</td>
                                                            <td>Mo</td>
                                                            <td>Tu</td>
                                                            <td>We</td>
                                                            <td>Th</td>
                                                            <td>Fr</td>
                                                            <td>Sa</td>
                                                        </tr>
                                                        </thead>
                                                        <tbody className="datepicker__calendar-content calendar-to">
                                                        <tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td>1</td>
                                                            <td>2</td>
                                                            <td>3</td>
                                                        </tr>
                                                        <tr>
                                                            <td>4</td>
                                                            <td>5</td>
                                                            <td>6</td>
                                                            <td>7</td>
                                                            <td>8</td>
                                                            <td>9</td>
                                                            <td>10</td>
                                                        </tr>
                                                        <tr>
                                                            <td>11</td>
                                                            <td>12</td>
                                                            <td>13</td>
                                                            <td>14</td>
                                                            <td>15</td>
                                                            <td>16</td>
                                                            <td>17</td>
                                                        </tr>
                                                        <tr>
                                                            <td>18</td>
                                                            <td>19</td>
                                                            <td>20</td>
                                                            <td>21</td>
                                                            <td>22</td>
                                                            <td>23</td>
                                                            <td>24</td>
                                                        </tr>
                                                        <tr>
                                                            <td>25</td>
                                                            <td>26</td>
                                                            <td>27</td>
                                                            <td>28</td>
                                                            <td>29</td>
                                                            <td>30</td>
                                                            <td>31</td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="custom__period-footer">
                                        <a href="#">Select</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
                
                {isBillingPopupActive && <SubscriptionPopup handler={toggleBillingPopup} />}
            </div>
        </MainLayout>
    );
};

export default Billing;