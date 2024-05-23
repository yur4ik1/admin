import { useEffect, useState } from 'react';
import SkillMap from './skillMap/SkillMap';
import styles from './skillMapPopup.module.scss'
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { hideOverlay, showOverlay } from '../../../store/actions/global';
import { useLazyQuery } from '@apollo/client';
import { GET_MYSKILLS_MAP, GET_SKILLS_BY_DEPARTMENTS, GET_SKILL_MAP_REDUCED } from '../../../queries/profile';
import { generatePDF } from '../../../utils/PDF/generatePDF';
import { useClickOutside } from '../../../utils/hooks/global';


const getParsedJobsData = (compData) => {
    let compJobs = []
    let skillPercentArr = []
    compData.departments_jobs.forEach((job) => {
        let skills = []
        job.jobs_skills_jobs.forEach((skill) => {
            if (skill.skills_jobs_skill.skills_skills_levels?.length > 0) {
                skills.push(skill.skills_jobs_skill.skills_skills_levels[0])
            }
        })

        let highestSkillCount = 0, highestSkillId = 0, highestSkillName = ''
        skills.forEach((skill) => {
            if (Number(highestSkillId) < Number(skill.level_id)) {
                highestSkillCount = 0
                highestSkillId = skill.level_id

                // highestSkillName = localizedValue(skill.skills_levels_level, 'i18n_levels', 'title')
                highestSkillName = skill.skills_levels_level.title ?? ''
            }
            if (highestSkillId == skill.level_id) {
                highestSkillCount++
            }

        })
        skillPercentArr.push(highestSkillId)

        let percent = Math.round(((highestSkillCount / skills.length) * 100))
        let seniority = `${percent ? `${percent}%` : ''} ${highestSkillName}`

        let jobData = {
            // title: localizedValue(job, 'i18n_jobs', 'title'),
            title: job.title ?? '',
            seniority: (seniority.trim() === '' || !seniority) ? 'Entry Level' : seniority,
        }
        compJobs.push(jobData)
    })

    let percentage = skillPercentArr.reduce((sum, item) => sum + (item), 0)
    percentage = ((percentage / 3) / compJobs.length) * 100
    percentage = percentage.toFixed(2)
    return [compJobs, percentage]
}

const formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}


