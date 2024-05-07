import React, { useState, useEffect } from 'react';
import BreadCrumb from '../../hooks/BreadCrumb';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewCouponCode = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState(null);

  useEffect(() => {
    axios.get(`${window.react_app_url + window.coupon_code_url}/${id}`)
      .then(result => {
        setCouponCode(result.data.data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
  }, []);
  console.log(couponCode)
  return (
    <>
      <div className="p-2 flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
        <div className="mr-6">
          <BreadCrumb title="Coupon Code / " desc='View Coupon Code' link="/admin-coupon-code" />
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
                    <th className='p-4'>Title</th>
                    <td>{couponCode.title}</td>
                  </tr>
                  <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                    <th className='p-4'>Code</th>
                    <td>{couponCode.code}</td>
                  </tr>
                  <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                    <th className='p-4'>Description</th>
                    <td>{couponCode.description}</td>
                  </tr>
                  <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                    <th className='p-4'>Discount</th>
                    <td>{couponCode.discount}%</td>
                  </tr>
                  <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                    <th className='p-4'>Max Discount</th>
                    <td>{couponCode.maxDiscount}</td>
                  </tr>
                  <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                    <th className='p-4'>Minimun Order Value</th>
                    <td>{couponCode.minimumOrderValue}</td>
                  </tr>
                  <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                    <th className='p-4'>Start Date</th>
                    <td>
                      {new Date(couponCode.startDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                  <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                    <th className='p-4'>End Date</th>
                    <td>
                      {new Date(couponCode.endDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                  <tr key={couponCode._id} className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                    <th className='p-4'>Status</th>
                    <td>
                      <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                        <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                        <span className="relative">
                          {couponCode.status}
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

export default ViewCouponCode
