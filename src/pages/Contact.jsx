import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Grainient from '../components/Grainient';
import { submitContactMessage } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { IoCheckmarkCircleOutline, IoCloseOutline } from 'react-icons/io5';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const contactInfoRef = useRef([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    try {
      // Ensure all elements are visible
      if (titleRef.current) {
        titleRef.current.style.opacity = '1';
        titleRef.current.style.visibility = 'visible';
      }
      if (formRef.current) {
        formRef.current.style.opacity = '1';
        formRef.current.style.visibility = 'visible';
      }

      // Animate form
      gsap.fromTo(formRef.current,
        { opacity: 0, x: 50 },
        {
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
          },
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out'
        }
      );

      // Ensure inputs are visible
      const inputs = formRef.current?.querySelectorAll('input, textarea');
      inputs?.forEach((input) => {
        input.style.opacity = '1';
        input.style.visibility = 'visible';
      });
    } catch (error) {
      console.warn('Animation setup error:', error);
      if (formRef.current) formRef.current.style.opacity = '1';
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim() || formData.name.trim().length < 2) return "Name must be at least 2 characters.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) return "Please enter a valid email address.";

    if (!formData.subject.trim() || formData.subject.trim().length < 3) return "Subject must be at least 3 characters.";

    if (!formData.message.trim() || formData.message.trim().length < 10) return "Message must be at least 10 characters.";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const formError = validateForm();
    if (formError) {
      setSubmitError(formError);
      return;
    }

    try {
      setIsSubmitting(true);
      await submitContactMessage(formData);

      // Show success message
      setSubmitted(true);

      // Reset form after delay
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      setSubmitError(error?.message || 'Unable to send your message right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="contact">
      <AnimatePresence>
        {submitted && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSubmitted(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-8 flex flex-col items-center text-center"
            >
              <button
                onClick={() => setSubmitted(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IoCloseOutline size={24} />
              </button>
              <div className="w-20 h-20 mb-6 rounded-full bg-[#133020]/10 text-[#133020] flex items-center justify-center">
                <IoCheckmarkCircleOutline size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                We've received your message and will get back to you soon.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="w-full py-3.5 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <section className="contact-section">
        <div className="container">
          <div className="contact-card-main">
            {/* Visual Column */}
            <div className="contact-left-visual">
              <div className="grainient-container">
                <Grainient
                  color1="#ffb347"
                  color2="#ffffff"
                  color3="#133020"
                  timeSpeed={0.25}
                  colorBalance={0.15}
                  warpStrength={1}
                  warpFrequency={5}
                  warpSpeed={2}
                  warpAmplitude={50}
                  blendAngle={0}
                  blendSoftness={0.05}
                  rotationAmount={500}
                  noiseScale={2}
                  grainAmount={0}
                  grainScale={2}
                  grainAnimated={false}
                  contrast={1.4}
                  gamma={1}
                  saturation={1}
                  centerX={0}
                  centerY={0}
                  zoom={0.9}
                />
              </div>
              <div className="visual-content">
                <h2 ref={titleRef}>Let's Connect And Talk</h2>
                <p>We provide global Data Engineering Services to enable AI Solutions.</p>
              </div>
            </div>

            {/* Form Column */}
            <div className="contact-right-form" ref={formRef}>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. john@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    rows="5"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>
                {submitError && <p className="error-message">{submitError}</p>}
              </form>
            </div>
          </div>
        </div>
      </section>
    </main >
  );
}
