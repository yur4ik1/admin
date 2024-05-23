import {useState} from "react";
import {addReward} from "../../utils/fetches/inventory/addReward.js";
import {editReward} from "../../utils/fetches/inventory/editReward.js";
import Loading from "../loading/Loading.jsx";

const RewardPopup = ({handler, json = {}}) => {
    const [form, setForm] = useState(json);
    const [errors, setErrors] = useState({});
    
    const [statuses, setStatuses] = useState(["Active", "Archived"]);
    
    const [isLoading, setIsLoading] = useState(false);
    
    /* Select states */
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    
    const handleChooseStatus = (status) => {
        setForm(
            {
                ...form,
                status: status === "Active"
            }
        )
        
        setIsSelectOpen(false);
    }
    
    const handleSave = () => {
        setErrors({});
        
        setErrors(
            {
                ...errors,
                title: !form.title && true,
                description: !form.description && true,
                size: !form.size && true,
                price: !form.price && true,
                status: form.status === undefined && true,
            }
        )
        
        if (Object.keys(errors).length) {
            return false;
        }
        
        setIsLoading(true)
        
        if(form.edit) {
            editReward(form).then((response) => {
                setIsLoading(false)
                handler();
            });
        } else {
            addReward(form).then((response) => {
                setIsLoading(false)
                handler();
            });
        }
    }
    
    return (
        <div className="ninjable__popup reward-popup add-reward-popup active">
            {isLoading && <Loading/>}
            
            <div className="ninjable__popup-inner">
                <div onClick={handler} className="ninjable__popup-header">
                    <span className="ninjable__popup-close add-revard-close">
                        <img src="/img/subscription__popup-close.svg" alt=""/>
                    </span>
                    <h3>
                        {form.edit ? "EDIT REWARD" : "ADD REWARD"}
                    </h3>
                </div>
                <div className="popup__users-content popup__users-content-new" id="mainPopup">
                    <div className="reward__popup-form" id="popup">
                        <label>* Title
                            <input onInput={(e) => setForm(
                                {
                                    ...form,
                                    title: e.target.value
                                }
                            )} defaultValue={form.title} className={`${errors.title && 'error'}`} type="text" placeholder="T-Shirt"/>
                            <span className="let-know">Please let us know the title</span>
                        </label>
                        <label>* Description
                            <textarea onInput={(e) => setForm(
                                {
                                    ...form,
                                    description: e.target.value
                                }
                            )} defaultValue={form.description} className={`${errors.description && 'error'}`} name="" id="" cols="30" rows="10" placeholder="Text"></textarea>
                            <span className="let-know">Please let us know the description</span>
                        </label>
                        
                        <label>
                            Size
                            <input onInput={(e) => setForm(
                                {
                                    ...form,
                                    size: e.target.value
                                }
                            )} defaultValue={form.size} className={`size-field ${errors.size && 'error'}`} type="text" placeholder="XL"/>
                            <span className="let-know">Please let us know the size</span>
                        </label>
                        
                        <label>
                            <div className="upload__icon-wrapper">
                                <div className="upload__icon-input">
                                    <input type="file" id="upload__file"/>
                                    <label htmlFor="upload__file">Upload Icon</label>
                                    <p>File.jpg</p>
                                </div>
                            </div>
                        </label>
                        <label>
                            * Price
                            <input onInput={(e) => setForm(
                                {
                                    ...form,
                                    price: e.target.value
                                }
                            )} defaultValue={form.price} type="number" placeholder="30" className={`${errors.price && 'error'}`}/>
                            <span className="let-know">Please let us know the price</span>
                        </label>
                        <label>
                            * Status
                            <div className={`custom-select ${isSelectOpen && 'active'}`}>
                                <div onClick={() => setIsSelectOpen(!isSelectOpen)} className={`select-selected select-selected-new ${isSelectOpen && 'select-arrow-active'} ${form.status !== undefined && 'selected-select-custom'} ${errors.status && 'error'}`}>
                                    {form.status === undefined ? "Please Select..." : form.status === true ? "Active" : "Archived"}
                                </div>
                                {isSelectOpen && (
                                    <div className="select-items">
                                        {statuses.map((status, index) => (
                                            <div key={index} onClick={(e) => handleChooseStatus(e.target.innerText)} className="select-option">{status}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className="let-know">Please let us know the status</span>
                        </label>
                        <div className="add__btn-wrapper">
                            <button onClick={handleSave} className="btn user-add" type="submit">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardPopup;