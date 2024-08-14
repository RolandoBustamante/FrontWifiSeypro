export const HOST_API_KEY = process.env.REACT_APP_API_URL || '';
export const HOST_WS_API_KEY= process.env.REACT_APP_WS_API

export const HEADER = {
    H_MOBILE: 64,
    H_MAIN_DESKTOP: 88,
    H_DASHBOARD_DESKTOP: 92,
    H_DASHBOARD_DESKTOP_OFFSET: 92 - 32,
};

export const NAV = {
    W_BASE: 260,
    W_LARGE: 320,
    W_DASHBOARD: 280,
    W_DASHBOARD_MINI: 88,
    //
    H_DASHBOARD_ITEM: 48,
    H_DASHBOARD_ITEM_SUB: 36,
    //
    H_DASHBOARD_ITEM_HORIZONTAL: 32,
};