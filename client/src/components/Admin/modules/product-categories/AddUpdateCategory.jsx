import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../../hooks/Button';
import BreadCrumb from '../../hooks/BreadCrumb';
import { toast } from 'react-toastify';
import useLoader from '../../hooks/useLoader';

const AddUpdateCategory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { loading, startLoading, stopLoading, Loader } = useLoader();

    const initialFormData = {
        name: '',
        productcategoryimg: null,
        gender: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [dataFetched, setDataFetched] = useState(false);

    useEffect(() => {
        if (id && !dataFetched) {
            startLoading();
            axios
                .get(`${window.react_app_url + window.product_category_url}/${id}`)
                .then((response) => {
                    const { name, gender } = response.data.data;
                    setFormData({ name, gender });
                    stopLoading();
                    setDataFetched(true);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    stopLoading();
                    navigate('/admin-product-categories');
                });
        }
    }, [id, dataFetched, navigate]);


    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'productcategoryimg') {
            const file = files[0];
            if (file) {
                if (file.type === 'image/jpeg' || file.type === 'image/png'|| file.type === 'image/webp') {
                    setFormData({
                        ...formData,
                        [name]: file,
                    });
                } else {
                    e.target.value = null;
                    toast.error('Please select a jpg, webp or png image.');
                }
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        startLoading();

        if (!formData.name.trim() ||!formData.gender || (!id && !formData.productcategoryimg)) {
            toast.warning('Please fill in all required fields.', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
            });
            stopLoading();
            return;
        }

        if (!/[a-zA-Z]/.test(formData.name)) {
            toast.warning('Name must contain at least one alphabet character.', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
            });
            stopLoading();
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('gender', formData.gender);
        formDataToSend.append('productcategoryimg', formData.productcategoryimg);

        try {
            if (id) {
                if (!dataFetched) {
                    navigate('/admin-product-categories');
                }
                if (dataFetched) {
                    const response = await axios.put(`${window.react_app_url + window.product_category_url}/${id}`, formDataToSend, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
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
                }
            } else {
                const response = await axios.post(`${window.react_app_url + window.product_category_url}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
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
            }
            navigate('/admin-product-categories');
        } catch (error) {
            console.error('Error:', error);
            toast.error(error, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
            });
        }
        finally {
            stopLoading();
        }
    };

    return (
        <>
            {loading && <Loader />}
            <div className="p-2 flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
                <div className="mr-6">
                    <BreadCrumb title="Product Category / " desc={id ? 'Update Category' : 'Add Category'} link="/admin-product-categories" />
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mx-24 space-y-4">
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Enter Title"

                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">Gender</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={formData.gender === "male"}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                Male
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={formData.gender === "female"}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                Female
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="kids"
                                    checked={formData.gender === "kids"}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                Kids
                            </label>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="productcategoryimg" className="block mb-2 text-sm font-medium text-gray-900">
                            Image
                        </label>
                        <input
                            type="file"
                            id="productcategoryimg"
                            name="productcategoryimg"
                            onChange={handleInputChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>
                </div>
                <div className="ml-20 mt-12">
                    <Button label={id ? 'Update' : 'Submit'} type="submit" width="32" bgColor="blue" />
                    <Button
                        label={id ? 'Cancel' : 'Reset'}
                        type='reset'
                        onClick={() => {
                            if (id) {
                                navigate('/admin-product-categories');
                            } else {
                                setFormData(initialFormData);
                            }
                        }}
                        width="32"
                        bgColor={id ? "gray" : "red"}
                    />
                </div>
            </form>
        </>
    );
};

export default AddUpdateCategory;
