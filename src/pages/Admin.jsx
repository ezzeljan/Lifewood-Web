import { useEffect, useMemo, useState } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { IoMenuOutline, IoCloseOutline, IoGridOutline, IoDocumentTextOutline, IoChatbubbleEllipsesOutline, IoChevronBackOutline, IoChevronForwardOutline, IoLogOutOutline, IoWarningOutline, IoMailOutline, IoLockClosedOutline, IoTimeOutline, IoPersonOutline, IoCheckmarkCircleOutline, IoSearchOutline, IoCalendarOutline, IoTrashOutline, IoChevronDownOutline, IoFilterOutline, IoNotificationsOutline, IoStarOutline, IoArchiveOutline, IoArrowBackOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'motion/react';
import emailjs from '@emailjs/browser';
import logo from '../assets/logo.png';
import icon from '../assets/icon.png';
import Grainient from '../components/Grainient';
import './Admin.css';

function StatusBadge({ status }) {
  return <span className={`status-badge ${status || 'pending'}`}>{status || 'pending'}</span>;
}

function CalendarWidget({ applications, messages }) {
  const [date, setDate] = useState(new Date());

  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Adjusted for Monday start

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const handlePrevMonth = () => setDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setDate(new Date(currentYear, currentMonth + 1, 1));

  const today = new Date();

  return (
    <div className="admin-card w-full !m-0 flex flex-col shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 !mb-0">{monthNames[currentMonth]} {currentYear}</h3>
        <div className="flex gap-1">
          <button onClick={handlePrevMonth} className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"><IoChevronBackOutline size={18} /></button>
          <button onClick={handleNextMonth} className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"><IoChevronForwardOutline size={18} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {dayNames.map(day => <div key={day} className="text-[11px] tracking-wider font-semibold text-gray-400 py-1">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

          let appCount = 0;
          let msgCount = 0;
          const matchDate = (timestamp) => {
            if (!timestamp) return false;
            let dateObj;
            if (timestamp.toDate) {
              dateObj = timestamp.toDate();
            } else if (timestamp instanceof Date) {
              dateObj = timestamp;
            } else if (typeof timestamp === 'number' || typeof timestamp === 'string') {
              dateObj = new Date(timestamp);
            } else {
              return false;
            }
            return dateObj.getDate() === day && dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear;
          };

          (applications || []).forEach(app => {
            if (matchDate(app.createdAt)) appCount++;
          });

          (messages || []).forEach(msg => {
            if (matchDate(msg.createdAt)) msgCount++;
          });

          const activityCount = appCount + msgCount;

          return (
            <div key={day} className={`group aspect-square relative flex items-center justify-center text-sm font-medium transition-all cursor-pointer ${isToday ? 'bg-[#FFB347] text-black hover:bg-[#FFB347]/90 shadow-md rounded-full' : 'text-gray-700 hover:text-black hover:bg-gray-100 rounded-2xl'}`}>
              <span className="z-10">{day}</span>
              {activityCount > 0 && (
                <>
                  <span className={`absolute bottom-1 right-1 flex items-center justify-center w-[14px] h-[14px] text-[9px] font-bold rounded-full z-10 ${isToday ? 'bg-white text-black' : 'bg-red-500 text-white'}`}>
                    {activityCount > 9 ? '9+' : activityCount}
                  </span>

                  {/* Tooltip Hover Box */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                    <div className="font-semibold mb-2 text-gray-300 border-b border-gray-700 pb-1">{monthNames[currentMonth]} {day}, {currentYear}</div>
                    <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
                      {appCount > 0 && (
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-green-400"></span>
                          <span className="truncate">{appCount} Application{appCount !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {msgCount > 0 && (
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-blue-400"></span>
                          <span className="truncate">{msgCount} Message{msgCount !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                    {/* Tooltip Triangle */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 border-r border-b border-gray-700 pointer-events-none"></div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActivityChart({ applications, messages }) {
  const chartData = useMemo(() => {
    const days = [];
    const now = new Date();
    const currentDay = now.getDay(); // 0 (Sun) to 6 (Sat)
    const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;

    const monday = new Date(now);
    monday.setDate(now.getDate() - daysSinceMonday);
    monday.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push({
        date: d,
        label: d.toLocaleDateString(undefined, { weekday: 'long' }),
        apps: 0,
        msgs: 0
      });
    }

    const matchDate = (timestamp, targetDate) => {
      if (!timestamp) return false;
      let dateObj;
      if (timestamp.toDate) dateObj = timestamp.toDate();
      else if (timestamp instanceof Date) dateObj = timestamp;
      else if (typeof timestamp === 'number' || typeof timestamp === 'string') dateObj = new Date(timestamp);
      else return false;

      return dateObj.getDate() === targetDate.getDate() &&
        dateObj.getMonth() === targetDate.getMonth() &&
        dateObj.getFullYear() === targetDate.getFullYear();
    };

    (applications || []).forEach(app => {
      const day = days.find(d => matchDate(app.createdAt, d.date));
      if (day) day.apps++;
    });

    (messages || []).forEach(msg => {
      const day = days.find(d => matchDate(msg.createdAt, d.date));
      if (day) day.msgs++;
    });

    return days;
  }, [applications, messages]);

  const maxVal = Math.max(...chartData.map(d => d.apps + d.msgs), 5); // Minimum 5 for scale

  return (
    <div className="admin-card w-full !m-0 flex flex-col shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800 !mb-0">Weekly Activity</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#133020]"></span>
            <span className="text-[10px] font-semibold text-gray-500 tracking-wider">Apps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb347]"></span>
            <span className="text-[10px] font-semibold text-gray-500 tracking-wider">Messages</span>
          </div>
        </div>
      </div>

      <div className="relative h-48 w-full flex items-end justify-between gap-2 px-1">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full border-t border-gray-50 h-0"></div>
          ))}
        </div>

        {chartData.map((day, idx) => {
          const appHeight = (day.apps / maxVal) * 100;
          const msgHeight = (day.msgs / maxVal) * 100;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative z-10 w-full px-0.5">
              <div className="w-full flex justify-center gap-0.5 sm:gap-1 items-end h-32">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${appHeight}%` }}
                  className="w-1/2 max-w-[24px] bg-[#133020] rounded-t-xl"
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${msgHeight}%` }}
                  className="w-1/2 max-w-[24px] bg-[#ffb347] rounded-t-xl"
                />
              </div>
              <span className="text-[10px] font-bold text-gray-400">{day.label.slice(0, 3)}</span>

              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gray-900 text-white text-[10px] py-2 px-3 rounded-lg shadow-xl whitespace-nowrap z-20">
                <div className="font-bold border-b border-gray-700 pb-1.5 mb-1.5 text-center">
                  {day.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-white opacity-80"></span>Apps:</div>
                    <span className="font-bold">{day.apps}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#ffb347]"></span>Messages:</div>
                    <span className="font-bold text-[#ffb347]">{day.msgs}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OutcomeChartWidget({ applications }) {
  const stats = useMemo(() => {
    let accepted = 0;
    let rejected = 0;
    (applications || []).forEach(app => {
      if (app.status === 'accepted') accepted++;
      if (app.status === 'rejected') rejected++;
    });
    const total = accepted + rejected;
    return { accepted, rejected, total };
  }, [applications]);

  if (stats.total === 0) {
    return (
      <div className="admin-card w-full flex flex-col justify-center items-center shadow-sm border border-gray-100 p-8 h-[260px]">
        <h3 className="text-lg font-bold text-gray-800 mb-6 w-full text-left">Outcome Rate</h3>
        <div className="flex-1 flex flex-col items-center justify-center opacity-40">
          <IoCheckmarkCircleOutline size={32} className="mb-2" />
          <span className="text-xs font-bold tracking-widest text-center mt-2">No Outcome Data Yet</span>
        </div>
      </div>
    );
  }

  const acceptedPercentage = Math.round((stats.accepted / stats.total) * 100);
  const strokeDasharray = `${acceptedPercentage} ${100 - acceptedPercentage}`;

  return (
    <div className="admin-card w-full flex flex-col shadow-sm border border-gray-100 h-[260px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800 !mb-0">Outcome Rate</h3>
      </div>

      <div className="flex-1 flex flex-row items-center justify-center gap-8 sm:gap-12 px-2 py-2">
        {/* Pie Chart SVG */}
        <div className="relative w-32 h-32 flex-shrink-0 drop-shadow-md">
          <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
            {/* Background Circle (Rejected) */}
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              stroke="#133020"
              strokeWidth="6"
            />
            {/* Foreground Circle (Accepted) */}
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              stroke="#ffb347"
              strokeWidth="6"
              strokeDasharray={strokeDasharray}
              strokeDashoffset="0"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-gray-900 leading-none">{acceptedPercentage}%</span>
            <span className="text-[9px] font-bold text-gray-400 tracking-widest mt-1">Hired</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-5 min-w-[100px]">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ffb347]"></span>
              <span className="text-xs font-bold text-gray-900">Accepted</span>
            </div>
            <span className="text-[10px] font-semibold text-gray-500 ml-5">{stats.accepted} applicant{stats.accepted !== 1 ? 's' : ''}</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#133020]"></span>
              <span className="text-xs font-bold text-gray-900">Rejected</span>
            </div>
            <span className="text-[10px] font-semibold text-gray-500 ml-5">{stats.rejected} applicant{stats.rejected !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentActivityCard({ title, items, type, onViewAll }) {
  const formatActivityDate = (timestamp) => {
    if (!timestamp) return '';
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 0) return 'Just now'; // Future dates handle
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 172800) return 'Yesterday';

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="admin-card w-full !m-0 flex flex-col shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-50">
        <h3 className="text-lg font-bold text-gray-800 !mb-0">{title}</h3>
        <span className="text-xs font-medium text-gray-400 tracking-wider">Latest 10</span>
      </div>

      <div className="flex flex-col">
        {items.length > 0 ? (
          items.slice(0, 10).map((item, idx) => {
            const firstName = type === 'application' ? item.firstName : (item.name?.split(' ')[0] || '');
            const lastName = type === 'application' ? item.lastName : (item.name?.split(' ')[1] || '');
            const initial = (firstName?.[0] || '') + (lastName?.[0] || '');

            return (
              <div key={item.id} className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group/item ${idx !== items.slice(0, 10).length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm border border-black group-hover:scale-105 transition-transform">
                  {initial || <IoPersonOutline size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {type === 'application' ? `${item.firstName} ${item.lastName}` : item.name}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-gray-400 shrink-0">
                      <span>{formatActivityDate(item.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {type === 'application' ? item.positionApplied : item.subject}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-gray-400 text-sm">
            No recent activity found.
          </div>
        )}
      </div>

      {items.length > 10 && (
        <div className="p-3 bg-gray-50/50 border-t border-gray-50 text-center">
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-gray-500 hover:text-black transition-colors tracking-widest"
          >
            View All
          </button>
        </div>
      )}
    </div>
  );
}

function NotificationModal({ message, onClose }) {
  if (!message) return null;
  const isError = message.type === 'error';

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-8 flex flex-col items-center text-center"
      >
        <div
          className={`w-20 h-20 mb-6 rounded-full flex items-center justify-center ${isError ? 'bg-red-50 text-red-500' : 'bg-[#133020]/10 text-[#133020]'
            }`}
        >
          {isError ? <IoWarningOutline size={40} /> : <IoCheckmarkCircleOutline size={40} />}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {isError ? 'Action Failed' : 'Success'}
        </h3>
        <p className="text-gray-500 mb-8 leading-relaxed">{message.text}</p>
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95"
        >
          Got it
        </button>
      </motion.div>
    </div>
  );
}

function ApplicantDetailsModal({ isOpen, onClose, application, onDelete, onReschedule }) {
  if (!isOpen || !application) return null;

  const detailFields = [
    { label: 'Full Name', value: `${application.firstName} ${application.lastName}`, icon: <IoPersonOutline size={18} /> },
    { label: 'Position', value: application.positionApplied, icon: <IoDocumentTextOutline size={18} /> },
    { label: 'Email', value: application.emailAddress, icon: <IoMailOutline size={18} /> },
    { label: 'Phone', value: application.phoneNumber, icon: <IoTimeOutline size={18} /> },
    { label: 'Gender', value: application.gender, icon: <IoPersonOutline size={18} /> },
    { label: 'Age', value: application.age, icon: <IoTimeOutline size={18} /> },
    { label: 'Country', value: application.country, icon: <IoGridOutline size={18} /> },
    { label: 'Address', value: application.currentAddress, icon: <IoGridOutline size={18} /> },
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
              {application.firstName[0]}{application.lastName[0]}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">Applicant Details</h3>
              <p className="text-xs text-gray-500 font-medium tracking-wider">ID: {application.id.slice(0, 8)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDelete(application)}
              className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors text-gray-400 mr-2"
              title="Delete Applicant"
            >
              <IoTrashOutline size={22} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
              <IoCloseOutline size={24} />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {detailFields.map((field, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 tracking-widest ml-1">{field.label}</span>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-sm">
                  <div className="text-gray-400 shrink-0">{field.icon}</div>
                  <span className="text-sm font-semibold text-gray-800">{field.value || '-'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Application Timeline */}
          <div className="mt-8 mb-4 flex flex-col gap-4 p-6 bg-gray-50/50 rounded-3xl border border-gray-100 overflow-x-auto">
            <span className="text-[10px] font-bold text-gray-400 tracking-widest ml-1 text-center">Timeline</span>

            <div className="flex items-center justify-center gap-2 sm:gap-6 py-2 min-w-max px-4 mx-auto">
              {(() => {
                const allSteps = [
                  { label: 'Applied', id: 0, date: application.createdAt },
                  { label: 'Pre-screening', id: 1, date: application.preScreeningDate || (application.status === 'interview' && application.interviewType === 'pre-screening' ? application.interviewScheduledAt : null) },
                  { label: 'Final Interview', id: 2, date: application.finalInterviewDate || (application.status === 'interview' && application.interviewType === 'interview' ? application.interviewScheduledAt : null) },
                  {
                    label: application.status === 'rejected' ? 'Rejected' : (application.status === 'accepted' ? 'Hired' : 'Outcome'),
                    id: 3,
                    date: application.decisionAt || ((application.status === 'accepted' || application.status === 'rejected') ? application.updatedAt : null)
                  }
                ];

                const currentIdx = application.status === 'pending' ? 0 :
                  application.status === 'interview' ? (application.interviewType === 'pre-screening' ? 1 : 2) :
                    3;

                const displaySteps = allSteps.slice(0, currentIdx + 1).map((step, idx) => ({
                  ...step,
                  type: idx === currentIdx ? 'current' : 'previous'
                }));

                return displaySteps.map((step, idx) => {
                  const isCurrent = step.type === 'current';
                  const isRejected = step.id === 3 && application.status === 'rejected';
                  const isAccepted = step.id === 3 && application.status === 'accepted';

                  let dotColor = isCurrent ? "bg-black text-white" : "bg-gray-200 text-gray-400";
                  if (isCurrent && (isRejected || isAccepted)) {
                    dotColor = isRejected ? "bg-red-500 text-white" : "bg-green-600 text-white";
                  }
                  if (!isCurrent) dotColor = "bg-green-50 text-green-700 shadow-sm border border-green-100"; // Previous is always "done"

                  const stepDate = step.date ? (step.date.toDate ? step.date.toDate() : new Date(step.date)) : null;

                  return (
                    <div key={idx} className="flex items-start gap-2 sm:gap-4">
                      {idx > 0 && <div className="w-4 sm:w-10 h-0.5 bg-gray-300 mt-5"></div>}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${dotColor} ${isCurrent && !isRejected && !isAccepted ? 'ring-4 ring-black/10' : ''}`}>
                          {!isCurrent ? <IoCheckmarkCircleOutline size={22} className="text-green-600" /> : step.id + 1}
                        </div>
                        <div className="flex flex-col items-center min-w-[70px] sm:min-w-[80px]">
                          <span className={`text-[10px] font-bold tracking-wider ${isCurrent ? 'text-black' : 'text-gray-400'}`}>
                            {isCurrent ? 'Current' : 'Completed'}
                          </span>
                          <span className={`text-xs font-bold leading-tight text-center ${isCurrent ? 'text-black' : 'text-gray-500'}`}>
                            {step.label}
                          </span>
                          {stepDate && (
                            <span className="text-[9px] font-medium text-gray-400 mt-1 text-center leading-tight">
                              {stepDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}<br />{stepDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            {application.status === 'interview' && (
              <div className="flex-1 p-5 bg-gray-50/50 border border-gray-100 rounded-3xl">
                <div className="flex items-center gap-2 mb-4 text-gray-900">
                  <IoCalendarOutline size={20} />
                  <h4 className="font-bold text-sm tracking-wider">Next Steps</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest">Meeting Type</span>
                    <span className="text-sm font-bold text-gray-900">{application.interviewType === 'pre-screening' ? 'Pre-screening' : 'Final Interview'}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest">Scheduled Time</span>
                    <span className="text-sm font-bold text-gray-900">
                      {(() => {
                        const d = application.interviewScheduledAt?.toDate
                          ? application.interviewScheduledAt.toDate()
                          : new Date(application.interviewScheduledAt);
                        return d.toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        });
                      })()}
                    </span>
                  </div>
                </div>

                {(() => {
                  const d = application.interviewScheduledAt?.toDate
                    ? application.interviewScheduledAt.toDate()
                    : new Date(application.interviewScheduledAt);
                  const isUpcoming = d && d > new Date();

                  if (!isUpcoming) return null;

                  return (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => { onReschedule(application); onClose(); }}
                        className="w-full py-2 bg-black text-white rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-gray-800 transition-all active:scale-95"
                      >
                        Reschedule Interview
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}

            {application.cvDownloadUrl && (
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 tracking-widest ml-1">Documentation</span>
                <a
                  href={application.cvDownloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="h-full min-h-[80px] flex items-center justify-center gap-3 bg-white text-black font-bold text-sm rounded-3xl border border-gray-200 hover:bg-black hover:text-white transition-all shadow-sm"
                >
                  <IoDocumentTextOutline size={20} />
                  View Candidate Resume
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end px-8">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-black hover:bg-gray-800 text-white rounded-full text-sm font-bold transition-all shadow-md active:scale-95"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ScheduledInterviewsCard({ interviews, onItemClick }) {
  const hasInterviews = interviews && interviews.length > 0;

  const partitioned = useMemo(() => {
    if (!interviews) return { today: [], upcoming: [] };
    const todayStr = new Date().toDateString();
    const today = [];
    const upcoming = [];

    interviews.forEach(item => {
      const date = item.interviewScheduledAt.toDate ? item.interviewScheduledAt.toDate() : new Date(item.interviewScheduledAt);
      if (date.toDateString() === todayStr) {
        today.push(item);
      } else {
        upcoming.push(item);
      }
    });
    return { today, upcoming };
  }, [interviews]);

  const InterviewItem = ({ item, isToday, isLast }) => {
    const date = item.interviewScheduledAt.toDate ? item.interviewScheduledAt.toDate() : new Date(item.interviewScheduledAt);
    return (
      <div
        onClick={() => onItemClick && onItemClick(item)}
        className={`p-5 flex items-start gap-4 hover:bg-gray-50/80 transition-colors ${onItemClick ? 'cursor-pointer' : ''} ${!isLast ? 'border-b border-gray-100' : ''}`}
      >
        <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 ${isToday ? 'bg-black text-white shadow-md' : 'bg-gray-50 text-gray-900 border border-gray-100'}`}>
          <span className="text-[10px] font-bold">{date.toLocaleDateString(undefined, { month: 'short' })}</span>
          <span className="text-lg font-bold leading-none">{date.getDate()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
            <p className="text-[10px] font-bold text-gray-400 tracking-wider truncate">
              {item.interviewType === 'pre-screening' ? 'Pre-screening' : 'Final Interview'}
            </p>
          </div>
          <h4 className="font-bold text-gray-900 truncate mb-1">{item.firstName} {item.lastName}</h4>
          <div className="flex items-center gap-2 text-gray-500">
            <IoTimeOutline size={14} />
            <span className="text-xs font-semibold">{date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm text-gray-400 tracking-widest uppercase">Interviews</h3>
        <span className="text-[10px] bg-[#FFB347] text-white px-2 py-0.5 rounded-full font-bold">{interviews ? interviews.length : 0}</span>
      </div>
      {hasInterviews ? (
        <div className="w-full bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden min-h-[100px]">
          <div className="flex flex-col">
            {partitioned.today.length > 0 && (
              <div className="flex flex-col">
                <div className="px-5 py-3 bg-gray-50/50 border-b border-gray-100">
                  <span className="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase">Today</span>
                </div>
                {partitioned.today.map((item, idx) => (
                  <InterviewItem key={item.id} item={item} isToday={true} isLast={idx === partitioned.today.length - 1 && partitioned.upcoming.length === 0} />
                ))}
              </div>
            )}

            {partitioned.upcoming.length > 0 && (
              <div className="flex flex-col">
                <div className="px-5 py-3 bg-gray-50/50 border-b border-gray-100">
                  <span className="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase">Upcoming</span>
                </div>
                {partitioned.upcoming.map((item, idx) => (
                  <InterviewItem key={item.id} item={item} isToday={false} isLast={idx === partitioned.upcoming.length - 1} />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full py-8 text-center flex flex-col items-center justify-center opacity-40">
          <IoCalendarOutline size={32} className="mb-3 text-gray-400" />
          <p className="text-sm font-medium text-gray-400">No upcoming interviews</p>
        </div>
      )}
    </div>
  );
}

function NotificationBell({ applications, messages, onItemClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [lastCheck, setLastCheck] = useState(() => {
    const saved = localStorage.getItem('admin_last_notification_check');
    return saved ? parseInt(saved) : 0;
  });

  const notifications = useMemo(() => {
    const all = [
      ...applications.map(app => ({ ...app, type: 'application', timestamp: app.createdAt })),
      ...messages.map(msg => ({ ...msg, type: 'message', timestamp: msg.createdAt }))
    ].sort((a, b) => {
      const getTime = (val) => val?.toMillis ? val.toMillis() : (val instanceof Date ? val.getTime() : new Date(val || 0).getTime());
      return getTime(b.timestamp) - getTime(a.timestamp);
    });

    const groups = {};
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    all.forEach(item => {
      if (!item.timestamp) return;
      const dateObj = item.timestamp.toDate ? item.timestamp.toDate() : new Date(item.timestamp);
      const dateStr = dateObj.toDateString();
      let label = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      
      if (dateStr === today) label = 'Today';
      else if (dateStr === yesterday) label = 'Yesterday';

      if (!groups[label]) groups[label] = [];
      groups[label].push(item);
    });

    return Object.entries(groups).map(([date, items]) => ({ date, items })).slice(0, 10);
  }, [applications, messages]);

  const totalUnread = useMemo(() => {
    // Only show items newer than the last time we checked clicking the bell.
    return [
      ...applications.filter(a => (a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt).getTime()) > lastCheck),
      ...messages.filter(m => (m.createdAt?.toMillis ? m.createdAt.toMillis() : new Date(m.createdAt).getTime()) > lastCheck)
    ].length;
  }, [applications, messages, lastCheck]);

  const toggleOpen = () => {
    if (!isOpen) {
      // If we are opening, mark all current items as "seen" by updating lastCheck
      const now = Date.now();
      setLastCheck(now);
      localStorage.setItem('admin_last_notification_check', now.toString());
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button 
        onClick={toggleOpen}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm text-gray-400 hover:text-black hover:bg-gray-50 transition-all relative"
      >
        <IoNotificationsOutline size={20} />
        {totalUnread > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-[320px] sm:w-[380px] bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col max-h-[500px]"
            >
              <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase">Notifications</h3>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{totalUnread} New Activities</span>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                {notifications.length > 0 ? (
                  notifications.map((group, idx) => (
                    <div key={idx} className="mb-4 last:mb-0">
                      <div className="px-3 py-2 flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-gray-300 tracking-[0.2em] uppercase">{group.date}</span>
                        <div className="h-px flex-1 bg-gray-50"></div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {group.items.map((item, i) => (
                          <div 
                            key={i} 
                            onClick={() => { onItemClick(item); setIsOpen(false); }}
                            className="p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group flex items-start gap-3 border border-transparent hover:border-gray-50"
                          >
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                              item.type === 'application' ? 'bg-black text-white border-black' : 'bg-amber-50 text-amber-600 border-amber-100'
                            }`}>
                              {item.type === 'application' ? (item.firstName?.[0] || 'A') : <IoChatbubbleEllipsesOutline size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <h4 className="font-bold text-gray-900 truncate text-[13px]">
                                  {item.type === 'application' ? `${item.firstName} ${item.lastName}` : item.name}
                                </h4>
                                <span className="text-[9px] text-gray-400 font-bold shrink-0">
                                  {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : ''}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500 truncate leading-tight">
                                {item.type === 'application' ? `Applied for ${item.positionApplied}` : `New message: ${item.subject}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center opacity-40 flex flex-col items-center">
                    <IoNotificationsOutline size={32} className="mb-3" />
                    <p className="text-xs font-bold tracking-widest">No Recent Activity</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MessageSidePanel({ isOpen, onClose, message }) {
  if (!message) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleReply = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(message.email)}&su=${encodeURIComponent(`Re: ${message.subject}`)}&body=${encodeURIComponent(`\n\n--- Original Message ---\nFrom: ${message.name}\nSubject: ${message.subject}\n\n${message.message}`)}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[2100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[600px] bg-white shadow-2xl z-[2200] flex flex-col font-sans"
          >
            {/* Header Toolbar */}
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors flex items-center gap-2 group"
              >
                <IoArrowBackOutline size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-medium">Back</span>
              </button>
            </div>

            {/* Message Content Area */}
            <div className="flex-1 overflow-y-auto bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl font-normal text-gray-900 mb-8">{message.subject}</h2>
                  
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                        {message.name?.[0] || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-gray-900">{message.name}</span>
                          <span className="text-xs text-gray-400">&lt;{message.email}&gt;</span>
                        </div>
                        <span className="text-xs text-gray-400">to me</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-400 font-medium">{formatDate(message.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-sans border-t border-gray-50 pt-8">
                  {message.message}
                </div>

                <div className="mt-12 flex gap-3">
                  <button 
                    onClick={handleReply}
                    className="flex items-center gap-2 px-8 py-2.5 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-900 transition-all active:scale-95"
                  >
                    <IoArrowBackOutline size={16} />
                    Reply via Gmail
                  </button>
                </div>
              </div>
            </div>

            {/* Footer metadata */}
            <div className="p-4 border-t border-gray-50 bg-gray-50/50">
              <div className="flex items-center justify-between opacity-40">
                <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_rtl.png" alt="Gmail Integrated" className="h-3 grayscale" />
                <span className="text-[9px] font-black tracking-widest uppercase">End of message</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function DecisionConfirmationModal({ isOpen, onClose, onConfirm, application, status }) {
  if (!isOpen) return null;

  const isAccept = status === 'accepted';
  const colorClass = isAccept ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600';
  const btnClass = isAccept ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';

  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-8 flex flex-col items-center text-center"
      >
        <div className={`w-20 h-20 mb-6 rounded-full flex items-center justify-center ${colorClass}`}>
          {isAccept ? <IoCheckmarkCircleOutline size={40} /> : <IoWarningOutline size={40} />}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {isAccept ? 'Accept Applicant?' : 'Reject Applicant?'}
        </h3>
        <p className="text-gray-500 mb-8 leading-relaxed text-sm">
          Are you sure you want to {isAccept ? 'accept' : 'reject'} <strong>{application.firstName} {application.lastName}</strong>? This will send an automatic email notification to them.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => {
              onConfirm(application.id, status);
              onClose();
            }}
            className={`w-full py-3.5 text-white rounded-full text-sm font-bold transition-all shadow-md active:scale-95 ${btnClass}`}
          >
            Yes, {isAccept ? 'Confirm Acceptance' : 'Confirm Rejection'}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-bold transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, application }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-8 flex flex-col items-center text-center"
      >
        <div className="w-20 h-20 mb-6 rounded-full flex items-center justify-center bg-red-50 text-red-600">
          <IoTrashOutline size={40} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Move to Trash?
        </h3>
        <p className="text-gray-500 mb-8 leading-relaxed text-sm">
          Are you sure you want to move <strong>{application?.firstName} {application?.lastName}</strong> to trash? You can still find them in the Trash filter.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => {
              onConfirm(application.id);
              onClose();
            }}
            className="w-full py-3.5 text-white rounded-full text-sm font-bold transition-all shadow-md active:scale-95 bg-red-600 hover:bg-red-700"
          >
            Yes, Move to Trash
          </button>
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-bold transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ScheduleInterviewModal({ isOpen, onClose, onConfirm, application }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState(application.status === 'interview' ? 'interview' : 'pre-screening');

  useEffect(() => {
    if (application) {
      setType(application.status === 'interview' ? 'interview' : 'pre-screening');
    }
  }, [application]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !time) return;
    onConfirm(application.id, { date, time, type });
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-8 flex flex-col items-center"
      >
        <div className="w-20 h-20 mb-4 rounded-full bg-gray-50 text-black flex items-center justify-center border border-gray-100">
          <IoCalendarOutline size={36} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Schedule Interview</h3>
        <p className="text-gray-500 mb-6 text-center text-sm">
          Select date and time for {application.firstName}'s {type}.
        </p>

        <div className="w-full flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1.5 p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-2">
            <span className="text-[10px] font-bold text-gray-400 tracking-widest">Next Hiring Stage</span>
            <div className="flex items-center gap-2 mt-1 py-1">
              <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
                {type === 'pre-screening' ? '1' : '2'}
              </div>
              <span className="text-sm font-bold text-gray-900">
                {type === 'pre-screening' ? 'Pre-screening Interview' : 'Final Interview'}
              </span>
            </div>
            <p className="text-[9px] text-gray-400 mt-2 font-medium">This candidate must complete this stage before moving forward.</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-left">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 ml-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 ml-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                className="w-full py-3.5 bg-black hover:bg-gray-800 text-white rounded-full text-sm font-bold transition-all shadow-md active:scale-95"
              >
                Confirm Schedule
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function CustomStatusSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'interview', label: 'Interview' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'trash', label: 'Trash' },
  ];
  const selectedLabel = options.find(opt => opt.value === value)?.label || 'All Statuses';

  return (
    <div className="relative w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="admin-select w-full sm:w-auto flex items-center justify-between gap-3 text-gray-700 font-medium hover:border-gray-300 transition-colors"
      >
        <span>{selectedLabel}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <IoChevronDownOutline size={16} className="text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 w-full sm:w-48 bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden z-[100] flex flex-col py-2"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`text-left px-5 py-2.5 text-sm transition-colors hover:bg-gray-50 flex items-center gap-2 ${opt.value === value ? 'text-[#133020] font-bold bg-[#133020]/5' : 'text-gray-600 font-medium'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ColumnSortSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className={`p-1.5 rounded-xl transition-colors ${value !== 'date_desc' ? 'bg-black text-white' : 'text-gray-400 hover:text-black hover:bg-black/5'}`}
        title="Sort Applications"
      >
        <IoFilterOutline size={14} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-36 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-[100] flex flex-col py-1"
          >
            {[
              { value: 'date_desc', label: 'Newest First' },
              { value: 'date_asc', label: 'Oldest First' },
              { value: 'alpha_asc', label: 'Name (A-Z)' },
              { value: 'alpha_desc', label: 'Name (Z-A)' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                className={`text-left px-4 py-2.5 text-[11px] transition-colors hover:bg-gray-50 flex items-center gap-2 ${opt.value === value ? 'text-[#133020] font-bold bg-[#133020]/5' : 'text-gray-600 font-medium'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const navWithIcons = [
  { id: "dashboard", label: "Dashboard", icon: <IoGridOutline size={20} /> },
  { id: "applications", label: "Applications", icon: <IoDocumentTextOutline size={20} /> },
];

export default function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [actionMessage, setActionMessage] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Sidebar & Navigation state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | applications | messages
  const [schedulingApp, setSchedulingApp] = useState(null);
  const [selectedAppDetails, setSelectedAppDetails] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteConfirmApp, setDeleteConfirmApp] = useState(null);
  const [pendingDecision, setPendingDecision] = useState(null); // { application, status }

  // Filters
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('all');
  const [msgSearch, setMsgSearch] = useState('');
  const [columnSorts, setColumnSorts] = useState({
    pending: 'date_asc',
    interview: 'date_asc',
    accepted: 'date_desc',
    rejected: 'date_desc'
  });

  const nonDeletedApps = useMemo(() => applications.filter(a => !a.deleted), [applications]);
  const nonDeletedMsgs = useMemo(() => messages.filter(m => !m.deleted), [messages]);

  const allowedAdminEmails = useMemo(
    () =>
      (import.meta.env.VITE_ADMIN_EMAILS || '')
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean),
    []
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user) {
        setIsAdmin(false);
        setAuthLoading(false);
        return;
      }

      const token = await user.getIdTokenResult();
      const claimAdmin = Boolean(token.claims.admin);
      const emailAdmin = allowedAdminEmails.includes((user.email || '').toLowerCase());
      setIsAdmin(claimAdmin || emailAdmin);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [allowedAdminEmails]);

  useEffect(() => {
    if (!isAdmin) return undefined;

    const appsQuery = collection(db, 'applications');
    const messagesQuery = collection(db, 'messages');

    const unsubApps = onSnapshot(appsQuery, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => {
        const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return tB - tA;
      });
      setApplications(docs);
      setIsDataLoading(false);
    }, (err) => {
      setActionMessage({ text: err?.message || 'Failed to load applications.', type: 'error' });
      setIsDataLoading(false);
    });

    const unsubMessages = onSnapshot(messagesQuery, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => {
        const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return tB - tA;
      });
      setMessages(docs);
    }, (err) => {
      setActionMessage({ text: err?.message || 'Failed to load messages.', type: 'error' });
    });

    return () => {
      unsubApps();
      unsubMessages();
    };
  }, [isAdmin]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setPassword('');
    } catch (error) {
      setLoginError(error?.message || 'Login failed.');
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    setActionMessage(null);
    try {
      await updateDoc(doc(db, 'applications', applicationId), {
        status,
        decisionAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const appDoc = await getDoc(doc(db, 'applications', applicationId));
      if (appDoc.exists()) {
        const applicantData = appDoc.data();
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        const templateId = import.meta.env.VITE_EMAILJS_OUTCOME_TEMPLATE_ID;

        if (serviceId && templateId && publicKey) {
          const decision = status === 'accepted' ? 'Accepted' : 'Rejected';
          const outcomeMessage = status === 'accepted'
            ? 'We are thrilled to move forward with your application. Our HR team will be contacting you shortly with the next steps and formal documentation. Welcome to the journey!'
            : 'While we were impressed with your background, we have decided to move forward with other candidates at this stage. We appreciate your time and wish you the very best.';

          const decisionHtml = `
            <p style="color: #1e293b; font-size: 18px; line-height: 1.6; margin-bottom: 32px;">
              Thank you for your interest in the <strong>${applicantData.positionApplied}</strong> position at Lifewood. Our recruitment team has carefully reviewed your profile.
            </p>
            <div style="background: #f8fafc; border-radius: 16px; padding: 24px; text-align: center; border: 1px solid #e2e8f0; margin-bottom: 32px;">
              <span style="display: block; font-size: 11px; color: #94a3b8; font-weight: 700; margin-bottom: 8px;">Status</span>
              <span style="font-size: 24px; font-weight: 800; color: #133020; letter-spacing: -0.5px;">${decision}</span>
            </div>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 40px;">
              ${outcomeMessage}
            </p>
          `;

          const templateParams = {
            name: applicantData.firstName,
            emailAddress: applicantData.emailAddress,
            body_html: decisionHtml,
            decision: decision
          };

          await emailjs.send(serviceId, templateId, templateParams, publicKey);
        } else {
          console.warn('EmailJS: Missing configuration for status update email', { serviceId, templateId, publicKey });
        }
      }
      setActionMessage({ text: `Application marked as ${status}.`, type: 'success' });
    } catch (error) {
      setActionMessage({ text: error?.message || 'Unable to update application status.', type: 'error' });
    }
  };

  const handleScheduleInterview = async (applicationId, scheduleData) => {
    setActionMessage(null);
    try {
      const interviewDate = new Date(`${scheduleData.date}T${scheduleData.time}`);

      // Fetch current data to check if it's a reschedule
      const appDocRef = doc(db, 'applications', applicationId);
      const appDocPre = await getDoc(appDocRef);
      const isRescheduling = appDocPre.exists() && appDocPre.data().status === 'interview';

      const updatePayload = {
        status: 'interview',
        interviewType: scheduleData.type,
        interviewScheduledAt: interviewDate,
        updatedAt: serverTimestamp(),
      };

      if (scheduleData.type === 'pre-screening') {
        updatePayload.preScreeningDate = interviewDate;
      } else {
        updatePayload.finalInterviewDate = interviewDate;
      }

      await updateDoc(appDocRef, updatePayload);

      setSchedulingApp(null);

      // Send Email Notification
      if (appDocPre.exists()) {
        const applicantData = appDocPre.data();
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        const templateId = import.meta.env.VITE_EMAILJS_SCHEDULE_TEMPLATE_ID;

        if (serviceId && templateId && publicKey) {
          const typeLabel = scheduleData.type === 'pre-screening' ? 'Pre-screening Interview' : 'Final Interview';
          const scheduleHtml = isRescheduling ? `
            <p style="color: #1e293b; font-size: 18px; line-height: 1.6; margin-bottom: 24px;">
              Hello <strong>${applicantData.firstName}</strong>, we are writing to inform you that your <strong>${typeLabel}</strong> for the <strong>${applicantData.positionApplied}</strong> position has been <strong>rescheduled</strong>.
            </p>
            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
              We sincerely apologize for any inconvenience this change may cause. Please find your new schedule details below:
            </p>
            <div style="border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0; margin-bottom: 32px; background-color: #f8fafc;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="33.33%" style="text-align: center; padding: 8px;">
                    <span style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 6px; color: #64748b;">Type</span>
                    <span style="font-size: 16px; color: #1e293b; font-weight: 700;">${typeLabel}</span>
                  </td>
                  <td width="33.33%" style="text-align: center; padding: 8px;">
                    <span style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 6px; color: #64748b;">New Date</span>
                    <span style="font-size: 16px; color: #1e293b; font-weight: 700;">${scheduleData.date}</span>
                  </td>
                  <td width="33.33%" style="text-align: center; padding: 8px;">
                    <span style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 6px; color: #64748b;">New Time</span>
                    <span style="font-size: 16px; color: #1e293b; font-weight: 700;">
                      ${new Date(`1970-01-01T${scheduleData.time}`).toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            <p style="color: #475569; font-size: 15px; line-height: 1.6; text-align: center; margin-bottom: 40px;">
              The meeting link will be sent to this email address on your new scheduled day. We appreciate your flexibility and look forward to our conversation.
            </p>
          ` : `
            <p style="color: #1e293b; font-size: 18px; line-height: 1.6; margin-bottom: 24px;">
              Great news! We’ve successfully scheduled your session for the <strong>${applicantData.positionApplied}</strong> position.
            </p>
            <div style="border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0; margin-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="33.33%" style="text-align: center; padding: 8px;">
                    <span style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 6px;">Type</span>
                    <span style="font-size: 16px; color: #1e293b; font-weight: 700;">${typeLabel}</span>
                  </td>
                  <td width="33.33%" style="text-align: center; padding: 8px;">
                    <span style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 6px;">Scheduled Date</span>
                    <span style="font-size: 16px; color: #1e293b; font-weight: 700;">${scheduleData.date}</span>
                  </td>
                  <td width="33.33%" style="text-align: center; padding: 8px;">
                    <span style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 6px;">Scheduled Time</span>
                    <span style="font-size: 16px; color: #1e293b; font-weight: 700;">
                      ${new Date(`1970-01-01T${scheduleData.time}`).toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            <p style="color: #475569; font-size: 15px; line-height: 1.6; text-align: center; margin-bottom: 40px;">
              A meeting link will be sent to your email on the scheduled day and time. 
              Please ensure you have a stable internet connection. We look forward to meeting you soon!
            </p>
          `;

          await emailjs.send(
            serviceId,
            templateId,
            {
              name: applicantData.firstName,
              emailAddress: applicantData.emailAddress,
              body_html: scheduleHtml,
              decision: isRescheduling ? 'Interview Rescheduled' : 'Interview Scheduled'
            },
            publicKey
          );
        } else {
          console.warn('EmailJS: Missing configuration for schedule interview email', { serviceId, templateId, publicKey });
        }
      }

      setActionMessage({
        text: isRescheduling
          ? `Interview rescheduled for ${scheduleData.date} at ${scheduleData.time}.`
          : `Interview scheduled for ${scheduleData.date} at ${scheduleData.time}.`,
        type: 'success'
      });
    } catch (error) {
      setActionMessage({ text: error?.message || 'Unable to schedule interview.', type: 'error' });
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      await updateDoc(doc(db, 'applications', applicationId), {
        deleted: true,
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSelectedAppDetails(null);
      setActionMessage({ text: 'Applicant moved to trash.', type: 'success' });
    } catch (error) {
      setActionMessage({ text: error?.message || 'Unable to move applicant to trash.', type: 'error' });
    }
  };

  const handleRestoreApplication = async (applicationId) => {
    try {
      await updateDoc(doc(db, 'applications', applicationId), {
        deleted: false,
        updatedAt: serverTimestamp(),
      });
      setActionMessage({ text: 'Applicant restored successfully.', type: 'success' });
    } catch (error) {
      setActionMessage({ text: error?.message || 'Unable to restore applicant.', type: 'error' });
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        deleted: true,
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setActionMessage({ text: 'Message moved to trash.', type: 'success' });
    } catch (error) {
      setActionMessage({ text: error?.message || 'Unable to move message to trash.', type: 'error' });
    }
  };

  const handleRestoreMessage = async (messageId) => {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        deleted: false,
        updatedAt: serverTimestamp(),
      });
      setActionMessage({ text: 'Message restored successfully.', type: 'success' });
    } catch (error) {
      setActionMessage({ text: error?.message || 'Unable to restore message.', type: 'error' });
    }
  };

  const formatInterviewDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const upcomingInterviews = useMemo(() => {
    const now = new Date();
    return applications
      .filter((app) => {
        if (app.status !== 'interview' || !app.interviewScheduledAt) return false;
        const interviewDate = app.interviewScheduledAt.toDate ? app.interviewScheduledAt.toDate() : new Date(app.interviewScheduledAt);
        return interviewDate > now;
      })
      .sort((a, b) => {
        const tA = a.interviewScheduledAt.toDate ? a.interviewScheduledAt.toDate() : new Date(a.interviewScheduledAt);
        const tB = b.interviewScheduledAt.toDate ? b.interviewScheduledAt.toDate() : new Date(b.interviewScheduledAt);
        return tA - tB;
      });
  }, [applications]);

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const term = appSearch.toLowerCase();
      const nMatch = `${app.firstName || ''} ${app.lastName || ''}`.toLowerCase().includes(term);
      const eMatch = (app.emailAddress || '').toLowerCase().includes(term);
      const pMatch = (app.positionApplied || '').toLowerCase().includes(term);

      // Soft-delete logic: by default, hide deleted items.
      // If filter is 'trash', ONLY show deleted items.
      if (appStatusFilter === 'trash') {
        if (!app.deleted) return false;
      } else {
        if (app.deleted) return false;
      }

      const sMatch = appStatusFilter === 'all' || appStatusFilter === 'trash' || app.status === appStatusFilter;
      return (nMatch || eMatch || pMatch) && sMatch;
    });
  }, [applications, appSearch, appStatusFilter]);

  const filteredMsgs = useMemo(() => {
    return messages.filter((msg) => {
      // Hide soft-deleted messages by default
      if (msg.deleted) return false;

      const term = msgSearch.toLowerCase();
      return (msg.name || '').toLowerCase().includes(term) ||
        (msg.email || '').toLowerCase().includes(term) ||
        (msg.subject || '').toLowerCase().includes(term);
    });
  }, [messages, msgSearch]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      totalApps: nonDeletedApps.length,
      acceptedApps: nonDeletedApps.filter(app => app.status === 'accepted').length,
      pendingApps: nonDeletedApps.filter((a) => a.status === 'pending').length,
      todayMsgs: nonDeletedMsgs.filter((m) => {
        if (!m.createdAt) return false;
        const d = m.createdAt.toDate ? m.createdAt.toDate() : new Date(m.createdAt);
        return d >= today;
      }).length,
    };
  }, [nonDeletedApps, nonDeletedMsgs]);

  if (authLoading) {
    return <main className="admin-page"><section className="admin-section"><p>Loading admin panel...</p></section></main>;
  }

  if (!currentUser) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-sans">
        {/* Grainient Background matching Hero */}
        <div className="absolute inset-0 z-0 pointer-events-none">
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

        {/* Subtle decorative background shapes */}
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-[#046241]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[60%] h-[60%] bg-[#f7a944]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <section className="relative z-10 w-full max-w-md px-6">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:shadow-[0_20px_60px_rgb(0,0,0,0.06)] border border-gray-100 p-8 sm:p-10 flex flex-col items-center">

            <div className="mb-8">
              <img src={logo} alt="Lifewood Logo" className="h-10 w-auto object-contain" />
            </div>


            <p className="text-gray-500 text-sm mb-8 text-center">Enter your admin credentials to access the dashboard.</p>

            <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <IoMailOutline size={20} />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@email.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#046241]/20 focus:border-[#046241] transition-all"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <IoLockClosedOutline size={20} />
                </div>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#046241]/20 focus:border-[#046241] transition-all"
                  required
                />
              </div>

              {loginError && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium mt-1">
                  <IoWarningOutline size={16} />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-3.5 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                Sign Into Account
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-sans">
        {/* Grainient Background matching Hero */}
        <div className="absolute inset-0 z-0 pointer-events-none">
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
        <section className="relative z-10 w-full max-w-md px-6">
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.06)] border border-gray-100 p-8 sm:p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
              <IoWarningOutline size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-500 text-sm mb-8">This account does not have administrator privileges to access the dashboard. Please sign in with an authorized account.</p>
            <button
              type="button"
              onClick={() => signOut(auth)}
              className="w-full py-3.5 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
            >
              Sign Out & Try Again
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f6f8f9] text-left">
      <div className="fixed top-6 left-6 z-[2000] hidden md:block">
        <img src={icon} alt="Lifewood Icon" className="w-14 h-14 object-contain drop-shadow-sm hover:scale-105 transition-transform cursor-pointer" />
      </div>

      <nav
        className="hidden md:flex flex-col fixed left-4 top-1/2 -translate-y-1/2 h-fit w-[72px] bg-white/20 backdrop-blur-2xl shadow-xl z-50 overflow-hidden !p-2 !m-0 rounded-full border border-white/40"
      >
        <div className="flex flex-col items-center justify-center gap-2 py-4">
          {navWithIcons.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-center transition-all duration-300 w-12 h-12 rounded-full ${isActive
                  ? "bg-black text-white font-semibold shadow-lg scale-100"
                  : "text-gray-500 hover:bg-black/5 hover:text-gray-900"
                  }`}
                title={item.label}
              >
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
              </button>
            );
          })}

          <div className="w-8 border-t border-gray-200/50 my-2" />

          <button
            onClick={() => setShowSignOutConfirm(true)}
            className="flex items-center justify-center transition-all duration-300 text-gray-500 hover:bg-black/5 hover:text-gray-900 w-12 h-12 rounded-full"
            title="Sign Out"
          >
            <div className="flex-shrink-0">
              <IoLogOutOutline className="w-5 h-5 translate-x-0.5" />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Topbar & Hamburger */}
      <nav className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#133020]/90 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-4">
        <div className="flex items-center shrink-0">
          <img
            src={logo}
            alt="Lifewood Admin"
            className="h-8 w-auto object-contain brightness-0 invert"
          />
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white"
          aria-label="Open menu"
        >
          <IoMenuOutline size={24} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#133020]/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-[280px] bg-[#133020] shadow-2xl flex flex-col border-l border-white/10"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <img
                  src={logo}
                  alt="Lifewood Admin"
                  className="h-8 w-auto object-contain brightness-0 invert"
                />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white"
                  aria-label="Close menu"
                >
                  <IoCloseOutline size={20} />
                </button>
              </div>
              <div className="flex flex-col gap-2 p-4">
                {navWithIcons.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${isActive
                        ? "bg-black text-white font-semibold shadow-md"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  );
                })}

                <div className="w-full h-px bg-white/10 my-2"></div>

                <button
                  onClick={() => {
                    setShowSignOutConfirm(true);
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-white/70 hover:bg-white/10 hover:text-white w-full text-left"
                >
                  <IoLogOutOutline className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sign Out Confirmation Modal */}
      <AnimatePresence>
        {showSignOutConfirm && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSignOutConfirm(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-8 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 mb-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                <IoLogOutOutline size={40} className="translate-x-0.5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Out?</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Are you sure you want to sign out of your admin account?
              </p>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => {
                    signOut(auth);
                    setShowSignOutConfirm(false);
                  }}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95"
                >
                  Sign Out
                </button>
                <button
                  onClick={() => setShowSignOutConfirm(false)}
                  className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-all active:scale-95"
                >
                  Stay Signed In
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div
        className="flex flex-col md:pl-[80px] md:pr-[80px] w-full max-w-full overflow-x-hidden">
        <header className="px-4 pt-8 pb-4 flex items-center justify-end w-full">
          <NotificationBell 
            applications={applications} 
            messages={messages} 
            onItemClick={(item) => {
              if (item.type === 'application') {
                setSelectedAppDetails(item);
              } else {
                setSelectedMessage(item);
              }
            }}
          />
        </header>
        <main className="flex-1 p-4 sm:p-8 w-full">
          <AnimatePresence>
            {selectedMessage && (
              <MessageSidePanel
                isOpen={!!selectedMessage}
                message={selectedMessage}
                onClose={() => setSelectedMessage(null)}
              />
            )}
            {actionMessage && (
              <NotificationModal
                message={actionMessage}
                onClose={() => setActionMessage(null)}
              />
            )}
            {schedulingApp && (
              <ScheduleInterviewModal
                isOpen={!!schedulingApp}
                application={schedulingApp}
                onClose={() => setSchedulingApp(null)}
                onConfirm={handleScheduleInterview}
              />
            )}
            {selectedAppDetails && (
              <ApplicantDetailsModal
                isOpen={!!selectedAppDetails}
                application={selectedAppDetails}
                onClose={() => setSelectedAppDetails(null)}
                onDelete={setDeleteConfirmApp}
                onReschedule={setSchedulingApp}
              />
            )}
            {deleteConfirmApp && (
              <DeleteConfirmationModal
                isOpen={!!deleteConfirmApp}
                application={deleteConfirmApp}
                onClose={() => setDeleteConfirmApp(null)}
                onConfirm={handleDeleteApplication}
              />
            )}
            {pendingDecision && (
              <DecisionConfirmationModal
                isOpen={!!pendingDecision}
                application={pendingDecision.application}
                status={pendingDecision.status}
                onClose={() => setPendingDecision(null)}
                onConfirm={handleStatusUpdate}
              />
            )}
          </AnimatePresence>
          {isDataLoading && <div className="mb-4 mx-4 sm:mx-0 text-gray-500">Loading data...</div>}

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between w-full">
                <h1 className="text-3xl font-bold text-gray-900 m-0">Welcome Back!</h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
                <div className="lg:col-span-2 w-full flex flex-col gap-6">
                  <div className="relative p-10 mb-6 rounded-[40px] shadow-sm overflow-hidden flex flex-col justify-between border border-gray-100 min-h-[420px]">
                    <div className="absolute inset-0 z-0">
                      <Grainient
                        color1="#ffb347"
                        color2="#ffffff"
                        color3="#133020"
                        timeSpeed={0.25}
                        colorBalance={0.15}
                        noiseScale={2}
                        contrast={1.4}
                      />
                    </div>
                    {/* Glass overlay with very subtle blur to keep text sharp */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] z-[1]"></div>

                    <div className="relative z-10 w-full mb-8">
                      <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                        Always <span className="text-[#133020]/80">switched on,</span> <br />
                        never <span className="text-[#133020]/80">off</span>
                      </h2>
                      <p className="mt-4 text-sm font-medium text-gray-500 tracking-widest">Admin Dashboard</p>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-10 w-full pt-8 border-t border-black/5">
                      <div className="transition-all">
                        <h3 className="text-[10px] font-bold text-black tracking-widest mb-2">Total Applications</h3>
                        <div className="text-4xl font-bold text-gray-900 leading-none">{stats.totalApps}</div>
                      </div>
                      <div className="transition-all">
                        <h3 className="text-[10px] font-bold text-black tracking-widest mb-2">Accepted Applicants</h3>
                        <div className="text-4xl font-bold leading-none" style={{ color: '#133020' }}>{stats.acceptedApps}</div>
                      </div>
                      <div className="transition-all">
                        <h3 className="text-[10px] font-bold text-black tracking-widest mb-2">Pending Review</h3>
                        <div className="text-4xl font-bold text-gray-900 leading-none">{stats.pendingApps}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-3 w-full items-stretch">
                    <div className="flex-[3] min-w-0 h-full">
                      <ActivityChart applications={nonDeletedApps} messages={nonDeletedMsgs} />
                    </div>
                    <div className="flex-[2] min-w-0 h-full">
                      <OutcomeChartWidget applications={nonDeletedApps} />
                    </div>
                  </div>
                  <RecentActivityCard
                    title="Recent Applications"
                    items={nonDeletedApps}
                    type="application"
                    onViewAll={() => setActiveTab('applications')}
                  />
                </div>

                <div className="lg:col-span-1 w-full flex flex-col gap-6">
                  <CalendarWidget applications={nonDeletedApps} messages={nonDeletedMsgs} />
                  <ScheduledInterviewsCard interviews={upcomingInterviews} onItemClick={setSelectedAppDetails} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="flex flex-col gap-6">
              <div className="px-4 sm:px-0">
                <h1 className="text-2xl font-bold text-gray-900 m-0">Applications</h1>
              </div>

              <ScheduledInterviewsCard interviews={upcomingInterviews} onItemClick={setSelectedAppDetails} />

              <div className="flex justify-end px-1 sm:px-0">
                <div className="admin-filters !mb-0 !gap-3 w-full sm:w-auto flex flex-col sm:flex-row">
                  <div className="relative flex-grow sm:w-[350px]">
                    <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search entries..."
                      className="admin-search-input !pl-11 w-full"
                      value={appSearch}
                      onChange={(e) => setAppSearch(e.target.value)}
                    />
                  </div>
                  <CustomStatusSelect
                    value={appStatusFilter}
                    onChange={(val) => setAppStatusFilter(val)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full items-start">
                {[
                  { title: 'Applied', status: 'pending' },
                  { title: 'Interview', status: 'interview' },
                  { title: 'Accepted', status: 'accepted' },
                  { title: 'Rejected', status: 'rejected' },
                  ...(appStatusFilter === 'trash' ? [{ title: 'Trash', status: 'trash' }] : [])
                ].map((col) => {
                  let items;
                  if (col.status === 'trash') {
                    items = filteredApps.filter(app => app.deleted);
                  } else {
                    items = filteredApps.filter(app => app.status === col.status && !app.deleted);
                  }

                  if (items.length === 0 && col.status === 'trash' && appStatusFilter !== 'trash') return null;
                  if (items.length === 0 && appStatusFilter !== 'all' && col.status !== appStatusFilter) return null;
                  const sortPref = columnSorts[col.status];
                  items = items.sort((a, b) => {
                    const getTime = (val) => val?.toMillis ? val.toMillis() : (val instanceof Date ? val.getTime() : new Date(val || 0).getTime());
                    if (sortPref === 'date_asc') return getTime(a.createdAt) - getTime(b.createdAt);
                    if (sortPref === 'alpha_asc') return (a.firstName || '').localeCompare(b.firstName || '');
                    if (sortPref === 'alpha_desc') return (b.firstName || '').localeCompare(a.firstName || '');
                    return getTime(b.createdAt) - getTime(a.createdAt);
                  });

                  return (
                    <div key={col.status} className="flex flex-col gap-3">
                      <div className="flex items-center justify-between px-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[11px] font-bold text-gray-400 tracking-widest">{col.title}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#FFB347] text-white`}>{items.length}</span>
                        </div>
                        <ColumnSortSelect
                          value={columnSorts[col.status]}
                          onChange={(val) => setColumnSorts(prev => ({ ...prev, [col.status]: val }))}
                        />
                      </div>

                      <div className="flex flex-col h-[600px] bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
                        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                          {items.length > 0 ? (
                            items.map((item, idx) => (
                              <div
                                key={item.id}
                                onClick={() => setSelectedAppDetails(item)}
                                className={`p-5 hover:bg-black/5 transition-colors cursor-pointer group flex flex-col gap-3 ${idx !== items.length - 1 ? 'border-b border-gray-100' : ''}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0 border border-black group-hover:scale-105 transition-transform">
                                    {item.firstName?.[0]}{item.lastName?.[0]}
                                  </div>
                                  <div className="flex flex-col gap-0.5 overflow-hidden">
                                    <h4 className="font-bold text-gray-900 leading-tight truncate">{item.firstName} {item.lastName}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold tracking-wider truncate">{item.positionApplied}</p>
                                  </div>
                                </div>

                                {item.status === 'interview' && (
                                  <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500 mb-0.5">
                                      <IoTimeOutline size={10} strokeWidth={2} />
                                      <span>{item.interviewType === 'pre-screening' ? 'Pre-screening' : 'Final Interview'}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-900 ml-3.5 font-semibold leading-tight">{formatInterviewDate(item.interviewScheduledAt)}</p>
                                  </div>
                                )}

                                <div className="flex flex-col gap-2 pt-1 border-t border-gray-50 mt-1">
                                  <div className="flex items-center justify-end w-full">
                                    <div className="flex gap-1">
                                      {item.deleted ? (
                                        <button
                                          type="button"
                                          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white rounded-full transition-all active:scale-95"
                                          title="Restore Applicant"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRestoreApplication(item.id);
                                          }}
                                        >
                                          <IoChevronForwardOutline size={18} className="rotate-180" />
                                        </button>
                                      ) : (
                                        <>
                                          {(() => {
                                            const scheduledDate = item.interviewScheduledAt?.toDate ? item.interviewScheduledAt.toDate() : (item.interviewScheduledAt ? new Date(item.interviewScheduledAt) : null);
                                            const isUpcoming = scheduledDate && scheduledDate > new Date();

                                            return (
                                              <div className="flex gap-1">
                                                {isUpcoming && (
                                                  <button
                                                    type="button"
                                                    className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white rounded-full transition-all active:scale-95"
                                                    title="Reschedule Interview"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setSchedulingApp(item);
                                                    }}
                                                  >
                                                    <IoCalendarOutline size={18} />
                                                  </button>
                                                )}

                                                {(item.status === 'pending' || (item.status === 'interview' && !isUpcoming && item.interviewType === 'pre-screening')) && (
                                                  <button
                                                    type="button"
                                                    className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white rounded-full transition-all active:scale-95"
                                                    title={item.status === 'interview' ? 'Schedule Final Interview' : 'Schedule Pre-screening'}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setSchedulingApp(item);
                                                    }}
                                                  >
                                                    <IoCalendarOutline size={18} />
                                                  </button>
                                                )}
                                              </div>
                                            );
                                          })()}
                                          <button
                                            type="button"
                                            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white rounded-full transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
                                            title={item.status === 'pending' ? 'Pre-screening required' : item.interviewType === 'pre-screening' ? 'Final Interview required' : 'Accept Applicant'}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setPendingDecision({ application: item, status: 'accepted' });
                                            }}
                                            disabled={item.status === 'pending' || (item.status === 'interview' && item.interviewType === 'pre-screening') || item.status === 'accepted'}
                                          >
                                            <IoCheckmarkCircleOutline size={18} />
                                          </button>
                                          <button
                                            type="button"
                                            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white rounded-full transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
                                            title="Reject Applicant"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setPendingDecision({ application: item, status: 'rejected' });
                                            }}
                                            disabled={item.status === 'rejected'}
                                          >
                                            <IoCloseOutline size={20} />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center py-12 opacity-30">
                              <IoGridOutline size={24} className="mb-2" />
                              <p className="text-[10px] font-bold tracking-widest text-center">Empty</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
