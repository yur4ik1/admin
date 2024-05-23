import PropTypes from 'prop-types';
import styles from '../attributeLevelPopup.module.scss'
import { useState } from 'react';
import { useClickOutside } from '../../../utils/hooks/global';

const LevelPopup = ({ className, popupPropsClassName, hasActiveLine, popupProps, level, imgPath, isActive, description, isPopup = true, ...props }) => {

    const [open, setOpen] = useState(false)
    const menu = useClickOutside(() => setOpen(false))


    return (
        <>
            <div
                className={`${styles['profile__left-item']} ${!isActive ? styles['deactivate'] : ''} ${hasActiveLine ? styles['active'] : ''} ${className}`}
                onClick={() => { setOpen((prev) => !prev) }}
                ref={menu}
                {...props}
            >
                {
                    isActive && <>
                        <div className={styles['icon']}>
                            <img src={imgPath} alt="" />
                        </div>
                        <p style={{ 'textTransform': 'capitalize' }}>{level?.title}</p>
                    </>
                }
            </div>


            {isPopup && <div className={`${styles['alert-popup']} ${open ? styles.active : ''} ${popupPropsClassName}`}
                style={{ 'top': '5vw', 'left': '0', 'width': '20vw' }}
                {...popupProps}
            >
                <h5>{`${level?.color} Ninja`}</h5>
                <p>{description}</p>
            </div>}

        </>
    )
}

LevelPopup.propTypes = {
    className: PropTypes.string,
    popupPropsClassName: PropTypes.string,
    popupProps: PropTypes.any,
    level: PropTypes.object,
    attributeDescription: PropTypes.string,
    imgPath: PropTypes.string,
    isActive: PropTypes.bool,
    isPopup: PropTypes.bool,
    hasActiveLine: PropTypes.bool,
    description: PropTypes.string,
}


export default LevelPopup