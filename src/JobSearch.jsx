import { useState, useEffect } from "react";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const searchJobs = async (query = "") => {
    setLoading(true);
    try {
      // Using the correct JobTech Links API endpoint
      const baseUrl = "https://links.api.jobtechdev.se/joblinks";
      const url = query ? `${baseUrl}?q=${encodeURIComponent(query)}` : baseUrl;

      console.log("Fetching from:", url); // Debug log

      const response = await fetch(url, {
        headers: {
          accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug log
      setJobs(data.hits || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    searchJobs(searchTerm);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for jobs..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : (
        <div className="space-y-4">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="p-4 border rounded shadow">
                <h2 className="text-xl font-semibold">{job.headline}</h2>
                {job.employer && (
                  <p className="text-gray-600">{job.employer.name}</p>
                )}
                {job.workplace_address?.municipality && (
                  <p className="text-sm text-gray-500">
                    Location: {job.workplace_address.municipality}
                  </p>
                )}
                {job.application_details?.url && (
                  <a
                    href={job.application_details.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-blue-500 hover:underline"
                  >
                    Apply Now
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No jobs found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobSearch;
