import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';

// utils
import localStorageAvailable from '../utils/localStorageAvailable';
//
import { isValidToken, setSession } from './utils';
import Usuario from "../Models/Usuario";

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  hasSesion: false,
  isChangingSesion: false,
  sesion: null,
  showSelectEmpresa: false,

};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      hasSesion: action.payload.hasSesion,
      sesion: action.payload.sesion,
      showSelectEmpresa:  action.payload.showSelectEmpresa,
    };
  }
  if (action.type === 'SET_SESSION') {
    return {
      ...state,
      hasSesion: true,
      isChangingSesion: false,
      sesion: action.payload.sesion,
    };
  }
  if (action.type === 'SET_CHANGING_SESION') {
    return {
      ...state,
      isChangingSesion: action.payload.isChangingSesion,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isAuthenticated: true,
      sesion: action.payload.sesion,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      isAuthenticated: true,
      sesion: action.payload.sesion,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      hasSesion: false,
      isChangingSesion: false,
      sesion: null,
      showSelectEmpresa:false
    };
  }

  if (action.type === 'SHOW_SELECT_EMPRESA') {
    return {
      ...state,
      showSelectEmpresa:  true,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        // const response = await axios.get('/api/account/my-account');
        const {data}= await Usuario.currentUsuario()

        const {isAuthenticated, hasSesion, currentSesion} = data.currentUsuario.data;


        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated,
            hasSesion,
            sesion: currentSesion,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            hasSesion: false,
            sesion: null,
          },
        });
      }
    } catch (error) {
      // console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          hasSesion: false,
          sesion: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // const selectSede = useCallback(async (selectEmpresaId, tipoEmpresa) => {
    // const response = await apollo.mutate({
    //   mutation: SELECT_EMPRESA_MUTATION,
    //   variables: {
    //     selectEmpresaId,
    //     tipoEmpresa,
    //   },
    //   fetchPolicy: 'no-cache',
    // });
    //
    // const { selectEmpresa: sesion } = response.data;
    // dispatch({
    //   type: 'SET_SESSION',
    //   payload: {
    //     sesion,
    //   },
    // });
  // }, []);

  const setChangingSesion = (isChangingSesion = true) => {
    dispatch({
      type: 'SET_CHANGING_SESION',
      payload: {
        isChangingSesion,
      },
    });
  };

  // LOGIN
  const login = useCallback(async (cuenta, contrasena) => {

    const {data} = await Usuario.login(cuenta, contrasena)
    const {auth, sesion} = data.login.authorization
    setSession(auth);
    dispatch({
      type: 'LOGIN',
      payload:{
       sesion: sesion
      }
    });
  }, []);
  const selectSede= useCallback(async (sedeId)=>{
    const {data}= await Usuario.selectSede(sedeId)

    const {currentSesion} = data.selectSede.data;
    dispatch({
      type: 'SET_SESSION',
      payload: {
        sesion: currentSesion,
      },
    });
  },[])

  // LOGOUT
  const logout = useCallback(async () => {
    try {
      await Usuario.logout()
      setSession(null);
      dispatch({
        type: 'LOGOUT',
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  // SHOW SELECT EMPRESA
  const setShowSelectEmpresa = useCallback( () => {
    dispatch({type: 'SHOW_SELECT_EMPRESA'});
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
    [state.isInitialized, state.isAuthenticated, state.hasSesion, state.sesion, state.isChangingSesion, state.showSelectEmpresa, login, logout, selectSede,setShowSelectEmpresa]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
