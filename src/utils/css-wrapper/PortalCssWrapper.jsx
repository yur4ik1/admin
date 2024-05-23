import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const PortalCssWrapper = () => {

    useEffect(() => {
        const body = document.getElementsByTagName('body')[0]
        body.classList.add('PORTAL_CSS_WRAPPER')

        return () => body.classList.remove('PORTAL_CSS_WRAPPER')
    }, [])
    return (
        <div className='PORTAL_CSS_CONTAINER'>
            <Outlet />
        </div>
    )
}

export default PortalCssWrapper