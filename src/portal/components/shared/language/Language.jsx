import { useState } from 'react'
import styles from './language.module.scss'
import { useClickOutside } from '../../../utils/hooks/global'
import { languages } from '../../../utils/methods/language'
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '../../../store/actions/languages';



const Language = () => {
    const dispatch = useDispatch()
    const { i18n } = useTranslation()
    const [isLanguageOpen, setIsLanguageOpen] = useState(false)
    const language = useSelector((state) => state.persistData.language)


    const languageRef = useClickOutside(() => {
        setIsLanguageOpen(false)
    })

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value
        i18n.changeLanguage(newLanguage)
        dispatch(setLanguage({ language: newLanguage }))
    }


    return (
        <>
            <div className={styles['languages']}>
                <div
                    ref={languageRef}
                    className={`${styles['languages-dropbtn']} ${isLanguageOpen ? styles['active'] : ""}`}
                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                >
                    {languages.filter((lan) => lan.value === language)[0]?.value}
                </div>
                <div className={`${styles['languages-droplist']} ${isLanguageOpen ? styles['active'] : ""}`}>
                    <div className={styles['languages-droplist-content']} id="languagesContainer">
                        {
                            languages.map((lan) => {
                                return (
                                    <div key={lan.value} className={styles['languages-option']}>
                                        <input
                                            id={lan.value}
                                            type="radio"
                                            name='languageSelectionRadio'
                                            value={lan.value}
                                            onChange={handleLanguageChange}
                                            checked={language === lan.value}
                                        />
                                        <label htmlFor={lan.value}>{lan.label}</label>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Language