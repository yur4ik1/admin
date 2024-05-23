import React from 'react';

function InfoPopup(props) {

    const { isOpenInfo, title, description } = props;

    return (
        <div className={!isOpenInfo? "info-popup" : "info-popup active"}>
            <p className="title">{title}</p>
            <p className="desc">
                {description}
            </p>
        </div>
    );
}

export default InfoPopup;