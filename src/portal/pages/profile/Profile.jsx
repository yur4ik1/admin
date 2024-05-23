import styles from './profile.module.scss'
import AttributePopup from '../../components/profile/attribute-popup/AttributePopup'
import LevelPopup from '../../components/profile/level-popup/LevelPopup'
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_DEPARTMENTS, GET_MYSKILLS, GET_SENIORITY, GET_SKILLS } from '../../queries/profile';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useClickOutside } from '../../utils/hooks/global';
import { hideOverlay, showOverlay } from '../../store/actions/global';
import { getColor } from '../../utils/methods/color';
import SkillMapPopup from '../../components/profile/skill-map-popup/SkillMapPopup';
import Language from '../../components/shared/language/Language';
import { useTranslation } from 'react-i18next';
import InfoSkillbar from '../../components/profile/info-skillbar/InfoSkillbar';
import Popup from '../../components/shared/popup/Popup';


const Profile = () => {

    const dispatch = useDispatch()
    const { t } = useTranslation()

    const [seniorityData, setSeniorityData] = useState([])
    const [userSeniority, setUserSeniority] = useState({})
    const [userNextSeniority, setUserNextSeniority] = useState({})
    const [isLevelsOpen, setIsLevelsOpen] = useState(false)
    const [isSkillMapOpen, setIsSkillMapOpen] = useState(false)
    const [isInfoOpen, setIsInfoOpen] = useState(false)
    const [departmentsData, setDepartmentsData] = useState([])
    const [skills, setSkills] = useState([])
    const [sideSkills, setSideSkills] = useState([])
    const [isAddSideSkillOpen, setIsAddSideSkillOpen] = useState(false)
    const [isSideSkillClansOpen, setIsSideSkillClansOpen] = useState(false)
    const [isSideSkillSkillsOpen, setIsSideSkillSkillsOpen] = useState(false)
    const [getSkillsData, setGetSkillsData] = useState([])


    const { userData } = useSelector((state) => state.auth)
    const { data, loading: seniorityLoading } = useQuery(GET_SENIORITY)
    const { seniority } = data || {}
    const [getDepartmentsRequest, { loading: departmentsLoading }] = useLazyQuery(GET_DEPARTMENTS)
    const [getMySkillsRequest, { loading: mySkillsLoading }] = useLazyQuery(GET_MYSKILLS)
    const [getGetSkillsRequest, { loading: getSkillsLoading }] = useLazyQuery(GET_SKILLS)

    const levelRef = useClickOutside(() => {
        setIsLevelsOpen(false)
    })

    const capitalizeFirstChar = (str) => {
        if (str === '') {
            return '';
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const handleInfoPopup = () => {
        setIsInfoOpen(true)
        dispatch(showOverlay())
        getMySkillsRequest({
            variables: {
                uid: userData?.id,
                isSide: false
            }
        }).then((res) => {
            setSkills(res.data?.users_skills_levels)
            dispatch(hideOverlay())
        }).catch(() => {
            dispatch(hideOverlay())
        })
        getMySkillsRequest({
            variables: {
                uid: userData?.id,
                isSide: true
            }
        }).then((res) => {
            setSideSkills(res.data?.users_skills_levels)
            dispatch(hideOverlay())
        }).catch(() => {
            dispatch(hideOverlay())
        })
    }

    const handleOpenSkillMapPopup = () => {
        setIsSkillMapOpen(true)
    }

    const handleAddSideSkillOpen = () => {
        setIsAddSideSkillOpen(true)
        dispatch(showOverlay())
        getGetSkillsRequest({
            variables: {
                search: `%`,
                not_skills: []
            }
        }).then((res) => {
            setGetSkillsData(res.data?.skills)
            dispatch(hideOverlay())
        }).catch(() => {
            dispatch(hideOverlay())
        })
    }

    const handleAddSideSkillClose = () => {
        setIsAddSideSkillOpen(false)
    }

    useEffect(() => {
        seniority?.sort((a, b) => a.id > b.id)
        const tempSeniorityData = seniority?.map((level) => ({
            ...level,
            color: capitalizeFirstChar(level.color)
        }))
        const tempUserSeniority = tempSeniorityData?.find(level => level.id === userData?.users_level?.id)
        const tempUserNextSeniority = tempSeniorityData?.find((level) => {
            if (userData?.users_level?.id) {
                return level.id === userData?.users_level?.id + 1
            }
            return false
        })

        setSeniorityData(tempSeniorityData)
        setUserSeniority(tempUserSeniority)
        setUserNextSeniority(tempUserNextSeniority)
    }, [seniority])

    useEffect(() => {
        if (seniorityLoading) {
            dispatch(showOverlay())
        } else {
            dispatch(hideOverlay())
        }
    }, [seniorityLoading])

    useEffect(() => {
        getDepartmentsRequest({
            variables: {
                search: `%`,
            }
        }).then((res) => {
            setDepartmentsData(res.data?.departments)
            dispatch(hideOverlay())
        }).catch(() => {
            dispatch(hideOverlay())
        })
    }, [])



    return (
        <>
            {!seniorityLoading && <>
                <section className={styles['profile']}>
                    <div className={`container ${styles['container']}`}>

                        {/* Seniority levels - Left */}
                        <div className={`${styles['profile__left']}`}>
                            <div className={`${styles['carousel']}`}></div>

                            {
                                seniorityData?.map((level, index) => {
                                    return (
                                        <LevelPopup
                                            key={level.id}
                                            level={level}
                                            imgPath={`/img/${level.slug}-face.svg`}
                                            isActive={level.id > userData?.users_level?.id ? false : true}
                                            isPopup={level.id > userData?.users_level?.id ? true : false}
                                            hasActiveLine={level.id === userData?.users_level?.id}
                                            popupProps={{
                                                style: {
                                                    top: `${(index) * 11}vh`,
                                                    width: '14vw',
                                                    left: '0.071vw'
                                                }
                                            }}
                                            description={t('profile.unlocks')}
                                        />
                                    )
                                })
                            }
                        </div>

                        {/* Profile - Center */}
                        <div className={styles['profile__centre']}>
                            <div className={styles['profile__centre-top']}>
                                <div className={styles['title']}>
                                    <h2 className={styles['ninja__profile-fullname']}>{`${userData?.firstname} ${userData?.lastname}`}</h2>
                                    <p ref={levelRef}
                                        className={styles['ninja__color-btn']}
                                        onClick={() => setIsLevelsOpen(!isLevelsOpen)}
                                    >
                                        <span style={{ color: `${getColor(userSeniority)}` }}>{userSeniority?.color} </span>
                                        &nbsp;Ninja
                                    </p>

                                    <div className={`${styles['ninja__color-popup']} ${isLevelsOpen ? styles.active : ''}`}>
                                        {
                                            seniorityData?.map((level) => {
                                                return (
                                                    <a href='#' key={level.id} className={level.id === userData?.users_level?.id ? styles.active : ''}>{`${level.title} (${level.color})`}</a>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <a
                                    className={`btn ${styles['info-btn']}`}
                                    onClick={handleInfoPopup}
                                >
                                    {t('profile.info')}
                                </a>
                            </div>
                            <div className={styles['profile__centre-content']}>
                                <div className={styles['character']}>
                                    <img src={`img/center_${userSeniority?.slug}.svg`} alt="" />
                                </div>
                                <div className={styles['leaves']}></div>
                            </div>
                            <div className={styles['profile__centre-bottom']}>
                                {/* <div className={styles['masks']}>
                                <p data-i18n="my-profile.masks">Masks</p>
                                <div className={styles['masks__list']}>
                                    {
                                        seniorityData?.map((level) => {
                                            return (
                                                <div
                                                    key={level.id}
                                                    className={`${styles['masks__list-item']} ${level.id > userData?.users_level?.id ? styles['mask-info'] : (level.id === userData?.users_level?.id ? styles['deactivate'] : '')}`}>
                                                    <img src={`/img/${userData?.users_level.slug}-mask-${level.id}.svg`} alt="mask-1" />
                                                </div>
                                            )
                                        })
                                    }
                                    <div className={`${styles['masks__list-item']} ${styles['deactivate']}`}>
                                        <img style={{ display: 'none' }} src={`/img/junior-mask-1.svg`} alt="mask-1" />
                                    </div>
                                    <div className={`${styles['masks__list-item']} ${styles['mask-info']}`}>
                                        <img style={{ display: 'none' }} src="" alt="mask-2" />
                                    </div>
                                    <div className={styles['masks__list-item']}>
                                        <img style={{ display: 'none' }} src="" alt="mask-3" />
                                    </div>
                                </div>
                            </div> */}

                                {/* <div className={`${styles['alert-popup']} ${styles['mask__info-popup']}`}>
                                <h5>Mask of Jedi</h5>
                                <p>The mask can be obtained for pumping 1 skill. Allows you to defend yourself during combat.</p>
                            </div> */}

                                <div className={styles['map']}>
                                    <p>{t('profile.skillMap')}</p>
                                    <div
                                        className={styles['map-btn']}
                                        onClick={handleOpenSkillMapPopup}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Attributes - Right */}
                        <div className={styles['profile__right']}>
                            <AttributePopup
                                className={styles['donthave']}
                                popupProps={{
                                    style: { top: '0.1vw', left: '-13.929vw' },
                                }}
                                popupPropsClassName={styles['donthave-popup']}
                                attribute={t('profile.magic')}
                                imageSrc={`/img/magic-icon.webp`}
                                attributeDescription={t('profile.dontHaveAccessToAttribute')}
                            />

                            <AttributePopup
                                className={styles['donthave']}
                                popupProps={{
                                    style: { top: '10.381vw', left: '-13.929vw' },
                                }}
                                popupPropsClassName={styles['donthave-popup']}
                                attribute={t('profile.protection')}
                                imageSrc={`/img/protection-icon.webp`}
                                attributeDescription={t('profile.dontHaveAccessToAttribute')}
                            />

                            <AttributePopup
                                className={styles['donthave']}
                                popupProps={{
                                    style: { top: '20.881vw', left: '-13.929vw' },
                                }}
                                popupPropsClassName={styles['donthave-popup']}
                                attribute={t('profile.power')}
                                imageSrc={`/img/power-icon.webp`}
                                attributeDescription={t('profile.dontHaveAccessToAttribute')}
                            />

                            <AttributePopup
                                className={styles['donthave']}
                                popupProps={{
                                    style: { top: '31vw', left: '-13.929vw' },
                                }}
                                popupPropsClassName={styles['donthave-popup']}
                                attribute={t('profile.speed')}
                                imageSrc={`/img/speed-icon.webp`}
                                attributeDescription={t('profile.dontHaveAccessToAttribute')}
                            />
                        </div>

                    </div>

                    {/* Profile info popup */}
                    <div className={`profile__info-popup ${isInfoOpen ? 'active' : ''}`}>
                        <div className="popup__inner">
                            <div className="profile__info-top">
                                <div className="left">
                                    <img src={`/img/${userSeniority?.slug}-avatar.svg`} alt="" />
                                    <div className="title">
                                        <h4 className="profile__info-popup-name">{`${userData?.firstname} ${userData?.lastname}`}</h4>
                                        <p className="profile__info-popup-seniority">
                                            <span style={{ color: `${getColor(userSeniority)}` }}>{userSeniority?.color}</span>
                                            {` Ninja (${userSeniority?.title})`}
                                        </p>
                                    </div>
                                </div>
                                <div className="right">
                                    {/* <div className="info">
                                        <p>{departmentsData?.map(department => department.title).join(', ')}</p>
                                    </div> */}
                                    <span className="close-popup" onClick={() => setIsInfoOpen(false)}></span>
                                </div>
                            </div>

                            {(!departmentsLoading && !mySkillsLoading) && <div className="profile__info-content">
                                <div className="skils__content">
                                    <p className="next-level">
                                        <span>{t('profile.nextLevel')} </span>
                                        <span style={{ color: `${getColor(userNextSeniority)}` }}>{userNextSeniority?.color}</span>
                                        {` Ninja (${userNextSeniority?.title}) - ${skills?.filter((skill) => skill.skills_level?.skills_levels_level.id > userSeniority?.id).length}/${skills?.length} ${t('profile.skills')}`}
                                    </p>
                                    <div className="skils__list list">

                                        <div className="skils__list-col">
                                            {
                                                skills?.map((skill, index) => {
                                                    if (index % 2 === 0) {
                                                        return (
                                                            <InfoSkillbar key={index} skill={skill} />
                                                        )
                                                    }
                                                    return null
                                                })
                                            }
                                        </div>

                                        <div className="skils__list-col">
                                            {
                                                skills?.map((skill, index) => {
                                                    if (index % 2 !== 0) {
                                                        return (
                                                            <InfoSkillbar key={index} skill={skill} />
                                                        )
                                                    }
                                                    return null
                                                })
                                            }
                                        </div>

                                    </div>
                                    <div className="level-row">
                                        <p className="next-level">{`${t('profile.sideSkills')} ${sideSkills?.length} ${t('profile.skills')}`}</p>
                                        <a className="add-skill-btn" href="#" onClick={handleAddSideSkillOpen}>{t('profile.addSkill')}</a>
                                    </div>

                                    <div className="skils__list side">
                                        <div className="skils__list-col">
                                            {
                                                sideSkills?.map((skill, index) => {
                                                    if (index % 2 === 0) {
                                                        return (
                                                            <InfoSkillbar key={index} skill={skill} />
                                                        )
                                                    }
                                                    return null
                                                })
                                            }
                                        </div>

                                        <div className="skils__list-col">
                                            {
                                                sideSkills?.map((skill, index) => {
                                                    if (index % 2 !== 0) {
                                                        return (
                                                            <InfoSkillbar key={index} skill={skill} />
                                                        )
                                                    }
                                                    return null
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>}
                        </div>
                    </div>

                    {/* Add side skills popup */}
                    <Popup
                        open={isAddSideSkillOpen}
                        title={t('profile.addSkill')}
                        className={`${styles['add__skill-popup']} ${styles['add__skill-profile']}`}
                        innerClassName={styles['main__popup-inner']}
                        contentClassName={styles['main__popup-content']}
                        handleClose={handleAddSideSkillClose}
                    >
                        <div className={styles['field__wrapper']}>
                            {!getSkillsLoading && <>
                                <div className={styles['new__custom-select-wrapper']}>
                                    <div
                                        className={`${styles['new__custom-select']} ${styles['filter-select-scroll']} ${isSideSkillClansOpen ? styles['open'] : ''}`}
                                        onClick={() => setIsSideSkillClansOpen(!isSideSkillClansOpen)}
                                    >
                                        <div className={styles['arrow']}></div>
                                        <div className={`${styles['new__custom-select__trigger']} ${styles['clan_input_search']}`}>
                                            <span className="clan_label">{t('profile.clan')}</span>
                                            <input type="text" placeholder={t('profile.typeForClan')} />
                                        </div>
                                        <div className={`${styles['new__custom-options']} ${styles['skills-dropdown']}`}>
                                            {
                                                departmentsData?.map((department) => {
                                                    return (
                                                        <div
                                                            className={styles['new__custom-option']}
                                                            key={department.id}
                                                        // onClick={(e) => onPotentialSkillSelect(e, department)}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="department"
                                                                id={department.id}
                                                                value={department.id}
                                                            // checked={selectedPotentialSkill.id === department.id}
                                                            // onChange={() => handlePotentialSkillChange(department)}
                                                            />
                                                            <label htmlFor={department.id}>{department.title}</label>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="custom-scrollbar" style={{ display: 'none' }}>
                                            <div className="custom-scrollbar-thumb"></div>
                                            <div className="custom-scrollbar-thumb"></div></div>
                                    </div>
                                </div>

                                <div className="new__custom-select-wrapper">
                                    <div className="new__custom-select filter-select-scroll">
                                        <div className="arrow"></div>

                                        <div className="new__custom-select__trigger rank_input_search">
                                            <span className="rank_label">{t('profile.rank')}</span>
                                            <input className="" type="text" placeholder={t('profile.typeForRank')} />
                                        </div>
                                        <div className="new__custom-options ranks"></div>
                                        <div className="custom-scrollbar" style={{ display: 'none' }}>
                                            <div className="custom-scrollbar-thumb"></div>
                                            <div className="custom-scrollbar-thumb"></div></div>
                                    </div>
                                </div>

                                <div className={styles['new__custom-select-wrapper']}>
                                    <div
                                        className={`${styles['new__custom-select']} ${styles['filter-select-scroll']} ${isSideSkillSkillsOpen ? styles['open'] : ''}`}
                                        onClick={() => setIsSideSkillSkillsOpen(!isSideSkillSkillsOpen)}
                                    >
                                        <div className={styles['arrow']}></div>
                                        <div className={`${styles['new__custom-select__trigger']} ${styles['skill_input_div_search']}`}>
                                            <span className="skill_label">{t('profile.skill')}</span>
                                            <input type="text" className="skill_input_search" placeholder={t('profile.typeForSkills')} />
                                        </div>

                                        <div className={`${styles['new__custom-options']} ${styles['skills-profile']}`}>
                                            {
                                                getSkillsData?.map((skill) => {
                                                    return (
                                                        <div
                                                            className={styles['new__custom-option']}
                                                            key={skill.id}
                                                        // onClick={(e) => onPotentialSkillSelect(e, skill)}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="department"
                                                                id={skill.id}
                                                                value={skill.id}
                                                            // checked={selectedPotentialSkill.id === skill.id}
                                                            // onChange={() => handlePotentialSkillChange(skill)}
                                                            />
                                                            <label htmlFor={skill.id}>{skill.title}</label>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="custom-scrollbar" style={{ display: 'none' }}><div className="custom-scrollbar-thumb"></div></div>
                                    </div>
                                </div>
                                <div className={styles['level__wrapper']}>
                                    <span className={styles['title']}>{t('profile.level')}</span>
                                    <div className={styles['level-list']}></div>
                                </div>

                                <div className={styles['bottom']}>
                                    <a className={`${styles['add_skill-btn-profile']} btn`}>{t('profile.add')}</a>
                                </div>
                            </>}
                        </div>
                    </Popup >


                    <SkillMapPopup
                        open={isSkillMapOpen}
                        handleClose={() => { setIsSkillMapOpen(false) }}
                        departmentsData={departmentsData}
                        userSeniority={userSeniority}
                    />

                </section >

                <Language />
            </>
            }
        </>
    )
}

export default Profile