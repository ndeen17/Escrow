import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import RoleSelection from './components/RoleSelection';
import ClientRegistration from './components/ClientRegistration';
import AgencyRegistration from './components/AgencyRegistration';
import FreelancerRegistration from './components/FreelancerRegistration';
import Dashboard from './components/Dashboard';
import CreateContract from './components/CreateContract';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/register/client" element={<ClientRegistration />} />
          <Route path="/register/agency" element={<AgencyRegistration />} />
          <Route path="/register/freelancer" element={<FreelancerRegistration />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-contract" element={<CreateContract />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
