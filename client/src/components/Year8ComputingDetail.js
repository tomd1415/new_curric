import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Year8ComputingDetail = () => {
  const navigate = useNavigate();
  const [curriculumData, setCurriculumData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching curriculum data...');
        const response = await fetch('/api/curriculum/subject/computing');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          let errorMessage = 'Failed to fetch curriculum data. ';
          
          if (response.status === 404) {
            errorMessage += 'The curriculum data could not be found.';
          } else if (response.status === 500) {
            errorMessage += 'There was a server error. Please try again later.';
          } else {
            errorMessage += `Server returned status ${response.status}: ${errorText}`;
          }
          
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        const year8Data = data.filter(item => item.year_group === 'Year 8');
        console.log('Filtered Year 8 data:', year8Data);
        
        // Sort by term
        year8Data.sort((a, b) => {
          const termOrder = { 'Autumn 1': 1, 'Autumn 2': 2, 'Spring 1': 3, 'Spring 2': 4, 'Summer 1': 5, 'Summer 2': 6 };
          return termOrder[a.term] - termOrder[b.term];
        });
        
        setCurriculumData(year8Data);
      } catch (err) {
        console.error('Error fetching curriculum data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <h1 className="text-3xl font-bold">Year 8 Computing Curriculum</h1>
        <button
          onClick={() => navigate('/curriculum')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Back to Overview
        </button>
      </div>

      <div className="space-y-8">
        {curriculumData.map((term) => (
          <div key={term.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">{term.term}</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Area of Study</h3>
                <p className="text-gray-600">{term.area_of_study}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">Literacy Focus</h3>
                  <p className="text-gray-600">{term.literacy_focus}</p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">Numeracy Focus</h3>
                  <p className="text-gray-600">{term.numeracy_focus}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">SMSC (Spiritual, Moral, Social, Cultural)</h3>
                <p className="text-gray-600">{term.smsc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Year8ComputingDetail; 