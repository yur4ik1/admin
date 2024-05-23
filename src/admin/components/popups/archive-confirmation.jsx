// eslint-disable-next-line react/prop-types
const ArchiveConfirmation = ({handlerConfirm, handlerReject}) => {
    return (
        <div className="skills__alert-popup department__wrapper-archive active"
             style={{left: "100%", top: "0%"}}>
            <p>Are you sure?</p>
            <div className="btns">
                <button onClick={handlerConfirm} className="true">Yes</button>
                <button onClick={handlerReject} className="false">No</button>
            </div>
        </div>
    );
};

export default ArchiveConfirmation;