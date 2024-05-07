import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const Auth = ({ element, role }) => {
    const [cookies, setCookie, removeCookie] = useCookies([role]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const verifyUser = async () => {
            if (cookies.user == role){
                navigate('/');
            }
            else if (cookies.admin == role) {
                navigate('/admin/dashboard');
            } 
            else if (!cookies[role]) {
                removeCookie(role);
                if(role == 'admin'){
                    navigate('/admin-authentication');
                }
                else{
                    navigate('/authentication');
                }
            } else {
                try {
                    const response = await axios.post(
                        `${window.react_app_url}auth/${role}`,
                        {},
                        { withCredentials: true }
                    );
                    if (!response.data.status) {
                        removeCookie(role);
                        navigate('/authentication');
                    }
                } catch (error) {
                    console.error('Authentication error:', error);
                    removeCookie(role);
                    navigate('/authentication');
                }
            }
        };

        verifyUser();
    }, [cookies, navigate, role]);

    return element;
};



const AuthGuard = ({ element, role }) => {
    const [cookies] = useCookies([role]);
    const isLoggedIn = !!cookies[role];
    
    return isLoggedIn ? (
        role === 'admin' ? <Link to="/admin-dashboard" /> : <Link to="/" />
    ) : (
        element
    );
};

export { Auth, AuthGuard };
