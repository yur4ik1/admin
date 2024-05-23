import {useEffect, useState} from "react";
import {getLevels} from "../../utils/fetches/levels/getLevels.js";
import Loading from "../loading/Loading.jsx";
import {addSkillLevel} from "../../utils/fetches/skills/addSkillLevel.js";
import {editSkillLevel} from "../../utils/fetches/skills/editSkillLevel.js";

// eslint-disable-next-line react/prop-types
const AddSkillLevel = ({handlerSave, handlerClose, id, info = {}}) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const [skillId, setSkillId] = useState(id);
    const [form, setForm] = useState(info);
    const [errors, setErrors] = useState({});
    
    const [statuses, setStatuses] = useState(["Active", "Archived"]);
    const [levels, setLevels] = useState({});
    
    /* Select states */
    const [isLevelsSelectOpen, setIsLevelsSelectOpen] = useState(false);
    const [isStatusSelectOpen, setIsStatusSelectOpen] = useState(false);
    
    const handleSelectLevel = (levelId, levelName) => {
        setForm({...form, levelId: levelId, levelName: levelName});
        setIsLevelsSelectOpen(false);
    }
    
    const handleSelectStatus = (status) => {
        setForm({...form, status: status});
        setIsStatusSelectOpen(false);
    }
    
    const handleSave = () => {
        setErrors({
            levelId: form.levelId === undefined && true,
            description: form.description === undefined && true,
            recipientCondition: form.recipientCondition === undefined && true,
            status: form.status === undefined && true
        });
        
        if (Object.values(errors).some(error => error)) {
            return false;
        }
        
        setIsLoading(true);
        
        if (form.edit) {
            editSkillLevel(form).then(() => {
                setIsLoading(true);
                handlerSave();
                handlerClose();
            })
        } else {
            addSkillLevel(skillId, form).then(() => {
                setIsLoading(true);
                handlerSave();
                handlerClose();
            });
        }
    }
    
    useEffect(() => {
        getLevels().then((data) => {
            setLevels(data.data.levels);
        });
    }, []);
    
    return (
        <div className="ninjable__popup skillss__level-popup add-skillss-level-level active">
            <div className="ninjable__popup-inner">
                <div className="ninjable__popup-header">
                    <span onClick={handlerClose} className="ninjable__popup-close edit-close">
                        <img src="/img/subscription__popup-close.svg" alt=""/>
                    </span>
                    <h3>
                        {form.edit ? "EDIT SKILL’S LEVEL" : "ADD SKILL’S LEVEL" }
                    </h3>
                </div>
                <div className="popup__users-content">
                    <div className="skillss__popup-form">
                        
                        <label>
                            * Level
                            <div className={`custom-select ${isLevelsSelectOpen && 'active'}`}>
                                <div
                                    onClick={() => setIsLevelsSelectOpen(!isLevelsSelectOpen)}
                                    className={`select-selected ${isLevelsSelectOpen && 'select-arrow-active'} ${form.levelName && 'selected-select-custom'} ${errors.levelId && 'error'}`}
                                >
                                    {form.levelName ? form.levelName : 'Please Select...'}
                                </div>
                                {isLevelsSelectOpen && (
                                    <div className="select-items">
                                        {levels.map((level) => (
                                            <div
                                                className="select-option"
                                                key={level.id}
                                                onClick={() => handleSelectLevel(level.id, level.title)}
                                            >
                                                {level.title}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className="let-know-required">
                                Please let us know the level
                            </span>
                        </label>
                        
                        <label htmlFor="add-skill-level-description">
                            * Description
                            <textarea
                                name="add-skill-level-description"
                                cols="30"
                                rows="10"
                                placeholder="Text"
                                onInput={(e) => setForm({...form, description: e.target.value})}
                                className={errors.description && 'error'}
                                defaultValue={form.description}
                            ></textarea>
                            <span className="let-know-required">
                                Please let us know the rank
                            </span>
                        </label>
                        
                        <label htmlFor="add-skill-level-recipient-condition">
                            <p className="skills-info">* Receipt Condition</p>
                            <input
                                type="number"
                                name="add-skill-level-recipient-condition"
                                placeholder="30"
                                className={errors.recipientCondition && 'error'}
                                onChange={(e) => setForm({...form, recipientCondition: e.target.value})}
                                defaultValue={form.recipientCondition}
                            />
                            <div className="info-popup">
                                <p className="title">Receipt Condition</p>
                                <p className="text">
                                    Please select how many coins will be taken from the participant for upgrading the
                                    skill.
                                </p>
                            </div>
                            <span className="let-know-required">
                                Please let us know how much it cost
                            </span>
                        </label>
                        
                        <label>
                            * Status
                            <div className={`custom-select ${isStatusSelectOpen && 'active'}`}>
                                <div
                                    onClick={() => setIsStatusSelectOpen(!isStatusSelectOpen)}
                                    className={`select-selected ${isStatusSelectOpen && 'select-arrow-active'} ${form.status && 'selected-select-custom'} ${errors.status && 'error'}`}
                                >
                                    {form.status ? form.status : 'Please Select...'}
                                </div>
                                {isStatusSelectOpen && (
                                    <div className="select-items">
                                        {statuses.map((status) => (
                                            <div
                                                className="select-option"
                                                onClick={() => handleSelectStatus(status)}
                                                key={status}
                                            >
                                                {status}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className="let-know-required">
                                Please let us know the status
                            </span>
                        </label>
                        
                        <div className="add__btn-wrapper">
                            <button onClick={handleSave} className="btn user-add" type="button">
                                {form.edit ? "Save" : "Add" }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {isLoading && <Loading />}
        </div>
    );
};

export default AddSkillLevel;