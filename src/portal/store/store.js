import { createStore } from "redux";
import { persistedReducer } from "./rootReducer";
import persistStore from "redux-persist/es/persistStore";


export let store = createStore(persistedReducer)
export let persistor = persistStore(store)

