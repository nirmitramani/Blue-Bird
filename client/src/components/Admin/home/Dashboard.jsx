import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineUser, AiFillQuestionCircle, AiOutlineContacts, AiOutlineShoppingCart } from "react-icons/ai";
import { LuGalleryThumbnails } from "react-icons/lu";
import { BiSolidShoppingBags, BiCategoryAlt, BiSelectMultiple, BiSolidDiscount } from "react-icons/bi";
import { BsCalendar2Event } from "react-icons/bs";

const Dashboard = () => {
    const [counts, setCounts] = useState([]);

    const sections = [
        {
            name: 'App Users',
            url: `${window.react_app_url + window.user_url}/count`,
            icon: <AiOutlineUser />,
            link: '/admin-users',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-100'
        },
        {
            name: 'Product Category',
            url: `${window.react_app_url + window.product_category_url}/count`,
            icon: <BiCategoryAlt />,
            link: '/admin-product-categories',
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            name: 'Products',
            url: `${window.react_app_url + window.product_url}/count`,
            icon: <BiSolidShoppingBags />,
            link: '/admin-products',
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            name: 'Slider',
            url: `${window.react_app_url + window.slider_url}/count`,
            icon: <LuGalleryThumbnails />,
            link: '/admin-sliders',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
        },
        {
            name: "FAQ's",
            url: `${window.react_app_url + window.faq_url}/count`,
            icon: <AiFillQuestionCircle />,
            link: '/admin-faqs',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-100'
        },
        {
            name: 'Contacts',
            url: `${window.react_app_url + window.contact_url}/count`,
            icon: <AiOutlineContacts />,
            link: '/admin-contact-us',
            color: 'text-teal-600',
            bgColor: 'bg-teal-100'
        },
        {
            name: 'Orders',
            url: `${window.react_app_url + window.order_url}/count`,
            icon: <AiOutlineShoppingCart />,
            link: '/admin-order',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            name: 'Coupon Code',
            url: `${window.react_app_url + window.coupon_code_url}/count`,
            icon: <BiSolidDiscount />,
            link: '/admin-coupon-code',
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        
    ];

    useEffect(() => {
        Promise.all(sections.map(section => {
            return axios.get(section.url)
                .then(response => response.data.count)
                .catch(error => {
                    console.error(`Error fetching ${section.name} count:`, error);
                    return 0;
                });
        }))
            .then(counts => {
                setCounts(counts);
            });
    }, []);

    return (
        <>
            <main className={`p-6 sm:p-10 space-y-6`}>
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {sections.map((section, index) => (
                        <Link to={section.link} key={index}>
                            <div className="flex items-center p-8 bg-white shadow rounded-lg transition-transform hover:scale-105 hover:shadow-lg hover:duration-300">
                                <div className={`inline-flex flex-shrink-0 items-center justify-center h-16 w-16 ${section.color} ${section.bgColor} rounded-full mr-6`}>
                                    <p className='text-3xl'>{section.icon}</p>
                                </div>
                                <div>
                                    <span className="block text-2xl font-bold">{counts[index]}</span>
                                    <span className="block text-gray-500">{section.name}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </section>
            </main>
        </>
    );

}

export default Dashboard;
