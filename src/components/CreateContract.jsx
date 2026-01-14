import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FaLock, FaCheck, FaArrowLeft, FaPlus, FaTimes, FaDollarSign, FaClock } from 'react-icons/fa';
import CategoryDropdown from './CategoryDropdown';
import AuthGate from './AuthGate';

const CreateContract = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [showDraftToast, setShowDraftToast] = useState(false);
  
  // Get user role from localStorage (set during role selection)
  const userRole = localStorage.getItem('selectedRole') || 'freelancer';
  const isClient = userRole === 'client';

  const [formData, setFormData] = useState({
    contractName: '',
    otherPartyEmail: '',
    category: '',
    subcategory: '',
    description: '',
    contractType: 'fixed',
    budget: '',
    currency: 'USD',
    splitMilestones: false,
    milestones: [],
    hourlyRate: '',
    weeklyLimit: '',
    noLimit: false,
    dueDate: ''
  });

  const steps = [
    { id: 1, label: 'Set Up' },
    { id: 2, label: 'Description' },
    { id: 3, label: 'Budget & Terms' }
  ];

  // Restore draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('contractDraft');
    if (draft) {
      try {
        const { data, timestamp, step } = JSON.parse(draft);
        const age = Date.now() - timestamp;
        
        // Draft expires after 48 hours
        if (age < 48 * 60 * 60 * 1000) {
          setFormData(data);
          setCurrentStep(step || 1);
          setShowDraftToast(true);
          setTimeout(() => setShowDraftToast(false), 5000);
        } else {
          localStorage.removeItem('contractDraft');
        }
      } catch (error) {
        console.error('Error restoring draft:', error);
      }
    }
  }, []);

  // Save draft whenever form data or step changes
  useEffect(() => {
    if (formData.contractName || formData.otherPartyEmail) {
      const draft = {
        data: formData,
        step: currentStep,
        timestamp: Date.now()
      };
      localStorage.setItem('contractDraft', JSON.stringify(draft));
    }
  }, [formData, currentStep]);

  const handleChange = (field, value) => {
    // Handle splitMilestones toggle
    if (field === 'splitMilestones' && value === true && formData.milestones.length === 0) {
      // Auto-create first milestone when toggled on
      setFormData({ 
        ...formData, 
        [field]: value,
        milestones: [{ name: '', budget: '', dueDate: '' }]
      });
    } else if (field === 'splitMilestones' && value === false) {
      // Clear milestones when toggled off
      setFormData({ ...formData, [field]: value, milestones: [] });
    } else {
      setFormData({ ...formData, [field]: value });
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const addMilestone = () => {
    if (formData.milestones.length < 10) {
      setFormData({
        ...formData,
        milestones: [...formData.milestones, { name: '', budget: '', dueDate: '' }]
      });
    }
  };

  const removeMilestone = (index) => {
    const newMilestones = formData.milestones.filter((_, i) => i !== index);
    setFormData({ ...formData, milestones: newMilestones });
  };

  const updateMilestone = (index, field, value) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setFormData({ ...formData, milestones: newMilestones });
    
    // Clear milestone budget error when editing
    if (errors.milestoneBudgetMismatch) {
      setErrors({ ...errors, milestoneBudgetMismatch: '' });
    }
  };

  const calculateMilestoneTotal = () => {
    return formData.milestones.reduce((sum, milestone) => {
      return sum + (parseFloat(milestone.budget) || 0);
    }, 0);
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.contractName.trim()) {
        newErrors.contractName = 'Contract name is required';
      }
      if (!formData.otherPartyEmail.trim()) {
        newErrors.otherPartyEmail = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.otherPartyEmail)) {
        newErrors.otherPartyEmail = 'Please enter a valid email address';
      }
    }

    if (step === 2) {
      if (!formData.category) {
        newErrors.category = 'Please select a category';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Please describe what needs to be done';
      }
    }

    if (step === 3) {
      if (formData.contractType === 'fixed' && !formData.budget) {
        newErrors.budget = 'Budget is required';
      }
      if (formData.contractType === 'fixed' && formData.splitMilestones) {
        // Validate milestones
        if (formData.milestones.length === 0) {
          newErrors.milestones = 'Please add at least one milestone';
        } else {
          // Check if all milestones have names and budgets
          const incompleteMilestones = formData.milestones.some(m => !m.name || !m.budget);
          if (incompleteMilestones) {
            newErrors.milestones = 'All milestones must have a name and budget';
          }
          
          // Check if milestone budgets sum matches total budget
          const milestoneTotal = calculateMilestoneTotal();
          const totalBudget = parseFloat(formData.budget) || 0;
          if (Math.abs(milestoneTotal - totalBudget) > 0.01) {
            newErrors.milestoneBudgetMismatch = `Milestone budgets ($${milestoneTotal.toFixed(2)}) must equal total budget ($${totalBudget.toFixed(2)})`;
          }
        }
      }
      if (formData.contractType === 'hourly' && !formData.hourlyRate) {
        newErrors.hourlyRate = 'Hourly rate is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        // Final submission - check authentication
        if (isAuthenticated) {
          // User is already authenticated, submit directly
          await handleSubmitContract();
        } else {
          // Show auth gate for unauthenticated users
          setShowAuthGate(true);
        }
      }
    }
  };

  const handleSubmitContract = async () => {
    try {
      const token = await getAccessTokenSilently();
      
      const response = await fetch('http://localhost:5000/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contractName: formData.contractName,
          contributorEmail: formData.otherPartyEmail,
          category: formData.category,
          description: formData.description,
          contractType: formData.contractType,
          budget: formData.contractType === 'fixed' ? parseFloat(formData.budget) : undefined,
          hourlyRate: formData.contractType === 'hourly' ? parseFloat(formData.hourlyRate) : undefined,
          weeklyLimit: formData.contractType === 'hourly' && !formData.noLimit ? parseFloat(formData.weeklyLimit) : undefined,
          currency: formData.currency,
          splitMilestones: formData.splitMilestones,
          milestones: formData.splitMilestones ? formData.milestones : undefined,
          dueDate: formData.dueDate || undefined,
          status: 'draft'
        })
      });

      if (response.ok) {
        // Clear draft and navigate to dashboard
        localStorage.removeItem('contractDraft');
        navigate('/dashboard');
      } else {
        const error = await response.json();
        alert('Error creating contract: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Contract submission error:', error);
      alert('Error creating contract. Please try again.');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  const handleSaveDraft = () => {
    const draft = {
      data: formData,
      step: currentStep,
      timestamp: Date.now()
    };
    localStorage.setItem('contractDraft', JSON.stringify(draft));
    alert('Draft saved! You can come back and continue later.');
  };

  const calculatePayout = () => {
    let amount = 0;
    
    if (formData.contractType === 'fixed') {
      // Use milestone total if milestones are enabled, otherwise use budget
      amount = formData.splitMilestones && formData.milestones.length > 0
        ? calculateMilestoneTotal()
        : parseFloat(formData.budget) || 0;
    } else if (formData.contractType === 'hourly') {
      amount = parseFloat(formData.hourlyRate) * (parseFloat(formData.weeklyLimit) || 40) || 0;
    }
    
    const fee = amount * 0.036;
    return {
      amount: amount,
      fee: fee,
      payout: amount - fee
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Draft Restored Toast */}
      {showDraftToast && (
        <div className="fixed top-4 right-4 bg-escon-green text-black px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <FaCheck />
          <span className="font-medium">Draft restored! Continue where you left off.</span>
        </div>
      )}

      {/* Auth Gate Modal */}
      <AuthGate 
        isOpen={showAuthGate}
        onClose={() => setShowAuthGate(false)}
        contractData={formData}
      />

      {/* Header with Progress Tracker */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6 mb-6">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            
            {/* Logo */}
            <div>
              <h1 className="text-3xl font-bold">
                <span className="text-gray-900">Es</span>
                <span className="text-escon-green">con</span>
              </h1>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center z-10 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep > step.id 
                      ? 'bg-escon-green text-black'
                      : currentStep === step.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.id ? <FaCheck /> : step.id}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-4 -mt-8 transition-all ${
                    currentStep > step.id ? 'bg-escon-green' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Step Description */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {currentStep === 1 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Set up project</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Define the basic details and enter the other party's email — we'll send them an invite to collaborate.
                  </p>
                </div>
              )}
              {currentStep === 2 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Add description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Describe what needs to be done and select the relevant category for your project.
                  </p>
                </div>
              )}
              {currentStep === 3 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Budget & Terms</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Set your budget, payment terms, and timeline. You can split the project into milestones for better tracking.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Form Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
          {/* Step 1: Set Up Project */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Set Up Project</h2>
              </div>

              {/* Contract Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={70}
                    value={formData.contractName}
                    onChange={(e) => handleChange('contractName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-escon-green ${
                      errors.contractName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Website Redesign Project"
                  />
                  <span className="absolute right-4 top-3 text-sm text-gray-500">
                    {formData.contractName.length} / 70
                  </span>
                </div>
                {errors.contractName && (
                  <p className="mt-1 text-sm text-red-600">{errors.contractName}</p>
                )}
              </div>

              {/* Contributor's Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contributor's Email *
                </label>
                <input
                  type="email"
                  value={formData.otherPartyEmail}
                  onChange={(e) => handleChange('otherPartyEmail', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-escon-green ${
                    errors.otherPartyEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="client@example.com"
                />
                {errors.otherPartyEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.otherPartyEmail}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Outline Your Project */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Outline Your Project</h2>
              </div>

              {/* Contract Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Category *
                </label>
                <CategoryDropdown
                  value={formData.category}
                  onChange={(value) => handleChange('category', value)}
                  error={errors.category}
                />
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What needs to be done? *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={8}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-escon-green ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your expectations and deliverables in detail..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Specify Services and Budget */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Specify Services and Budget</h2>
              </div>

              {/* Contract Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Contract Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fixed Price */}
                  <div
                    onClick={() => handleChange('contractType', 'fixed')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      formData.contractType === 'fixed'
                        ? 'border-escon-green bg-escon-green/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        formData.contractType === 'fixed' ? 'bg-escon-green/10' : 'bg-gray-100'
                      }`}>
                        <FaDollarSign className={`w-5 h-5 ${
                          formData.contractType === 'fixed' ? 'text-escon-green' : 'text-gray-600'
                        }`} />
                      </div>
                      <h3 className="font-semibold text-gray-900">Fixed Price</h3>
                    </div>
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-600 flex-1">
                        Ideal for one-time projects with clear deliverables
                      </p>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.contractType === 'fixed'
                          ? 'border-escon-green'
                          : 'border-gray-300'
                      }`}>
                        {formData.contractType === 'fixed' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-escon-green"></div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hourly Rate */}
                  <div
                    onClick={() => handleChange('contractType', 'hourly')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      formData.contractType === 'hourly'
                        ? 'border-escon-green bg-escon-green/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        formData.contractType === 'hourly' ? 'bg-escon-green/10' : 'bg-gray-100'
                      }`}>
                        <FaClock className={`w-5 h-5 ${
                          formData.contractType === 'hourly' ? 'text-escon-green' : 'text-gray-600'
                        }`} />
                      </div>
                      <h3 className="font-semibold text-gray-900">Hourly Rate</h3>
                    </div>
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-600 flex-1">
                        Payments are based on hours worked each week
                      </p>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.contractType === 'hourly'
                          ? 'border-escon-green'
                          : 'border-gray-300'
                      }`}>
                        {formData.contractType === 'hourly' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-escon-green"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side - Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Fixed Price Fields */}
                  {formData.contractType === 'fixed' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Budget *
                          </label>
                          <input
                            type="number"
                            value={formData.budget}
                            onChange={(e) => handleChange('budget', e.target.value)}
                            disabled={formData.splitMilestones}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-escon-green disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 ${
                              errors.budget ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                          />
                          {errors.budget && (
                            <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Currency
                          </label>
                          <select
                            value={formData.currency}
                            onChange={(e) => handleChange('currency', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-escon-green"
                          >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="USDT">USDT</option>
                            <option value="USDC">USDC</option>
                          </select>
                        </div>
                      </div>

                      {/* Split into Milestones Toggle */}
                      <div className="flex items-center justify-between pt-2 pb-2">
                        <label htmlFor="splitMilestones" className="text-sm font-medium text-gray-700">
                          Split into milestones
                        </label>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={formData.splitMilestones}
                          onClick={() => handleChange('splitMilestones', !formData.splitMilestones)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-escon-green focus:ring-offset-2 ${
                            formData.splitMilestones ? 'bg-escon-green' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              formData.splitMilestones ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Milestone List */}
                      {formData.splitMilestones && (
                        <div className="mt-6 space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-gray-900">Milestones</h4>
                            <span className="text-xs text-gray-500">
                              {formData.milestones.length}/10 milestones
                            </span>
                          </div>

                          {/* Milestone Header Row */}
                          <div className="grid grid-cols-12 gap-3 px-3 text-xs font-medium text-gray-600">
                            <div className="col-span-1">#</div>
                            <div className="col-span-4">Milestone Name</div>
                            <div className="col-span-2">Budget</div>
                            <div className="col-span-4">Due Date</div>
                            <div className="col-span-1"></div>
                          </div>

                          {/* Milestone Rows */}
                          {formData.milestones.map((milestone, index) => (
                            <div key={index} className="grid grid-cols-12 gap-3 items-center">
                              {/* Index Number */}
                              <div className="col-span-1">
                                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                  {index + 1}
                                </div>
                              </div>

                              {/* Milestone Name */}
                              <div className="col-span-4">
                                <input
                                  type="text"
                                  value={milestone.name}
                                  onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                                  placeholder="e.g., Initial Design Phase"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-escon-green text-sm"
                                />
                              </div>

                              {/* Budget */}
                              <div className="col-span-2">
                                <input
                                  type="number"
                                  value={milestone.budget}
                                  onChange={(e) => updateMilestone(index, 'budget', e.target.value)}
                                  placeholder="0.00"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-escon-green text-sm"
                                />
                              </div>

                              {/* Due Date */}
                              <div className="col-span-4">
                                <input
                                  type="date"
                                  value={milestone.dueDate}
                                  onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-escon-green text-sm bg-white hover:border-gray-400 transition-colors cursor-pointer"
                                />
                              </div>

                              {/* Remove Button */}
                              <div className="col-span-1 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => removeMilestone(index)}
                                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                  disabled={formData.milestones.length === 1}
                                >
                                  <FaTimes size={16} />
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* Add Milestone Button */}
                          {formData.milestones.length < 10 && (
                            <button
                              type="button"
                              onClick={addMilestone}
                              className="flex items-center gap-2 text-escon-green hover:text-escon-green-hover font-medium text-sm transition-colors mt-2"
                            >
                              <FaPlus size={12} />
                              <span>Add milestone</span>
                            </button>
                          )}

                          {errors.milestones && (
                            <p className="text-sm text-red-600 mt-2">{errors.milestones}</p>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* Hourly Rate Fields */}
                  {formData.contractType === 'hourly' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rate per hour *
                        </label>
                        <div className="flex gap-4">
                          <input
                            type="number"
                            value={formData.hourlyRate}
                            onChange={(e) => handleChange('hourlyRate', e.target.value)}
                            className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-escon-green ${
                              errors.hourlyRate ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                          />
                          <select
                            value={formData.currency}
                            onChange={(e) => handleChange('currency', e.target.value)}
                            className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-escon-green"
                          >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                          </select>
                        </div>
                        {errors.hourlyRate && (
                          <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weekly limit (hours)
                        </label>
                        <input
                          type="number"
                          value={formData.weeklyLimit}
                          onChange={(e) => handleChange('weeklyLimit', e.target.value)}
                          disabled={formData.noLimit}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-escon-green disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="40"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="noLimit"
                          checked={formData.noLimit}
                          onChange={(e) => handleChange('noLimit', e.target.checked)}
                          className="w-5 h-5 text-escon-green border-gray-300 rounded focus:ring-escon-green"
                        />
                        <label htmlFor="noLimit" className="ml-3 text-sm text-gray-700">
                          No limit needed
                        </label>
                      </div>
                    </>
                  )}

                  {/* Due Date - Only show when milestones are NOT enabled for fixed contracts, or always for hourly */}
                  {(formData.contractType === 'hourly' || !formData.splitMilestones) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleChange('dueDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-escon-green"
                      />
                    </div>
                  )}
                </div>

                {/* Right Side - Payment Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sticky top-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {isClient ? "You'll pay" : "You'll receive"}
                    </h3>
                    
                    <div className="space-y-3">
                      {formData.contractType === 'hourly' ? (
                        <>
                          {/* Hourly Rate Display */}
                          <div className="text-center py-4">
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                              ${isClient 
                                ? (parseFloat(formData.hourlyRate || 0) + (parseFloat(formData.hourlyRate || 0) * 0.036)).toFixed(2)
                                : (parseFloat(formData.hourlyRate || 0) - (parseFloat(formData.hourlyRate || 0) * 0.036)).toFixed(2)
                              } <span className="text-lg text-gray-600">USD/hr</span>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-300 pt-3">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">Hourly rate</span>
                              <span className="font-medium text-gray-900">
                                ${parseFloat(formData.hourlyRate || 0).toFixed(2)} USD/hr
                              </span>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Platform fee 3.6%</span>
                              <span className="font-medium text-gray-900">
                                {isClient ? '+' : '-'}${(parseFloat(formData.hourlyRate || 0) * 0.036).toFixed(2)} USD/hr
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Fixed Price Display */}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Project budget</span>
                            <span className="font-medium text-gray-900">
                              ${calculatePayout().amount.toFixed(2)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Platform fee (3.6%)</span>
                            <span className="font-medium text-gray-900">
                              {isClient ? '+' : '-'}${calculatePayout().fee.toFixed(2)}
                            </span>
                          </div>
                          
                          <div className="border-t border-gray-300 pt-3 mt-3">
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-900">
                                {isClient ? 'Total cost' : 'Your payout'}
                              </span>
                              <span className="font-bold text-xl text-gray-900">
                                ${isClient ? (calculatePayout().amount + calculatePayout().fee).toFixed(2) : calculatePayout().payout.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-900">
                        Final amount may vary based on payment method and currency conversion rates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="px-6 py-3 text-gray-700 font-medium hover:text-gray-900 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSaveDraft}
                className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Save Draft
              </button>
            </div>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-escon-green hover:bg-escon-green-hover text-black font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              {currentStep === 3 ? 'Submit Contract' : 'Next'}
            </button>
          </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateContract;
