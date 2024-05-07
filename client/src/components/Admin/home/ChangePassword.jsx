import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from '../hooks/Button';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const ChangePassword = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        oldPassword: '', 
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const toggleOldPasswordVisibility = () => {
        setShowOldPassword(!showOldPassword);
    };

    const resetForm = () => {
        setFormData({
            oldPassword: '',
            password: '',
            confirmPassword: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.oldPassword.trim() ||
            !formData.password.trim() ||
            !formData.confirmPassword.trim()
        ) {
            toast.error('All fields are required.', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match", {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
            });
            return;
        }

        try {
            const response = await axios.put(
                `${window.react_app_url + window.user_url + '/change-password'}/${id}`,
                {
                    password: formData.password,
                    oldPassword: formData.oldPassword
                }
            );

            if (response.data.status === false) {
                toast.error(response.data.message, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                });
            }
            else {
                toast.success(response.data.message, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                });
                navigate('/admin-dashboard');
            }
        } catch (error) {
            toast.error('Error updating password', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
            });
        }
    };

    return (
        <main className="profile-page pt-[18rem]">
            <section className="relative py-16 bg-blueGray-200">
                <div className="container mx-auto px-4">
                    <div className="relative flex flex-col min-w-0 break-words bg-slate-100 w-full mb-6 shadow-lg rounded-lg -mt-64">
                        <div className="px-6 py-12">
                            <form onSubmit={handleSubmit}>
                                <div className="mx-24 space-y-4">
                                    <div>
                                        <label
                                            htmlFor="oldPassword"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Old Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showOldPassword ? 'text' : 'password'}
                                                id="oldPassword"
                                                name="oldPassword"
                                                value={formData.oldPassword}
                                                onChange={handleInputChange}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            />
                                            <span
                                                onClick={toggleOldPasswordVisibility}
                                                className="absolute text-lg top-3 right-4 cursor-pointer"
                                            >
                                                {showOldPassword ? <FaEye /> : <FaEyeSlash />}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            />
                                            <span
                                                onClick={togglePasswordVisibility}
                                                className="absolute text-lg top-3 right-4 cursor-pointer"
                                            >
                                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="confirmPassword"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            />
                                            <span
                                                onClick={toggleConfirmPasswordVisibility}
                                                className="absolute text-lg top-3 right-4 cursor-pointer"
                                            >
                                                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-20 mt-12">
                                    <Button label="Update" type="submit" width="48" bgColor="blue" />
                                    <Button label="Reset" type="reset" onClick={resetForm} width="48" bgColor="red" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ChangePassword;
