


export const useLogout = () => {


    const logout = () => {
        // Remove user data from localStorage
        localStorage.removeItem('user');
        
        // Dispatch logout action to update auth context state

    };

    return {logout};
};
