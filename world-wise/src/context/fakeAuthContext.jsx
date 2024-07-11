import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext()
const initalState = {
    isAuthenticated: false,
    user: null
}

function reducer ( state , action ){
    switch( action.type ){
        case "login":{
            return { ...state , user: action.payload , isAuthenticated:true}
        }
        case "logout":{
            return { ...state , user: null , isAuthenticated:false  }
        }
        default:{
            throw new Error("Invalid action!")
        }
    }
}

const FAKE_USER = {
    name: "Jack",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }){
    const [{user , isAuthenticated} , dispatch] = useReducer(reducer , initalState)

    function Login( email , password ){
        if ( email === FAKE_USER.email && password === FAKE_USER.password ){
            dispatch({ type: 'login' , payload: FAKE_USER})
        }
    }
    function Logout(){
        dispatch( {type: 'logout' })
    }
    return(
        <AuthContext.Provider value={{
            user, isAuthenticated , Login , Logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth(){
    const context = useContext(AuthContext)
    if ( context === undefined ) throw new Error('Auth Context is being used wrongly!')
    return context
}

export {AuthProvider , useAuth}