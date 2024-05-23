import {useEffect, useState} from "react";
import Loading from "../loading/Loading.jsx";
import {addBadge} from "../../utils/fetches/achievements/addBadge.js";
import {editBadge} from "../../utils/fetches/achievements/editBadge.js";

// eslint-disable-next-line react/prop-types
const AchievementsPopup = ({handler, json = {}}) => {
    const [form, setForm] = useState(json);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    
    /*
    Selects states
     */
    const [isIconSelectActive, setIsIconSelectActive] = useState(false);
    const [isTypeSelectActive, setIsTypeSelectActive] = useState(false);
    const [isPeriodSelectActive, setIsPeriodSelectActive] = useState(false);
    const [isStatusSelect, setIsStatusSelectActive] = useState(false);
    
    /*
    Select infos
     */
    const types = ["Coins", "Skill", "Task"];
    const periods = ["Monthly", "Weekly"];
    const statuses = ["Active", "Archived"];
    
    /* Handle Selects */
    const handleType = (type) => {
        setIsTypeSelectActive(!isTypeSelectActive);
        
        setForm(
            {
                ...form,
                type: type
            }
        )
    }
    
    const handlePeriod = (period) => {
        setIsPeriodSelectActive(!isPeriodSelectActive);
        
        setForm(
            {
                ...form,
                period: period
            }
        )
    }
    
    const handleStatus = (status) => {
        setIsStatusSelectActive(!isStatusSelect);
        
        setForm(
            {
                ...form,
                status: status
            }
        )
    }
    
    const handleSave = () => {
        setErrors(
            {
                ...errors,
                name: form.name === undefined && true,
                type: form.type === undefined && true,
                period: form.period === undefined && true,
                amount: form.amount === undefined && true,
                badges: form.badges === undefined && true,
                reward: form.reward === undefined && true,
                status: form.status === undefined && true
            }
        )
        
        if (Object.values(errors).some(error => error)) {
            return false;
        }
        
        setIsLoading(true);
        
        if(form.edit) {
            editBadge(form).then((response) => {
                handler();
            })
        } else {
            addBadge(form).then((response) => {
                handler();
            })
        }
    }
    
    useEffect(() => {
        const info = document.querySelectorAll(".info"),
            popup = document.querySelectorAll(".badge__info-popup");
        
        info.forEach((item, index) => {
            item.addEventListener("click", () => {
                popup[index].classList.toggle("active");
                
                setTimeout(() => {
                    popup[index].classList.remove("active");
                }, 5000);
            });
        });
    }, []);
    
    return (
        <div className="ninjable__popup add-badge-popup active">
            <div className="ninjable__popup-inner">
                <div className="ninjable__popup-header">
                    <span onClick={handler} className="ninjable__popup-close add-badge-close">
                        <img src="/img/subscription__popup-close.svg" alt=""/>
                    </span>
                    <h3>
                        {form.edit ? "EDIT BADGE" : "ADD BADGE"}
                    </h3>
                </div>
                <div className="popup__users-content">
                    <div className="badge__popup-form" id="popup">
                        <label>
                            * Icon
                            <div className='new__custom-select-wrapper acievements-select'>
                                <div className={`new__custom-select ${isIconSelectActive && 'open'}`}>
                                    <span className="line"></span>
                                    <div className="arrow"></div>
                                    <div onClick={() => setIsIconSelectActive(!isIconSelectActive)} className="new__custom-select__trigger">Please Select a icon.</div>
                                    
                                    {isIconSelectActive && (
                                        <div className="new__custom-options">
                                            <div className="new__custom-option active" data-value="icon-1">
                                                <div className="acievements-bg">
                                                    <img src="/img/acievements-img-1.png" alt=""/>
                                                </div>
                                            </div>
                                            <div className="new__custom-option" data-value="icon-1">
                                                <div className="acievements-bg">
                                                    <img src="/img/acievements-img-2.png" alt=""/>
                                                </div>
                                            </div>
                                            <div className="new__custom-option" data-value="icon-1">
                                                <div className="acievements-bg">
                                                    <img src="/img/acievements-img-3.png" alt=""/>
                                                </div>
                                            </div>
                                            <div className="new__custom-option" data-value="icon-1">
                                                <div className="acievements-bg">
                                                
                                                </div>
                                            </div>
                                            <div className="new__custom-option" data-value="icon-1">
                                                <div className="acievements-bg">
                                                
                                                </div>
                                            </div>
                                            <div className="new__custom-option" data-value="icon-1">
                                                <div className="acievements-bg">
                                                
                                                </div>
                                            </div>
                                            <div className="new__custom-option" data-value="icon-1">
                                                <div className="acievements-bg">
                                                
                                                </div>
                                            </div>
                                            <div className="new__custom-option" data-value="icon-1">
                                                <div className="acievements-bg">
                                                
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="custom-scrollbar"></div>
                                </div>
                            </div>
                            <span className="let-know">Please let us know icon</span>
                        </label>
                        <label>
                            * Name
                            <input onInput={(e) => setForm(
                                {
                                    ...form,
                                    name: e.target.value
                                }
                            )} defaultValue={form.name} className={`${errors.name && 'error'}`} type="text" placeholder="Please let us know badge name"/>
                            <span className="let-know">Please let us know badge name</span>
                        </label>
                        
                        <h4>Condition</h4>
                        <div className="badge__form-wrapper">
                            <div className="badge__form-col">
                                <label className="info">* Type
                                    <div className="badge__info-popup type">
                                        <p className="title">Type</p>
                                        <p className="desc">
                                            Please select what type of task the <br/> employees should perform.
                                        </p>
                                        <p className="desc">
                                            <span>Examples:</span> <br/>
                                            - Upgrade skill <br/>
                                            - Complete tasks <br/>
                                            - Earn coins <br/>
                                        </p>
                                    </div>
                                </label>
                                
                                <div className={`custom-select ${isTypeSelectActive && 'active'}`}>
                                    <div
                                        onClick={() => setIsTypeSelectActive(!isTypeSelectActive)}
                                        className={`select-selected-new ${isTypeSelectActive && 'select-arrow-active'} ${form.type && 'selected-select-custom'} ${errors.type && 'error'}`}
                                    >
                                        {form.type ? form.type : "Please Select..."}
                                    </div>
                                    {isTypeSelectActive && (
                                        <div className="select-items">
                                            {types.map((item, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => handleType(item)}
                                                    className="select-option"
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <span className="let-know">Please let us know type</span>
                                
                                <label className="info">* Period
                                    <div className="badge__info-popup period">
                                        <p className="title">Period</p>
                                        <p className="desc">
                                            Please choose how long this <br/> challenge will last.
                                        </p>
                                    </div>
                                </label>
                                <div className={`custom-select ${isPeriodSelectActive && 'active'}`}>
                                    <div
                                        onClick={() => setIsPeriodSelectActive(!isPeriodSelectActive)}
                                        className={`select-selected-new ${isPeriodSelectActive && 'select-arrow-active'} ${form.period && 'selected-select-custom'} ${errors.period && 'error'}`}
                                    >
                                        {form.period ? form.period : "Please Select..."}
                                    </div>
                                    {isPeriodSelectActive && (
                                        <div className="select-items">
                                            {periods.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="select-option"
                                                    onClick={() => handlePeriod(item)}
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <span className="let-know">Please let us know period</span>
                            </div>
                            <div className="badge__form-col">
                                <label className="info">* Amount
                                    <div className="badge__info-popup amount">
                                        <p className="title">Amount</p>
                                        <p className="desc">
                                            Please select the conditions for <br/> receiving the award.
                                        </p>
                                        <p className="desc">
                                            <span>Examples:</span><br/>
                                            - Upgrade 1 skill<br/>
                                            - Complete 10 tasks<br/>
                                            - Earn 300 coins<br/>
                                        </p>
                                    </div>
                                </label>
                                <input onInput={(e) => setForm({
                                        ...form,
                                        amount: e.target.value
                                    })
                                } defaultValue={form.amount} type="number" className={`${errors.amount && 'error'}`} placeholder="10"/>
                                <span className="let-know">Please let us know amount</span>
                                <label className="info" style={{marginTop: "2.5vw"}}>* Badges Amount
                                    <div className="badge__info-popup badges">
                                        <p className="title">Badges Amount</p>
                                        <p className="desc">
                                            Please select how many employees <br/> will receive badges.
                                        </p>
                                        <p className="desc">
                                            <span>Examples:</span><br/>
                                            - 1 employee who will be the first to fulfill the conditions<br/>
                                            - A certain number of employees: 2 or more<br/>
                                            - All employees who meet the conditions<br/>
                                            - Department
                                        </p>
                                    </div>
                                </label>
                                <input onInput={(e) => setForm(
                                    {
                                        ...form,
                                        badges: e.target.value
                                    }
                                )} defaultValue={form.badges} className={`${errors.badges && 'error'}`} type="number" placeholder="1"/>
                                <span className="let-know">Please let us know badges amount</span>
                            </div>
                        </div>
                        
                        <label className="info">
                            * Reward
                            <div className="badge__info-popup reward">
                                <p className="title">Reward</p>
                                <p className="desc">
                                    In addition to the badge, the employee will receive coins.
                                </p>
                                <p className="desc">
                                    All employees listed in "Badges Amount" will receive the amount you enter here.
                                </p>
                            </div>
                        </label>
                        
                        <input onInput={(e) => setForm(
                            {
                                ...form,
                                reward: e.target.value
                            }
                        )} defaultValue={form.reward} className={`${errors.reward && 'error'}`} type="number" placeholder="30 Coins"/>
                        <span className="let-know">Please let us know reward</span>
                        <h4>Reward</h4>
                        
                        <label>* Status
                            <div className={`custom-select ${isStatusSelect && 'active'}`}>
                                <div
                                    onClick={() => setIsStatusSelectActive(!isStatusSelect)}
                                    className={`select-selected-new ${isStatusSelect && 'select-arrow-active'} ${form.status && 'selected-select-custom'} ${errors.status && 'error'}`}
                                >
                                    {form.status ? form.status : "Please Select..."}
                                </div>
                                {isStatusSelect && (
                                    <div className="select-items">
                                        {statuses.map((item, index) => (
                                            <div
                                                key={index}
                                                className="select-option"
                                                onClick={() => handleStatus(item)}
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className="let-know">Please let us know status</span>
                        </label>
                        
                        <div className="bottom">
                            <button onClick={handleSave} className="btn badge-add" type="submit">
                                {form.edit ? "Save" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {isLoading && <Loading />}
        </div>
    );
};

export default AchievementsPopup;