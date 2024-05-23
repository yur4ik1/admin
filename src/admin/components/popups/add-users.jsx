import {useEffect, useState} from "react";
import {getDepartments} from "../../utils/fetches/users/getDepartments.js";
import {getLevels} from "../../utils/fetches/users/getLevels.js";
import {getManagers} from "../../utils/fetches/users/getManagers.js";
import {getJobs} from "../../utils/fetches/users/getJobs.js";
import Loading from "../loading/Loading.jsx";
import {addUser} from "../../utils/fetches/users/addUser.js";
import {editUser} from "../../utils/fetches/users/editUser.js";

// eslint-disable-next-line react/prop-types
const AddUsers = ({handler, json = {}}) => {
    const [isLoading, setIsLoading] = useState(json.edit ? true : false);
    
    /* Entry information */
    const [departments, setDepartments] = useState([]);
    const [levels, setLevels] = useState([]);
    const roles = ['Admin', 'User'];
    const [managers, setManagers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const status = ['Active', 'Archived'];
    
    /* Select states */
    const [isDepartmentSelectActive, setIsDepartmentSelectActive] = useState(false);
    const [isLevelSelectActive, setIsLevelSelectActive] = useState(false);
    const [isManagerSelectActive, setIsManagerSelectActive] = useState(false);
    const [isJobSelectActive, setIsJobSelectActive] = useState(false);
    const [isPermissionRoleSelectActive, setIsPermissionRoleSelectActive] = useState(false);
    const [isStatusSelectActive, setIsStatusSelectActive] = useState(false);
    
    /* Search states */
    const [departmentSearch, setDepartmentSearch] = useState('');
    const [managerSearch, setManagerSearch] = useState('');
    
    /* Form states */
    const [form, setForm] = useState(json);
    const [passwordType, setPasswordType] = useState('password');
    
    /* Error states */
    const [errors, setErrors] = useState({});
    
    const handleSetDepartment = (id, name) => {
        setForm(
            {
                ...form,
                departmentId: id,
                departmentName: name
            }
        )
        
        getJobs(id).then((data) => {
            setJobs(data.data.jobs);
        });
        
        setIsDepartmentSelectActive(false);
    }
    
    const handleSetLevel = (id, title) => {
        setForm(
            {
                ...form,
                levelId: id,
                levelTitle: title
            }
        )
        
        setIsLevelSelectActive(false);
    }
    
    const handleSetManager = (id, name) => {
        setForm(
            {
                ...form,
                managerId: id,
                managerName: name
            }
        )
        
        setIsManagerSelectActive(false);
    }
    
    const handleSetJob = (id, title) => {
        setForm(
            {
                ...form,
                jobId: id,
                jobTitle: title
            }
        )
        
        setIsJobSelectActive(false);
    }
    
    const handleSetRole = (role) => {
        setForm(
            {
                ...form,
                role
            }
        )
        
        setIsPermissionRoleSelectActive(false);
    }
    
    const handleStatus = (status) => {
        setForm(
            {
                ...form,
                status
            }
        )
        
        setIsStatusSelectActive(false);
    }
    
    const handleAddUser = () => {
        setErrors({});
        
        setErrors(prevErrors => ({
            ...prevErrors,
            name: !form.name,
            email: !form.email,
            departmentId: !form.departmentId,
            levelId: !form.levelId,
            managerId: !form.managerId,
            password: !form.password,
            jobId: !form.jobId,
            role: !form.role,
            status: !form.status
        }));
        
        if (Object.values(errors).some(error => error)) {
            return false;
        }
        
        setIsLoading(true);
        
        addUser(form).then((data) => {
            setIsLoading(false);
            
            if (data.data.insert_users.affected_rows > 0) {
                handler();
            }
        });
    }
    
    const handleEditUser = () => {
        setErrors({});
        
        setErrors(prevErrors => ({
            ...prevErrors,
            name: !form.name,
            email: !form.email,
            departmentId: !form.departmentId,
            levelId: !form.levelId,
            managerId: !form.managerId,
            password: !form.password,
            jobId: !form.jobId,
            role: !form.role,
            status: !form.status
        }));
        
        if (Object.values(errors).some(error => error)) {
            return false;
        }
        
        setIsLoading(true);
        
        editUser(form).then((data) => {
            setIsLoading(false);
            handler();
        });
    }

    const getDepartmentTitleWithFirstChar = (title) => {
        if (!title || typeof title !== 'string') return title;
        const firstChar = title.charAt(0);
        return `${firstChar}`;
    }
    console.log(form)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const departmentsData = await getDepartments(departmentSearch);
                setDepartments(departmentsData.data.departments);
                setIsLoading(false);

                if (form.edit === true && departmentsData.data.departments.length > 0 && departmentSearch === "") {
                    const department = departmentsData.data.departments.find(department => department.id === form.departmentId ?  department : false);
                    setForm(prevForm => ({
                        ...prevForm,
                        departmentName: department.title
                    }));
                }
            } catch (error) {
                console.error("Error on fetching:", error);
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [departmentSearch, form.edit, form.departmentId]);
    
    useEffect(() => {
        getLevels().then((data) => {
            setLevels(data.data.levels);
        });
        
        getManagers(managerSearch).then((data) => {
            setManagers(data.data.users);
        });
    }, [managerSearch]);
    
    
    return (
        <div className="ninjable__popup popup__users add-users active" id="add-users_popup">
            {isLoading && <Loading/>}
            
            <div className="ninjable__popup-inner">
                <div className="ninjable__popup-header">
                    <span onClick={handler} className="ninjable__popup-close">
                        <img src="/img/subscription__popup-close.svg" alt="close"/>
                    </span>
                    <div id='anchor'>
                        <h3>
                            {form.edit && 'EDIT USER' || 'ADD USER'}
                        </h3>
                    </div>
                </div>
                <div className="popup__users-content" id="mainPopup">
                    <div className="popup__users-form" id="popup">
                        <div className="popup__users-col">
                            <label>Full Name
                                <input onChange={(e) => setForm(
                                    {
                                        ...form,
                                        name: e.target.value
                                    }
                                )} type="text" placeholder="30 Exp"
                                       className={`selected ${errors.name && 'error'} `}
                                       id="add-user-firstname"
                                       defaultValue={form.name}
                                />
                                <span className="let-know-required" id="add-user-firstname-required">Please let us know your
                                full name</span>
                            </label>
                            {/*<!-- <label>* Last Name
                                <input type="text" placeholder="Please let us know your last name" class="selected"
                                    id="add-user-lastname">
                                <span class="let-know-required" id="add-user-lastname-required">Please let us know your last
                                    name</span>s
                            </label> -->*/}
                            <label>Department (Clan)
                                <div
                                    className={`custom-select ${isDepartmentSelectActive && 'active'} ${errors.departmentId && 'error'}`}>
                                    <div onInput={(e) => setDepartmentSearch(e.target.innerText)}
                                         onClick={() => setIsDepartmentSelectActive(!isDepartmentSelectActive)}
                                         className={`select-selected-new ${isDepartmentSelectActive && 'select-arrow-active'} ${form.departmentName && 'selected'}`}
                                         contentEditable={true} suppressContentEditableWarning={true}
                                         id="depatmentField">
                                        {isDepartmentSelectActive ? '' : (form.departmentName ? form.departmentName : 'Start typing to select a Clan')}
                                    </div>
                                    {isDepartmentSelectActive && (
                                        <div className="select-items">
                                            <div className="custom-scrollbar-new" id="selectDepatment">
                                                {departments
                                                    .filter(department => department.title.includes(departmentSearch))
                                                    .map((department, index) => (
                                                        <div key={index}
                                                             onClick={() => handleSetDepartment(department.id, department.title)}
                                                             className="select-option department">
                                                            <span className="select-option-first-char">{getDepartmentTitleWithFirstChar(department.title)}</span>
                                                            {department.title}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <span className="let-know">Please let us know the clan</span>
                            </label>
                            <label>Level
                                <div
                                    className={`custom-select ${isLevelSelectActive && 'active'} ${errors.levelId && 'error'}`}>
                                    <div
                                        className={`select-selected-new ${isLevelSelectActive && 'select-arrow-active'} ${form.levelTitle && 'selected'}`}
                                        id="levelField" onClick={() => setIsLevelSelectActive(!isLevelSelectActive)}>
                                        {form.levelTitle ? form.levelTitle : 'Select Level'}
                                    </div>
                                    {isLevelSelectActive && (
                                        <div className="select-items" id='levelSelectOption'>
                                            {levels.map((level) => (
                                                <div key={level.id}
                                                     onClick={() => handleSetLevel(level.id, level.title)}
                                                     className="select-option level">
                                                    <span className="select-option-first-char">{getDepartmentTitleWithFirstChar(level.title)}</span>
                                                    {level.title}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <span className="let-know">Please let us know the level</span>
                            </label>
                            <label>Manager
                                <div
                                    className={`custom-select ${isManagerSelectActive && 'active'} ${errors.managerId && 'error'}`}>
                                    <div onInput={(e) => setManagerSearch(e.target.innerText)}
                                         onClick={() => setIsManagerSelectActive(!isManagerSelectActive)}
                                         className={`select-selected-new ${isManagerSelectActive && 'select-arrow-active'} ${form.managerName && 'selected'}`}
                                         id="managerField" contentEditable={true} suppressContentEditableWarning={true}>
                                        {isManagerSelectActive ? '' : form.managerName ? form.managerName : 'Start typing to select a Manager'}
                                    </div>
                                    {
                                        isManagerSelectActive > 0 && (
                                            <div className="select-items">
                                                <div className="custom-scrollbar-new" id="selectManager">
                                                    {managers.map((manager) =>
                                                        <div
                                                            onClick={() => handleSetManager(manager.id, `${manager.firstname} ${manager.lastname}`)}
                                                            key={manager.id} className="select-option manager">
                                                            {manager.firstname} {manager.lastname}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                <span className="let-know">Please let us know the manager</span>
                            </label>
                            {
                                !form.edit && (
                                    <label>Password
                                        <input className={`password ${errors.password && 'error'}`} type={passwordType}
                                               id="password" name="password"
                                               placeholder="*************************"
                                               onChange={(e) => setForm(
                                                   {
                                                       ...form,
                                                       password: e.target.value
                                                   }
                                               )}
                                        />
                                        <span onClick={() => setPasswordType(
                                            passwordType === 'password' ? 'text' : 'password'
                                        )} className="password-icon"></span>
                                        <span className="let-know">Please let us know your password</span>
                                    </label>
                                )
                            }
                        </div>

                        <div className="popup__users-col popup__users-col-second">
                            <label>Email
                                <input onChange={(e) => setForm(
                                    {
                                        ...form,
                                        email: e.target.value
                                    }
                                )} type="text" placeholder="example@mail.com"
                                       className={`selected ${errors.email && 'error'} `}
                                       id="add-user-email"
                                       defaultValue={form.email}
                                />
                                <span className="let-know-required" id="add-user-email-required">Please let us know the
                                email</span>
                            </label>
                            <label>Job (Rank)
                                <div
                                    className={`custom-select ${isJobSelectActive && form.departmentName && 'active'} ${errors.jobId && 'error'}`}>
                                    <div onClick={() => setIsJobSelectActive(!isJobSelectActive)}
                                         className={`select-selected-new ${isJobSelectActive && form.departmentName && 'select-arrow-active'} ${form.jobTitle && 'selected'}`}
                                         contentEditable={false} suppressContentEditableWarning={true} id="jobField">
                                        {form.departmentName ? (isJobSelectActive ? (form.jobTitle ? form.jobTitle : '') : (form.jobTitle ? form.jobTitle : 'Please Select')) : 'Start typing to select a Rank'}
                                    </div>
                                    {(isJobSelectActive && form.departmentName) && (
                                        <div className="select-items">
                                            <div className="custom-scrollbar-new" id="selectJob">
                                                {jobs.length <= 0 ? (
                                                    <div className="select-option job">
                                                        Please Select Another Department
                                                    </div>
                                                ) : (
                                                    jobs.map((job) => (
                                                        <div key={job.id}
                                                             onClick={() => handleSetJob(job.id, job.title)}
                                                             className="select-option job">
                                                            <span
                                                                className="select-option-first-char">{getDepartmentTitleWithFirstChar(job.title)}</span>
                                                            {job.title}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <span className="let-know">Please let us know the rank</span>
                            </label>

                            <label>
                                <div>
                                    Title <span className="lable-span">(Optional)</span>
                                </div>
                                <input onChange={(e) => setForm(
                                    {
                                        ...form,
                                        title: e.target.value
                                    }
                                )} className={`selected`} type="text" placeholder="Create a Title"/>
                                <span className="let-know">Please let us know the rank</span>
                            </label>

                            <label>Permission Role
                                <div
                                    className={`custom-select ${isPermissionRoleSelectActive && 'active'} ${errors.role && 'error'}`}>
                                    <div
                                        className={`select-selected-new ${isPermissionRoleSelectActive && 'select-arrow-active'} ${form.role && 'selected'}`}
                                        id="permissionRole"
                                        onClick={() => setIsPermissionRoleSelectActive(!isPermissionRoleSelectActive)}
                                    >
                                        {form.role ? form.role : 'Select Role'}
                                    </div>
                                    {
                                        isPermissionRoleSelectActive && (
                                            <div className="select-items">
                                                {roles.map((role, index) => (
                                                    <div key={index} onClick={() => handleSetRole(role)}
                                                         className="select-option role">
                                                        {role}
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    }
                                </div>

                                <span className="let-know">Please let us know the role</span>
                            </label>


                                    <label>
                                        Status
                                        <div
                                            className={`custom-select ${isStatusSelectActive && 'active'} ${errors.status && 'error'}`}>
                                            <div
                                                onClick={() => setIsStatusSelectActive(!isStatusSelectActive)}
                                                className={`select-selected-new ${isStatusSelectActive && 'select-arrow-active'} ${form.status && 'selected'}`}
                                                id="statusAdd"
                                            >
                                                {form.status ? form.status : 'Please Select...'}
                                            </div>
                                            {isStatusSelectActive && (
                                                <div className="select-items">
                                                    {status.map((status, index) => (
                                                        <div key={index} onClick={() => handleStatus(status)}
                                                             className="select-option status">
                                                            {status}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <span className="let-know" id="roleAdd">Please let us know the status</span>
                                    </label>


                        </div>
                    </div>
                    <div className="popup__users-footer">
                        <button
                            type="button"
                            className="undo-button"
                            onClick={handler}
                        >
                            Cancel
                        </button>
                        <button onClick={form.edit ? handleEditUser : handleAddUser} className="btn user-add"
                                type="button">{form.edit ? "Edit User" : "Add User"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUsers;