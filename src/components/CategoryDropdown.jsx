import React, { useState, useEffect, useRef } from 'react';
import { FaChevronRight, FaSearch, FaArrowLeft } from 'react-icons/fa';

const CategoryDropdown = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMainCategory, setActiveMainCategory] = useState(null);
  const [hoveredMainCategory, setHoveredMainCategory] = useState(null);
  const [mobileView, setMobileView] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const categories = {
    'IT & Networking': [
      'Database Administration',
      'DevOps Engineering',
      'Information Security',
      'Network Administration',
      'Network Security',
      'Solutions Architecture',
      'System Administration'
    ],
    'Design and Creative': [
      'Graphic Design',
      'UI/UX Design',
      'Motion Graphics'
    ],
    'Legal': [
      'Corporate Law',
      'Intellectual Property',
      'Contract Review'
    ],
    'Sales and Marketing': [
      'SEO',
      'Social Media Management',
      'Lead Generation'
    ]
  };

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setMobileView(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedMainCategory(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      const mainCategories = Object.keys(categories);
      
      if (mobileView && selectedMainCategory) {
        // Mobile drill-down navigation
        const subCategories = categories[selectedMainCategory];
        if (e.key === 'Escape') {
          setSelectedMainCategory(null);
        }
      } else {
        // Desktop navigation
        if (e.key === 'Escape') {
          setIsOpen(false);
          setActiveMainCategory(null);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const currentIndex = mainCategories.indexOf(activeMainCategory);
          const nextIndex = currentIndex < mainCategories.length - 1 ? currentIndex + 1 : 0;
          setActiveMainCategory(mainCategories[nextIndex]);
          setHoveredMainCategory(mainCategories[nextIndex]);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const currentIndex = mainCategories.indexOf(activeMainCategory);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : mainCategories.length - 1;
          setActiveMainCategory(mainCategories[prevIndex]);
          setHoveredMainCategory(mainCategories[prevIndex]);
        } else if (e.key === 'ArrowRight' && activeMainCategory) {
          e.preventDefault();
          setHoveredMainCategory(activeMainCategory);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setHoveredMainCategory(null);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeMainCategory, selectedMainCategory, mobileView]);

  // Filter categories based on search
  const getFilteredCategories = () => {
    if (!searchQuery.trim()) return categories;

    const filtered = {};
    Object.keys(categories).forEach((mainCat) => {
      const matchingSubCats = categories[mainCat].filter(subCat =>
        subCat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mainCat.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matchingSubCats.length > 0) {
        filtered[mainCat] = matchingSubCats;
      }
    });
    return filtered;
  };

  const handleSubCategorySelect = (mainCat, subCat) => {
    const fullValue = `${mainCat} > ${subCat}`;
    onChange(fullValue);
    setIsOpen(false);
    setSelectedMainCategory(null);
    setSearchQuery('');
    setActiveMainCategory(null);
    setHoveredMainCategory(null);
  };

  const handleMainCategoryClick = (mainCat) => {
    if (mobileView) {
      setSelectedMainCategory(mainCat);
    } else {
      setHoveredMainCategory(mainCat);
    }
    setActiveMainCategory(mainCat);
  };

  const filteredCategories = getFilteredCategories();
  const displayCategory = hoveredMainCategory || activeMainCategory;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Input Field */}
      <div
        ref={inputRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-escon-green transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${isOpen ? 'ring-2 ring-escon-green' : ''}`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value || 'Select a category'}
        </span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-escon-green focus:ring-0 text-sm bg-white transition-colors"
              />
            </div>
          </div>

          {/* Mobile Drill-Down View */}
          {mobileView && selectedMainCategory ? (
            <div className="max-h-80 overflow-y-auto">
              {/* Back Button */}
              <button
                onClick={() => setSelectedMainCategory(null)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-gray-700 border-b border-gray-200"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back to categories</span>
              </button>

              {/* Sub-categories */}
              {categories[selectedMainCategory].map((subCat) => (
                <button
                  key={subCat}
                  onClick={() => handleSubCategorySelect(selectedMainCategory, subCat)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  {subCat}
                </button>
              ))}
            </div>
          ) : (
            /* Desktop Two-Column View */
            <div className="flex">
              {/* Left Pane - Main Categories */}
              <div className="w-1/2 border-r border-gray-200 max-h-80 overflow-y-auto">
                {Object.keys(filteredCategories).map((mainCat) => (
                  <button
                    key={mainCat}
                    onClick={() => handleMainCategoryClick(mainCat)}
                    onMouseEnter={() => !mobileView && setHoveredMainCategory(mainCat)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      (hoveredMainCategory === mainCat || activeMainCategory === mainCat)
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{mainCat}</span>
                    <FaChevronRight className="w-3 h-3 text-gray-400" />
                  </button>
                ))}
                {Object.keys(filteredCategories).length === 0 && (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    No categories found
                  </div>
                )}
              </div>

              {/* Right Pane - Sub-categories (Desktop Only) */}
              {!mobileView && displayCategory && filteredCategories[displayCategory] && (
                <div className="w-1/2 max-h-80 overflow-y-auto bg-gray-50">
                  {filteredCategories[displayCategory].map((subCat) => (
                    <button
                      key={subCat}
                      onClick={() => handleSubCategorySelect(displayCategory, subCat)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700 transition-colors border-b border-gray-200 last:border-b-0"
                    >
                      {subCat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
