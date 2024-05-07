import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../../hooks/Button';
import BreadCrumb from '../../hooks/BreadCrumb';
import { toast } from 'react-toastify';
import useLoader from '../../hooks/useLoader';

const AddUpdateFAQs = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, startLoading, stopLoading, Loader } = useLoader();

  const initialFormData = {
    question: '',
    answer: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (id && !dataFetched) {
      startLoading();
      axios
        .get(`${window.react_app_url + window.faq_url}/${id}`)
        .then((response) => {
          const { question, answer } = response.data.data;
          setFormData({ question, answer });
          stopLoading();
          setDataFetched(true);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          stopLoading();
          navigate('/admin-faqs');
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

    if (!formData.question.trim() || !formData.answer.trim()) {
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

    if (!/[a-zA-Z]/.test(formData.question)) {
      toast.warning('Question must contain at least one alphabet character.', {
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

    if (!/[a-zA-Z]/.test(formData.answer)) {
      toast.warning('Answer must contain at least one alphabet character.', {
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
      question: formData.question,
      answer: formData.answer,
    };
    try {
      if (id) {
        if (!dataFetched) {
          navigate('/admin-faqs');
        }
        if (dataFetched) {
          const responseUpdate = await axios.put(
            `${window.react_app_url + window.faq_url}/${id}`,
            formDataToSend
          );
          toast.success(responseUpdate.data.message, {
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
        const response = await axios.post(`${window.react_app_url + window.faq_url}`, formDataToSend);
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
      navigate('/admin-faqs');
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
          <BreadCrumb title="FAQ's / " desc={id ? 'Update FAQ' : 'Add FAQ'} link="/admin-faqs" />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mx-24 space-y-4">
          <div>
            <label htmlFor="question" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Question
            </label>
            <input
              type="text"
              id="question"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter Question"

            />
          </div>
          <div>
            <label htmlFor="answer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Answer
            </label>
            <textarea
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter Answer"
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
                navigate('/admin-faqs');
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
  )
}

export default AddUpdateFAQs
