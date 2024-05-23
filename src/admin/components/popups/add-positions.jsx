import React, {useEffect, useState} from "react";
import {getDepartments} from "../../utils/fetches/users/getDepartments.js";
import {addDepartment} from "../../utils/fetches/positions/addDepartments.js";

import Loading from "../loading/Loading.jsx";
import InfoPopup from "./info-popup.jsx";

// eslint-disable-next-line react/prop-types
const DepartamentElement = ({ data, onDelete }) => {

    return (
        <label id={data.title}>
            Department Name
            <div className="field added">
                <input type="" className='new__custom-select__trigger' placeholder="Development" defaultValue={data.title} readOnly />
                <button className="btn" onClick={() => onDelete(data.id)}></button>
            </div>
        </label>
    )
}


const AddPosition = ({handler, positions, handleOnChange, json = {}}) => {
    const [isLoading, setIsLoading] = useState(json.edit ? true : false);

    /* Entry information */
    const [departments, setDepartments] = useState([]);


    /* Select states */
    const [isDepartmentSelectActive, setIsDepartmentSelectActive] = useState(false);
    /* Search states */
    const [departmentSearch, setDepartmentSearch] = useState("");
    const [managerSearch, setManagerSearch] = useState("");

    /* Form states */
    const [form, setForm] = useState(json);
    /* Error states */
    const [errors, setErrors] = useState({});

    const [isOpenInfo, setIsOpenInfo] = useState(false);
    const [isDepartmentInput, setIsDepartmentInput] = useState('')
    const [addedDepartments, setAddedDepartments] = useState([]);

    const handleSetDepartment = (id, name) => {
        setForm({
            ...form,
            departmentId: id,
            departmentName: name,
        });

        setIsDepartmentSelectActive(false);
    };

    const handleOpenInfo = () => {
        setIsOpenInfo(!isOpenInfo);
    };

    const AddDepartmentElement = () => {
        if (!isDepartmentInput.trim()) {
            return;
        }
        const newDepartment = {
            id: addedDepartments.length + 1,
            title: isDepartmentInput.trim()
        };
        setAddedDepartments([...addedDepartments, newDepartment]);

        setIsDepartmentInput('');
    }
    const handleDeleteDepartment = (id) => {
        const updatedDepartments = addedDepartments.filter(department => department.id !== id);
        setAddedDepartments(updatedDepartments);
    };
    const handelAddDepartments = async () => {
        // if (Object.values(errors).some(error => error)) {
        //     return false;
        // }
        setIsLoading(true);

        await addDepartment(addedDepartments).then((data) => {

            setIsLoading(false);

            if (data.returning) {
                handler();
                handleOnChange();
            }
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const departmentsData = await getDepartments(departmentSearch);
                setDepartments(departmentsData.data.departments);
                setIsLoading(false);

                if (form.edit === true && departmentsData.data.departments.length > 0) {
                    const department = departmentsData.data.departments.find((department) => department.id === form.departmentId);

                    setForm((prevForm) => ({
                        ...prevForm,
                        departmentName: department.title,
                    }));
                }
            } catch (error) {
                console.error("Error on fetching:", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [form.edit, form.departmentId]);
    useEffect(() => {

        getDepartments().then((data) => {
            setDepartments(data.data)
        })
    }, [managerSearch]);

    return (
        <div className="positions__popup ninjable__popup popup__users add-users active" id="add-users_popup">
            {isLoading && <Loading/>}

            <div className="ninjable__popup-inner">
                <div className="ninjable__popup-header">
                    <span onClick={handler} className="ninjable__popup-close">
                        <img src="/img/subscription__popup-close.svg" alt=""/>
                    </span>
                    <div id="anchor">
                        <h3>{(form.edit && "EDIT DEPARTMENT") || "ADD DEPARTMENT"}</h3>
                    </div>
                </div>
                <div className="positions__popup-content">


                <div className="positions__popup-form">
                    <label>
                        Department Name
                        <span className="let-know-required" id="required-add-job-skills-selected">
                            Please let us know the skills
                        </span>

                        <div className="field">
                            <div className="new__custom-select-wrapper">
                                <div className="new__custom-select">
                                    <div className="new__custom-select__trigger">
                                        <input
                                            onChange={(e) => setIsDepartmentInput(e.target.value)}
                                            value={isDepartmentInput}
                                            id="search-input"
                                            type="text" placeholder="Enter name"
                                            name="search"
                                        />
                                    </div>
                                </div>
                            </div>
                            <button className="btn" onClick={AddDepartmentElement}></button>
                        </div>
                    </label>
                    <div>
                        <h4 className="departments-title" onClick={handleOpenInfo}>
                            Added Departments
                        </h4>
                        <InfoPopup
                            isOpenInfo={isOpenInfo}
                            title="Added Departments"
                            description="These departments are in preview mode. Please click the 'Add' button to add these departments to the page."
                        />
                    </div>
                    <div>
                        {addedDepartments.map((department) => (
                            <DepartamentElement key={department.id} data={department} onDelete={handleDeleteDepartment} />
                        ))}
                    </div>
                    <div className="bottom">
                        <button className="btn" onClick={handelAddDepartments}>Add</button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default AddPosition;
