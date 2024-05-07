import React, { useState, useEffect, useMemo } from "react";
import Button from "../../hooks/Button";
import { AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import BreadCrumb from "../../hooks/BreadCrumb";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import useAnimatedLoader from "../../hooks/useAnimatedLoader";
import { usePagination, Pagination } from "../../hooks/Pagination";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState({});
  const { loading, startAnimatedLoading, stopAnimatedLoading, Loader } =
    useAnimatedLoader();

  useEffect(() => {
    startAnimatedLoading();
    axios
      .get(`${window.react_app_url + window.order_url}`)
      .then((result) => {
        setOrders(result.data.data);

        const statusMap = {};

        result.data.data.forEach((order) => {
          statusMap[order._id] = order.status;
        });

        setSelectedStatus(statusMap);

        stopAnimatedLoading();
      })
      .catch((err) => {
        stopAnimatedLoading();
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    handlePageChange(1);
  };

  const updateStatus = (id, newStatus) => {
    setSelectedStatus((prevStatus) => ({
      ...prevStatus,
      [id]: newStatus,
    }));

    axios
      .put(`${window.react_app_url + window.order_url}/status/${id}`, {
        status: newStatus,
      })
      .then((res) => {
        const message = `Status updated to ${newStatus}`;
        toast.success(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(
        `${window.react_app_url + window.order_url}/${orderId}`
      );
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      return order._id.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [orders, searchQuery]);

  const { currentPage, totalPages, handlePageChange, currentItems } =
    usePagination(filteredOrders);

  return (
    <>
      <div className="p-2 flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
        <BreadCrumb title="Orders" desc="" link="/admin" />
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
            placeholder="Search order"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8">
        {loading ? (
          <Loader key="" />
        ) : (
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            {currentItems.length > 0 ? (
              <>
                <div className="inline-block max-w-full shadow-md rounded-lg overflow-hidden">
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Order Id
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Coupon Id
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Discount Amount
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Order Date
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Payment Type
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
                      {currentItems.map((order) => (
                        <tr key={order._id}>
                          <td className="text-center border-b border-gray-200 bg-white text-sm">
                            <div className="flex">
                              <div className="ml-3">
                                <p className="text-gray-600 whitespace-no-wrap">
                                  {order._id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="text-center border-b border-gray-200 bg-white text-sm">
                            <div className="flex">
                              <div className="ml-3">
                                <p className="text-gray-600 whitespace-no-wrap">
                                  {order.couponId}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="text-center border-b border-gray-200 bg-white text-sm">
                            <div className="flex">
                              <div className="ml-3">
                                <p className="text-gray-600 whitespace-no-wrap">
                                  {order.discountAmount}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="text-center border-b border-gray-200 bg-white text-sm">
                            <div className="flex">
                              <div className="ml-3">
                                <p className="text-gray-600 whitespace-no-wrap">
                                  {new Date(order.orderDate).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="text-center border-b border-gray-200 bg-white text-sm">
                            <div className="flex">
                              <div className="ml-3">
                                <p className="text-gray-600 whitespace-no-wrap">
                                  {order.paymentType}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="text-center bg-white border-b">
                            <div className="flex">
                              <div className="ml-3">
                                <label>
                                  <input
                                    type="radio"
                                    value="Pending"
                                    checked={
                                      selectedStatus[order._id] === "Pending"
                                    }
                                    onChange={() =>
                                      updateStatus(order._id, "Pending")
                                    }
                                  />
                                  Pending
                                </label>
                              </div>
                              <div className="ml-3">
                                <label>
                                  <input
                                    type="radio"
                                    value="Deliverd"
                                    checked={
                                      selectedStatus[order._id] === "Deliverd"
                                    }
                                    onChange={() =>
                                      updateStatus(order._id, "Deliverd")
                                    }
                                  />
                                  Delivered
                                </label>
                              </div>
                              <div className="ml-3">
                                <label>
                                  <input
                                    type="radio"
                                    value="Cancelled"
                                    checked={
                                      selectedStatus[order._id] === "Cancelled"
                                    }
                                    onChange={() =>
                                      updateStatus(order._id, "Cancelled")
                                    }
                                  />
                                  Cancelled
                                </label>
                              </div>
                            </div>
                          </td>

                          <td className="text-center border-b border-gray-200 bg-white text-sm space-x-2">
                            <span className="relative inline-block px-3 py-1 font-semibold text-yellow-900 leading-tight">
                              <span
                                aria-hidden
                                className="absolute inset-0 bg-yellow-200 opacity-50 rounded-full"
                              ></span>
                              <span className="relative">
                                <Link to={`view/${order._id}`}>
                                  <button>View</button>
                                </Link>
                              </span>
                            </span>
                            <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                              <span
                                aria-hidden
                                className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
                              ></span>
                              <span className="relative">
                                <button onClick={() => handleDelete(order._id)}>
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
};

export default Orders;
