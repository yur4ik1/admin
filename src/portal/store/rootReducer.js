import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { userReducer } from './reducers/userReducer'
import { globalReducer } from './reducers/globalReducer'
import { persistDataReducer } from './reducers/persistDataReducer'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'persistData']
}

const rootReducer = combineReducers({
    auth: userReducer,
    global: globalReducer,
    persistData: persistDataReducer
})

export const persistedReducer = persistReducer(persistConfig, rootReducer)
