import {useEffect, useState} from "react";
import {Helmet} from "react-helmet";
import ReactPaginate from 'react-paginate';
import {createFileRoute} from '@tanstack/react-router'

import Header from "../components/header/header.jsx";
import Sidebar from "../components/sidebar/sidebar.jsx";
import Loading from "../components/loading/Loading.jsx";
import MainLayout from "../components/layouts/main-layout/main-layout.jsx";
import SkillPopup from "../components/popups/skill-popup.jsx";
import AddSkillLevel from "../components/popups/add-skill-level.jsx";
import ArchiveConfirmation from "../components/popups/archive-confirmation.jsx";
import {protectedRoute} from "../utils/auth.jsx";

import {getSkills} from "../utils/fetches/skills/getSkills.js";
import {performSearch} from "../utils/fetches/skills/search.js";
import {editSkillStatus} from "../utils/fetches/skills/editSkillStatus.js";
import {updateTitle} from "../utils/fetches/skills/updateTitle.js";
import {editSkillLevelStatus} from "../utils/fetches/skills/editSkillLevelStatus.js";

export const Route = createFileRoute('/skills')({
    beforeLoad: ({context, location}) => {
        protectedRoute({location});
    },
    component: () => <Skills/>
})

const Skills = () => {
    const [isLoading, setIsLoading] = useState(true);

    const [limit, setLimit] = useState();
    const [offset, setOffset] = useState(0);
    const [status, setStatus] = useState();
    const [skills, setSkills] = useState([]);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isAddSkillPopupOpen, setIsAddSkillPopupOpen] = useState(false);

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [globalSearch, setGlobalSearch] = useState('');

    // pagination code
    const [itemOffsetSkill, setItemOffsetSkill] = useState(0);
    const [itemsPerPage] = useState(5)
    const endOffset = itemOffsetSkill + itemsPerPage;
    const currentItems = skills.slice(itemOffsetSkill, endOffset);
    const pageCount = Math.ceil(skills.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % skills.length;
        setItemOffsetSkill(newOffset);
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    const handleAddSkill = () => {
        setIsAddSkillPopupOpen(false);

        getSkills(limit, offset, status, globalSearch).then((data) => {
            setIsLoading(false);
            setSkills(data.data.skills);
        });
    }

    const handleSearch = (search) => {
        performSearch(search, status).then((data) => {
            setSearchResults(data.data.skills);
        });
    }
    const handleGlobalSearch = (search) => {
        if (search === '') {
            setGlobalSearch('');
            setSearchResults([]);
            setIsLoading(true);

            document.getElementById('search-input').value = '';
            return;
        }
        setGlobalSearch(search);
        setSearchResults([]);
        setIsLoading(true);
        document.getElementById('search-input').value = search;
    }
    const resetSearch = () => {
        document.getElementById('search-input').value = '';
        setSearch('');
        setGlobalSearch('');
        setSearchResults([]);
    }

    const handleChangeStatus = (status) => {
        setStatus(status);
        setIsLoading(true);
    }
    const handleChanges = () => {
        setIsLoading(true);

        getSkills(limit, offset, status, globalSearch).then((data) => {
            setIsLoading(false);
            setSkills(data.data.skills);
        });
    }

    useEffect(() => {
        getSkills(limit, offset, status, globalSearch).then((data) => {
            setIsLoading(false);
            setSkills(data.data.skills);
        });

    }, [globalSearch, limit, offset, status]);

    console.log(skills)

    return (
        <MainLayout>
            {
                <Helmet>
                    <link rel="stylesheet" href="/css/skills.css"/>
                </Helmet>
            }

            <div className="skills-page">
                <Header/>

                <section className="another__wrapper">
                    <Sidebar/>

                    <section className="content skills">
                        <div id="anchor">
                            <h2>SKILLS</h2>
                        </div>
                        <div className="add-skill">
                            <a onClick={() => setIsAddSkillPopupOpen(true)} className="add-skill-btn btn">Add Skill</a>
                        </div>
                        <div className="search__wrapper">
                            <span className="search-icon">
                                <div className="search-input-block">
                                    <input className="search-input" id="search-input" type="text"
                                           placeholder="Type here to search for Skill..."
                                           onChange={(e) => handleSearch(e.target.value)}
                                    />
                                    {globalSearch && (
                                        <button onClick={resetSearch} className="closeFilter">
                                            <img src="/img/subscription__popup-close.svg" alt=""/>
                                        </button>
                                    )}
                                    {searchResults.length > 0 && (
                                        <div className="search-input-selector">
                                            {searchResults.map((result) => (
                                                <label onClick={() => handleGlobalSearch(result.title)}
                                                       key={result.id}>{result.title}</label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </span>
                            <div className={`filter-select ${isFilterOpen && 'active'}`}>
                                <div onClick={() => setIsFilterOpen(!isFilterOpen)}
                                     className={`select-selected ${isFilterOpen && 'select-arrow-active'}`}
                                     id="filterSelect">
                                    {status === undefined ? "All" : status ? "Active" : "Archived"}
                                </div>
                                <span className="line"></span>
                                {isFilterOpen && (
                                    <div className="select-items" id="selectItemsFilter">
                                        <div className="select-option">
                                            <input type="checkbox" onClick={() => handleChangeStatus()} id="all"
                                                   checked={status === undefined}/>
                                            <label htmlFor="all" className="filterLabel">All</label>
                                        </div>
                                        <div className="select-option">
                                            <input type="checkbox" id="active" onClick={() => handleChangeStatus(true)}
                                                   checked={status === true}/>
                                            <label htmlFor="active" className="filterLabel">Active</label>
                                        </div>
                                        <div className="select-option">
                                            <input type="checkbox" id="Archived"
                                                   onClick={() => handleChangeStatus(false)}
                                                   checked={status === false}/>
                                            <label htmlFor="Archived" className="filterLabel">Archived</label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {isLoading && <Loading/>}

                        <div id="skills-view">
                            {currentItems.map((skill) => (
                                <Skill key={skill.id} handlerOnChange={handleChanges} skill={skill}/>
                            ))}
                        </div>

                        <ReactPaginate
                            breakLabel="..."
                            nextLabel=""
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel=""
                            renderOnZeroPageCount={null}
                            ageRangeDisplayed={4}
                            marginPagesDisplayed={2}
                            containerClassName="navigation"
                            breakClassName="page-item"
                            pageLinkClassName="page-item"
                            previousClassName="page-item-button page-item-button-prev"
                            nextClassName="page-item-button page-item-button-next"
                            activeClassName="page-item-active"
                        />
                    </section>
                </section>
            </div>

            {isAddSkillPopupOpen && <SkillPopup handler={handleAddSkill}/>}
        </MainLayout>
    );
};

/* eslint-disable */
const Skill = ({skill, handlerOnChange}) => {
    const [isEdit, setIsEdit] = useState(false);

    const [title, setTitle] = useState(skill.title);

    const [isArchivePopupActive, setIsArchivePopupActive] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [isAddSkillLevelPopupOpen, setIsAddSkillLevelPopupOpen] = useState(false);

    const saveName = () => {
        setIsLoading(true);
        updateTitle(skill.id, title).then(() => {
            setIsEdit(false);
            handlerOnChange();
            setIsLoading(false);
        });
    }

    const handleEditBtn = () => {
        if (isEdit) {
            saveName()
            setIsEdit(false);
        } else {
            setIsEdit(true);
        }
    }

    const handleEditStatus = (id, newStatus) => {
        setIsLoading(true);
        editSkillStatus(id, newStatus).then(() => {
            handlerOnChange();
            setIsArchivePopupActive(false);
            setIsLoading(false);
        })
    }

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                saveName();
            }
        });
    }, []);

    return (
        <div className={"skill-item"}>
            <div className="department__wrapper">
                <div className="department">
                    <p
                        className={`department-field department-field-custom-style ${isEdit ? "editableInput" : ""}`}
                        type="text"
                        contentEditable={isEdit}
                        suppressContentEditableWarning={true}
                        onInput={(e) => setTitle(e.target.innerText)}
                    >
                        {skill.title}
                    </p>
                    <button
                        type="button"

                        className={`edit ${isEdit ? "edit-done" : ''} edit-skill-btn`}
                        style={{border: "none", background: "none"}}
                        onClick={handleEditBtn}
                    >
                    </button>
                    <a
                        onClick={() => setIsArchivePopupActive(!isArchivePopupActive)}
                        className={`archive ${skill.active ? "" : "Archived-statu"}`}
                        href="#"
                    >
                    </a>

                    {isArchivePopupActive && (<ArchiveConfirmation handlerReject={() => setIsArchivePopupActive(false)}
                                                                   handlerConfirm={() => handleEditStatus(skill.id, skill.active)}/>)}
                </div>
                <div className="add-job">
                    {skill.skills_skills_levels.length < 6 ?
                        (<button onClick={() => setIsAddSkillLevelPopupOpen(true)}
                                 className="add-skills btn add-skills-btn">Add Skill’s
                            Level</button>) :
                        (<button disabled={true} className="add-skills btn deactive-btn"
                                 style={{color: "#b9babe", background: "#fafcfb"}}>Add Skill’s
                            Level</button>)
                    }
                </div>

                <div className="deactive-info-popup">
                    <p className="title">You can’t add Skill’s Level</p>
                    <p className="text">All levels already added to this skill. You can only
                        edit or archive any necessary skill's level.</p>
                </div>
            </div>

            <div className="section__tags">
                {skill.skills_skills_departments.map((department, index) => (
                    <a href={'#'} key={index}>{department.skills_departments_department.title}</a>
                ))}
            </div>

            <div className="content__section">
                <div className="table">
                    <div className="row row-header">
                        <div className="cell">Level</div>
                        <div className="cell">Description</div>
                        <div className="cell" style={{width: "10.46vw"}}>Attribute</div>
                        <div className="cell" style={{width: "6.72vw"}}>Receipt <br/> Condition
                        </div>
                        <div className="cell" style={{width: "5.7vw"}}>Status</div>
                        <div className="cell">Actions</div>
                    </div>

                    {skill.skills_skills_levels.map((level) => (
                        <Level key={level.id} level={level} handlerOnChange={handlerOnChange}/>
                    ))}
                </div>
            </div>

            {isAddSkillLevelPopupOpen && <AddSkillLevel handlerSave={handlerOnChange}
                                                        handlerClose={() => setIsAddSkillLevelPopupOpen(!isAddSkillLevelPopupOpen)}
                                                        id={skill.id}/>}

            {isLoading && <Loading/>}
        </div>
    );
}


export default Skills;

const Level = ({level, handlerOnChange}) => {
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isArchivePopupActive, setIsArchivePopupActive] = useState(false);

    const handleChangeStatus = (id, newStatus) => {
        editSkillLevelStatus(id, newStatus).then(() => {
            handlerOnChange();
            setIsArchivePopupActive(false);
        });

        handlerOnChange();
    }

    return (
        <div className="row row-item" key={level.id}>
            <div className="cell name">{level.skills_levels_level.title}</div>
            <div className="cell desc">{level.description}</div>
            <div className="cell attribute">
                <div className="flex">
                    <div className="flex-start">
                        <img src="/img/power-2.png" alt="" className="no-absolute"/>
                        <p className="no-absolute">Power</p>
                    </div>
                </div>
            </div>
            <div className="cell coins">{level.goal}</div>
            <div className="cell status">{level.status === 1 ? "Active" : "Archived"}</div>
            <div className="cell actions">
                <span onClick={() => setIsEditPopupOpen(!isEditPopupOpen)} className="edit edit-job-btn"></span>
                <span onClick={() => setIsArchivePopupActive(!isArchivePopupActive)}
                      className={`archive ${level.status === 1 ? "" : "Archived-statu"}`}></span>
            </div>

            {isEditPopupOpen &&
                <AddSkillLevel handlerClose={() => setIsEditPopupOpen(!isEditPopupOpen)} handlerSave={handlerOnChange}
                               info={
                                   {
                                       id: level.id,
                                       description: level.description,
                                       recipientCondition: level.goal,
                                       levelId: level.level_id,
                                       levelName: level.skills_levels_level.title,
                                       status: level.status === 1 ? "Active" : "Archived",
                                       edit: true
                                   }
                               }
                />
            }

            {isArchivePopupActive && 
                (<ArchiveConfirmation 
                    handlerReject={() => setIsArchivePopupActive(false)}
                    handlerConfirm={() => handleChangeStatus(level.id, level.status === 1 ? "Active" : "Archived")}
                />)
            }
        </div>
    );
}

/* eslint-enable */