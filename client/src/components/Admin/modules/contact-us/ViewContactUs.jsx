import React, { useState, useEffect } from 'react';
import BreadCrumb from '../../hooks/BreadCrumb';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewContactUs = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true);
  const [cmsPage, setCmsPage] = useState(null);

  useEffect(() => {
    axios.get(`${window.react_app_url + window.contact_url}/${id}`)
      .then(result => {
        console.log(result);
        setCmsPage(result.data.data);
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
          <BreadCrumb title="ContactUs Requests /" desc='ContactUs Detail' link="/admin-contact-us" />
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
                    <td>{cmsPage.name}</td>
                  </tr>
                  <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                    <th className='p-4'>Email</th>
                    <td>{cmsPage.email}</td>
                  </tr>
                  <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                    <th className='p-4'>Meassage</th>
                    <td>{cmsPage.email}</td>
                  </tr>

                  <tr key={cmsPage._id} className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                    <th className='p-4'>Status</th>
                    <td>
                      <span className={`relative inline-block px-3 py-1 font-semibold ${cmsPage.status === 'Rejected' ? 'text-red-900' :
                          cmsPage.status === 'Pending' ? 'text-yellow-900' :
                            'text-green-900'
                        } leading-tight`}>
                        <span aria-hidden className={`absolute inset-0 ${cmsPage.status === 'Rejected' ? 'bg-red-200' :
                            cmsPage.status === 'Pending' ? 'bg-yellow-200' :
                              'bg-green-200'
                          } opacity-50 rounded-full`}></span>
                        <span className="relative">
                          {cmsPage.status}
                        </span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ViewContactUs