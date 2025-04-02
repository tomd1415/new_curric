import React, { useState, useEffect } from 'react';

const ComputingYear8 = () => {
  const [curriculumData, setCurriculumData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const response = await fetch('/api/curriculum/subject/Computing');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('Raw response:', text);
        
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('JSON parse error:', e);
          throw new Error(`Failed to parse JSON: ${e.message}`);
        }
        
        console.log('Parsed data:', data);
        
        // Filter for Year 8 data only
        const year8Data = data.filter(item => item.year_group === 'Year 8');
        console.log('Year 8 data:', year8Data);
        
        // Sort by term
        year8Data.sort((a, b) => {
          const termOrder = { 'Autumn 1': 1, 'Autumn 2': 2, 'Spring 1': 3, 'Spring 2': 4, 'Summer 1': 5, 'Summer 2': 6 };
          return termOrder[a.term] - termOrder[b.term];
        });
        
        setCurriculumData(year8Data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return (
    <div className="p-4">
      <div className="text-red-500">Error: {error}</div>
      <div className="mt-2 text-gray-600">Please make sure the backend server is running on port 5000.</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Year 8 Computing Curriculum</h1>
      <div className="grid gap-6">
        {curriculumData.map((item) => (
          <div key={item.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{item.term}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700">Area of Study</h3>
                <p className="mt-1 text-gray-600">{item.area_of_study}</p>
              </div>
              {item.literacy_focus && (
                <div>
                  <h3 className="text-lg font-medium text-gray-700">Literacy Focus</h3>
                  <p className="mt-1 text-gray-600">{item.literacy_focus}</p>
                </div>
              )}
              {item.numeracy_focus && (
                <div>
                  <h3 className="text-lg font-medium text-gray-700">Numeracy Focus</h3>
                  <p className="mt-1 text-gray-600">{item.numeracy_focus}</p>
                </div>
              )}
              {item.smsc && (
                <div>
                  <h3 className="text-lg font-medium text-gray-700">SMSC</h3>
                  <p className="mt-1 text-gray-600">{item.smsc}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComputingYear8; 