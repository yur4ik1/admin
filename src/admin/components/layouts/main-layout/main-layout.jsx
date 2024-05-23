import {Helmet} from "react-helmet";

const MainLayout = ({children}) => {
    return (
        <div className="wrapper">
            { <Helmet>
                <link rel="stylesheet" href="/css/main.css" />
            </Helmet> }
            
            {children}
        </div>
    );
};

export default MainLayout;