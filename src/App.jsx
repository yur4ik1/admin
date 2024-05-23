import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Login from './portal/pages/login/Login';
import Tasks from './portal/pages/tasks/Tasks';
import { router } from './utils/routes';
import { client } from './portal/graphql/config';
import Skills from './portal/pages/skills/Skills';
import Profile from './portal/pages/profile/Profile';
import Settings from './portal/pages/settings/Settings';
import Overlay from './portal/components/shared/overlay/Overlay';
import Authentication from './portal/components/authentication/Authentication';

import Users from './admin/pages/users';
import Transactions from './admin/pages/transactions';
import Subscription from './admin/pages/subscription';
import AdminSkills from './admin/pages/skills';
import Requests from './admin/pages/requests';
import Levels from './admin/pages/levels';
import Inventory from './admin/pages/inventory';
import Integrations from './admin/pages/integrations';
import Branding from './admin/pages/branding';
import Billing from './admin/pages/billing';
import Achievements from './admin/pages/achievements';
import Positions from './admin/pages/positions';
import AdminAuth from './utils/auth/AdminAuth';
import Home from './admin/pages/index';
import PortalCssWrapper from './utils/css-wrapper/PortalCssWrapper';

import './App.scss';
import 'tippy.js/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  const language = useSelector((state) => state.persistData.language)
  const { i18n } = useTranslation()

  useEffect(() => {
    if (i18n.language !== language) {
      setTimeout(() => {
        i18n.changeLanguage(language)
      }, 0)
    }
  }, [language, i18n])


  return (
    <React.Fragment key={i18n.language}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Routes>
            <Route element={<PortalCssWrapper />}>

              {/* Public routes */}
              <Route path="/" element={<Login />} />
              <Route path={router.login} element={<Login />} />

              {/* Private routes */}
              <Route element={<Authentication />}>
                <Route path={router.skills} element={<Skills />} />
                <Route path={router.tasks} element={<Tasks />} />
                <Route path={router.profile} element={<Profile />} />
                <Route path={router.settings} element={<Settings />} />
              </Route>

            </Route>

            {/* Admin routes */} 
            <Route path={router.adminBase} element={<AdminAuth />}>
              <Route path={router.adminBase} element={<Home />} />
              <Route path={router.adminUsers} element={<Users />} />
              <Route path={router.adminTransactions} element={<Transactions />} />
              <Route path={router.adminSubscription} element={<Subscription />} />
              <Route path={router.adminSkills} element={<AdminSkills />} />
              <Route path={router.adminRequests} element={<Requests />} />
              <Route path={router.adminPositions} element={<Positions />} />
              <Route path={router.adminLevels} element={<Levels />} />
              <Route path={router.adminInventory} element={<Inventory />} />
              <Route path={router.adminIntegrations} element={<Integrations />} />
              <Route path={router.adminBranding} element={<Branding />} />
              <Route path={router.adminBilling} element={<Billing />} />
              <Route path={router.adminAchievements} element={<Achievements />} />
            </Route>

            {/* Not found */}
            <Route path={router[404]} element={<div>Not found</div>} />
            <Route path="*" element={<Navigate to={router[404]} />} />
          </Routes>
        </BrowserRouter>
      </ApolloProvider >

      <Overlay />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </React.Fragment>
  )
}

export default App
