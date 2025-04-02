import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TermDetail = () => {
  const { subject, yearGroup, term } = useParams();
  const navigate = useNavigate();
  const [termData, setTermData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTermData = async () => {
      try {
        const response = await fetch(`/api/curriculum/subject/${subject}`);
        if (!response.ok) throw new Error('Failed to fetch term data');
        
        const data = await response.json();
        const termItem = data.find(item => 
          item.year_group === yearGroup && 
          item.term === term
        );
        
        if (!termItem) {
          throw new Error('Term data not found');
        }
        
        setTermData(termItem);
      } catch (err) {
        console.error('Error fetching term data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTermData();
  }, [subject, yearGroup, term]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-700">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {term} - {subject} ({yearGroup})
        </h1>
        <button
          onClick={() => navigate('/curriculum')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Back to Overview
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Area of Study</h2>
            <p className="text-gray-600">{termData.area_of_study}</p>
          </div>

          {termData.literacy_focus && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Literacy Focus</h2>
              <p className="text-gray-600">{termData.literacy_focus}</p>
            </div>
          )}

          {termData.numeracy_focus && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Numeracy Focus</h2>
              <p className="text-gray-600">{termData.numeracy_focus}</p>
            </div>
          )}

          {termData.smsc && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">SMSC</h2>
              <p className="text-gray-600">{termData.smsc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermDetail; 