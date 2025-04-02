import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const CurriculumDetailed = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.get(`/api/curriculum/detailed/${id}`);
        setPlan(res.data);
        setFormData(res.data);
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
      return true; // Simplified for now
    }
    
    return false;
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/curriculum/${id}`, formData);
      setPlan(formData);
      setEditing(false);
    } catch (err) {
      setError('Failed to update curriculum plan');
    }
  };

  const handleCancel = () => {
    setFormData(plan);
    setEditing(false);
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
          <h1 className="text-2xl font-bold text-blue-700">{plan.subject} - {plan.year_group}</h1>
          <div className="space-x-2">
            <Link to="/curriculum/overview" className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              Back to Overview
            </Link>
            {canEdit() && !editing && (
              <button 
                onClick={handleEdit}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit Plan
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
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

      {editing ? (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area of Study
            </label>
            <textarea
              name="area_of_study"
              value={formData.area_of_study || ''}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Literacy Focus
              </label>
              <textarea
                name="literacy_focus"
                value={formData.literacy_focus || ''}
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
                value={formData.numeracy_focus || ''}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SMSC
            </label>
            <textarea
              name="smsc"
              value={formData.smsc || ''}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <h2 className="text-lg font-semibold text-gray-700 pt-4">Knowledge and Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autumn 1
              </label>
              <textarea
                name="knowledge_skills_au1"
                value={formData.knowledge_skills_au1 || ''}
                onChange={handleChange}
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autumn 2
              </label>
              <textarea
                name="knowledge_skills_au2"
                value={formData.knowledge_skills_au2 || ''}
                onChange={handleChange}
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Spring 1
              </label>
              <textarea
                name="knowledge_skills_sp1"
                value={formData.knowledge_skills_sp1 || ''}
                onChange={handleChange}
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Spring 2
              </label>
              <textarea
                name="knowledge_skills_sp2"
                value={formData.knowledge_skills_sp2 || ''}
                onChange={handleChange}
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Summer 1
              </label>
              <textarea
                name="knowledge_skills_su1"
                value={formData.knowledge_skills_su1 || ''}
                onChange={handleChange}
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Summer 2
              </label>
              <textarea
                name="knowledge_skills_su2"
                value={formData.knowledge_skills_su2 || ''}
                onChange={handleChange}
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Additional fields like assessments, etc. would go here */}
 // Continue from where it left off, completing the button group at the bottom of the form
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
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
      ) : (
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Area of Study</h2>
            <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.area_of_study || 'Not specified'}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Literacy Focus</h2>
              <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.literacy_focus || 'Not specified'}</div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Numeracy Focus</h2>
              <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.numeracy_focus || 'Not specified'}</div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">SMSC</h2>
            <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.smsc || 'Not specified'}</div>
          </div>

          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2">Knowledge and Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-2">Autumn 1</h3>
              <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.knowledge_skills_au1 || 'Not specified'}</div>
            </div>
            
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-2">Autumn 2</h3>
              <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.knowledge_skills_au2 || 'Not specified'}</div>
            </div>
            
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-2">Spring 1</h3>
              <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.knowledge_skills_sp1 || 'Not specified'}</div>
            </div>
            
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-2">Spring 2</h3>
              <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.knowledge_skills_sp2 || 'Not specified'}</div>
            </div>
            
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-2">Summer 1</h3>
              <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.knowledge_skills_su1 || 'Not specified'}</div>
            </div>
            
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-2">Summer 2</h3>
              <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.knowledge_skills_su2 || 'Not specified'}</div>
            </div>
          </div>

          {/* Assessments section */}
          {(plan.key_assessments_au1 || plan.key_assessments_au2 || plan.key_assessments_sp1 || 
            plan.key_assessments_sp2 || plan.key_assessments_su1 || plan.key_assessments_su2) && (
            <>
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2">Key Assessments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {plan.key_assessments_au1 && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Autumn 1</h3>
                    <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.key_assessments_au1}</div>
                  </div>
                )}
                
                {plan.key_assessments_au2 && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Autumn 2</h3>
                    <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.key_assessments_au2}</div>
                  </div>
                )}
                
                {plan.key_assessments_sp1 && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Spring 1</h3>
                    <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.key_assessments_sp1}</div>
                  </div>
                )}
                
                {plan.key_assessments_sp2 && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Spring 2</h3>
                    <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.key_assessments_sp2}</div>
                  </div>
                )}
                
                {plan.key_assessments_su1 && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Summer 1</h3>
                    <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.key_assessments_su1}</div>
                  </div>
                )}
                
                {plan.key_assessments_su2 && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Summer 2</h3>
                    <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.key_assessments_su2}</div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Additional information sections */}
          {plan.help_at_home && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">How You Can Help Your Child at Home</h2>
              <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.help_at_home}</div>
            </div>
          )}

          {plan.wider_skills && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Wider Skills</h2>
              <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">{plan.wider_skills}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CurriculumDetailed;         
