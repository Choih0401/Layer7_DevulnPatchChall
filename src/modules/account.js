import update from "react-addons-update";
//Action types
export const AUTH_LOGIN = "AUTH_LOGIN";
export const AUTH_LOGOUT = "AUTH_LOGOUT";
export const AUTH_LOGIN_SUCCESS = "AUTH_LOGIN_SUCCESS";
export const AUTH_LOGIN_FAILURE = "AUTH_LOGIN_FAILURE";

//Action Creators
export function login() {
    return {
        type: AUTH_LOGIN
    };
}
export function logout() {
    return {
        type: AUTH_LOGOUT
    };
}
export function loginSuccess(data) {
    return {
        type: AUTH_LOGIN_SUCCESS,
        data
    };
}
export function loginFailure() {
    return {
        type: AUTH_LOGIN_FAILURE
    };
}

//Initial state
const initialState = {
    login: {
        status: "INIT"
    },
    status: {
        isLoggedIn: false,
        id: ""
    }
};

//Reducer
function reducer(state = initialState, action) {
    switch (action.type) {
        case AUTH_LOGIN:
            return update(state, {
                login: {
                    status: { $set: "WAITING" }
                }
            });
        case AUTH_LOGOUT:
            return update(state, {
                login: {
                    status: { $set: "INIT" }
                },
                status: {
                    isLoggedIn: { $set: false },
                    id: { $set: "" }
                }
            });
        case AUTH_LOGIN_SUCCESS:
            return update(state, {
                login: {
                    status: { $set: "SUCCESS" }
                },
                status: {
                    isLoggedIn: { $set: true },
                    id: { $set: action.data.id }
                }
            });
        case AUTH_LOGIN_FAILURE:
            return update(state, {
                login: {
                    status: { $set: "FAILURE" }
                }
            });
        default:
            return state;
    }
}

//Export Reducer
export default reducer;