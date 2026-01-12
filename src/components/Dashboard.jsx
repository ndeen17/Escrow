import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaPlus, FaArchive, FaBars, FaTimes } from 'react-icons/fa';
import { AiOutlineClockCircle, AiOutlineCheckCircle, AiOutlineInbox, AiOutlineWallet } from 'react-icons/ai';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('archived');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'pending', label: 'Pending', icon: AiOutlineClockCircle },
    { id: 'active', label: 'Active', icon: AiOutlineCheckCircle },
    { id: 'archived', label: 'Archived', icon: AiOutlineInbox },
    { id: 'payments', label: 'Payments', icon: AiOutlineWallet }
  ];

  const getFilterTabs = () => {
    const filters = {
      pending: [
        { id: 'all', label: 'All' },
        { id: 'new-offers', label: 'New Offers' },
        { id: 'offer-sent', label: 'Offer sent' },
        { id: 'accepted', label: 'Accepted' },
        { id: 'expired', label: 'Expired' },
        { id: 'draft', label: 'Draft' }
      ],
      active: [
        { id: 'all', label: 'All' },
        { id: 'active', label: 'Active' },
        { id: 'on-hold', label: 'On hold' },
        { id: 'disputed', label: 'Disputed' }
      ],
      archived: [
        { id: 'all', label: 'All' },
        { id: 'rejected', label: 'Rejected' },
        { id: 'completed', label: 'Completed' },
        { id: 'closed', label: 'Closed' }
      ],
      payments: [
        { id: 'all', label: 'All' },
        { id: 'pending', label: 'Pending' },
        { id: 'completed', label: 'Completed' },
        { id: 'failed', label: 'Failed' }
      ]
    };
    return filters[activeNav] || filters.archived;
  };

  const handleNavChange = (navId) => {
    setActiveNav(navId);
    setActiveFilter('all'); // Reset filter when changing navigation
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const getPageTitle = () => {
    const titles = {
      pending: 'Pending contracts (Offers)',
      active: 'Active contracts',
      archived: 'Archive contracts',
      payments: 'Payment history'
    };
    return titles[activeNav] || 'Contracts';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Global Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-end p-4 border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold">
            <span className="text-gray-900">Es</span>
            <span className="text-escon-green">con</span>
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeNav === item.id
                      ? 'bg-gray-200 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* New Contract Button */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => navigate('/create-contract')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-escon-green hover:bg-escon-green-hover text-black font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <FaPlus className="w-4 h-4" />
            <span>New contract</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button & Page Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <FaBars className="w-5 h-5" />
              </button>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900">{getPageTitle()}</h2>
            </div>

            {/* Utility Icons & User Profile */}
            <div className="flex items-center gap-3 md:gap-6">
              {/* Notification Bell */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <FaBell className="w-4 h-4 md:w-5 md:h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-escon-green rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  SJ
                </div>
                <div className="text-sm hidden sm:block">
                  <div className="font-semibold text-gray-900">Samuel J.</div>
                  <div className="text-gray-500">Freelancer</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-4 md:px-8 py-4 md:py-6">
          {/* Filter Tabs */}
          <div className="mb-4 md:mb-6 flex gap-2 md:gap-3 flex-wrap">
            {getFilterTabs().map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-sm md:text-base font-medium transition-all ${
                  activeFilter === tab.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-transparent border border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Empty State Container */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-24 flex items-center justify-center min-h-[400px] md:min-h-[500px]">
            <div className="text-center max-w-md">
              {/* Empty State Icon */}
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <FaArchive className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
              </div>

              {/* Text Content */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                No contracts yet
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">
                Get started by creating your first contract. It only takes a minute!
              </p>

              {/* CTA Button */}
              <button 
                onClick={() => navigate('/create-contract')}
                className="w-full sm:w-auto px-6 md:px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Create contract
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
