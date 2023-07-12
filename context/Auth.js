// Imports
import jwtDecode from 'jwt-decode';
import {createContext, useReducer} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';





// Initial state
const initialState = {
    user:null
};





// Local storage check
const localStorageCheck = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if(token){
            const decodedToken = jwtDecode(token);
            if(decodedToken.exp > Date.now()){
                await AsyncStorage.removeItem('token');
            }else{
                initialState.user = decodedToken;
            }
        }
    } catch (err) {
        console.log(err);
    }
};
localStorageCheck();





// Context
const AuthContext = createContext({
    user:null,
    login:userData => {},
    update:() => {},
    logout:() => {}
});





// Reducer
const AuthReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user:action.payload
            }
        case 'UPDATE':

            // Followings
            let followingArray = state.user.following;
            const userId = action.payload.newFollowing;
            if(followingArray?.includes(userId)){
                const newArray = followingArray.filter(id => id !== userId);
                followingArray = newArray;
            }else{
                followingArray.push(userId);
            }

            // Follow count
            const isFollow = action.payload.isFollow;

            
            return {
                ...state,
                user:{...state.user, bio:action.payload.bio, profilePic:action.payload.profilePic, following:followingArray, followingCount:isFollow ? state.user.followingCount + 1 : state.user.followingCount - 1}
            };
        case 'LOGOUT':
            return{
                ...state,
                user:null
            }
        default:
            return state;
    };
};





// Provider
const AuthProvider = props => {
    const [state, dispatch] = useReducer(AuthReducer, initialState);
    const login = async userData => {
        try {
            await AsyncStorage.setItem('token', userData.token);
            dispatch({
                type:'LOGIN',
                payload:userData
            });
        } catch (err) {
            console.log(err);
        }
    };
    const update = async ({bio, profilePic, newFollowing, isFollow}) => {
        try {
            dispatch({
                type:'UPDATE',
                payload:{bio, profilePic, newFollowing, isFollow}
            });
        } catch (err) {
            console.log(err);
        }
    };
    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            dispatch({
                type:'LOGOUT'
            });
        } catch (err) {
            console.log(err);
        }
    };
    return(
        <AuthContext.Provider
            value={{user:state.user, login, update, logout}}
            {...props}
        />
    );
};





// Export
export {AuthContext, AuthProvider};