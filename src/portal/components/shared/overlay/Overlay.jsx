import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styles from './overlay.module.scss'

const Overlay = () => {
    const { overlayOpen } = useSelector((state) => state.global)

    return (
        <div className={`${styles.overlay} ${overlayOpen ? styles.active : ''}`}>
            <div className={styles.overlay__inner}>
                <div className={styles.overlay__content}><span className={styles.spinner}></span></div>
            </div>
        </div>
    )
}

Overlay.propTypes = {
    open: PropTypes.bool
}

export default Overlay