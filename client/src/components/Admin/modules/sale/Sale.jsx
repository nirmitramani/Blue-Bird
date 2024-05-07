import React, { useState, useEffect, useMemo } from 'react';
import { FaSearch } from 'react-icons/fa';
import Button from '../../hooks/Button';
import { AiOutlinePlus } from "react-icons/ai";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import BreadCrumb from '../../hooks/BreadCrumb';
import useDragAndDrop from '../../hooks/useDragAndDrop';
import useAnimatedLoader from '../../hooks/useAnimatedLoader';
import ConfirmDelete from '../../hooks/ConfirmDelete';
import { usePagination, Pagination } from '../../hooks/Pagination';

const Sale = () => {
    const [sale, setSale] = useState([]);
    const [switchStates, setSwitchStates] = useState({});
    const { loading, startAnimatedLoading, stopAnimatedLoading, Loader } = useAnimatedLoader();
    const [searchQuery, setSearchQuery] = useState('');

    const handleReorder = async (newOrder) => {
        try {
            await axios.post(`${window.react_app_url + window.sale_url}/reorder`, { newOrder });
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    };
    const { draggedItem, handleDragStart, handleDragEnd } = useDragAndDrop(handleReorder);

    useEffect(() => {
        const initialSwitchStates = {};
        sale.forEach((sale) => {
            initialSwitchStates[sale._id] = sale.status === 'Active';
        });
        setSwitchStates(initialSwitchStates);
    }, [sale]);

    useEffect(() => {
        startAnimatedLoading()
        axios.get(`${window.react_app_url + window.sale_url}`)
            .then(result => {
                setSale(result.data.data);
                stopAnimatedLoading()
            })
            .catch(err => {
                stopAnimatedLoading()
                console.log(err)
            })
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

        axios.put(`${window.react_app_url + window.sale_url}/status/${id}`, { status: newStatus })
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
            onConfirm: () => deleteSale(id),
        });
    };

    const deleteSale = async (id) => {
        try {
            const response = await axios.delete(`${window.react_app_url + window.sale_url}/${id}`);
            setSale((prevSale) => prevSale.filter((sale) => sale._id !== id));
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

    const filteredSale = useMemo(() => {
        return sale.filter((sale) => {
            return sale.name.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [sale, searchQuery]);

    const { currentPage, totalPages, handlePageChange, currentItems } = usePagination(filteredSale);

    return (
        <>

            <div className="p-2 flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
                <BreadCrumb title="Sale" desc="" link="/admin" />
                <div className="flex flex-wrap items-start justify-end -mb-3 p-4">
                    <Link to="/admin-sale-add">
                        <Button label="Add new sale" iconURL={<AiOutlinePlus />} />
                    </Link>
                </div>
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
                        placeholder="Search sale"
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
                            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Image
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                ACTIONS
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((sale, index) => (
                                            <tr
                                                key={sale._id}
                                                draggable
                                                onDragStart={() => handleDragStart(sale)}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={() => handleDragEnd(index, currentItems, setSale)}
                                            >
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <div className="flex">
                                                        <div className="ml-3">
                                                            <p className="text-gray-900 whitespace-no-wrap">{sale.name}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <div className="flex">
                                                        <div className="ml-3">
                                                            <p className="text-gray-900 whitespace-no-wrap">{sale.description}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">

                                                    <img
                                                        className="h-full rounded-sm w-20"
                                                        src={`http://localhost:3000/public/images/sale/${sale.saleimg}`}
                                                        alt={sale.name}
                                                        loading='eager'
                                                    />

                                                </td>
                                                <td className='bg-white border-b'>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer"
                                                            id={`flexSwitchCheckChecked_${sale._id}`}
                                                            checked={switchStates[sale._id] || false}
                                                            onChange={() => handleStatusChange(sale._id)}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm space-x-2">
                                                    <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                        <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                        <span className="relative">
                                                            <Link to={`update/${sale._id}`}>
                                                                <button>Edit</button>
                                                            </Link>
                                                        </span>
                                                    </span>
                                                    <span className="relative inline-block px-3 py-1 font-semibold text-yellow-900 leading-tight">
                                                        <span aria-hidden className="absolute inset-0 bg-yellow-200 opacity-50 rounded-full"></span>
                                                        <span className="relative">
                                                            <Link to={`view/${sale._id}`}>
                                                                <button>View</button>
                                                            </Link>
                                                        </span>
                                                    </span>
                                                    <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                                                        <span aria-hidden className="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
                                                        <span className="relative">
                                                            <button onClick={() => handleDelete(sale._id)}>Delete</button>
                                                        </span>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No data found</p>
                        )}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            handlePageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default Sale
