import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import styles from './skillTaskLayout.module.scss';
import { useTranslation } from 'react-i18next';
import { router } from '../../../utils/routes';


const SkillTaskLayout = ({ active }) => {

    const { t } = useTranslation()

    return (
        <>
            <div className={styles['menu-wrapper']}>
                <ul className={styles['menu']}>
                    <li className={`${active === 'skills' ? styles.active : ''}`}>
                        <Link to={router.skills}>{t('skillTaskLayout.skills')}</Link>
                    </li>
                    <li className={`${active === 'tasks' ? styles.active : ''}`}>
                        <Link to={router.tasks}>{t('skillTaskLayout.tasks')}</Link>
                    </li>
                </ul>
            </div>
        </>
    )
}

SkillTaskLayout.propTypes = {
    active: PropTypes.string
}

export default SkillTaskLayout