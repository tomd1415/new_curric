import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CurriculumOverview = () => {
  const [curriculumPlans, setCurriculumPlans] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [yearGroups, setYearGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedYearGroups, setSelectedYearGroups] = useState([]);
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [curriculumRes, subjectsRes, yearGroupsRes] = await Promise.all([
          axios.get('/api/curriculum/overview'),
          axios.get('/api/subjects'),
          axios.get('/api/year-groups')
        ]);
        
        setCurriculumPlans(curriculumRes.data);
        setSubjects(subjectsRes.data);
        setYearGroups(yearGroupsRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter curriculum plans based on selected subjects and year groups
  const filteredPlans = curriculumPlans.filter(plan => {
    const subjectMatch = selectedSubjects.length === 0 || selectedSubjects.includes(plan.subject);
    const yearGroupMatch = selectedYearGroups.length === 0 || selectedYearGroups.includes(plan.year_group);
    return subjectMatch && yearGroupMatch;
  });

  // Handle subject filter change
  const handleSubjectChange = (e) => {
    const subject = e.target.value;
    setSelectedSubjects(prevSelected => {
      if (e.target.checked) {
        return [...prevSelected, subject];
      } else {
        return prevSelected.filter(s => s !== subject);
      }
    });
  };

  // Handle year group filter change
  const handleYearGroupChange = (e) => {
    const yearGroup = e.target.value;
    setSelectedYearGroups(prevSelected => {
      if (e.target.checked) {
        return [...prevSelected, yearGroup];
      } else {
        return prevSelected.filter(yg => yg !== yearGroup);
      }
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Curriculum Overview</h1>
      
      <div className="flex flex-wrap gap-6 mb-6">
        <div className="w-full md:w-auto p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Filter by Subject</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {subjects.map(subject => (
              <label key={subject.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={subject.name}
                  onChange={handleSubjectChange}
                  className="rounded text-blue-600"
                />
                <span>{subject.name}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="w-full md:w-auto p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Filter by Year Group</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {yearGroups.map(yearGroup => (
              <label key={yearGroup.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={yearGroup.name}
                  onChange={handleYearGroupChange}
                  className="rounded text-blue-600"
                />
                <span>{yearGroup.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year Group</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area of Study</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPlans.length > 0 ? (
              filteredPlans.map(plan => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {plan.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {plan.year_group}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.term}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                    {plan.area_of_study}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link to={`/curriculum/detailed/${plan.id}`} className="text-blue-600 hover:underline">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No curriculum plans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurriculumOverview;
