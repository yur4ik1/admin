import { useEffect, useState } from "react";
import { getBillingData } from "../../utils/fetches/billing/getBillingData.js";
import subscriptionPopupIcon from "/img-admin/subscription__popup-close.svg"

const SubscriptionPopup = ({ handler }) => {
  const [billing, setBilling] = useState("");

  const handlerOpeningPagePayment = async () => {
    try {
        
      const customerData = billing.data.company[0].paddle_customer_id
      const numData = billing.data.users_aggregate.aggregate.count;

      const url = `https://checkout.ninjable.io/?customer=${customerData}&num=${numData}`;

      window.location.href = url;

    } catch (err) {
      console.error("Помилка під час отримання даних для оплати:", err);
    }
  };

  useEffect(() => {
    getBillingData().then((data) => setBilling(data));
  }, []);

  return (
    <div className="ninjable__popup subscription__popup active">
      <div className="ninjable__popup-inner">
        <div className="light-bg"></div>
        <div className="ninjable__popup-header">
          <span onClick={handler} className="ninjable__popup-close">
            <img src={subscriptionPopupIcon} alt="" />
          </span>
          <div className="subscription__header-list">
            <div>
              <p>FREE</p>
            </div>
            <div>
              <p>LIGHT</p>
            </div>
            <div>
              <p>PRO</p>
            </div>
            <div>
              <p>ENTERPRISE</p>
            </div>
          </div>
        </div>
        <div className="popup__users-content">
          <div className="subscription__list-content">
            <div className="subscription__list-row">
              <div className="cell subscription-name">Users</div>
              <div className="cell subscription-free">3</div>
              <div className="cell subscription-light">
                <span className="infinity"></span>
              </div>
              <div className="cell subscription-pro">
                <span className="infinity"></span>
              </div>
              <div className="cell subscription-enterprise">
                <span className="infinity"></span>
              </div>
            </div>
            <div className="subscription__list-row">
              <div className="cell subscription-name">Active skills/User</div>
              <div className="cell subscription-free">9</div>
              <div className="cell subscription-light">9</div>
              <div className="cell subscription-pro">18</div>
              <div className="cell subscription-enterprise">
                <span className="infinity"></span>
              </div>
            </div>

            <div className="subscription__list-row">
              <div className="cell subscription-name">Active departments/Company</div>
              <div className="cell subscription-free">1</div>
              <div className="cell subscription-light">15</div>
              <div className="cell subscription-pro">26</div>
              <div className="cell subscription-enterprise">
                <span className="infinity"></span>
              </div>
            </div>

            <div className="subscription__list-row">
              <div className="cell subscription-name">
                Skill Map (Positoions/ <br />
                Department)
              </div>
              <div className="cell subscription-free">10</div>
              <div className="cell subscription-light">10</div>
              <div className="cell subscription-pro">16</div>
              <div className="cell subscription-enterprise">
                <span className="infinity"></span>
              </div>
            </div>
            <div className="subscription__list-row">
              <div className="cell subscription-name">
                OKRs (Company OKRs x <br />
                Departments drill down levels)
              </div>
              <div className="cell subscription-free">2х3</div>
              <div className="cell subscription-light">2х3</div>
              <div className="cell subscription-pro">10х3</div>
              <div className="cell subscription-enterprise">
                <span className="infinity"></span>
              </div>
            </div>
            <div className="subscription__list-row">
              <div className="cell subscription-name">Standart Reporting</div>
              <div className="cell subscription-free">
                <span className="tick"></span>
              </div>
              <div className="cell subscription-light">
                <span className="tick"></span>
              </div>
              <div className="cell subscription-pro">
                <span className="tick"></span>
              </div>
              <div className="cell subscription-enterprise">
                <span className="tick"></span>
              </div>
            </div>
            <div className="subscription__list-row">
              <div className="cell subscription-name">Skill approval flow</div>
              <div className="cell subscription-free">
                <span className="tick"></span>
              </div>
              <div className="cell subscription-light">
                <span className="tick"></span>
              </div>
              <div className="cell subscription-pro">
                <span className="tick"></span>
              </div>
              <div className="cell subscription-enterprise">
                <span className="tick"></span>
              </div>
            </div>
            <div className="subscription__list-row">
              <div className="cell subscription-name">Integrations</div>
              <div className="cell subscription-free">
                <span className="tick"></span>
              </div>
              <div className="cell subscription-light">
                <span className="tick"></span>
              </div>
              <div className="cell subscription-pro">
                <span className="tick"></span>
              </div>
              <div className="cell subscription-enterprise">
                <span className="tick"></span>
              </div>
            </div>
            <div className="subscription__list-row">
              <div className="cell subscription-name">Custom Branding</div>
              <div className="cell subscription-free"></div>
              <div className="cell subscription-light"></div>
              <div className="cell subscription-pro">
                <span className="tick"></span>
              </div>
              <div className="cell subscription-enterprise">
                <span className="tick"></span>
              </div>
            </div>
            <div className="subscription__list-row">
              <div className="cell subscription-name">Performance Review</div>
              <div className="cell subscription-free"></div>
              <div className="cell subscription-light"></div>
              <div className="cell subscription-pro">
                <span className="tick"></span>
              </div>
              <div className="cell subscription-enterprise">
                <span className="tick"></span>
              </div>
            </div>
            <div className="subscription__list-row">
              <div className="cell subscription-name">OKR analytics</div>
              <div className="cell subscription-free"></div>
              <div className="cell subscription-light"></div>
              <div className="cell subscription-pro">
                <span className="tick"></span>
              </div>
              <div className="cell subscription-enterprise">
                <span className="tick"></span>
              </div>
            </div>
            <div className="subscription__list-row">
              <div className="cell subscription-name">Custom Reporting</div>
              <div className="cell subscription-free"></div>
              <div className="cell subscription-light"></div>
              <div className="cell subscription-pro">
                <span className="tick"></span>
              </div>
              <div className="cell subscription-enterprise">
                <span className="tick"></span>
              </div>
            </div>
          </div>
          <div className="subscription__bottom">
            <div className="subscription__bottom-item">
              <p className="price">$0</p>
              {/* <button onClick={getBillingData} className="btn">Downgrade</button> */}
              <button className="btn active">Current</button>
            </div>
            <div className="subscription__bottom-item">
              <p className="price">$5</p>
              <p className="sale">
                <span>user/month</span>
                <br />
                -25% annual commit
              </p>
              <button onClick={handlerOpeningPagePayment} className="btn">
                Upgrade
              </button>
            </div>
            <div className="subscription__bottom-item">
              <button className="btn">Coming Soon</button>
            </div>
            <div className="subscription__bottom-item">
              <button className="btn">Contact Sales</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPopup;
