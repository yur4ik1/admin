import React, {useEffect, useState} from "react";
import AddJob from "../popups/add-job.jsx";
import {editPositionTitle} from "../../utils/fetches/positions/editPositionTitle.js";
import {disablePosition} from "../../utils/fetches/positions/disablePosition.js";
import ArchiveConfirmation from "../popups/archive-confirmation.jsx";
import JobItem from "./job-item.jsx";

/* eslint-disable */
const Position = ({position, handleOnChange, setIsLoading}) => {
    const [isEditTitle, setIsEditTitle] = useState(false);
    const [title, setTitle] = useState(position.title);
    const [isJobPopupActive, setIsJobPopupActive] = useState(false)

    const [isArchiveDepPopupActive, setIsArchiveDepPopupActive] = useState(false);

    const handleSaveTitle = () => {
        editPositionTitle(position.id, title).then((data) => {
            console.log(data);
        })
    }

    const handleEditTitle = (e) => {
        e.preventDefault();

        if (isEditTitle) {
            handleSaveTitle();
            handleOnChange();
            setIsEditTitle(false);
        } else {
            setIsEditTitle(true);
        }
    }
    const handleIsJobPopupActive = () => {
        setIsJobPopupActive(!isJobPopupActive);
    }


    function handleArchiveDepStatus() {
        setIsLoading(true);
        disablePosition(position.id, !position.active).then(() => {
            setIsArchiveDepPopupActive(false);
            handleOnChange();
            setIsLoading(false);
        })
    }

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && isEditTitle) {
                e.preventDefault();
                handleSaveTitle();
                handleOnChange();
                setIsEditTitle(false);
            }
        });
    }, []);
    // console.log("data job for positions component: ", position.departments_jobs)


    return (
        <div className="positions-item" key={position.id}>
            <div className="department__wrapper">
                <div className="department">
                    <p
                        className={`department-field department-field-custom-style ${isEditTitle ? 'editableInput' : ''}`}
                        contentEditable={isEditTitle}
                        suppressContentEditableWarning={true}
                        onInput={(e) => setTitle(e.target.innerText)}
                    >
                        {position.title}
                    </p>
                    <a
                        className={isEditTitle ? "edit-done" : "edit"}
                        href="#"
                        onClick={(e) => handleEditTitle(e)}
                    ></a>
                    <span onClick={() => setIsArchiveDepPopupActive(true)}
                          className={`skills-archive ${position.active ? "" : "archived-status"}`}></span>

                    {isArchiveDepPopupActive &&
                        (<ArchiveConfirmation
                            handlerReject={() => setIsArchiveDepPopupActive(false)}
                            handlerConfirm={() => handleArchiveDepStatus()}
                        />)
                    }
                </div>

                <div className="skills__archive-popup">
                    <p>
                        Department can't be deactivated until you have at least one active user
                        with this department.
                    </p>
                </div>

                <div className="add-job">
                    <button className="add-job-btn btn" onClick={handleIsJobPopupActive}>
                        Add Job
                    </button>
                </div>
            </div>

            <div className="content__section">
                <div className="table">
                    <div className="row row-header">
                        <div className="cell">Job Title (Rank)</div>
                        <div className="cell">Description</div>
                        <div className="cell">Skills</div>
                        <div className="cell">Actions</div>
                    </div>


                    {position.departments_jobs.map((job) =>
                        <JobItem key={job.id} job={job} setIsLoading={setIsLoading} handleOnChange={handleOnChange}/>
                    )}
                </div>
                {isJobPopupActive && (
                    <AddJob handler={handleIsJobPopupActive} departmentId={position.id}
                            handleOnChange={handleOnChange}/>
                )}
            </div>


        </div>
    )
}
/* eslint-enable */

export default Position