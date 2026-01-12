import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaInfoCircle, FaCheck } from 'react-icons/fa';
import { SiTether, SiCircle, SiPolygon } from 'react-icons/si';

const CreateContract = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    contractName: '',
    otherPartyEmail: '',
    escrowType: 'blockchain',
    category: '',
    subcategory: '',
    description: '',
    contractType: 'fixed',
    budget: '',
    currency: 'USD',
    splitMilestones: false,
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

  const categories = {
    'IT & Networking': ['Database Administration', 'DevOps', 'Network Security', 'Software Development', 'System Administration'],
    'Design': ['Graphic Design', 'UI/UX Design', 'Web Design', 'Brand Identity', 'Illustration'],
    'Legal': ['Contract Law', 'Corporate Law', 'Intellectual Property', 'Compliance', 'Litigation'],
    'Marketing': ['Digital Marketing', 'Content Marketing', 'SEO', 'Social Media', 'Brand Strategy'],
    'Writing': ['Content Writing', 'Copywriting', 'Technical Writing', 'Blog Writing', 'Editing']
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
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
      if (formData.contractType === 'hourly' && !formData.hourlyRate) {
        newErrors.hourlyRate = 'Hourly rate is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        // Final submission
        console.log('Contract created:', formData);
        navigate('/dashboard');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/dashboard');
    }
  };

  const calculatePayout = () => {
    const amount = formData.contractType === 'fixed' 
      ? parseFloat(formData.budget) || 0
      : parseFloat(formData.hourlyRate) * (parseFloat(formData.weeklyLimit) || 40) || 0;
    const fee = amount * 0.036;
    return {
      amount: amount,
      fee: fee,
      payout: amount - fee
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Progress Tracker */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Contract</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              Cancel
            </button>
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
      <main className="max-w-4xl mx-auto px-8 py-8">
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

              {/* Other Party's Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Party's Email *
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

              {/* Escrow Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Escrow Type *
                </label>
                <div
                  onClick={() => handleChange('escrowType', 'blockchain')}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    formData.escrowType === 'blockchain'
                      ? 'border-escon-green bg-escon-green/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Blockchain</h3>
                      <p className="text-sm text-gray-600 mb-4">Secure, transparent payments on the blockchain</p>
                      
                      {/* Token Icons */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 font-medium">Supported:</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
                            <SiTether className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-medium">USDT</span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
                            <SiCircle className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-medium">USDC</span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
                            <span className="text-xs font-medium">DAI</span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
                            <SiPolygon className="w-4 h-4 text-purple-600" />
                            <span className="text-xs font-medium">Polygon</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      formData.escrowType === 'blockchain'
                        ? 'border-escon-green'
                        : 'border-gray-300'
                    }`}>
                      {formData.escrowType === 'blockchain' && (
                        <div className="w-3.5 h-3.5 rounded-full bg-escon-green"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="mt-4 flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <FaInfoCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">No crypto?</span> You can also use bank accounts or credit/debit cards for payments.
                    </p>
                  </div>
                </div>
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
                <select
                  value={formData.category}
                  onChange={(e) => {
                    handleChange('category', e.target.value);
                    handleChange('subcategory', '');
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-escon-green ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {Object.keys(categories).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Subcategory */}
              {formData.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Role
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => handleChange('subcategory', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-escon-green"
                  >
                    <option value="">Select a specific role (optional)</option>
                    {categories[formData.category].map((subcat) => (
                      <option key={subcat} value={subcat}>{subcat}</option>
                    ))}
                  </select>
                </div>
              )}

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Fixed Price */}
                  <div
                    onClick={() => handleChange('contractType', 'fixed')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      formData.contractType === 'fixed'
                        ? 'border-escon-green bg-escon-green/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">Fixed Price</h3>
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
                    <p className="text-sm text-gray-600">
                      Ideal for one-time projects with clear deliverables
                    </p>
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
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">Hourly Rate</h3>
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
                    <p className="text-sm text-gray-600">
                      Payments are based on hours worked each week
                    </p>
                  </div>

                  {/* Retainer (Locked) */}
                  <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50 cursor-not-allowed relative">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-400">Retainer</h3>
                      <FaLock className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-400">
                      Coming soon - Premium feature
                    </p>
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
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-escon-green ${
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

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="splitMilestones"
                          checked={formData.splitMilestones}
                          onChange={(e) => handleChange('splitMilestones', e.target.checked)}
                          className="w-5 h-5 text-escon-green border-gray-300 rounded focus:ring-escon-green"
                        />
                        <label htmlFor="splitMilestones" className="ml-3 text-sm text-gray-700">
                          Split into milestones
                        </label>
                      </div>
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

                  {/* Due Date */}
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
                </div>

                {/* Right Side - Payment Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sticky top-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">You'll receive</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {formData.contractType === 'fixed' ? 'Project budget' : 'Estimated weekly'}
                        </span>
                        <span className="font-medium text-gray-900">
                          ${calculatePayout().amount.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Platform fee (3.6%)</span>
                        <span className="font-medium text-gray-900">
                          -${calculatePayout().fee.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="border-t border-gray-300 pt-3 mt-3">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-900">Your payout</span>
                          <span className="font-bold text-xl text-gray-900">
                            ${calculatePayout().payout.toFixed(2)}
                          </span>
                        </div>
                      </div>
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
            <button
              onClick={handleBack}
              className="px-6 py-3 text-gray-700 font-medium hover:text-gray-900 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-escon-green hover:bg-escon-green-hover text-black font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              {currentStep === 3 ? 'Review contract' : 'Next'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateContract;
