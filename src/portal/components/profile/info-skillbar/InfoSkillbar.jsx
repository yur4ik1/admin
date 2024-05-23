import PropTypes from 'prop-types';

const InfoSkillbar = ({ skill }) => {
    return (
        <>
            <div className="skils__list-item" key={skill.id}>
                <div className="progress-info">
                    <p className="name">{`${skill.skills_level?.skills_levels_skill?.title} (${skill.skills_level?.skills_levels_level?.title})`}</p>
                    <p className="raised">{`${skill.balance}/${skill.skills_level?.goal}`}</p>
                </div>
                <div className="progress-bar">
                    <span style={{ width: '50%' }}></span>
                </div>
            </div>
        </>
    )
}

InfoSkillbar.propTypes = {
    skill: PropTypes.object
}

export default InfoSkillbar

