const CloseSubscriptionPopup = ({handler}) => {
    return (
        <div className="branding__popup active">
            <p className="title">Cancel Subscription</p>
            <p className="desc">
                Please contact the support team to request your subscription cancelling.
            </p>
            <a onClick={handler} href="#" id="closeBtn">Close</a>
        </div>
    );
};

export default CloseSubscriptionPopup;