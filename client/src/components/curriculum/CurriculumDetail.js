import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const CurriculumDetail = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.get(`/api/curriculum/${id}`);
        setPlan(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch curriculum plan');
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  // Check if user can edit this plan
  const canEdit = () => {
    if (!isAuthenticated || !user) return false;
    
    // Admins can edit any plan
    if (user.role === 'admin') return true;
    
    // Subject leaders can only edit their assigned subjects
    if (user.role === 'subject_leader') {
      // You'd need to check if the user is the subject leader for this plan's subject
      // This would require further API calls or context setup
      return true; // Simplified for now - in a real app, check against subject_leaders table
    }
    
    return false;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!plan) {
    return <div className="text-center">Curriculum plan not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-700">{plan.subject}</h1>
          <div className="space-x-2">
            <Link to="/curriculum" className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              Back to All Plans
            </Link>
            {canEdit() && (
              <Link to={`/curriculum/edit/${plan.id}`} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Edit Plan
              </Link>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-sm">
            <p className="font-semibold text-gray-500">Year Group</p>
            <p>{plan.year_group}</p>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-500">Term</p>
            <p>{plan.term}</p>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-500">Last Updated</p>
            <p>{new Date(plan.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Area of Study</h2>
          <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.area_of_study || 'Not specified'}</div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Literacy Focus</h2>
          <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.literacy_focus || 'Not specified'}</div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Numeracy Focus</h2>
          <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.numeracy_focus || 'Not specified'}</div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">SMSC</h2>
          <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.smsc || 'Not specified'}</div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumDetail;
