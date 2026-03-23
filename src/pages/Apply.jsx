import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { IoCheckmarkCircleOutline, IoCloseOutline } from 'react-icons/io5';
import { GENDER_OPTIONS, POSITION_OPTIONS, COUNTRY_OPTIONS } from '../lib/applicationOptions';
import { submitApplication, uploadCv } from '../lib/api';
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setCvFile(file);
  };

  const validateCvFile = () => {
    if (!cvFile) {
      return 'Please upload your CV (PDF only).';
    }

    const extension = cvFile.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf') {
      return 'CV must be a PDF file.';
    }

    const maxBytes = 5 * 1024 * 1024;
    if (cvFile.size > maxBytes) {
      return 'CV file size must be 5MB or less.';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResultMessage('');

    const cvError = validateCvFile();
    if (cvError) {
      setResultMessage(cvError);
      return;
    }

    try {
      setIsSubmitting(true);

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
                <input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
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
                <input id="age" name="age" type="number" min="16" max="80" value={formData.age} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="emailAddress">Email Address</label>
                <input id="emailAddress" name="emailAddress" type="email" value={formData.emailAddress} onChange={handleInputChange} required />
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
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cvFile">Upload CV <span style={{ fontWeight: 400, color: '#64748b' }}>(PDF only, max 5MB)</span></label>
              <input id="cvFile" name="cvFile" type="file" accept=".pdf" onChange={handleFileChange} required />
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
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden p-8 flex flex-col items-center text-center font-sans z-10 border border-gray-100"
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
    </main>
  );
}
