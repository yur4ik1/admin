const Loading = () => {
    return (
        <div className="overlay active">
            <div className="overlay__inner">
                <div className="overlay__content"><span className="spinner"></span></div>
            </div>
        </div>
    );
};

export default Loading;