import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import BreadCrumb from '../../hooks/BreadCrumb';
import { FaSearch } from "react-icons/fa";
import useAnimatedLoader from '../../hooks/useAnimatedLoader';
import { Pagination, usePagination } from '../../hooks/Pagination';

const ContactUs = () => {
  const [contactUs, setContactUs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { loading, startAnimatedLoading, stopAnimatedLoading, Loader } = useAnimatedLoader();
  const [selectedStatus, setSelectedStatus] = useState({});

  useEffect(() => {
    startAnimatedLoading()
    axios.get(`${window.react_app_url + window.contact_url}`)
      .then(result => {
        if (result.data.data.length > 0) {

          const statusMap = {};

          result.data.data.forEach(contact => {
            statusMap[contact._id] = contact.status;
          });

          setContactUs(result.data.data);
          setSelectedStatus(statusMap);
          stopAnimatedLoading()
        } else {
          stopAnimatedLoading()
        }
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

  const updateStatus = (id, newStatus) => {
    axios
      .put(`${window.react_app_url + window.contact_url}/status/${id}`, { status: newStatus })
      .then((res) => {
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

        setSelectedStatus(prevStatus => ({
          ...prevStatus,
          [id]: newStatus,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const filteredContactUs = useMemo(() => {
    return contactUs.filter((contact) => {
      return contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [contactUs, searchQuery]);

  const { currentPage, totalPages, handlePageChange, currentItems } = usePagination(filteredContactUs,10);

  return (
    <>

      <div className="p-2 flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
        <BreadCrumb title="Contact Requests" desc="" link="/admin" />
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
            placeholder="Search Contact Requests"
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
                        Email
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-5 py-3 w-64 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((contact) => (
                      <tr key={contact._id}>
                        <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                          <div className="flex">
                            <div className="ml-3">
                              <p className="text-gray-900 whitespace-no-wrap">{contact.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                          <div className="flex">
                            <div className="ml-3">
                              <p className="text-gray-900 whitespace-no-wrap">{contact.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                          <div className="flex">
                            <div className="ml-3">
                              <p className="text-gray-900 whitespace-no-wrap">{contact.message}</p>
                            </div>
                          </div>
                        </td>
                        <td className='bg-white border-b'>
                          <div className="flex">
                            <div className="ml-3">
                              <label>
                                <input
                                  type="radio"
                                  value="Pending"
                                  checked={selectedStatus[contact._id] === 'Pending'}
                                  onChange={() => updateStatus(contact._id, 'Pending')}
                                />
                                Pending
                              </label>
                            </div>
                            <div className="ml-3">
                              <label>
                                <input
                                  type="radio"
                                  value="Rejected"
                                  checked={selectedStatus[contact._id] === 'Rejected'}
                                  onChange={() => updateStatus(contact._id, 'Rejected')}
                                />
                                Rejected
                              </label>
                            </div>
                            <div className="ml-3">
                              <label>
                                <input
                                  type="radio"
                                  value="Approved"
                                  checked={selectedStatus[contact._id] === 'Approved'}
                                  onChange={() => updateStatus(contact._id, 'Approved')}
                                />
                                Approved
                              </label>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 w-64 border-b border-gray-200 bg-white text-sm space-x-2">
                          <span className="relative inline-block px-3 py-1 font-semibold text-yellow-900 leading-tight">
                            <span aria-hidden className="absolute inset-0 bg-yellow-200 opacity-50 rounded-full"></span>
                            <span className="relative">
                              <Link to={`view/${contact._id}`}>
                                <button>View</button>
                              </Link>
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
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </>
  );
}

export default ContactUs;