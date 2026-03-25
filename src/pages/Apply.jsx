import { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { IoCheckmarkCircleOutline, IoCloseOutline, IoCloudUploadOutline, IoDocumentTextOutline, IoWarningOutline } from 'react-icons/io5';
import { GENDER_OPTIONS, POSITION_OPTIONS, COUNTRY_OPTIONS } from '../lib/applicationOptions';
import { submitApplication, uploadCv, checkExistingApplication } from '../lib/api';
import './Apply.css';

const initialFormState = {
  firstName: '',
  lastName: '',
  gender: '',
  age: '',
  phoneNumber: '',
  emailAddress: '',
  positionApplied: '',
  country: '',
  currentAddress: '',
};

export default function Apply() {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [searchParams] = useSearchParams();
  const preselectedPosition = searchParams.get('position') || '';

  const [formData, setFormData] = useState({
    ...initialFormState,
    positionApplied: preselectedPosition,
  });
  const [cvFile, setCvFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [restrictionReason, setRestrictionReason] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension !== 'pdf') {
        setResultMessage('CV must be a PDF file.');
        return;
      }
    }
    setCvFile(file);
    setResultMessage('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension !== 'pdf') {
        setResultMessage('CV must be a PDF file.');
        return;
      }
      setCvFile(file);
      setResultMessage('');
    }
  };

  const validateCvFile = () => {
    if (!cvFile) {
      return 'Please upload your CV (PDF only).';
    }

    const extension = cvFile.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf') {
      return 'CV must be a PDF file.';
    }

    const maxBytes = 10 * 1024 * 1024;
    if (cvFile.size > maxBytes) {
      return 'CV file size must be 10MB or less.';
    }

    return '';
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) return "First name must be at least 2 characters.";
    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) return "Last name must be at least 2 characters.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.emailAddress || !emailRegex.test(formData.emailAddress)) return "Please enter a valid email address.";

    const phoneRegex = /^[\d\s()+-]{7,20}$/;
    if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) return "Please enter a valid phone number.";

    const ageValue = Number(formData.age);
    if (!formData.age || isNaN(ageValue) || ageValue < 16 || ageValue > 80) return "Age must be a valid number.";

    if (!formData.currentAddress.trim() || formData.currentAddress.trim().length < 5) return "Please enter a more detailed current address.";

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResultMessage('');

    const formError = validateForm();
    if (formError) {
      setResultMessage(formError);
      return;
    }

    const cvError = validateCvFile();
    if (cvError) {
      setResultMessage(cvError);
      return;
    }

    try {
      setIsSubmitting(true);

      // Check for duplicate application
      const checkResult = await checkExistingApplication(formData.emailAddress);
      if (!checkResult.allowed) {
        setRestrictionReason(checkResult.reason);
        setIsSubmitting(false);
        return;
      }

      const applicantLabel = `${formData.firstName}_${formData.lastName}`.toLowerCase();
      const cvMeta = await uploadCv(cvFile, applicantLabel);

      await submitApplication({
        ...formData,
        age: Number(formData.age),
        ...cvMeta,
      });

      setResultMessage('');
      setShowModal(true);
      setFormData(initialFormState);
      setCvFile(null);
    } catch (error) {
      setResultMessage(error?.message || 'Unable to submit your application right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const getFieldError = (name, value) => {
    if (!value) return "";
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim().length > 0 && value.trim().length < 2 ? `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters.` : "";
      case 'emailAddress': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return value && !emailRegex.test(value) ? "Please enter a valid email address." : "";
      }
      case 'phoneNumber': {
        const phoneRegex = /^[\d\s()+-]{7,20}$/;
        return value && !phoneRegex.test(value) ? "Please enter a valid phone number." : "";
      }
      case 'age': {
        const ageValue = Number(value);
        return value && (isNaN(ageValue) || ageValue < 16 || ageValue > 80) ? "Age must be a valid number between 16 and 80." : "";
      }
      case 'currentAddress':
        return value.trim().length > 0 && value.trim().length < 5 ? "Please enter a more detailed current address." : "";
      default:
        return "";
    }
  };

  return (
    <main className="apply-page">
      <section className="apply-section">
        <div className="container">
          <div className="apply-header">
            <h1>Apply Now</h1>
            <p>Fill in your details and upload your CV to submit your application.</p>
          </div>

          <form className="apply-form" onSubmit={handleSubmit}>
            <div className="apply-grid">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="e.g. John" required />
                {getFieldError('firstName', formData.firstName) && <span className="text-red-500 text-xs -mt-1 font-medium">{getFieldError('firstName', formData.firstName)}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="e.g. Doe" required />
                {getFieldError('lastName', formData.lastName) && <span className="text-red-500 text-xs -mt-1 font-medium">{getFieldError('lastName', formData.lastName)}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} required>
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input id="age" name="age" type="number" min="16" max="80" value={formData.age} onChange={handleInputChange} placeholder="e.g. 25" required />
                {getFieldError('age', formData.age) && <span className="text-red-500 text-xs -mt-1 font-medium">{getFieldError('age', formData.age)}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="e.g. +63 912 345 6789" required />
                {getFieldError('phoneNumber', formData.phoneNumber) && <span className="text-red-500 text-xs -mt-1 font-medium">{getFieldError('phoneNumber', formData.phoneNumber)}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="emailAddress">Email Address</label>
                <input id="emailAddress" name="emailAddress" type="email" value={formData.emailAddress} onChange={handleInputChange} placeholder="e.g. john.doe@example.com" required />
                {getFieldError('emailAddress', formData.emailAddress) && <span className="text-red-500 text-xs -mt-1 font-medium">{getFieldError('emailAddress', formData.emailAddress)}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="positionApplied">Position Applied</label>
                <select id="positionApplied" name="positionApplied" value={formData.positionApplied} onChange={handleInputChange} required>
                  <option value="">Select position</option>
                  {POSITION_OPTIONS.map((position) => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select id="country" name="country" value={formData.country} onChange={handleInputChange} required>
                  <option value="">Select country</option>
                  {COUNTRY_OPTIONS.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="currentAddress">Current Address</label>
              <textarea
                id="currentAddress"
                name="currentAddress"
                rows="3"
                value={formData.currentAddress}
                onChange={handleInputChange}
                placeholder="e.g. 123 Main St, City, State, ZIP"
                required
              />
              {getFieldError('currentAddress', formData.currentAddress) && <span className="text-red-500 text-xs -mt-1 font-medium">{getFieldError('currentAddress', formData.currentAddress)}</span>}
            </div>

            <div className="form-group">
              <label>Upload CV</label>
              <div 
                className={`upload-zone ${isDragging ? 'dragging' : ''} ${cvFile ? 'has-file' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  style={{ display: 'none' }}
                />
                {!cvFile ? (
                  <div className="upload-content">
                    <div className="upload-icon">
                      <IoCloudUploadOutline size={36} />
                    </div>
                    <div className="upload-text">
                      <p className="main-text">Click to upload or drag and drop</p>
                      <p className="sub-text">PDF only (max. 10MB)</p>
                    </div>
                  </div>
                ) : (
                  <div className="file-selected-content">
                    <div className="file-info-header">
                      <div className="file-icon">
                        <IoDocumentTextOutline size={32} />
                      </div>
                      <div className="file-details">
                        <p className="file-name">{cvFile.name}</p>
                        <p className="file-size">{(cvFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="remove-file-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCvFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      <IoCloseOutline size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Uploading & Submitting...' : 'Submit Application'}
            </button>

            {resultMessage && !showModal && (
              <p className="apply-message error">{resultMessage}</p>
            )}
          </form>
        </div>
      </section>

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 flex flex-col items-center text-center font-sans z-10 border border-gray-100"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoCloseOutline size={24} />
              </button>

              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 mt-2">
                <IoCheckmarkCircleOutline size={48} />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Your application has been received successfully. We will review your profile and contact you by email shortly.
              </p>

              <button
                onClick={closeModal}
                className="w-full py-3.5 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                Got it, thanks!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Restriction/Duplicate Modal */}
      <AnimatePresence>
        {restrictionReason && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRestrictionReason('')}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 flex flex-col items-center text-center font-sans z-10 border border-gray-100"
            >
              <button
                onClick={() => setRestrictionReason('')}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoCloseOutline size={24} />
              </button>
  
              <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6 mt-2">
                <IoWarningOutline size={48} />
              </div>
  
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Notice</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                {restrictionReason}
              </p>
  
              <button
                onClick={() => setRestrictionReason('')}
                className="w-full py-3.5 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
