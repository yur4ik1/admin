import {useState} from "react";
import AddJob from "../popups/add-job.jsx";
import ArchiveConfirmation from "../popups/archive-confirmation.jsx";
import {setActiveJobStatus} from "../../utils/fetches/positions/setActiveJobStatus.js";


/* eslint-disable */
const JobItem = ({job, handleOnChange, setIsLoading}) => {
    const [isArchivePopupActive, setIsArchivePopupActive] = useState(false);
    const [isEditJobPopupActive, setIsEditJobPopupActive] = useState(false)
    const [editPopupId, setEditPopupId] = useState(0)
    
    const handleIsEditJobPopupActive = (id) => {
        setIsEditJobPopupActive(!isEditJobPopupActive);
        setEditPopupId(id);
    }
    
    function handleSetActiveJobStatus() {
        setIsLoading(true);
        setActiveJobStatus(job.id, !job.active).then(() => {
            setIsArchivePopupActive(false);
            handleOnChange();
            setIsLoading(false);
        })
    }

    return (
        <div className="row row-item" key={job.id}>
            <script>console.log(job)</script>
            <div className="cell name">{job.title}</div>
            <div className="cell description">{job.description}</div>
            <div className="cell tags">
                <div>
                    {job.jobs_skills_jobs.map((skill, index) => (
                        <a href={'#'}
                           key={index}
                        >{skill.skills_jobs_skill.title}</a>
                    ))}
                </div>
            </div>
            <div className="cell actions">
                                <span
                                    className="edit edit-job-btn"
                                    onClick={() => handleIsEditJobPopupActive(job.id)}
                                ></span>
                <span
                    onClick={() => setIsArchivePopupActive(true)}
                    className={`archive ${job.active ? "" : "archived-status"}`}
                >
                                    
                                </span>
            </div>

            {isEditJobPopupActive && editPopupId === job.id && (
                <AddJob handler={handleIsEditJobPopupActive} departmentId={job.id}
                        handleOnChange={handleOnChange}
                        json={{
                            id: job.id,
                            jobTitle: job.title,
                            description: job.description,
                            selectedSkills: job.jobs_skills_jobs,
                            jobsLevels: job.jobs_levels,
                            edit: true
                        }}
                />
            )}

            {isArchivePopupActive &&
                (<ArchiveConfirmation
                    handlerReject={() => setIsArchivePopupActive(false)}
                    handlerConfirm={() => handleSetActiveJobStatus()}
                />)
            }
        </div>
    )                     
}
/* eslint-enable */

export default JobItem