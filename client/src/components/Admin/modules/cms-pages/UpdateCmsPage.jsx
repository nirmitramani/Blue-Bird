import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../../hooks/Button';
import BreadCrumb from '../../hooks/BreadCrumb';
import { toast } from 'react-toastify';
import useLoader from '../../hooks/useLoader';

const UpdateCmsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, startLoading, stopLoading, Loader } = useLoader();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (id && !dataFetched) {
      startLoading();
      axios
        .get(`${window.react_app_url + window.cms_page_url}/${id}`)
        .then((response) => {
          const { title, description } = response.data.data;
          setFormData({ title, description });
          stopLoading();
          setDataFetched(true);

        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          stopLoading();
          navigate('/admin-cms-pages');
        });
    }
  }, [id, dataFetched, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    startLoading();

    if (!formData.title.trim() || !formData.description.trim()) {
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

    if (!/[a-zA-Z]/.test(formData.title)) {
      toast.warning('Title must contain at least one alphabet character.', {
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

    if (!/[a-zA-Z]/.test(formData.description)) {
      toast.warning('Description must contain at least one alphabet character.', {
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

    const formDataToSend = {
      title: formData.title,
      description: formData.description,
    };

    try {
      if (id) {
        if (!dataFetched) {
          navigate('/admin-cms-pages');
        }
        if (dataFetched) {
          const response = await axios.put(`${window.react_app_url + window.cms_page_url}/${id}`, formDataToSend);

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
      }
      navigate('/admin-cms-pages');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'An error occurred', {
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
          <BreadCrumb title="CMS / " desc={id ? 'Update CMS' : 'Add CMS'} link="/admin-cms-pages" />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mx-24 space-y-4">
          <div>
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter title"

            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter description"
              cols="30"
              rows="10"
            ></textarea>
          </div>
        </div>
        <div className="ml-20 mt-12">
          <Button label={id ? 'Update' : 'Submit'} type="submit" width="32" bgColor="blue" />
          <Button
            label={id ? 'Cancel' : 'Reset'}
            type='reset'
            onClick={() => {
              if (id) {
                navigate('/admin-cms-pages');
              } else {
                setFormData();
              }
            }}
            width="32"
            bgColor={id ? "gray" : "red"}
          />
        </div>
      </form>
    </>
  )
}

export default UpdateCmsPage