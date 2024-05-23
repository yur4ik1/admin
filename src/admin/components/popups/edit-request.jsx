import {useState} from "react";
import {editRequest} from "../../utils/fetches/requests/editRequest.js";
import Loading from "../loading/Loading.jsx";

// eslint-disable-next-line react/prop-types
const EditRequest = ({id, handler, status, comment}) => {
    const [isSelectActive, setIsSelectActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const [statusForm, setStatusForm] = useState(status);
    const [commentForm, setCommentForm] = useState(comment);
    
    const handleStatusChanged = (status) => {
        setStatusForm(status);
        setIsSelectActive(false);
    }
    
    const handleEdit = () => {
        setIsLoading(true);
        
        editRequest(id, statusForm, commentForm).then(async () => {
            setIsLoading(false);
            await handler();
        });
    }
    
    return (
        <div className="ninjable__popup answer__popup answer-edit active">
            <div className="ninjable__popup-inner">
                <div className="ninjable__popup-header">
                    <span onClick={handler} className="ninjable__popup-close answer-edit-close">
                        <img src="/img/subscription__popup-close.svg" alt=""/>
                    </span>
                    <h3>EDIT</h3>
                </div>
                <div className="positions__popup-content" id="mainPopup">
                    <div className="positions__popup-form">
                        <label>
                            * Status
                            <div className={`custom-select ${isSelectActive && 'active'}`}>
                                <div onClick={() => setIsSelectActive(!isSelectActive)} className={`select-selected ${isSelectActive && 'select-arrow-active'} ${statusForm !== undefined && 'select-checked'}`} id="status">
                                    {statusForm === undefined && 'Please Select...'}
                                    {statusForm === 0 && 'Pending'}
                                    {statusForm === 1 && 'Approved'}
                                    {statusForm === 2 && 'Rejected'}
                                </div>
                                {isSelectActive && (
                                    <div className="select-items">
                                        <div onClick={() => handleStatusChanged(0)} className="select-option">Pending</div>
                                        <div onClick={() => handleStatusChanged(1)} className="select-option">Approved</div>
                                        <div onClick={() => handleStatusChanged(2)} className="select-option">Reject</div>
                                    </div>
                                )}
                            </div>
                            <span className="let-know">Please let us know the status</span>
                        </label>
                        <label>
                            * Comment
                            <textarea onChange={(e) => setCommentForm(e.target.value)} name="" id="comment" cols="30" rows="10" placeholder="Text">
                                {commentForm}
                            </textarea>
                        </label>
                    </div>
                    <div className="popup__users-footer">
                        <button onClick={handleEdit} className="btn request-edit" type="button">Edit</button>
                    </div>
                </div>
            </div>
            
            {isLoading && <Loading/>}
        </div>
    );
};

export default EditRequest;