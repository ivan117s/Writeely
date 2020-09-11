const initialState = 
{
    user: false, 
};
 
export default (state = initialState, action) =>
{
    if(action.type === "UPDATE_USER")  
    {
        return {...state, user: action.payload}
    } 
    return state
}

const selectUser = (state) => state.Reducers.user;

export const getUser = (state) =>
{
    return { user: selectUser(state) }   
}

 