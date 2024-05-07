import React, { useState, useEffect, useMemo } from 'react';
import { FaEdit, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BreadCrumb from '../../hooks/BreadCrumb';
import useAnimatedLoader from '../../hooks/useAnimatedLoader';

const CmsPages = () => {

  const [cmsPages, setCmsPages] = useState([]);
  const { loading, startAnimatedLoading, stopAnimatedLoading, Loader } = useAnimatedLoader();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    startAnimatedLoading()
    axios.get(`${window.react_app_url + window.cms_page_url}`)
      .then(result => {
        setCmsPages(result.data.data);
        stopAnimatedLoading()
      })
      .catch(err => {
        stopAnimatedLoading()
        console.log(err)
      })
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCmspages = useMemo(() => {
    return cmsPages.filter((cmsPage) => {
      return cmsPage.title.toLowerCase().includes(searchQuery.toLowerCase()) || cmsPage.description.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [cmsPages, searchQuery]);


  return (
    <>
      <div className="p-2 flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
        <BreadCrumb title="CMS Page" desc="" link="/admin" />
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
            placeholder="Search Page"
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
            {filteredCmspages.length > 0 ? (
              <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Page Name
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCmspages.map((cmsPage) => (
                      <tr key={cmsPage._id}>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div className="flex">
                            <div className="ml-3">
                              <p className="text-gray-900 whitespace-no-wrap">{cmsPage.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div className="flex">
                            <div className="ml-3">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {cmsPage.description.length > 20 ? (
                                  <span>
                                    {cmsPage.description.substring(0, 20)}... <br />
                                    <span className="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
                                      <span aria-hidden className="absolute inset-0 bg-blue-200 opacity-50 rounded-sm"></span>
                                      <span className="relative">
                                        <Link to={`view/${cmsPage._id}`}>
                                          <button>View More</button>
                                        </Link>
                                      </span>
                                    </span>
                                  </span>
                                ) : (
                                  cmsPage.description
                                )}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm space-x-2">
                          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                            <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                            <span className="relative">
                              <Link to={`update/${cmsPage._id}`}>
                                <button>Edit</button>
                              </Link>
                            </span>
                          </span>
                          <span className="relative inline-block px-3 py-1 font-semibold text-yellow-900 leading-tight">
                            <span aria-hidden className="absolute inset-0 bg-yellow-200 opacity-50 rounded-full"></span>
                            <span className="relative">
                              <Link to={`view/${cmsPage._id}`}>
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
      </div>
    </>
  );
}

export default CmsPages
