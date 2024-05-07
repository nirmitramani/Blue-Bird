import React, { useState, useEffect, useMemo } from 'react';
import Button from '../../hooks/Button';
import { AiOutlinePlus } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import BreadCrumb from '../../hooks/BreadCrumb';
import ConfirmDelete from '../../hooks/ConfirmDelete';
import useAnimatedLoader from '../../hooks/useAnimatedLoader';
import { usePagination, Pagination } from '../../hooks/Pagination';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [switchStates, setSwitchStates] = useState({});
    const {loading, startAnimatedLoading, stopAnimatedLoading, Loader } = useAnimatedLoader();

    useEffect(() => {
        const initialSwitchStates = {};
        users.forEach((user) => {
            initialSwitchStates[user._id] = user.status === 'Active';
        });
        setSwitchStates(initialSwitchStates);
    }, [users]);

    useEffect(() => {
        startAnimatedLoading();
        axios.get(`${window.react_app_url + window.user_url}`)
          .then(result => {
            const user = result.data.data.filter(user => user.role === 'user');
            setUsers(user);
            stopAnimatedLoading();
          })
          .catch(err => {
            stopAnimatedLoading();
            console.log(err);
          });
      }, []);
      

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        handlePageChange(1)
    };

    const handleStatusChange = (id) => {
        setSwitchStates((prevSwitchStates) => ({
            ...prevSwitchStates,
            [id]: !prevSwitchStates[id],
        }));

        const newStatus = switchStates[id] ? 'Inactive' : 'Active';

        axios.put(`${window.react_app_url + window.user_url}/status/${id}`, { status: newStatus })
            .then(res => {
                console.log(res);
                const message = `Status updated to ${newStatus}`;
                toast.success(message, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    const handleDelete = (id) => {
        ConfirmDelete()({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this?',
            onConfirm: () => deleteUser(id),
        });
    };

    const deleteUser = async (userId) => {
        try {
            const response = await axios.delete(`${window.react_app_url + window.user_url}/${userId}`);
            setUsers(users.filter(user => user._id !== userId));
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
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            return user.userName.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [users, searchQuery]);

    const { currentPage, totalPages, handlePageChange, currentItems } = usePagination(filteredUsers);


    return (
        <>
            <div className="p-2 flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
                <BreadCrumb title="Users" desc="" link="/admin" />
            </div>

            <div className="hidden md:flex flex-auto space-x-2 justify-center items-center">
                <div className="w-1/3 relative flex items-center h-12 rounded-lg focus-within:shadow-lg bg-white border-2 overflow-hidden">
                    <div className="grid place-items-center h-full w-12 text-gray-300">
                        <FaSearch />
                    </div>
                    <input
                        className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
                        type="search"
                        id="search"
                        placeholder="Search user"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-8">
                {loading ? (
                    <Loader />
                ) : (
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        {currentItems.length > 0 ? (
                            <>
                                <div
                                    className="inline-block min-w-full shadow-md rounded-lg overflow-hidden"
                                >
                                    <table className="min-w-full leading-normal">
                                        <thead>
                                            <tr>
                                                <th
                                                    className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                                >
                                                    Name
                                                </th>
                                                <th
                                                    className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                                >
                                                    Email
                                                </th>
                                                <th
                                                    className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                                >
                                                    Phone
                                                </th>
                                                <th
                                                    className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                                >
                                                    Status
                                                </th>
                                                <th
                                                    className="px-5 py-3 w-64 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                                >
                                                    ACTIONS
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.map((user) => (
                                                <tr key={user._id}>
                                                    <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                                                        <div className="flex">
                                                            <div className="flex-shrink-0 w-10 h-10">
                                                                <img
                                                                    className="w-full h-full rounded-full"
                                                                    src={`http://localhost:3000/public/images/user/${user.profileimg}`}
                                                                    onError={(e) => {
                                                                        e.target.src = "https://i.stack.imgur.com/l60Hf.png";
                                                                    }}
                                                                    alt={user.useName}
                                                                />
                                                            </div>
                                                            <div className="ml-3">
                                                                <p className="text-gray-900 whitespace-no-wrap">
                                                                    {user.userName}
                                                                </p>
                                                                <p className="text-gray-600 whitespace-no-wrap">
                                                                    {user._id}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                                                        <p className="text-gray-900 whitespace-no-wrap">{user.email}</p>
                                                    </td>
                                                    <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                                                        <p className="text-gray-900 whitespace-no-wrap">{user.phone}</p>
                                                    </td>
                                                    <td className='px-3 py-3 border-b border-gray-200 bg-white text-sm'>
                                                        <label className="relative inline-flex cursor-pointer">
                                                            <input type="checkbox" className="sr-only peer"
                                                                id={`flexSwitchCheckChecked_${user._id}`}
                                                                checked={switchStates[user._id]}
                                                                onChange={() => handleStatusChange(user._id)}
                                                            />
                                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                        </label>
                                                    </td>

                                                    <td className="px-3 py-3 w-64 border-b border-gray-200 bg-white text-sm space-x-2">
                                                        <span className="relative inline-block px-3 py-1 font-semibold text-yellow-900 leading-tight">
                                                            <span aria-hidden className="absolute inset-0 bg-yellow-200 opacity-50 rounded-full"></span>
                                                            <span className="relative">
                                                                <Link to={`view/${user._id}`}>
                                                                    <button>View</button>
                                                                </Link>
                                                            </span>
                                                        </span>
                                                        <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                                                            <span aria-hidden className="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
                                                            <span className="relative">
                                                                <button onClick={() => handleDelete(user._id)}>
                                                                    Delete
                                                                </button>
                                                            </span>
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    handlePageChange={handlePageChange}
                                />
                            </>
                        ) : (
                            <p className="text-center text-gray-500">No data found</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
export default Users
