import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './portal/store/store'
import { I18nextProvider } from 'react-i18next';
import './portal/i18n/i18n.js'
import './index.css'
import AuthContextProvider from './admin/utils/auth.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider>
      <AuthContextProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </AuthContextProvider>
    </I18nextProvider>
  </React.StrictMode>,
)
