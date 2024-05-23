import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLazyQuery, useMutation } from '@apollo/client';
import { hideOverlay, showOverlay } from '../../store/actions/global';
import SkillTaskLayout from '../../components/skill-task-layout/SkillTaskLayout';
import { ACTIVATE_SKILL, ADD_POTENTIAL_SKILL, DEACTIVATE_SKILL, FILTER_POTENTIAL_SKILLS, GET_MYSKILLS } from '../../queries/skills';
import styles from './skills.module.scss'
import Popup from '../../components/shared/popup/Popup';
import { GET_LEVELS } from '../../queries/global';
import Language from '../../components/shared/language/Language';
import { useTranslation } from 'react-i18next';


const Skills = () => {

    const dispatch = useDispatch()
    const { t } = useTranslation()

    const [skills, setSkills] = useState([])
    const [passiveSkills, setPassiveSkills] = useState([])
    const [isPassiveSkillsOpen, setIsPassiveSkillsOpen] = useState(false)
    const [isAddSkillOpen, setIsAddSkillOpen] = useState(false)
    const [potentialSkills, setPotentialSkills] = useState([])
    const [isPotentialSkillsOpen, setIsPotentialSkillsOpen] = useState(false)
    const [selectedPotentialSkill, setSelectedPotentialSkill] = useState({})
    const [levels, setLevels] = useState([])
    const [isActiveLevelHint, setIsActiveLevelHint] = useState(null)

    const { userData } = useSelector((state) => state.auth)
    const [getMySkillsRequest] = useLazyQuery(GET_MYSKILLS)
    const [deactivateSkillRequest] = useMutation(DEACTIVATE_SKILL)
    const [activateSkillRequest] = useMutation(ACTIVATE_SKILL)
    const [getPotentialSkillsRequest] = useLazyQuery(FILTER_POTENTIAL_SKILLS)
    const [getLevelsRequest] = useLazyQuery(GET_LEVELS)
    const [addPotentialSkillRequest] = useMutation(ADD_POTENTIAL_SKILL)


    const setMySkillsData = () => {
        dispatch(showOverlay())

        getMySkillsRequest({
            variables: {
                lang: 'en',
                uid: userData?.id
            }
        }).then((res) => {

            const data = res.data
            let userSkillLevels = data?.users_skills_levels || []
            let skillItemCount = userSkillLevels?.filter((skill) => skill.ismain === true) ?? []
            let passiveSkillItemCount = userSkillLevels?.filter((skill) => skill.ismain === false) ?? []

            const itemLock = 9 - skillItemCount.length;
            for (let i = 1; i <= itemLock; i++) {
                if (i === 1) {
                    skillItemCount.push(1);
                } else {
                    skillItemCount.push(0);
                }
            }

            setSkills(skillItemCount ?? [])
            setPassiveSkills(passiveSkillItemCount ?? [])

            dispatch(hideOverlay())
        }).catch(() => {
            dispatch(hideOverlay())
        })
    }

    const deactivateMySkill = (id) => {
        dispatch(showOverlay())
        deactivateSkillRequest({
            variables: {
                usl_id: id
            }
        }).then(() => {
            setMySkillsData()
            dispatch(hideOverlay())
        }).catch(() => {
            dispatch(hideOverlay())
        })
    }

    const activateMySkill = (id) => {
        dispatch(showOverlay())
        activateSkillRequest({
            variables: {
                usl_id: id
            }
        }).then(() => {
            setMySkillsData()
            dispatch(hideOverlay())
        }).catch(() => {
            dispatch(hideOverlay())
        })
    }

    const onPotentialSkillSelect = (e, selectedSkill) => {
        e.stopPropagation()
        handlePotentialSkillChange(selectedSkill)
    }

    const handleAddSkillClose = () => {
        setSelectedPotentialSkill({})
        setIsAddSkillOpen(false)
    }

    const handlePotentialSkillChange = (selectedSkill) => {
        setSelectedPotentialSkill(selectedSkill)
        setTimeout(() => {
            setIsPotentialSkillsOpen(false)
        }, 0)
    }

    const addPotentialSkill = (id) => {
        dispatch(showOverlay())
        addPotentialSkillRequest({
            variables: {
                usl_id: id
            }
        }).then(() => {
            setMySkillsData()
            setIsAddSkillOpen(false)
            dispatch(hideOverlay())
        }).catch(() => {
            dispatch(hideOverlay())
        })
    }

    useEffect(() => {
        if (userData?.id) {
            setMySkillsData()
            getPotentialSkillsRequest({
                variables: {
                    search: `%`,
                    user_id: userData?.id
                }
            }).then((res) => {
                setPotentialSkills(res.data?.users_skills_levels || [])
            })
            getLevelsRequest().then((res) => {
                setLevels(res.data?.levels)
            })
        }
    }, [userData?.id])


    return (
        <>
            <div className="wrapper">
                <section className={styles['skills']}>
                    <div className="container">

                        <SkillTaskLayout active='skills' />

                        {/* Active skills */}
                        <div className={styles['skills__list']}>
                            {
                                skills.map((skill, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`${styles['skills__list-item']} ${skill === 0 ? styles.lock : ''} ${skill === 1 ? styles.add : ''} ${skill !== "" ? styles.active : ""}`}
                                            style={{ "backgroundImage": `url('${skill?.skills_level?.attribute?.picture_active}')` }}
                                            onClick={() => { if (skill === 1) setIsAddSkillOpen(true) }}
                                        >
                                            <div className={styles['top']}>
                                                <span className={styles['skill']}>{`${skill?.skills_level?.skills_levels_skill?.title ?? ''} ${skill?.skills_level?.skills_levels_level?.title ?? ''}`}</span>
                                                <span className={styles['raised']}>{skill != 0 ? skill.balance + "/" : ""}{skill != 0 ? skill.skills_level?.goal : ""}</span>
                                            </div>
                                            <button
                                                style={{
                                                    "background": `${skill == 0 ? "" : (skill.skills_level?.attribute?.slug == "protection" || skill.skills_level?.attribute?.slug == "power")
                                                        ? "#91C0C0" : (skill.skills_level?.attribute?.slug == "magic" || skill.skills_level?.attribute?.slug == "speed") && "#9ba0b5"}`
                                                }}
                                                onClick={() => deactivateMySkill(skill.id)}
                                            >
                                                {t('skills.deactivate')}
                                            </button>
                                        </div>
                                    )
                                })
                            }

                        </div>
                        <div className={styles['skills__bottom']}>
                            <button className={`${styles['passive-btn']} ${styles['btn']}`} onClick={() => setIsPassiveSkillsOpen(true)}>{t('skills.passiveSkills')}</button>
                        </div>

                    </div>
                </section>


                {/* Passive skill popup */}
                <Popup
                    open={isPassiveSkillsOpen}
                    title={t('skills.passiveSkills')}
                    className={styles['passive__skills-popup']}
                    innerClassName={styles['main__popup-inner']}
                    contentClassName={styles['main__popup-content']}
                    handleClose={() => setIsPassiveSkillsOpen(false)}
                >
                    <div className={styles['passive__skills-list']}>
                        {
                            passiveSkills.map((passiveSkill, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`${styles['passive__skills-list-item']} ${passiveSkill !== "" ? "active" : ""}`}
                                    >
                                        <div
                                            className={styles['passive__skills-item']}
                                            style={{ "backgroundImage": ` url('${passiveSkill.skills_level.attribute?.picture_passive}')` }}>
                                            <div className={styles['top']}>
                                                <span className={styles['skill']}>{`${passiveSkill?.skills_level?.skills_levels_skill?.title ?? ''} ${passiveSkill?.skills_level?.skills_levels_level?.title ?? ''}`}</span>
                                                <span className={styles['raised']}>{passiveSkill != 0 ? passiveSkill.balance + "/" : ""}{passiveSkill != 0 ? passiveSkill.skills_level?.goal : ""}</span>
                                            </div>
                                            <button
                                                style={{
                                                    "background": `${passiveSkill == 0 ? "" : (passiveSkill.skills_level?.attribute?.slug == "protection" || passiveSkill.skills_level?.attribute?.slug == "power")
                                                        ? "#91C0C0" : (passiveSkill.skills_level?.attribute?.slug == "magic" || passiveSkill.skills_level?.attribute?.slug == "speed") && "#9ba0b5"}`
                                                }}
                                                onClick={() => activateMySkill(passiveSkill.id)}
                                            >
                                                {t('skills.activate')}
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Popup>


                {/* Add skill popup */}
                <Popup
                    open={isAddSkillOpen}
                    title={t('skills.addSkill')}
                    className={styles['add__skill-popup']}
                    innerClassName={styles['main__popup-inner']}
                    handleClose={handleAddSkillClose}
                >
                    <div className={styles['field__wrapper']}>
                        <div className={styles['new__custom-select-wrapper']}>
                            <div
                                className={`${styles['new__custom-select']} ${styles['filter-select-scroll']} ${isPotentialSkillsOpen ? styles['open'] : ''}`}
                                onClick={() => setIsPotentialSkillsOpen(!isPotentialSkillsOpen)}
                            >
                                <div className={styles['arrow']}></div>
                                <div className={styles['new__custom-select__trigger']}>
                                    <span className={styles['skill_label']}>{selectedPotentialSkill?.skills_level?.skills_levels_skill?.title ?? t('skills.skill')}</span>
                                    <input className={styles['skill_input_search']} type="text" placeholder={t('skills.typeForSkills')} />
                                </div>
                                <div className={`${styles['new__custom-options']} ${styles['skills-dropdown']}`}>
                                    {
                                        potentialSkills?.map((potentialSkill) => {
                                            return (
                                                <div
                                                    className={styles['new__custom-option']}
                                                    key={potentialSkill.id}
                                                    onClick={(e) => onPotentialSkillSelect(e, potentialSkill)}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="skill"
                                                        id={potentialSkill.id}
                                                        value={potentialSkill.id}
                                                        checked={selectedPotentialSkill.id === potentialSkill.id}
                                                        onChange={() => handlePotentialSkillChange(potentialSkill)}
                                                    />
                                                    <label htmlFor={potentialSkill.id}>{potentialSkill.skills_level?.skills_levels_skill?.title}</label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className={styles['custom-scrollbar']}></div>
                            </div>
                        </div>

                        <div className={styles['level__wrapper']}>
                            <span className={styles['title']}>{t('skills.level')}</span>
                            <div className={styles['level-list']}>
                                {
                                    levels?.map((level) => {
                                        return (
                                            <div className={`${styles['item']} ${selectedPotentialSkill?.skills_level?.level_id === level.id ? styles.active : ""}`} key={level.id} onClick={() => setIsActiveLevelHint(isActiveLevelHint === level.id ? null : level.id)}>
                                                <div className={styles['popup_item_trigger']}>
                                                    <img src={`img/level-icon-${level.id}.svg`} alt="" />
                                                    <p className={styles['color']}>{level.color}</p>
                                                </div>
                                                <div className={`${styles['item-popup']} ${isActiveLevelHint === level.id ? styles.act : ""}`}>
                                                    <p className={styles['title']}>{level.title}</p>
                                                    <p className={styles['text']}>{selectedPotentialSkill?.skills_level?.level_id === level.id ? selectedPotentialSkill?.skills_level?.description : "No such level is presented for the skill"}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        <div className={styles['level__wrapper']}>
                            <p className={styles['icon']}>
                                <img src="/img/condition-icon.svg" alt="" />
                                <span>{t('skills.upgradeCondition')}</span>
                                <span className={styles['upgrade_condition_balance']}>{`${selectedPotentialSkill?.balance ?? 0}/${selectedPotentialSkill?.skills_level?.goal ?? 0} ${t('skills.coins')}`}</span>
                            </p>
                        </div>

                        <div className={styles['bottom']}>
                            <a className={`${styles['add_skill-btn']} ${styles['btn']}`} onClick={() => addPotentialSkill(selectedPotentialSkill?.id)}>{t('skills.add')}</a>
                        </div>
                    </div>
                </Popup >

            </div >

            <Language />
        </>
    )
}

export default Skills