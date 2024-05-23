import PropTypes from 'prop-types';
import styles from '../attributeLevelPopup.module.scss'
import { useState } from 'react';
import { useClickOutside } from '../../../utils/hooks/global';

const AttributePopup = ({ popupProps, popupPropsClassName, className, attribute, attributeDescription, imageSrc, ...props }) => {
    const [open, setOpen] = useState(false)
    const menu = useClickOutside(() => setOpen(false))

    return (
        <>
            <div
                className={`${styles['profile__left-item']} ${styles['no-attr-item']} ${styles['donthave']} ${open ? styles['active'] : ''} ${className}`}
                onClick={() => { setOpen((prev) => !prev) }}
                ref={menu}
                {...props}
            >
                <div className={styles['icon']}>
                    <img src={imageSrc} alt="" />
                </div>
                <p>{attribute}</p>
            </div>


            <div
                className={`${popupPropsClassName} ${styles['alert-popup']} ${styles['donthave-popup']} ${open ? styles['active'] : ''}`}
                {...popupProps}
            >
                <h5>{`${attribute} Attribute`}</h5>
                <p>{attributeDescription}</p>
            </div>
        </>
    )
}

AttributePopup.propTypes = {
    className: PropTypes.string,
    popupPropsClassName: PropTypes.string,
    popupProps: PropTypes.any,
    attribute: PropTypes.string,
    attributeDescription: PropTypes.string,
    imageSrc: PropTypes.string,
}


export default AttributePopup