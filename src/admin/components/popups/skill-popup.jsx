// eslint-disable-next-line react/prop-types
import {useEffect, useState} from "react";
import {getDepartments} from "../../utils/fetches/users/getDepartments.js";
import Loading from "../loading/Loading.jsx";
import {addSkill} from "../../utils/fetches/skills/addSkills.js";

// eslint-disable-next-line react/prop-types
const SkillPopup = ({handler}) => {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    
    const [departments, setDepartments] = useState([]);
    const [statuses, setStatuses] = useState(["Active", "Archived"]);
    
    const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);
    
    const handleDepartment = (departmentId, departmentTitle) => {
        setForm({
            ...form,
            departmentId: departmentId,
            departmentTitle: departmentTitle
        });
        setIsDepartmentOpen(false);
    }
    
    const handleStatus = (status) => {
        setForm({
            ...form,
            status: status
        });
        setIsStatusOpen(false);
    }
    
    const addSkills = () => {
        setErrors(
            {
                title: form.title === undefined,
                departmentId: form.departmentId === undefined,
                status: form.status === undefined
            }
        );
        
        if (Object.values(errors).includes(true)) {
            return false;
        }
        
        setIsLoading(true);
        
        addSkill(form).then((data) => {
            setIsLoading(false);
            handler();
        });
    }
    
    useEffect(() => {
        getDepartments('').then((data) => {
            setDepartments(data.data.departments);
        });
    }, []);
    return (
        <div className="ninjable__popup skillss__level-popup add-skillss-popup active">
            <div className="ninjable__popup-inner">
                <div className="ninjable__popup-header">
                    <span onClick={handler} className="ninjable__popup-close add-skill-close">
                        <img src="/img/subscription__popup-close.svg" alt=""/>
                    </span>
                    <h3>ADD SKILL</h3>
                </div>
                <div className="popup__users-content">
                    <div className="skillss__popup-form">
                        <label htmlFor="add-title">* Title
                            <input onInput={(e) => setForm(
                                {
                                    ...form,
                                    title: e.target.value
                                }
                            )} className={`${errors.title && 'error'}`} type="text" placeholder="Adobe Photoshop" id="add-title" name="add-tile"/>
                            <span className="let-know-required" id="required-title">Please let us know the title</span>
                        </label>
                        <label htmlFor="add-tag">Tag
                            <input onInput={(e) => setForm(
                                {
                                    ...form,
                                    tag: e.target.value
                                }
                            )} type="text" placeholder="PS" id="add-tag" name="add-tag"/>
                        </label>
                        <label>
                            * Department (Clan)
                            <div
                                className={`new__custom-select-wrapper add-new__custom-select-wrapper skills-filter-select`}>
                                <div className="skills-tags-list add-skills-tags-list" id="skills-tags-list"></div>
                                <span className="select-open-btn hidden">
                                    <div className="arrow"></div>
                                </span>
                                <div className={`new__custom-select ${isDepartmentOpen && 'open'}`} id="newCustomSelectField">
                                    <span className="line"></span>
                                    
                                    <div
                                        onClick={() => setIsDepartmentOpen(!isDepartmentOpen)}
                                        className={`new__custom-select__trigger ${form.departmentTitle && 'selected-select-custom'} ${errors.departmentId && 'error'}`}
                                    >
                                        {form.departmentTitle ? form.departmentTitle : 'Type here to choose for Clan...'}
                                    </div>
                                    {isDepartmentOpen && (
                                        <div className="new__custom-options add-new__custom-options">
                                            {departments.map((department) => (
                                                <div onClick={() => handleDepartment(department.id, department.title)} className="new__custom-option" key={department.id}>{department.title}</div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="custom-scrollbar"></div>
                                </div>
                            </div>
                            
                            <span className="let-know-required" id="required-clan">Please let us know the clan</span>
                        </label>
                        
                        <label>* Status
                            <div className={`custom-select ${isStatusOpen && 'active'}`}>
                                <div
                                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                                    className={`select-selected ${isStatusOpen && 'select-arrow-active'} ${form.status && 'selected-select-custom'} ${errors.status && 'error'}`}
                                >
                                    {form.status ? form.status : 'Please select...'}
                                </div>
                                {isStatusOpen && (
                                    <div className="select-items">
                                        {statuses.map((status) => (
                                            <div onClick={() => handleStatus(status)} className="select-option" key={status}>{status}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className="let-know-required"
                                  id="required-status">Please let us know the status</span>
                        </label>
                        <div className="add__btn-wrapper">
                            <button className="btn user-add" type="button" onClick={addSkills}>Add</button>
                        </div>
                    </div>
                </div>
            </div>
            
            {isLoading && <Loading />}
        </div>
    );
};

export default SkillPopup;