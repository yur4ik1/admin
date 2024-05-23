import { useEffect, useState } from "react"
import SkillTaskLayout from "../../components/skill-task-layout/SkillTaskLayout"
import styles from './tasks.module.scss'
import { GET_SKILLS, GET_TASKS } from "../../queries/tasks"
import { useLazyQuery } from "@apollo/client"
import { useDispatch, useSelector } from 'react-redux';
import { hideOverlay, showOverlay } from "../../store/actions/global"
import { useClickOutside } from "../../utils/hooks/global"
import Language from "../../components/shared/language/Language"
import { useTranslation } from "react-i18next"
import AddTaskPopup from "../../components/tasks/add-task-popup/AddTaskPopup"



const limit = 10

const Tasks = () => {

    const dispatch = useDispatch()
    const { t } = useTranslation()

    const { userData } = useSelector((state) => state.auth)

    const [isFilterOpen, setIsFilterOpen] = useState({
        priority: false,
        status: false,
        skills: false,
        price: false
    })
    const [skills, setSkills] = useState([])
    const [skillsFilterSearch, setSkillsFilterSearch] = useState('')
    const [tasks, setTasks] = useState([])
    const [filters, setFilters] = useState({
        limit: limit,
        offset: 0,
        _status: [1, 2],
        sort: "desc",
        _priority: [1, 2, 3, 4, 5]
    })
    const [pages, setPages] = useState([])
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)

    const priorityMenu = useClickOutside(() => setIsFilterOpen((prev) => ({ ...prev, priority: false })))
    const statusMenu = useClickOutside(() => setIsFilterOpen((prev) => ({ ...prev, status: false })))
    const skillsMenu = useClickOutside(() => setIsFilterOpen((prev) => ({ ...prev, skills: false })))
    const priceMenu = useClickOutside(() => setIsFilterOpen((prev) => ({ ...prev, price: false })))


    const [getSkillsRequest] = useLazyQuery(GET_SKILLS)
    const [getTasksRequest] = useLazyQuery(GET_TASKS)


    const priorityFilterOptions = [
        {
            value: 1,
            label: t('tasks.lowest')
        },
        {
            value: 2,
            label: t('tasks.low')
        },
        {
            value: 3,
            label: t('tasks.medium')
        },
        {
            value: 4,
            label: t('tasks.high')
        },
        {
            value: 5,
            label: t('tasks.highest')
        }
    ]

    const statusFilterOptions = [
        {
            value: 1,
            label: t('tasks.open')
        },
        {
            value: 2,
            label: t('tasks.inProgress')
        },
        {
            value: 4,
            label: t('tasks.done')
        }
    ]

    const priceFilterOptions = [
        {
            value: 'asc',
            label: t('tasks.lowPriceFirst')
        },
        {
            value: 'desc',
            label: t('tasks.highPriceFirst')
        }
    ]


    const setSkillsData = (search) => {
        dispatch(showOverlay())
        getSkillsRequest({
            variables: {
                search: search ? `${search}%` : '%'
            }
        }).then((res) => {
            setSkills(res.data?.skills || [])
            dispatch(hideOverlay())
        }).catch(() => {
            dispatch(hideOverlay())
        })
    }

    const setTasksData = (variables) => {
        if (!variables) {
            variables = {
                ...filters,
                user_id: userData.id,
            }
        }
        dispatch(showOverlay())
        getTasksRequest({
            variables
        }).then((res) => {
            setTasks(res.data?.tasks || [])
            setPages(() => {
                let pageNumbers = [];
                let totalPages = Math.ceil(res.data?.tasks_aggregate?.aggregate?.count / limit)
                for (let i = 1; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
                return pageNumbers || []
            })
            dispatch(hideOverlay())
        }).catch(() => {
            dispatch(hideOverlay())
        })
    }

    const formatStatusValue = (status) => {
        switch (status) {
            case 1:
                return t('tasks.open');
            case 2:
                return t('tasks.inProgress');
            case 3:
                return t('tasks.underReview');
            case 4:
                return t('tasks.done');
            default:
        }
    }

    const handleChangeFilterValues = (value, key) => {
        let data = [...filters[key]]

        const index = data.findIndex((item) => item === value)

        if (index < 0) {
            data.push(value)
        } else {
            data.splice(index, 1)
        }

        setFilters((prev) => ({
            ...prev,
            [key]: data,
            offset: 0
        }))
    }

    const handleChangeFilterValuesRadio = (value, key) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            offset: 0
        }))
    }

    const handleAddTaskClose = () => {
        setIsAddTaskOpen(false)
    }


    useEffect(() => {
        const getSearchData = setTimeout(() => {
            setSkillsData(skillsFilterSearch)
        }, 500)

        return () => clearTimeout(getSearchData)
    }, [skillsFilterSearch])

    useEffect(() => {
        if (userData?.id) {
            setSkillsData()
        }
    }, [userData?.id])

    useEffect(() => {
        if (userData?.id) {
            setTasksData({
                ...filters,
                user_id: userData.id,
            })
        }
    }, [filters, userData.id])


    return (
        <>
            <section className={styles['tasks']}>
                <div className={`container ${styles['container']}`}>

                    <SkillTaskLayout active='tasks' />

                    <div className={styles['tasks__content']}>
                        <div className={styles['filter__wrapper']}>

                            {/* Priority filter */}
                            <div
                                className={`${styles['filter']} filter-select ${styles['filter-select']} ${styles['filter-priority']} ${isFilterOpen.priority ? styles.active : ''}`}
                                onClick={() => setIsFilterOpen((prev) => ({ ...prev, priority: !prev.priority }))}
                                ref={priorityMenu}
                            >
                                <div className="select-selected">
                                    <span className="select-name">{t('tasks.priority')}</span>
                                    <span className="select-text">{t('tasks.select')}</span>
                                </div>
                                <div className={`select-items ${!isFilterOpen.priority ? 'select-hide' : ''}`}>
                                    {
                                        priorityFilterOptions.map((priorityOption, index) => {
                                            return (
                                                <div
                                                    className="select-option"
                                                    key={index}
                                                    onClick={(e) => { e.stopPropagation() }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name='priorityFilter'
                                                        value={priorityOption.value}
                                                        id={`priorityOptions_${index}`}
                                                        checked={filters._priority?.includes(priorityOption.value)}
                                                        onChange={() => { handleChangeFilterValues(priorityOption.value, '_priority') }}
                                                    />
                                                    <label htmlFor={`priorityOptions_${index}`}>{priorityOption.label}</label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            {/* Status filter */}
                            <div
                                className={`${styles['filter']} filter-select ${styles['filter-select']} ${styles['filter-status']} ${isFilterOpen.status ? styles.active : ''}`}
                                onClick={() => setIsFilterOpen((prev) => ({ ...prev, status: !prev.status }))}
                                ref={statusMenu}
                            >
                                <div className="select-selected">
                                    <span className="select-name">{t('tasks.status')}</span>
                                    <span className="select-text">{t('tasks.select')}</span>
                                </div>
                                <div className={`select-items ${!isFilterOpen.status ? 'select-hide' : ''}`}>
                                    {
                                        statusFilterOptions.map((statusOption, index) => {
                                            return (
                                                <div
                                                    className="select-option"
                                                    key={statusOption.value}
                                                    onClick={(e) => { e.stopPropagation() }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name="statusFilter"
                                                        value={statusOption.value}
                                                        id={`statusFilterOptions_${index}`}
                                                        checked={filters._status?.includes(statusOption.value)}
                                                        onChange={() => { handleChangeFilterValues(statusOption.value, '_status') }}
                                                    />
                                                    <label htmlFor={`statusFilterOptions_${index}`}>{statusOption.label}</label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            {/* Skills filter */}
                            <div
                                className={`${styles['filter']} filter-select new__custom-select-wrapper ${styles['new__custom-select-wrapper']}`}
                                onClick={() => setIsFilterOpen((prev) => ({ ...prev, skills: !prev.skills }))}
                                ref={skillsMenu}
                            >
                                <div className={`new__custom-select filter-select-scroll ${isFilterOpen.skills ? 'open' : ''}`}>
                                    <div className="arrow"></div>

                                    <div className="new__custom-select__trigger">
                                        <span>{t('tasks.skills')}</span>
                                        <input
                                            type="text"
                                            placeholder={t('tasks.typeForSkills')}
                                            onClick={(e) => { e.stopPropagation() }}
                                            onChange={(e) => setSkillsFilterSearch(e.target.value)}
                                            value={skillsFilterSearch}
                                        />
                                    </div>

                                    <div className="new__custom-options">
                                        {
                                            skills?.map((skillsData, index) => {
                                                return (
                                                    <div
                                                        className="new__custom-option"
                                                        key={skillsData.id}
                                                        onClick={(e) => { e.stopPropagation() }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            name="skillsFilter"
                                                            value={skillsData.id}
                                                            id={`skillsFilterOptions_${index}`}
                                                            checked={filters.skill_id?.includes(skillsData.id)}
                                                            onChange={() => { handleChangeFilterValues(skillsData.id, 'skill_id') }}
                                                        />
                                                        <label htmlFor={`skillsFilterOptions_${index}`}>{skillsData.title}</label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="custom-scrollbar">
                                        <div className="custom-scrollbar-thumb"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Price filter */}
                            <div
                                className={`${styles['filter']} filter-select ${styles['filter-select']} ${styles['filter-price']} ${isFilterOpen.price ? styles.active : ''}`}
                                onClick={() => setIsFilterOpen((prev) => ({ ...prev, price: !prev.price }))}
                                ref={priceMenu}
                            >
                                <div className="select-selected">
                                    <span className="select-name">{t('tasks.price')}</span>
                                    <span className="select-text">{t('tasks.select')}</span>
                                </div>

                                <div className={`select-items ${!isFilterOpen.price ? 'select-hide' : ''}`}>
                                    {
                                        priceFilterOptions.map((priceOption) => {
                                            return (
                                                <div className="select-option" key={priceOption.value}>
                                                    <input
                                                        type="checkbox"
                                                        value={priceOption.value}
                                                        name="priceFilterOption"
                                                        id={`priceFilterOption_${priceOption.value}`}
                                                        checked={priceOption.value === filters.sort}
                                                        onChange={() => { handleChangeFilterValuesRadio(priceOption.value, 'sort') }}
                                                    />
                                                    <label htmlFor={`priceFilterOption_${priceOption.value}`}>{priceOption.label}</label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Task list */}
                        <div className="tasks__list">
                            {
                                tasks?.map((task) => {
                                    return (
                                        <div
                                            key={task.id}
                                            className={styles['tasks__list-item']}
                                            style={{
                                                backgroundImage: 'url(/img/tasks-yellow.webp)',
                                                backgroundRepeat: 'no-repeat', backgroundSize: 'cover'
                                            }}
                                        >
                                            <div className={styles['price']}>
                                                <span className={styles['price-image']}>
                                                    <img src="/img/tasks-price-yellow.svg" alt="" />
                                                </span>
                                                <span>{task.bounty}</span>
                                            </div>
                                            <div className={styles['name']} style={{ color: 'rgb(134, 102, 57)' }}>
                                                {task.skills?.map(skill => skill.skill?.title).join(', ')}
                                            </div>
                                            <div className={`${styles['text']} ${styles['task-popup']}`}>
                                                <p>{task.title}</p>
                                                <a className={styles['status-open-btn']} style={{
                                                    background: '#EAC185',
                                                    boxShadow: 'rgba(140, 98, 39, 0.4) 0px 0px 10px 5px'
                                                }}>
                                                    {formatStatusValue(task.status)}
                                                </a>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        {/* Pagination */}
                        <div className="pagination">
                            <span className="prev"></span>
                            {
                                pages?.map((page) => {
                                    return (
                                        <span
                                            key={page}
                                            className={`page ${(page - 1) * limit === filters.offset ? 'active' : ''}`}
                                            onClick={() => { setFilters((prev) => ({ ...prev, offset: (page - 1) * limit })) }}
                                        >
                                            {page}
                                        </span>
                                    )
                                })
                            }
                            <span className="next"></span>
                        </div>

                        {/* Task buttons */}
                        <div className={styles['add__btns-wrapper']}>
                            <div className={styles['add__btns-list']}>
                                <button className={styles['wisdom__scroll-btn']}>{t('tasks.wisdomScroll')}</button>
                                <button className={styles['add__task-btn']} onClick={() => setIsAddTaskOpen(true)}>{t('tasks.addTask')}</button>
                                <button className={styles['find__task-btn']}>
                                    {t('tasks.findTask')}
                                    <span>{t('tasks.comingSoon')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section >


            {/* Add task popup */}
            <AddTaskPopup
                open={isAddTaskOpen}
                handleClose={handleAddTaskClose}
                setTasksData={setTasksData}
            />

            <Language />
        </>
    )
}

export default Tasks