const SkillMapPopup = ({ open, handleClose, departmentsData, userSeniority }) => {

    const [skillMapJobs, setSkillMapJobs] = useState([])
    const [mySkills, setMySkills] = useState([])
    const [skillsByDepartment, setSkillsByDepartment] = useState({})
    const [suggestionsData, setSuggestionsData] = useState({})
    const [departmentSelectOpen, setDepartmentSelectOpen] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState(null)

    const dispatch = useDispatch()
    const { userData, token } = useSelector((state) => state.auth)
    const [getSkillMapReducedRequest, { loading: skillMapJobsLoading }] = useLazyQuery(GET_SKILL_MAP_REDUCED)
    const [getMySkillsRequest, { loading: skillMapSkillsLoading }] = useLazyQuery(GET_MYSKILLS_MAP)
    const [getSkillsByDepartments, { loading: skillsByDepartmentsLoading }] = useLazyQuery(GET_SKILLS_BY_DEPARTMENTS)
    const departmentMenu = useClickOutside(() => setDepartmentSelectOpen(false))


    const handleDownloadPDF = async () => {

        let rawEntreCompData = skillsByDepartment.departments?.filter((item) => item.title === "ENTRECOMP")[0]
        let [entreCompJobs, entrePer] = getParsedJobsData(rawEntreCompData)
        let entreCompData = {
            label: 'EntreComp Competence proficiency level',
            jobs: entreCompJobs,
            perText: `${'Overall result'}: ${entrePer}% ${'of'} 100% ${'EntreComp framework knowledge'}`
            // perText: `${i18next.t('PDF.resultTitleText')}: ${entrePer}% ${i18next.t('PDF.of')} 100% ${i18next.t('PDF.entreCompResultDescText')}`
        }

        let rawGreenCompData = skillsByDepartment.departments?.filter((item) => item.title === "GREENCOMP")[0]
        let [greenCompJobs, greenPer] = getParsedJobsData(rawGreenCompData)
        let greenCompData = {
            label: 'GreenComp Competence proficiency level',
            jobs: greenCompJobs,
            perText: `${'Overall result'}: ${greenPer}% ${'of'} 100% ${'GreenComp framework knowledge'}`
        }

        let rawDigCompData = skillsByDepartment.departments?.filter((item) => item.title === "DIGCOMP")[0]
        let [digCompJobs, digPer] = getParsedJobsData(rawDigCompData)
        let digCompData = {
            label: 'DigComp Competence proficiency level',
            jobs: digCompJobs,
            perText: `${'Overall result'}: ${digPer}% ${'of'} 100% ${'DigComp framework knowledge'}`
        }

        let suggestions = suggestionsData.suggestions?.[0]?.map((item) => ({ title: item })) ?? []
        let nextSteps = [{ title: suggestionsData.suggestions ? (suggestionsData.suggestions[1] ?? '') : '' }]
        let summary = [{ title: suggestionsData.suggestions ? (suggestionsData.suggestions[2] ?? '') : '' }]

        dispatch(showOverlay())
        await generatePDF(
            [
                { label: 'Date and Time', text: `${new Intl.DateTimeFormat().format(new Date())}, ${formatAMPM(new Date())}` },
                { label: 'Name', text: `${userData?.firstname || ""} ${userData?.lastname || ""}` },
            ],
            [
                { ...entreCompData },
                { ...greenCompData },
                { ...digCompData },
                { label: 'SUMMARY', jobs: summary },
                { label: 'Potential professional path', jobs: suggestions },
                { label: 'Next steps', jobs: nextSteps },
            ]
        )
        dispatch(hideOverlay())
    }

    const fetchSuggestionsData = async () => {
        const quizData = userData?.quiz
        let tmpUserData = {} // AdditionalUserData
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_DISPATCH_URL}/api/v1/suggestion`, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    data: skillsByDepartment,
                    quiz: quizData,
                    lang: 'en',
                    // userdata: tmpUserData
                }),
            })
            let parsedSuggestionData = await response.json()
            if (parsedSuggestionData) {
                setSuggestionsData(parsedSuggestionData)
            }
        } catch (error) {
            console.error('error :>> ', error);
        }
    }


    useEffect(() => {
        if (open) {
            getSkillMapReducedRequest().then((res) => {
                setSkillMapJobs(res.data?.jobs)
            }).catch((err) => {
                console.error('err getSkillMapReducedRequest :>> ', err);
            })

            getMySkillsRequest({
                variables: {
                    user_id: userData?.id
                }
            }).then((res) => {
                setMySkills(res.data?.jobs)
            }).catch((err) => {
                console.error('err getMySkillsRequest :>> ', err);
            })

            getSkillsByDepartments({
                variables: {
                    user_id: userData?.id
                }
            }).then((res) => {
                setSkillsByDepartment(res.data ?? {})
            }).catch((err) => {
                console.error('err getSkillsByDepartments :>> ', err);
            })

        }
    }, [open])

    useEffect(() => {
        if (Object.keys(skillsByDepartment).length) {
            fetchSuggestionsData()
        }
    }, [skillsByDepartment, userData, token])

    useEffect(() => {
        if (skillMapJobsLoading || skillMapSkillsLoading || skillsByDepartmentsLoading) {
            dispatch(showOverlay())
        } else if (!skillMapJobsLoading && !skillMapSkillsLoading && !skillsByDepartmentsLoading) {
            dispatch(hideOverlay())
        }
    }, [skillMapJobsLoading, skillMapSkillsLoading, skillsByDepartmentsLoading])

    useEffect(() => {
        if (departmentsData && departmentsData.length > 0 && !selectedDepartment) {
            setSelectedDepartment(departmentsData[0].id)
        }
    }, [departmentsData])


    return (
        <>
            <div className={`${styles['main__popup']} ${styles['skill__map']} ${open ? styles['active'] : ''}`}>

                <div className={styles['main__popup-inner']}>
                    {
                        (!skillMapJobsLoading && !skillMapSkillsLoading) &&
                        <>
                            <div className={styles['skill-map-controls']}>
                                <button className={`${styles['skill-map-btn-zoom']} ${styles['btn-zoom-down']} btn-zoom-down`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="2" viewBox="0 0 22 2" fill="none">
                                        <rect y="1.84619" width="1.69231" height="22" transform="rotate(-90 0 1.84619)" fill="#FFFEFE" />
                                    </svg>
                                </button>
                                <button className={`${styles['skill-map-btn-zoom']} ${styles['btn-zoom-up']} btn-zoom-up`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                        <rect x="10.1538" width="1.69231" height="22" fill="#FFFEFE" />
                                        <rect y="11.8462" width="1.69231" height="22" transform="rotate(-90 0 11.8462)" fill="#FFFEFE" />
                                    </svg>
                                </button>
                            </div>
                            <div className={styles['main__popup-top']}>
                                <div className={`new__custom-select-wrapper ${styles['new__custom-select-wrapper']}`}>
                                    <div
                                        className={`new__custom-select filter-select-scroll ${departmentSelectOpen ? 'open' : ''}`}
                                        onClick={() => setDepartmentSelectOpen((prev) => (!prev))}
                                        ref={departmentMenu}
                                    >

                                        <div className={`arrow`}></div>

                                        <div className={`new__custom-select__trigger ${styles['new__custom-select__trigger']}`}>
                                            <span>{departmentsData?.filter((item) => item.id === selectedDepartment)[0]?.title}</span>
                                            {/* <input type="text" placeholder="Type here to search for Clan..." /> */}
                                        </div>

                                        <div className={`new__custom-options ${styles['new__custom-options']}`}>
                                            {
                                                departmentsData?.map((department, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`_new__custom-option ${styles['_new__custom-option']}`}
                                                            onClick={() => setSelectedDepartment(department.id)}
                                                        >
                                                            <span>{department.title}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>

                                        <div className={`custom-scrollbar ${styles['custom-scrollbar']}`}>
                                            <div className={`custom-scrollbar-thumb ${styles['custom-scrollbar-thumb']}`}></div>
                                        </div>

                                    </div>
                                </div>

                                <span
                                    className={`${styles['main__popup-close']} ${styles['skill__map-close']}`}
                                    onClick={handleClose}
                                ></span>
                                <span
                                    className={styles['skill__map-download']}
                                    onClick={handleDownloadPDF}
                                ></span>
                            </div>

                            {open && <SkillMap
                                options={{
                                    minScale: 0.3,
                                    maxScale: 1.7,
                                    initialScale: 0.4,
                                    initialTranslateX: -0.015 * window.innerWidth,
                                    initialTranslateY: -1.2 * window.innerHeight,
                                    smoothTime: 0.5,
                                }}
                                skillMapJobs={skillMapJobs}
                                userSeniority={userSeniority}
                                mySkills={mySkills}
                            />}
                        </>
                    }

                </div>

            </div>

        </>
    )
}

SkillMapPopup.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    departmentsData: PropTypes.array,
    userSeniority: PropTypes.object
}

export default SkillMapPopup