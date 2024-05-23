import {useEffect, useState} from "react";
import {getDepartments} from "../../utils/fetches/users/getDepartments.js";
import {getLevels} from "../../utils/fetches/users/getLevels.js";
import {getSkills} from "../../utils/fetches/skills/getSkills.js";
import {addJob} from "../../utils/fetches/positions/addJob.js";

import Loading from "../loading/Loading.jsx";
import {editJob} from "../../utils/fetches/positions/editJob.js";

// eslint-disable-next-line react/prop-types
const AddJob = ({handler, departmentId, handleOnChange, json = {}}) => {
    const [isLoading, setIsLoading] = useState(json.edit ? true : false);
    const [levels, setLevels] = useState([]);
    const [skills, setSkills] = useState([])

    console.log(skills);

    const [departments, setDepartments] = useState([]);
    const [departmentSearch, setDepartmentSearch] = useState('');
    const [managerSearch, setManagerSearch] = useState('');

    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({...json,});
    const [selectedSkills, setSelectedSkills] = useState([]);

    // const [selectedLevel, setSelectedLevel] = useState({})
    // const [selectedLevel1, setSelectedLevel1] = useState({})
    // const [selectedLevel2, setSelectedLevel2] = useState({})
    // const [selectedLevel3, setSelectedLevel3] = useState({})
    // const [selectedLevel4, setSelectedLevel4] = useState({})
    // const [selectedLevel5, setSelectedLevel5] = useState({})
    //
    // const arraySelectedLevelFn = [setSelectedLevel, setSelectedLevel1, setSelectedLevel2, setSelectedLevel3, setSelectedLevel4, setSelectedLevel5]
    //
    // const emptyLevel = {
    //     levelDescription: "",
    //     levelId: null
    //     levelTitle: "",
    //     title: "",
    // }
    // const jobsLevelArray = [
    //     (Object.keys(selectedLevel).length ? {...selectedLevel} : {...emptyLevel}),
    //     (Object.keys(selectedLevel1).length ? {...selectedLevel1} : {...emptyLevel}),
    //     (Object.keys(selectedLevel2).length ? {...selectedLevel2} : {...emptyLevel}),
    //     (Object.keys(selectedLevel3).length ? {...selectedLevel3} : {...emptyLevel}),
    //     (Object.keys(selectedLevel4).length ? {...selectedLevel4} : {...emptyLevel}),
    //     (Object.keys(selectedLevel5).length ? {...selectedLevel5} : {...emptyLevel}),
    // ];
    // console.log("global data from form compon. : ", jobsLevelArray)

    const [selectedLevels, setSelectedLevels] = useState([
        {
            description: "",
            seniority: {
                id: 0,
                title: "",
            },
            seniority_id: 0,
            title: ""
        }, {
            description: "",
            seniority: {
                id: 0,
                title: "",
            },
            seniority_id: 0,
            title: ""
        }, {
            description: "",
            seniority: {
                id: 0,
                title: "",
            },
            seniority_id: 0,
            title: ""
        }, {
            description: "",
            seniority: {
                id: 0,
                title: "",
            },
            seniority_id: 0,
            title: ""
        }, {
            description: "",
            seniority: {
                id: 0,
                title: "",
            },
            seniority_id: 0,
            title: ""
        }, {
            description: "",
            seniority: {
                id: 0,
                title: "",
            },
            seniority_id: 0,
            title: ""
        }
    ]);
    const handleFormSubmit = (formData, index) => {
        setSelectedLevels(prevSelectedLevels => {
            const updatedSelectedLevels = [...prevSelectedLevels];
            updatedSelectedLevels[index] = formData;
            return updatedSelectedLevels;
        });
    };
    // console.log("form in global: ", form)
    console.log("global data from form compon.: ", selectedLevels)

    const handleSetSkills = (id, title) => {
        const alreadySelected = selectedSkills.some(skill => skill.id === id);
        if (alreadySelected) {
            setSelectedSkills(selectedSkills.filter(skill => skill.id !== id));
        } else {
            setSelectedSkills([...selectedSkills, {id, title}]);
        }
    };

    const handelAddJob = () => {
        setErrors({});

        setErrors(prevErrors => ({
            ...prevErrors,
            jobTitle: !form.jobTitle,
            description: !form.description,
            skills: !form.SkillsId,
            level: !form.level,
            title: !form.title,
            levelDescription: !form.levelDescription
        }));

        // const hasErrors = !Object.values(errors).some(error => error);
        // if (hasErrors) {
        //     return false;
        // }
        if (selectedSkills.length === 0) {
            console.error("Please select at least one skill.")
            alert("Please select at least one skill.");
            return;
        }

        setIsLoading(true);
        try {
            addJob(departmentId, form.jobTitle, form.description, selectedSkills, selectedLevels).then((data) => {

                setIsLoading(false);
                if (data) {
                    handler();
                    handleOnChange();
                } else {
                    console.error("Failed to add job.");
                }
            })
        } catch (err) {
            console.error("Error adding job:", err);
            setIsLoading(false);
        }
    }
    const handleEditJob = async () => {
        setErrors({});

        setErrors(prevErrors => ({
            ...prevErrors,
            jobTitle: !form.jobTitle,
            description: !form.description,
            skills: !form.skills,
            level: !form.level,
            title: !form.title,
            levelDescription: !form.levelDescription
        }));

        // const hasErrors = !Object.values(errors).some(error => error);
        // if (hasErrors) {
        //     return ;
        // }
        if (selectedSkills.length === 0) {
            console.error("Please select at least one skill.")
            alert("Please select at least one skill.");
            return;
        }
        setIsLoading(true);
        try {
            editJob(departmentId, form.jobTitle, form.description, selectedSkills, selectedLevels).then((data) => {
                setIsLoading(false);
                if (data) {
                    handler();
                    handleOnChange();
                } else {
                    console.error("Failed to update job.");
                }
            });
        } catch (err) {
            console.error("Error update job:", err)
        }


    }

    useEffect(() => {
        const fetchData = async () => {

            try {
                const departmentsData = await getDepartments(departmentSearch);
                setDepartments(departmentsData.data.departments);
                setIsLoading(false);

                if (form.edit === true && departmentsData.data.departments.length > 0) {
                    const department = departmentsData.data.departments.find(department => department.id === form.departmentId);

                }
            } catch (error) {
                console.error("Error on fetching:", error);
                setIsLoading(false);
            }
        };

        fetchData();
        if (form.edit) {
            const arraySkills = json.selectedSkills.map(item => item.skills_jobs_skill)
            setSelectedSkills(json.edit ? arraySkills : [])
        }
    }, [departmentSearch, form.edit, form.departmentId]);
    useEffect(() => {
        getLevels().then((data) => {
            setLevels(data.data.levels);
        });
        getSkills().then((data) => {
            setSkills(data.data.skills)
        })
        setIsLoading(true)
    }, [managerSearch]);


    return (
        <div className="positions__popup ninjable__popup popup__users add-users active" id="add-users_popup">
            {isLoading && <Loading/>}

            <div className="ninjable__popup-inner">
                <div className="ninjable__popup-header">
                    <span onClick={handler} className="ninjable__popup-close">
                        <img src="/img/subscription__popup-close.svg" alt=""/>
                    </span>
                    <div id='anchor'>
                        <h3>
                            {form.edit && 'EDIT JOB' || 'ADD JOB'}
                        </h3>
                    </div>
                </div>
                <div className="positions__popup-content">
                    <div className="positions__popup-form">
                        <label>* Job Title (Rank)
                            <div className="field">
                                <input
                                    type="text"
                                    placeholder="Designer"
                                    id="add-job-title"
                                    onChange={(e) => setForm({
                                        ...form,
                                        jobTitle: e.target.value
                                    })}
                                    className={`selected ${errors.jobTitle && 'error'} `}
                                    defaultValue={form.jobTitle}
                                    required
                                />
                            </div>
                            <span className="let-know-required" id="required-add-job-title">
                                {errors.jobTitle ? 'Please let us know the title' : ''}
                            </span>
                        </label>
                        <label>* Description
                            <span className="let-know-required" id="required-add-job-description">
                                Please let us know the description
                            </span>
                            <div className="field">
                                <textarea
                                    name=""
                                    cols="30"
                                    rows="10"
                                    placeholder="Text"
                                    id="add-job-description"
                                    onChange={(e) => setForm({
                                        ...form,
                                        description: e.target.value
                                    })}
                                    className={`selected ${errors.description && 'error'} `}
                                    defaultValue={form.description}
                                    required
                                />
                            </div>
                        </label>
                        <label>* Skills
                            <div className={`add-skils ${selectedSkills.length == 0 && "error"}`}>
                                {skills.map((skill) => (
                                    <button key={skill.id}
                                            onClick={() => handleSetSkills(skill.id, skill.title)}
                                            className={`skill ${selectedSkills.some(selected => selected.id === skill.id) ? 'active' : ''}`}>
                                        {skill.title}
                                    </button>
                                ))}
                            </div>
                        </label>
                        {selectedLevels.map((jobLevel, index) => (
                            <FormElement
                                key={index}
                                levels={levels}
                                form={form}
                                errors={errors}
                                onSubmit={handleFormSubmit}
                                json={json}
                                index={index}
                            />
                        ))}
                        <div className="bottom">
                            <button
                                className="btn"
                                id="add-job-skills-add-button"
                                onClick={form.edit ? handleEditJob : handelAddJob}
                            >
                                {form.edit ? "Save" : "Add"}
                            </button>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};


const FormElement = ({levels, form, errors, onSubmit, json, index}) => {
    const [isLevelSelectActive, setIsLevelSelectActive] = useState(false);

    // console.log(`json.jobs_levels in index = ${index}: `, json?.jobsLevels[index])

    const [formData, setFormData] = useState({});

    console.log(formData)

    useEffect(() => {
        if (json.jobsLevels && json.jobsLevels[index]) {
            setFormData(json.jobsLevels[index]);
        } else {
            setFormData({});
        }
    }, [index]);


    const handleSetLevel = (id, title) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            seniority: {
                id: id,
                title: title,
            }
        }));
        setIsLevelSelectActive(false);
    };

    const handleTitleChange = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            title: e.target.value,
        }));
    };

    const handleDescriptionChange = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            description: e.target.value,
        }));
    };

    useEffect(() => {
        if (levels && levels[index]) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                seniority: {
                    id: levels[index].id,
                    title: levels[index].title
                }
            }));
        }
    }, [levels, index]);


    useEffect(() => {
        onSubmit(formData, index);
    }, [formData]);


    return (
        <>
            <div className="levels__fields">
                <div className="left">
                    <label>* Level
                        <div
                            // className={`custom-select ${isLevelSelectActive && 'active'} ${errors.levelId && 'error'}`}

                        >

                            {levels.map((level, levelIndex) => (
                                // <div key={level.id}
                                //     // onClick={() => handleSetLevel(level.id, level.title)}
                                //      className="selected">
                                //     {/*{index === levelIndex && level.title}*/}
                                //
                                //
                                // </div>
                                index === levelIndex && <input key={level.id} type="text" readOnly defaultValue={level.title}/>
                            ))}
                            {/*<div className={`select-selected ${isLevelSelectActive && 'select-arrow-active'} ${form.levelTitle && 'selected'}`} id="levelField" onClick={() => setIsLevelSelectActive(!isLevelSelectActive)}></div>*/}
                            {/*{formData.seniority !== undefined && formData.seniority?.title !== null ?  formData.seniority.title : 'Please Select...'}*/}
                            {/*{isLevelSelectActive && (*/}
                            {/*    <div className="select-items" id='levelSelectOption'>*/}
                            {/*        {levels.map((level) => (*/}
                            {/*            <div key={level.id}*/}
                            {/*                 onClick={() => handleSetLevel(level.id, level.title)}*/}
                            {/*                 className="select-option level">*/}
                            {/*                {level.title}*/}
                            {/*            </div>*/}
                            {/*        ))}*/}
                            {/*    </div>*/}
                            {/*)}*/}
                        </div>
                        <span className="let-know-required" id="required-add-job-skills-selected">Please let us know the skills</span>
                    </label>

                    <label>* Title
                        <div className="field">
                            <input
                                type="text"
                                placeholder="Manager Developer"
                                id="add-job-title"
                                // onChange={(e) => setFormData({
                                //     ...form,
                                //     title: e.target.value
                                // })}
                                onChange={handleTitleChange}
                                className={`selected `}
                                value={formData.title}
                                // ${errors.title && 'error'}
                            />
                        </div>
                        <span className="let-know-required"
                              id="required-add-job-title">Please let us know the title</span>
                    </label>
                </div>
                <div className="right">
                    <label>* Level Description
                        <div className="field">
                            <textarea
                                name=""
                                cols="30"
                                rows="10"
                                placeholder="Text"
                                id="add-job-description"
                                // onChange={(e) => setFormData({
                                //     ...json,
                                //     levelDescription: e.target.value
                                // })}
                                onChange={handleDescriptionChange}
                                className={`selected`}
                                // ${errors.levelDescription && 'error'}
                                defaultValue={formData.description || ''}
                            ></textarea>
                        </div>
                        <span className="let-know-required" id="required-add-job-description">Please let us know the level description</span>
                    </label>
                </div>
            </div>
        </>
    )
}

export default AddJob;