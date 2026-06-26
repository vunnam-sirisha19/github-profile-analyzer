import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import axios from 'axios';
import './App.css';
const COLORS = ['#58a6ff', '#3fb950', '#f78166', '#d2a8ff', '#ffa657', '#79c0ff', '#ff7b72'];
function App() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/profile/${username}/`);
      setData(res.data);
    } catch (err) {
      setError('User not found. Please check the username and try again.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
    <h1>GitHub Profile Analyzer</h1>

    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>

    {loading && <p>Loading...</p>}
    {error && <p className="error-message">{error}</p>}

   {data && (
  <div className="profile-card">
    <img src={data.profile.avatar} alt="avatar" />
    <h2>{data.profile.name}</h2>
    <p className="bio">{data.profile.bio}</p>

    <div className="stats">
      <div className="stat-item">
        <div className="number">{data.profile.followers}</div>
        <div className="label">Followers</div>
      </div>
      <div className="stat-item">
        <div className="number">{data.profile.public_repos}</div>
        <div className="label">Repos</div>
      </div>
    </div>

    {data.languages && Object.keys(data.languages).length > 0 && (
      <div className="chart-section">
        <h3>Languages Used</h3>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <PieChart width={280} height={280}>
            <Pie
              data={Object.entries(data.languages).map(([name, value]) => ({ name, value }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={false}
            >
              {Object.entries(data.languages).map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    )}

    {data.top_repos && data.top_repos.length > 0 && (
      <div className="repos-section">
        <h3>Top Repositories</h3>
        <ul className="repo-list">
          {data.top_repos.map((repo, index) => (
            <li key={index} className="repo-item">
              <a href={repo.url} target="_blank" rel="noreferrer">
                {repo.name}
              </a>
              <span className="repo-stars">⭐ {repo.stars}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}
  </div>
  );
}

export default App;