import React, { useState, useEffect } from "react";
import BreadCrumb from "../../hooks/BreadCrumb";
import axios from "axios";
import { useParams } from "react-router-dom";

const ViewOrders = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState({
    order: "",
    orderItem: [],
    paymentDetail: "",
  });

  useEffect(() => {
    // Fetch the order details
    axios
      .get(`${window.react_app_url + window.order_url}/${id}`)
      .then((result) => {
        setOrderData(result.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [id]);
  console.log(orderData);
  return (
    <>
      <div className="p-2 flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
        <div className="mr-6">
          <BreadCrumb
            title="Orders / "
            desc="View Order"
            link="/admin-order"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8">
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
            {loading ? (
              <p className="p-3">Loading...</p>
            ) : (
              <>
                <table className="min-w-full leading-normal">
                  <tbody>
                    <tr className="px-5 py-5 border border-gray-200 bg-white text-sm">
                      <th className="p-4">Order Id</th>
                      <td>{orderData.order._id}</td>
                    </tr>
                    <tr className="px-5 py-5 border border-gray-200 bg-white text-sm">
                      <th className="p-4">User Id</th>
                      <td>{orderData.order.userId}</td>
                    </tr>
                    <tr className="px-5 py-5 border border-gray-200 bg-white text-sm">
                      <th className="p-4">Coupon Id</th>
                      <td>
                        {orderData.order.couponId
                          ? orderData.order.couponId
                          : "-"}
                      </td>
                    </tr>
                    <tr className="px-5 py-5 border border-gray-200 bg-white text-sm">
                      <th className="p-4">Discount Amount</th>
                      <td>
                        {orderData.order.discountAmount
                          ? orderData.order.discountAmount
                          : "-"}
                      </td>
                    </tr>
                    <tr className="px-5 py-5 border border-gray-200 bg-white text-sm">
                      <th className="p-4">Order Date</th>
                      <td>
                        {new Date(
                          orderData.order.orderDate
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                    <tr className="px-5 py-5 border border-gray-200 bg-white text-sm">
                      <th className="p-4">Payment Type</th>
                      <td>{orderData.order.paymentType}</td>
                    </tr>
                    <tr
                      key={orderData.order._id}
                      className="px-5 py-5 border border-gray-200 bg-white text-sm"
                    >
                      <th className="p-4">Status</th>
                      <td>
                        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                          <span
                            aria-hidden
                            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                          ></span>
                          <span className="relative">
                            {orderData.order.status}
                          </span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Display Order Items */}
                <h2 className="text-xl font-semibold mt-6">Order Items</h2>
                {orderData.orderItem.length ? (
                  <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                      <thead>
                        <tr>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Product Id
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-slate-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderData.orderItem.map((item) => (
                          <tr
                            key={item._id}
                            className="px-5 py-5 border border-gray-200 bg-white text-sm"
                          >
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <div className="flex">
                                <div className="ml-3">
                                  <p className="text-gray-600 whitespace-no-wrap">
                                    {item.productId}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <div className="flex">
                                <div className="ml-3">
                                  <p className="text-gray-600 whitespace-no-wrap">
                                    {item.quantity}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xl font-semibold mt-6">
                    No Order Items Found
                  </p>
                )}

                {/* Display Payment Details */}
                <h2 className="text-xl font-semibold mt-6">Payment Details</h2>
                {orderData.paymentDetail ? (
                  <table className="min-w-full leading-normal">
                    <tbody>
                      <tr className="px-5 py-5 border border-gray-200 bg-white text-sm">
                        <th className="p-4">Total Amount</th>
                        <td>
                          {orderData.paymentDetail.totalAmount
                            ? orderData.paymentDetail.totalAmount
                            : "-"}
                        </td>
                      </tr>
                      <tr className="px-5 py-5 border border-gray-200 bg-white text-sm">
                        <th className="p-4">Payment Status</th>
                        <td>
                          {orderData.paymentDetail.status
                            ? orderData.paymentDetail.status  
                            : "-"}
                        </td>
                      </tr>
                      <tr className="px-5 py-5 border border-gray-200 bg-white text-sm">
                        <th className="p-4">Online Order Id</th>
                        <td>
                          {orderData.paymentDetail.onlineOrderId
                            ? orderData.paymentDetail.onlineOrderId
                            : "-"}
                        </td>
                      </tr>
                      <tr className="px-5 py-5 border border-gray-200 bg-white text-sm">
                        <th className="p-4">Online Payment Id</th>
                        <td>
                          {orderData.paymentDetail.onlinPaymentId
                            ? orderData.paymentDetail.onlinPaymentId
                            : "-"}
                        </td>{" "}
                      </tr>
                      <tr className="px-5 py-5 border border-gray-200 bg-white text-sm">
                        <th className="p-4">Status</th>
                        <td>
                          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                            <span
                              aria-hidden
                              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                            ></span>
                            <span className="relative">
                              {orderData.paymentDetail.status}
                            </span>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p className="text-xl font-semibold mt-6">
                    Payment Details Not Available
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewOrders;
