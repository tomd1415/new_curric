import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CurriculumViewer = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [yearGroups, setYearGroups] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedYearGroup, setSelectedYearGroup] = useState('');
  const [curriculumData, setCurriculumData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch subjects and year groups on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch subjects
        const subjectsResponse = await fetch('/api/subjects');
        if (!subjectsResponse.ok) throw new Error('Failed to fetch subjects');
        const subjectsData = await subjectsResponse.json();
        setSubjects(subjectsData);

        // Fetch curriculum data to extract unique year groups
        const curriculumResponse = await fetch('/api/curriculum');
        if (!curriculumResponse.ok) throw new Error('Failed to fetch curriculum data');
        const curriculumData = await curriculumResponse.json();
        const uniqueYearGroups = [...new Set(curriculumData.map(item => item.year_group))].sort();
        setYearGroups(uniqueYearGroups);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError(err.message);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch curriculum data when subject or year group changes
  useEffect(() => {
    const fetchCurriculumData = async () => {
      if (!selectedSubject || !selectedYearGroup) {
        setCurriculumData([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/curriculum/subject/${selectedSubject}`);
        if (!response.ok) throw new Error('Failed to fetch curriculum data');
        
        const data = await response.json();
        const filteredData = data.filter(item => item.year_group === selectedYearGroup);
        
        // Sort by term
        filteredData.sort((a, b) => {
          const termOrder = { 'Autumn 1': 1, 'Autumn 2': 2, 'Spring 1': 3, 'Spring 2': 4, 'Summer 1': 5, 'Summer 2': 6 };
          return termOrder[a.term] - termOrder[b.term];
        });
        
        setCurriculumData(filteredData);
      } catch (err) {
        console.error('Error fetching curriculum data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculumData();
  }, [selectedSubject, selectedYearGroup]);

  const handleTermClick = (term) => {
    navigate(`/curriculum/${selectedSubject}/${selectedYearGroup}/${term}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Curriculum Viewer</h1>
      
      {/* Selectors */}
      <div className="mb-8 flex gap-4">
        <div className="flex-1">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <select
            id="subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.name}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="yearGroup" className="block text-sm font-medium text-gray-700 mb-1">
            Year Group
          </label>
          <select
            id="yearGroup"
            value={selectedYearGroup}
            onChange={(e) => setSelectedYearGroup(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a year group</option>
            {yearGroups.map((yearGroup) => (
              <option key={yearGroup} value={yearGroup}>
                {yearGroup}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-700">Error: {error}</div>
          <div className="mt-2 text-red-600">Please make sure the backend server is running on port 5000.</div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}

      {/* Curriculum Data */}
      {!loading && !error && curriculumData.length > 0 && (
        <div className="grid gap-6">
          {curriculumData.map((item) => (
            <div 
              key={item.id} 
              className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleTermClick(item.term)}
            >
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
      )}

      {/* No Selection Message */}
      {!loading && !error && !selectedSubject && !selectedYearGroup && (
        <div className="text-center py-8 text-gray-500">
          Please select a subject and year group to view the curriculum.
        </div>
      )}

      {/* No Data Message */}
      {!loading && !error && curriculumData.length === 0 && (selectedSubject || selectedYearGroup) && (
        <div className="text-center py-8 text-gray-500">
          No curriculum data found for the selected subject and year group.
        </div>
      )}
    </div>
  );
};

export default CurriculumViewer; 