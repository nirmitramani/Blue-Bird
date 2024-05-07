import React, { useState, useEffect } from "react";
import BreadCrumb from "../../hooks/BreadCrumb";
import axios from "axios";
import { useParams } from "react-router-dom";

const ViewProduct = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null); // Changed to singular category as it seems we're fetching only one category

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${window.react_app_url + window.product_url}/${id}`);
        setProduct(result.data.data);
        
        const categoryId = result.data.data.categoryid;
        const categoryResponse = await axios.get(`${window.react_app_url + window.product_category_url}/${categoryId}`);
        setCategory(categoryResponse.data.data);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product or category data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // Added id as a dependency to trigger useEffect when id changes

  return (
    <>
      <div className="p-2 flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
        <div className="mr-6">
          <BreadCrumb
            title="Product / "
            desc="View Product"
            link="/admin-products"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8">
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
            {loading ? (
              <p className="p-3">Loading...</p>
            ) : (
              <table className="min-w-full leading-normal">
                <tbody>
                  <tr className="px-5 py-5 border border-gray-200 bg-white text-sm">
                    <th className="p-4">Name</th>
                    <td>{product.name}</td>
                  </tr>

                  <tr className="px-5 py-5 border border-gray-200 bg-white text-sm">
                    <th className="p-4">Short Description</th>
                    <td>{product.shortdescription}</td>
                  </tr>
                
                  <tr className="px-5 py-5 border border-gray-200 bg-white text-sm">
                    <th className="p-4">Description</th>
                    <td>{product.description}</td>
                  </tr>

                  <tr className="px-5 py-5 border border-gray-200 bg-white text-sm">
                    <th className="p-4">Price</th>
                    <td>{product.price}</td>
                  </tr>

                  <tr className="px-5 py-5 border border-gray-200 bg-white text-sm">
                    <th className="p-4">Category Name</th>
                    <td>{category ? category.name : "Category not found"}</td>
                  </tr>

                  <tr
                    key={product._id}
                    className="px-5 py-5 border border-gray-200 bg-white text-sm"
                  >
                    <th className="p-4">Status</th>
                    <td>
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold ${
                          product.status === "Inactive"
                            ? "text-red-900"
                            : "text-green-900"
                        } leading-tight`}
                      >
                        <span
                          aria-hidden
                          className={`absolute inset-0 ${
                            product.status === "Inactive"
                              ? "bg-red-200"
                              : "bg-green-200"
                          } opacity-50 rounded-full`}
                        ></span>
                        <span className="relative">{product.status}</span>
                      </span>
                    </td>
                  </tr>
                  <tr className="px-5 py-5 border border-gray-200 bg-white text-sm">
                    <th className="p-4">Product Image</th>
                    <td className="flex">
                      <img
                        src={`${window.react_app_url}public/images/products/${product.productimg}`}
                        alt={product.name}
                        className="w-48 p-4"
                      />
                    </td>
                  </tr>

                  <tr className="px-5 py-5 border border-gray-200 bg-white text-sm">
                    <th className="p-4">Product Thumbnail Images</th>
                    <td className="flex">
                      {product.productthumbimg.map((thumbimg, index) => (
                        <img
                          key={index}
                          src={`${window.react_app_url}public/images/products/${thumbimg}`}
                          alt={`${product.name} - Image ${index}`}
                          className="w-48 p-4"
                        />
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProduct;
