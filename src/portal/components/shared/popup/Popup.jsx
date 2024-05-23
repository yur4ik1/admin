import styles from './popup.module.scss'
import PropTypes from 'prop-types';


const Popup = ({ children, open, title, className, handleClose, contentClassName, innerClassName }) => {

    return (
        <>
            <div className={`${styles['main__popup']}  ${open ? styles['active'] : ""} ${className}`}>
                <div className={`${styles['main__popup-inner']} ${innerClassName}`}>
                    <div className={styles['main__popup-top']}>
                        <h3>{title}</h3>
                        <span
                            className={`${styles['main__popup-close']}`}
                            onClick={handleClose}
                        ></span>
                    </div>

                    <div className={`${styles['main__popup-content']} ${contentClassName}`}>
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}

Popup.propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    className: PropTypes.string,
    innerClassName: PropTypes.string,
    contentClassName: PropTypes.string,
    children: PropTypes.node,
    handleClose: PropTypes.func,
}


export default Popup