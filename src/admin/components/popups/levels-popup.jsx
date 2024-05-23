import {useEffect, useState} from "react";
import {getLevels} from "../../utils/fetches/levels/getLevels.js";
import {pushLevels} from "../../utils/fetches/levels/pushLevels.js";

// eslint-disable-next-line react/prop-types
const LevelsPopup = ({handleSave, handleClose}) => {
    const [levels, setLevels] = useState([]);
    
    const handleClick = (id) => {
        levels.forEach((level) => {
            if(level.id === id) {
                level.is_active = !level.is_active;
            }
        });
        
        setLevels([...levels]);
    }
    
    const handleSaveLevels = (e) => {
        e.preventDefault();
        
        pushLevels(levels).then(() => {
            handleSave();
        });
    }
    
    useEffect(() => {
        getLevels('asc', '').then((data) => {
            setLevels(data.data.levels);
        });
    }, []);
    
    return (
        <div className="ninjable__popup active level__popup">
            <div className="ninjable__popup-inner">
                <div className="ninjable__popup-header">
                    <span onClick={handleClose} className="ninjable__popup-close level-close">
                        <img src="/img/subscription__popup-close.svg" alt=""/>
                    </span>
                    <h3>MODIFY LEVEL</h3>
                </div>
                
                <div className="level__popup-content">
                    <h4>Levels</h4>
                    <div className="level__popup-form" id="formPopupLevels">
                        {levels.map((level) => (
                            <Level handler={() => handleClick(level.id)} key={level.id} level={level} />
                        ))}
                    </div>
                    
                    {/*<h4>EntreComp Framework</h4>
                    <div className="level__popup-form" id="formPopupLevels">
                        <button>Foundation (Discover)</button>
                        <button>Foundation (Explore)</button>
                        <button>Intermediate (Experiment)</button>
                        <button>Intermediate (Dare)</button>
                        <button>Advanced (Improve)</button>
                        <button>Advanced (Reinforce)</button>
                        <button>Expert (Expand)</button>
                        <button>Expert (Transform)</button>
                    </div>*/}
                    
                    <div className="level__popup-bottom">
                        <a onClick={handleSaveLevels} className="btn" href="#" id="btnLevelSave">Save</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

// eslint-disable-next-line react/prop-types
const Level = ({level, handler}) => {
    return (
        // eslint-disable-next-line react/prop-types
        <button onClick={handler} className={`${level.is_active && 'active'}`}>
            {/* eslint-disable-next-line react/prop-types */}
            {level.title}
        </button>
    );
};

export default LevelsPopup;