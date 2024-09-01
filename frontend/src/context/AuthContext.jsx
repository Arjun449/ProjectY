import { createContext, useState, useEffect } from 'react';
import * as jwtDecode from 'jwt-decode'; // Using named import as a fallback
// import jwtDecode from 'jwt-decode';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                return jwtDecode(token); // Decode token to get user data
            } catch (error) {
                console.error('Token decode error:', error);
                return null;
            }
        }
        return null;
    });

    const login = (token) => {
        try {
            localStorage.setItem('token', token);
            setUser(jwtDecode(token));
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
