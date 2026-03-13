import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';

import localStorageAvailable from '../utils/localStorageAvailable';
import { isValidToken, setSession } from './utils';
import Usuario from '../Models/Usuario';
import useMountedRef from '../customHooks/useMountedRef';

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  hasSesion: false,
  isChangingSesion: false,
  sesion: null,
  showSelectEmpresa: false
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      hasSesion: action.payload.hasSesion,
      sesion: action.payload.sesion,
      showSelectEmpresa: action.payload.showSelectEmpresa
    };
  }
  if (action.type === 'SET_SESSION') {
    return {
      ...state,
      hasSesion: true,
      isChangingSesion: false,
      sesion: action.payload.sesion
    };
  }
  if (action.type === 'SET_CHANGING_SESION') {
    return {
      ...state,
      isChangingSesion: action.payload.isChangingSesion
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isAuthenticated: true,
      sesion: action.payload.sesion
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      isAuthenticated: true,
      sesion: action.payload.sesion
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      hasSesion: false,
      isChangingSesion: false,
      sesion: null,
      showSelectEmpresa: false
    };
  }
  if (action.type === 'SHOW_SELECT_EMPRESA') {
    return {
      ...state,
      showSelectEmpresa: true
    };
  }

  return state;
};

export const AuthContext = createContext(null);

AuthProvider.propTypes = {
  children: PropTypes.node
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const storageAvailable = localStorageAvailable();
  const mountedRef = useMountedRef();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        const { data } = await Usuario.currentUsuario();
        const { isAuthenticated, hasSesion, currentSesion } = data.currentUsuario.data;

        if (!mountedRef.current) return;

        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated,
            hasSesion,
            sesion: currentSesion
          }
        });
      } else {
        if (!mountedRef.current) return;
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            hasSesion: false,
            sesion: null
          }
        });
      }
    } catch (error) {
      if (!mountedRef.current) return;
      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          hasSesion: false,
          sesion: null
        }
      });
    }
  }, [mountedRef, storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const setChangingSesion = (isChangingSesion = true) => {
    dispatch({
      type: 'SET_CHANGING_SESION',
      payload: {
        isChangingSesion
      }
    });
  };

  const login = useCallback(async (cuenta, contrasena) => {
    const { data } = await Usuario.login(cuenta, contrasena);
    const { auth, sesion } = data.login.authorization;
    setSession(auth);

    if (!mountedRef.current) return;

    dispatch({
      type: 'LOGIN',
      payload: {
        sesion
      }
    });
  }, [mountedRef]);

  const selectSede = useCallback(async (sedeId) => {
    const { data } = await Usuario.selectSede(sedeId);
    const { currentSesion } = data.selectSede.data;

    if (!mountedRef.current) return;

    dispatch({
      type: 'SET_SESSION',
      payload: {
        sesion: currentSesion
      }
    });
  }, [mountedRef]);

  const logout = useCallback(async () => {
    try {
      await Usuario.logout();
      setSession(null);

      if (!mountedRef.current) return;

      dispatch({
        type: 'LOGOUT'
      });
    } catch (error) {
      console.error(error);
    }
  }, [mountedRef]);

  const setShowSelectEmpresa = useCallback(() => {
    dispatch({ type: 'SHOW_SELECT_EMPRESA' });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      hasSesion: state.hasSesion,
      sesion: state.sesion,
      isChangingSesion: state.isChangingSesion,
      showSelectEmpresa: state.showSelectEmpresa,
      method: 'jwt',
      login,
      logout,
      selectSede,
      setChangingSesion,
      setShowSelectEmpresa
    }),
    [
      state.isInitialized,
      state.isAuthenticated,
      state.hasSesion,
      state.sesion,
      state.isChangingSesion,
      state.showSelectEmpresa,
      login,
      logout,
      selectSede,
      setShowSelectEmpresa
    ]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
