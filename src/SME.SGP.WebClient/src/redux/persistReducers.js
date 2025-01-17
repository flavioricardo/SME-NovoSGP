import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export default reducers => {
  const persistedReducer = persistReducer(
    {
      key: 'sme-sgp',
      storage,
      whitelist: ['usuario', 'perfil', 'filtro'],
    },
    reducers
  );

  return persistedReducer;
};
