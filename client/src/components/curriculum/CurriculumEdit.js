import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const CurriculumEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    area_of_study: '',
    literacy_focus: '',
    numeracy_focus: '',
    smsc: ''
  });
  
  const [planInfo, setPlanInfo] = useState({
    subject: '',
    year_group: '',
    term: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.get(`/api/curriculum/${id}`);
        const { area_of_study, literacy_focus, numeracy_focus, smsc, subject, year_group, term } = res.data;
        
        setFormData({
          area_of_study: area_of_study || '',
          literacy_focus: literacy_focus || '',
          numeracy_focus: numeracy_focus || '',
          smsc: smsc || ''
        });
        
        setPlanInfo({
          subject,
          year_group,
          term
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch curriculum plan');
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`/api/curriculum/${id}`, formData);
      setSaveStatus('success');
      
      // Automatically navigate back after successful save
      setTimeout(() => {
        navigate(`/curriculum/${id}`);
      }, 2000);
    } catch (err) {
      setSaveStatus('error');
      setError(err.response?.data?.message || 'Failed to update curriculum plan');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error && !saveStatus) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Edit Curriculum Plan</h1>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-sm">
            <p className="font-semibold text-gray-500">Subject</p>
            <p>{planInfo.subject}</p>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-500">Year Group</p>
            <p>{planInfo.year_group}</p>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-500">Term</p>
            <p>{planInfo.term}</p>
          </div>
        </div>
      </div>

      {saveStatus === 'success' && (
        <div className="bg-green-100 text-green-700 p-4 mb-4">
          Curriculum plan updated successfully! Redirecting...
        </div>
      )}
      
      {saveStatus === 'error' && (
        <div className="bg-red-100 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Area of Study
          </label>
          <textarea
            name="area_of_study"
            value={formData.area_of_study}
            onChange={handleChange}
            rows="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Literacy Focus
          </label>
          <textarea
            name="literacy_focus"
            value={formData.literacy_focus}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Numeracy Focus
          </label>
          <textarea
            name="numeracy_focus"
            value={formData.numeracy_focus}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SMSC
          </label>
          <textarea
            name="smsc"
            value={formData.smsc}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(`/curriculum/${id}`)}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default CurriculumEdit;
