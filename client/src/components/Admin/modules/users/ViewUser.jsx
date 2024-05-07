import React, { useState, useEffect } from 'react';
import BreadCrumb from '../../hooks/BreadCrumb';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewUser = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`${window.react_app_url + window.user_url}/${id}`)
            .then(result => {
                setUser(result.data.data);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                console.log(err);
            });
    }, []);

    return (
        <>
            <div className="p-2 flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
                <div className="mr-6">
                    <BreadCrumb title="User / " desc='View User' link="/admin-users" />
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-8">
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                        {loading ? (
                            <p className='p-3'>Loading...</p>
                        ) : (
                            <table className="min-w-full leading-normal">
                                <tbody>
                                    <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                                        <th className='p-4'>Name</th>
                                        <td>{user.userName ? user.userName : "-"}</td>
                                    </tr>

                                    <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                                        <th className='p-4'>Email</th>
                                        <td>{user.email ? user.email : "-"}</td>
                                    </tr>

                                    <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                                        <th className='p-4'>Phone</th>
                                        <td>{user.phone ? user.phone : "-"}</td>
                                    </tr>

                                    <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                                        <th className='p-4'>Role</th>
                                        <td>{user.role}</td>
                                    </tr>

                                    <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                                        <th className='p-4'>Address</th>
                                        <td>{user.address ? user.address : "-"}</td>
                                    </tr>

                                    <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                                        <th className='p-4'>City</th>
                                        <td>{user.city ? user.city : "-"}</td>
                                    </tr>

                                    <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                                        <th className='p-4'>State</th>
                                        <td>{user.state ? user.state : "-"}</td>
                                    </tr>

                                    <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                                        <th className='p-4'>Country</th>
                                        <td>{user.country ? user.country : "-"}</td>
                                    </tr>

                                    <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                                        <th className='p-4'>Postal Code</th>
                                        <td>{user.postalcode ? user.postalcode : "-"}</td>
                                    </tr>
                                    
                                    <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                                        <th className='p-4'>Token</th>
                                        <td>{user.token ? user.token : "-"}</td>
                                    </tr>
                                    
                                    <tr key={user._id} className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                                        <th className='p-4'>Status</th>
                                        <td>
                                            <span className={`relative inline-block px-3 py-1 font-semibold ${user.status === 'Inactive' ? 'text-red-900' : 'text-green-900'} leading-tight`}>
                                                <span aria-hidden className={`absolute inset-0 ${user.status === 'Inactive' ? " bg-red-200" : " bg-green-200"} opacity-50 rounded-full`}></span>
                                                <span className="relative">
                                                    {user.status}
                                                </span>
                                            </span>
                                        </td>
                                    </tr>

                                    {user.profile ? (
                                        <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                                            <th className='p-4'>User Image</th>
                                            <td className='flex'>
                                                <img
                                                    src={`http://localhost:3000/public/images/users/${user.profile}`}
                                                    alt={user.name}
                                                    className='w-48 p-4'
                                                />
                                            </td>
                                        </tr>
                                    ) : null}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewUser;
