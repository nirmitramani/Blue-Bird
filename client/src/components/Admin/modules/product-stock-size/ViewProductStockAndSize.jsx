import React, { useState, useEffect } from 'react';
import BreadCrumb from '../../hooks/BreadCrumb';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewProductStockAndSize = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true);
  const [ProductStockAndSize, setProductStockAndSize] = useState(null);
  const [ProductInfo, setProductInfo] = useState(null);

  useEffect(() => {
    axios.get(`${window.react_app_url + window.product_stock_size}/${id}`)
      .then(result => {
        setProductStockAndSize(result.data.data);
        setLoading(false);

        const productId = result.data.data.productId;
        // Make another request to fetch product info
        axios.get(`${window.react_app_url + window.product_url}/${productId}`)
          .then(productResult => {
            setProductInfo(productResult.data.data);
            console.log(ProductInfo)
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
  }, [id]);

  return (
    <>
      <div className="p-2 flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
        <div className="mr-6">
          <BreadCrumb title="Product Size & Stock / " desc='View Size & Stock Detail' link="/admin-product-stock-size" />
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
                  {ProductInfo && (
                    <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                      <th className='p-4'>Product Name</th>
                      <td>{ProductInfo.name}</td>
                    </tr>
                  )}
                  <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                    <th className='p-4'>Size</th>
                    <td>{ProductStockAndSize.size}</td>
                  </tr>
                  <tr className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                    <th className='p-4'>Stock</th>
                    <td>{ProductStockAndSize.stockQuantity}</td>
                  </tr>
                  <tr key={ProductStockAndSize._id} className='px-5 py-5 border border-gray-200 bg-white text-sm'>
                    <th className='p-4'>Status</th>
                    <td>
                      <span className={`relative inline-block px-3 py-1 font-semibold ${ProductStockAndSize.status === 'Inactive' ? 'text-red-900' : 'text-green-900'
                        } leading-tight`}>
                        <span aria-hidden className={`absolute inset-0 ${ProductStockAndSize.status === 'Inactive' ? 'bg-red-200' : 'bg-green-200'} opacity-50 rounded-full`}></span>
                        <span className="relative">
                          {ProductStockAndSize.status}
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

export default ViewProductStockAndSize
