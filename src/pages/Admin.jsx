import { useEffect, useMemo, useState } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, getIdTokenResult } from 'firebase/auth';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp, getDoc, deleteDoc, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { IoMenuOutline, IoCloseOutline, IoGridOutline, IoDocumentTextOutline, IoChatbubbleEllipsesOutline, IoChevronBackOutline, IoChevronForwardOutline, IoLogOutOutline, IoWarningOutline, IoMailOutline, IoLockClosedOutline, IoTimeOutline, IoPersonOutline, IoCheckmarkCircleOutline, IoSearchOutline, IoCalendarOutline, IoTrashOutline, IoChevronDownOutline, IoFilterOutline, IoNotificationsOutline, IoStarOutline, IoArchiveOutline, IoArrowBackOutline, IoArrowForwardOutline, IoCameraOutline, IoPulseOutline, IoListOutline, IoExpandOutline, IoContractOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'motion/react';
import emailjs from '@emailjs/browser';
import logo from '../assets/logo.png';
import icon from '../assets/icon.png';
import Grainient from '../components/Grainient';
import { uploadProfileImage } from '../lib/api';
import { POSITION_OPTIONS } from '../lib/applicationOptions';
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
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const handlePrevMonth = () => setDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setDate(new Date(currentYear, currentMonth + 1, 1));
  const handleMonthChange = (e) => setDate(new Date(currentYear, parseInt(e.target.value), 1));
  const handleYearChange = (e) => setDate(new Date(parseInt(e.target.value), currentMonth, 1));

  const today = new Date();

  return (
    <div className="admin-card w-full !m-0 flex flex-col shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-1.5">
          <select 
            value={currentMonth} 
            onChange={handleMonthChange}
            className="text-sm font-bold bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 outline-none text-gray-700 focus:border-black focus:bg-white transition-all cursor-pointer hover:shadow-sm"
          >
            {monthNames.map((name, i) => <option key={name} value={i} className="text-sm font-bold">{name}</option>)}
          </select>
          <select 
            value={currentYear} 
            onChange={handleYearChange}
            className="text-sm font-bold bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 outline-none text-gray-700 focus:border-black focus:bg-white transition-all cursor-pointer hover:shadow-sm"
          >
            {years.map(y => <option key={y} value={y} className="text-sm font-bold">{y}</option>)}
          </select>
        </div>
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
  const [selectedWeekDate, setSelectedWeekDate] = useState(new Date());

  const chartData = useMemo(() => {
    const days = [];
    const now = selectedWeekDate;
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
  }, [applications, messages, selectedWeekDate]);

  const maxVal = Math.max(...chartData.map(d => d.apps + d.msgs), 5); // Minimum 5 for scale

  return (
    <div className="admin-card w-full h-full !m-0 flex flex-col shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-gray-800 !mb-0">Weekly Activity</h3>
          <span className="text-[10px] font-bold text-gray-400 tracking-wider">
            Week of {chartData[0].date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {chartData[6].date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Week Jump Selectors */}
          <div className="flex items-center gap-1">
            <select 
              value={selectedWeekDate.getMonth()} 
              onChange={(e) => {
                const newDate = new Date(selectedWeekDate);
                newDate.setMonth(parseInt(e.target.value));
                setSelectedWeekDate(newDate);
              }}
              className="text-[10px] font-black uppercase tracking-wider bg-gray-50 border border-gray-100 rounded-xl px-2 py-1.5 outline-none text-gray-500 cursor-pointer hover:text-black hover:bg-white hover:shadow-sm transition-all"
            >
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((name, i) => (
                <option key={name} value={i}>{name}</option>
              ))}
            </select>
            <select 
              value={selectedWeekDate.getFullYear()} 
              onChange={(e) => {
                const newDate = new Date(selectedWeekDate);
                newDate.setFullYear(parseInt(e.target.value));
                setSelectedWeekDate(newDate);
              }}
              className="text-[10px] font-black uppercase tracking-wider bg-gray-50 border border-gray-100 rounded-xl px-2 py-1.5 outline-none text-gray-500 cursor-pointer hover:text-black hover:bg-white hover:shadow-sm transition-all"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
            <button 
              onClick={() => setSelectedWeekDate(new Date(selectedWeekDate.getTime() - 7 * 24 * 60 * 60 * 1000))}
              className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all"
              title="Previous Week"
            >
              <IoChevronBackOutline size={14} />
            </button>
            <button 
              onClick={() => setSelectedWeekDate(new Date())}
              className="px-2 py-1 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
              Current
            </button>
            <button 
              onClick={() => setSelectedWeekDate(new Date(selectedWeekDate.getTime() + 7 * 24 * 60 * 60 * 1000))}
              className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all"
              title="Next Week"
            >
              <IoChevronForwardOutline size={14} />
            </button>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
            <div className="flex items-center gap-1.5 sm:flex hidden">
              <span className="w-2 h-2 rounded-full bg-[#133020]"></span>
              <span className="text-[9px] font-black text-gray-400 tracking-wider">APPS</span>
            </div>
            <div className="flex items-center gap-1.5 sm:flex hidden">
              <span className="w-2 h-2 rounded-full bg-[#ffb347]"></span>
              <span className="text-[9px] font-black text-gray-400 tracking-wider">MSGS</span>
            </div>
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
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const stats = useMemo(() => {
    let accepted = 0;
    let rejected = 0;
    (applications || []).forEach(app => {
      const appDate = app.createdAt?.toDate ? app.createdAt.toDate() : new Date(app.createdAt || 0);
      if (appDate.getMonth() === selectedMonth && appDate.getFullYear() === selectedYear) {
        if (app.status === 'accepted') accepted++;
        if (app.status === 'rejected') rejected++;
      }
    });
    const total = accepted + rejected;
    return { accepted, rejected, total };
  }, [applications, selectedMonth, selectedYear]);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const acceptedPercentage = stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0;
  const strokeDasharray = `${acceptedPercentage} ${100 - acceptedPercentage}`;

  return (
    <div className="admin-card w-full h-full flex flex-col shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h3 className="text-lg font-bold text-gray-800 !mb-0">Outcome Rate</h3>
        <div className="flex items-center gap-1.5">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="text-[11px] font-bold bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 outline-none text-gray-700 focus:border-black focus:bg-white transition-all cursor-pointer hover:shadow-sm"
          >
            {monthNames.map((name, i) => <option key={name} value={i}>{name.slice(0, 3)}</option>)}
          </select>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="text-[11px] font-bold bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 outline-none text-gray-700 focus:border-black focus:bg-white transition-all cursor-pointer hover:shadow-sm"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {stats.total === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center opacity-40 py-12">
          <IoCheckmarkCircleOutline size={32} className="mb-2" />
          <span className="text-xs font-bold tracking-widest text-center mt-2">No Outcome Data Yet</span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 lg:gap-12 px-2 py-4">
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
      )}
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
                    <div className="flex items-center gap-2 text-[11px] shrink-0">
                        <span className={`status-badge ${item.status || (type === 'application' ? 'pending' : 'new')} !px-2 !py-0.5 !text-[8px] !font-black uppercase tracking-wider`}>
                          {type === 'application' ? (item.status || 'pending') : (item.status === 'new' ? 'Pending' : (item.status || 'new'))}
                        </span>
                      <span className="text-gray-400 font-medium">{formatActivityDate(item.createdAt)}</span>
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
                    label: application.status === 'rejected' ? 'Rejected' : 
                           (application.status === 'accepted' ? 'Hired' : 
                           (application.status === 'withdrew' ? 'Withdrew / Dropped Out' : 
                           (application.status === 'deleted' ? 'Deleted' : 'Outcome'))),
                    id: 3,
                    date: application.deletedAt || application.decisionAt || ((application.status === 'accepted' || application.status === 'rejected' || application.status === 'withdrew' || application.status === 'deleted') ? application.updatedAt : null)
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
                  const isWithdrew = step.id === 3 && application.status === 'withdrew';
                  const isDeleted = step.id === 3 && application.status === 'deleted';

                  let dotColor = isCurrent ? "bg-black text-white" : "bg-gray-200 text-gray-400";
                  if (isCurrent && (isRejected || isAccepted || isWithdrew || isDeleted)) {
                    dotColor = isRejected ? "bg-red-500 text-white" : 
                               (isAccepted ? "bg-green-600 text-white" : 
                               (isWithdrew ? "bg-purple-600 text-white" : "bg-gray-500 text-white"));
                  }
                  if (!isCurrent) dotColor = "bg-green-50 text-green-700 shadow-sm border border-green-100"; // Previous is always "done"

                  const stepDate = step.date ? (step.date.toDate ? step.date.toDate() : new Date(step.date)) : null;

                  return (
                    <div key={idx} className="flex items-start gap-2 sm:gap-4">
                      {idx > 0 && <div className="w-4 sm:w-10 h-0.5 bg-gray-300 mt-5"></div>}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${dotColor} ${isCurrent && !isRejected && !isAccepted && !isWithdrew && !isDeleted ? 'ring-4 ring-black/10' : ''}`}>
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
      ...messages.filter(m => m.status !== 'spam').map(msg => ({ ...msg, type: 'message', timestamp: msg.createdAt }))
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
      ...messages.filter(m => m.status !== 'spam' && (m.createdAt?.toMillis ? m.createdAt.toMillis() : new Date(m.createdAt).getTime()) > lastCheck)
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

function MessageSidePanel({ isOpen, onClose, message, onStatusUpdate }) {
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
    if (message.status === 'new') {
      onStatusUpdate(message.id, 'replied');
    }
  };

  const statusColors = {
    new: 'bg-blue-50 text-blue-600 border-blue-100',
    replied: 'bg-amber-50 text-amber-600 border-amber-100',
    resolved: 'bg-green-50 text-green-700 border-green-100',
    spam: 'bg-red-50 text-red-600 border-red-100',
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
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors flex items-center gap-2 group"
              >
                <IoArrowBackOutline size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-medium">Back</span>
              </button>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[message.status || 'new']}`}>
                  {message.status === 'new' ? 'Pending' : (message.status || 'new')}
                </span>
                
                <div className="flex items-center gap-1.5 ml-2 border-l border-gray-100 pl-3">
                  {message.status !== 'resolved' && message.status !== 'spam' && (
                    <button
                      onClick={() => onStatusUpdate(message.id, 'resolved')}
                      disabled={message.status !== 'replied'}
                      className="px-4 py-1.5 bg-[#133020] text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-black transition-all active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed"
                      title={message.status !== 'replied' ? 'You must reply first' : 'Mark as Resolved'}
                    >
                      Resolve
                    </button>
                  )}
                  {message.status !== 'spam' && (
                    <button
                      onClick={() => onStatusUpdate(message.id, 'spam')}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                      title="Report Spam"
                    >
                      <IoWarningOutline size={20} />
                    </button>
                  )}
                </div>
              </div>
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
                  {message.status === 'replied' && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">
                       <IoCheckmarkCircleOutline size={16} />
                       Reply Sent
                    </div>
                  )}
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
  const isWithdrew = status === 'withdrew';
  const colorClass = isAccept ? 'bg-green-50 text-green-600' : isWithdrew ? 'bg-purple-50 text-purple-600' : 'bg-red-50 text-red-600';
  const btnClass = isAccept ? 'bg-green-600 hover:bg-green-700' : isWithdrew ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700';

  const title = isAccept ? 'Accept Applicant?' : isWithdrew ? 'Mark as Withdrew / Dropped Out?' : 'Reject Applicant?';
  const body = isAccept ? `Are you sure you want to accept ` : isWithdrew ? `Mark ` : `Are you sure you want to reject `;
  const bodyEnd = isAccept
    ? `? This will send an automatic email notification to them.`
    : isWithdrew
    ? ` as "Withdrew / Dropped Out"? No email will be sent.`
    : `? This will send an automatic email notification to them.`;
  const confirmLabel = isAccept ? 'Yes, Confirm Acceptance' : isWithdrew ? 'Yes, Mark as Withdrew' : 'Yes, Confirm Rejection';
  const IconEl = isAccept ? IoCheckmarkCircleOutline : isWithdrew ? IoArrowBackOutline : IoWarningOutline;

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
          <IconEl size={40} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-8 leading-relaxed text-sm">
          {body}<strong>{application.firstName} {application.lastName}</strong>{bodyEnd}
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => {
              onConfirm(application.id, status);
              onClose();
            }}
            className={`w-full py-3.5 text-white rounded-full text-sm font-bold transition-all shadow-md active:scale-95 ${btnClass}`}
          >
            {confirmLabel}
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
    { value: 'pending', label: 'Applied' },
    { value: 'interview', label: 'Interview' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'withdrew', label: 'Withdrew / Dropped Out' },
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
                className={`text-left px-5 py-2.5 text-sm transition-colors hover:bg-gray-50 flex items-center gap-2 ${opt.value === value ? 'text-[#133020] font-semibold bg-[#133020]/5' : 'text-gray-600 font-medium'}`}
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



function CustomMessageStatusSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { value: 'all', label: 'Inquiries' },
    { value: 'new', label: 'Pending' },
    { value: 'replied', label: 'Replied' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'spam', label: 'Spam' },
  ];
  const selectedLabel = options.find(opt => opt.value === value)?.label || 'Inquiries';

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
                className={`text-left px-5 py-2.5 text-sm transition-colors hover:bg-gray-50 flex items-center gap-2 ${opt.value === value ? 'text-[#133020] font-semibold bg-[#133020]/5' : 'text-gray-600 font-medium'}`}
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

function CustomMessageFilterSelect({ value, onChange, options, prefix, dropdownClassName }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(opt => opt.value === value)?.label || options[0].label;

  return (
    <div className="relative w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="admin-select w-full sm:w-auto flex items-center justify-between gap-3 text-gray-700 font-medium hover:border-gray-300 transition-colors"
      >
        <div className="flex items-center gap-2">
          {prefix && <span className="text-gray-400 font-medium">{prefix}</span>}
          <span className="truncate max-w-[150px]">{selectedLabel}</span>
        </div>
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
            className={`absolute top-full mt-2 left-0 bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden z-[100] flex flex-col py-2 ${dropdownClassName || 'w-full sm:w-48'}`}
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`text-left px-5 py-2.5 text-sm transition-colors hover:bg-gray-50 flex items-center gap-2 ${opt.value === value ? 'text-[#133020] font-semibold bg-[#133020]/5' : 'text-gray-600 font-medium'}`}
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

function LogDetailsModal({ isOpen, onClose, log }) {
  if (!isOpen || !log) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Pending';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const actionColors = {
    status_update: 'bg-blue-50 text-blue-600',
    interview_schedule: 'bg-amber-50 text-amber-600',
    interview_reschedule: 'bg-orange-50 text-orange-600',
    application_delete: 'bg-red-50 text-red-600',
    application_restore: 'bg-green-50 text-green-600',
    message_delete: 'bg-red-50 text-red-600',
    message_status_update: 'bg-blue-50 text-blue-600',
    message_restore: 'bg-green-50 text-green-600',
  };

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
        className="relative w-full max-w-lg bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 p-6 sm:p-10"
      >
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-black shadow-lg">
                {log.adminEmail?.[0].toUpperCase()}
             </div>
             <div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">Activity Details</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Audit Log Entry</p>
             </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
            <IoCloseOutline size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh] pr-2 custom-scrollbar">
          <div className="p-5 sm:p-6 bg-gray-50 rounded-[32px] border border-gray-100 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Administrator</span>
                <span className="text-sm font-bold text-gray-900 break-all">{log.adminEmail}</span>
                <span className="text-[9px] font-bold text-[#133020] uppercase tracking-wider bg-[#133020]/5 px-2 py-0.5 rounded-full w-fit mt-1">
                  {log.adminRole?.replace('_', ' ')}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Timestamp</span>
                <span className="text-sm font-bold text-gray-900 leading-tight whitespace-pre-wrap">{formatDate(log.timestamp)}</span>
              </div>
            </div>
            
            <div className="h-px bg-gray-200/50 w-full" />

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Action Performed</span>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${actionColors[log.actionType] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                <IoPulseOutline size={18} />
                <span className="text-sm font-black uppercase tracking-wider">{log.actionType?.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Target Information</span>
            <div className="flex flex-col gap-4 p-6 bg-white border border-gray-100 rounded-[32px] shadow-sm">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    <IoPersonOutline size={20} />
                 </div>
                 <div className="flex flex-col min-w-0">
                    <span className="text-base font-bold text-gray-900 truncate">{log.targetName}</span>
                    <span className="text-xs text-gray-400 font-medium break-all">ID: {log.targetId}</span>
                 </div>
              </div>

              {log.details && Object.keys(log.details).length > 0 && (
                <div className="mt-2 flex flex-col gap-3">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Metadata</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(log.details).map(([key, value]) => (
                      <div key={key} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-0.5">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="text-xs font-bold text-gray-800 break-all">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-10 py-4 bg-black hover:bg-gray-800 text-white rounded-full text-sm font-bold shadow-xl transition-all active:scale-95"
        >
          Close Log Details
        </button>
      </motion.div>
    </div>
  );
}

export default function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState(null); // super_admin, app_admin, inquiry_admin

  const navWithIcons = useMemo(() => {
    const all = [
      { id: "dashboard", label: "Dashboard", icon: <IoGridOutline size={20} /> },
      { id: "applications", label: "Applications", icon: <IoDocumentTextOutline size={20} />, permission: 'app_admin' },
      { id: "messages", label: "Messages", icon: <IoChatbubbleEllipsesOutline size={20} />, permission: 'inquiry_admin' },
      { id: "logs", label: "Activity Logs", icon: <IoListOutline size={20} />, permission: 'super_admin' },
    ];
    
    if (adminRole === 'super_admin') return all;
    if (adminRole === 'app_admin') return [all[0], all[1]];
    if (adminRole === 'inquiry_admin') return [all[0], all[2]];
    return [all[0]];
  }, [adminRole]);

  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [actionMessage, setActionMessage] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Idle Logout: 20 minutes (20 * 60 * 1000 ms)
  useEffect(() => {
    if (!isAdmin || !currentUser) return undefined;

    const IDLE_TIMEOUT = 20 * 60 * 1000;
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const updateActivity = () => setLastActivity(Date.now());

    events.forEach(event => window.addEventListener(event, updateActivity));

    const checkIdle = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity > IDLE_TIMEOUT) {
        signOut(auth);
        sessionStorage.removeItem('admin_access_granted');
        setActionMessage({ text: 'Session expired due to inactivity.', type: 'error' });
      }
    }, 60000); // Check every minute

    return () => {
      events.forEach(event => window.removeEventListener(event, updateActivity));
      clearInterval(checkIdle);
    };
  }, [isAdmin, currentUser, lastActivity]);

  // Sidebar & Navigation state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | applications | messages | account
  const [newName, setNewName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [newPhotoURL, setNewPhotoURL] = useState('');
  const [schedulingApp, setSchedulingApp] = useState(null);
  const [selectedAppDetails, setSelectedAppDetails] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteConfirmApp, setDeleteConfirmApp] = useState(null);
  const [pendingDecision, setPendingDecision] = useState(null); // { application, status }
  const [selectedLog, setSelectedLog] = useState(null);
  const [adminProfiles, setAdminProfiles] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null); // The profile document we are currently editing

  // Filters
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('all');
  const [appPositionFilter, setAppPositionFilter] = useState('all');
  const [msgSearch, setMsgSearch] = useState('');
  const [msgStatusFilter, setMsgStatusFilter] = useState('all');
  const [msgSortOrder, setMsgSortOrder] = useState('date_desc');
  const [msgDateFilter, setMsgDateFilter] = useState('all');
  const [msgPage, setMsgPage] = useState(1);
  const [logPage, setLogPage] = useState(1);
  const [columnSorts, setColumnSorts] = useState({
    pending: 'date_asc',
    interview: 'date_asc',
    accepted: 'date_desc',
    rejected: 'date_desc',
    withdrew: 'date_desc',
  });
  const [msgColumnSorts, setMsgColumnSorts] = useState({
    new: 'date_asc',
    replied: 'date_asc',
    resolved: 'date_asc'
  });
  const [expandedColumn, setExpandedColumn] = useState(null);
  const [columnPages, setColumnPages] = useState({
    pending: 1,
    interview: 1,
    accepted: 1,
    rejected: 1,
    withdrew: 1,
    trash: 1,
  });

  useEffect(() => {
    setColumnPages({
      pending: 1,
      interview: 1,
      accepted: 1,
      rejected: 1,
      withdrew: 1,
      trash: 1,
    });
  }, [appSearch, appStatusFilter, appPositionFilter]);





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
        setAdminRole(null);
        setAuthLoading(false);
        return;
      }

      const email = user.email ? user.email.toLowerCase() : '';
      const emailAdmin = allowedAdminEmails.includes(email);
      
      const token = await getIdTokenResult(user);
      const claimAdmin = Boolean(token.claims.admin);
      setIsAdmin(claimAdmin || emailAdmin);

      // Determine specific role
      if (email === 'admin@lifewood.com') {
        setAdminRole('super_admin');
      } else if (email === 'applicants@lifewood.com') {
        setAdminRole('app_admin');
      } else if (email === 'support@lifewood.com') {
        setAdminRole('inquiry_admin');
      } else if (claimAdmin || emailAdmin) {
        setAdminRole('super_admin'); // Fallback for other admins
      } else {
        setAdminRole(null);
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [allowedAdminEmails]);

  // Fetch admin profiles
  useEffect(() => {
    if (!isAdmin) return undefined;

    const unsub = onSnapshot(collection(db, 'admin_profiles'), (snapshot) => {
      const profiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdminProfiles(profiles);
      
      // Initialize editingAdmin with current user's profile if not already set
      if (!editingAdmin && currentUser) {
        const myProfile = profiles.find(p => p.id === currentUser.email);
        if (myProfile) {
          setEditingAdmin(myProfile);
          setNewName(myProfile.displayName || '');
          setNewPhotoURL(myProfile.photoURL || '');
        } else {
          // If no profile in Firestore yet, use Auth session data
          const fallbackProfile = { 
            id: currentUser.email, 
            displayName: currentUser.displayName || '', 
            photoURL: currentUser.photoURL || '',
            role: adminRole
          };
          setEditingAdmin(fallbackProfile);
          setNewName(fallbackProfile.displayName);
          setNewPhotoURL(fallbackProfile.photoURL);
        }
      } else if (editingAdmin) {
        // Keep editingAdmin in sync if it's updated in Firestore
        const updated = profiles.find(p => p.id === editingAdmin.id);
        if (updated) {
          setEditingAdmin(updated);
        }
      }
    });

    return () => unsub();
  }, [isAdmin, currentUser, adminRole]);



  useEffect(() => {
    if (!isAdmin || adminRole !== 'super_admin') return undefined;

    const logsQuery = query(collection(db, 'activity_logs'), orderBy('timestamp', 'desc'), limit(100));
    const unsubLogs = onSnapshot(logsQuery, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActivityLogs(docs);
    });

    return () => unsubLogs();
  }, [isAdmin, adminRole]);

  const logAction = async (actionType, targetId, targetName, details = {}) => {
    try {
      if (!currentUser?.email) return;
      
      await addDoc(collection(db, 'activity_logs'), {
        adminEmail: currentUser.email,
        adminRole: adminRole,
        actionType,
        targetId,
        targetName,
        details,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error logging action:', error);
    }
  };

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

  useEffect(() => {
    if (currentUser) {
      setNewName(currentUser.displayName || '');
      setNewPhotoURL(currentUser.photoURL || '');
    }
  }, [currentUser]);

  const handleUpdateProfile = async () => {
    if (!currentUser || !editingAdmin || adminRole !== 'super_admin') return;
    setIsUpdatingProfile(true);
    setActionMessage(null);

    try {
      // Always save to Firestore admin_profiles
      await updateDoc(doc(db, 'admin_profiles', editingAdmin.id), {
        displayName: newName || editingAdmin.displayName || '',
        photoURL: newPhotoURL || editingAdmin.photoURL || null,
        updatedAt: serverTimestamp()
      }).catch(async (err) => {
        // If doc doesn't exist, create it (fallback for first time)
        if (err.code === 'not-found') {
          const { setDoc } = await import('firebase/firestore');
          await setDoc(doc(db, 'admin_profiles', editingAdmin.id), {
            displayName: newName || editingAdmin.displayName || '',
            photoURL: newPhotoURL || editingAdmin.photoURL || null,
            email: editingAdmin.id,
            role: editingAdmin.role || 'admin',
            updatedAt: serverTimestamp()
          });
        } else throw err;
      });
      
      // If editing current user, also update Auth profile as a mirror
      if (editingAdmin.id === currentUser.email) {
        await updateProfile(currentUser, {
          displayName: newName,
          photoURL: newPhotoURL || currentUser.photoURL
        });
        await auth.currentUser.reload();
        setCurrentUser({...auth.currentUser});
      }
      
      setActionMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      setActionMessage({ text: error?.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !editingAdmin || adminRole !== 'super_admin') return;

    setIsUpdatingProfile(true);
    setActionMessage(null);

    try {
      const url = await uploadProfileImage(file);
      setNewPhotoURL(url);
      
      // Save to Firestore
      await updateDoc(doc(db, 'admin_profiles', editingAdmin.id), {
        photoURL: url,
        updatedAt: serverTimestamp()
      }).catch(async (err) => {
        if (err.code === 'not-found') {
          const { setDoc } = await import('firebase/firestore');
          await setDoc(doc(db, 'admin_profiles', editingAdmin.id), {
            photoURL: url,
            email: editingAdmin.id,
            updatedAt: serverTimestamp()
          });
        }
      });

      // If editing self, mirror to Auth
      if (editingAdmin.id === currentUser.email) {
        await updateProfile(auth.currentUser, {
          photoURL: url
        });
        await auth.currentUser.reload();
        setCurrentUser({...auth.currentUser});
      }
      setActionMessage({ text: 'Profile image updated successfully!', type: 'success' });
    } catch (error) {
      setActionMessage({ text: error?.message || 'Failed to upload image.', type: 'error' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

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
      let applicantData = null;
      if (appDoc.exists()) {
        applicantData = appDoc.data();
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

        // Log the action
        await logAction('status_update', applicationId, `${applicantData.firstName} ${applicantData.lastName}`, { status });
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
      let applicantData = null;
      if (appDocPre.exists()) {
        applicantData = appDocPre.data();
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

        // Log the action
        await logAction(isRescheduling ? 'interview_reschedule' : 'interview_schedule', applicationId, `${applicantData.firstName} ${applicantData.lastName}`, { 
          type: scheduleData.type, 
          date: scheduleData.date, 
          time: scheduleData.time 
        });
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
      const app = applications.find(a => a.id === applicationId);
      await updateDoc(doc(db, 'applications', applicationId), {
        deleted: true,
        status: 'deleted',
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await logAction('application_delete', applicationId, `${app?.firstName} ${app?.lastName}`, { originalStatus: app?.status });
      
      setSelectedAppDetails(null);
      setActionMessage({ text: 'Applicant moved to trash.', type: 'success' });
    } catch (error) {
      setActionMessage({ text: error?.message || 'Unable to move applicant to trash.', type: 'error' });
    }
  };

  const handleRestoreApplication = async (applicationId) => {
    try {
      const app = applications.find(a => a.id === applicationId);
      await updateDoc(doc(db, 'applications', applicationId), {
        deleted: false,
        status: 'pending', // Default back to pending as the status was changed to 'deleted'
        updatedAt: serverTimestamp(),
      });
      await logAction('application_restore', applicationId, `${app?.firstName} ${app?.lastName}`);

      setActionMessage({ text: 'Applicant restored successfully.', type: 'success' });
    } catch (error) {
      setActionMessage({ text: error?.message || 'Unable to restore applicant.', type: 'error' });
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const msg = messages.find(m => m.id === messageId);
      await updateDoc(doc(db, 'messages', messageId), {
        deleted: true,
        status: 'deleted',
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await logAction('message_delete', messageId, msg?.name, { subject: msg?.subject, originalStatus: msg?.status });

      setActionMessage({ text: 'Message moved to trash.', type: 'success' });
    } catch (error) {
      setActionMessage({ text: error?.message || 'Unable to move message to trash.', type: 'error' });
    }
  };

  const handleMessageStatusUpdate = async (messageId, status) => {
    setActionMessage(null);
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        status,
        updatedAt: serverTimestamp(),
      });
      const msg = messages.find(m => m.id === messageId);
      await logAction('message_status_update', messageId, msg?.name, { status, subject: msg?.subject });

      setActionMessage({ text: `Message marked as ${status}.`, type: 'success' });
    } catch (error) {
      setActionMessage({ text: error?.message || 'Unable to update message status.', type: 'error' });
    }
  };

  const handleRestoreMessage = async (messageId) => {
    try {
      const msg = messages.find(m => m.id === messageId);
      await updateDoc(doc(db, 'messages', messageId), {
        deleted: false,
        status: 'new', // Default back to new as the status was changed to 'deleted'
        updatedAt: serverTimestamp(),
      });
      await logAction('message_restore', messageId, msg?.name, { subject: msg?.subject });

      setActionMessage({ text: 'Message restored successfully.', type: 'success' });
    } catch (error) {
      setActionMessage({ text: error?.message || 'Unable to restore message.', type: 'error' });
    }
  };

  // Auto-cleanup rejected applications older than 7 days
  useEffect(() => {
    if (!isAdmin || !applications || applications.length === 0) return;

    const runAutoCleanup = async () => {
      const now = Date.now();
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      
      const expiredApps = applications.filter(app => {
        if (app.status !== 'rejected' || app.deleted) return false;
        const decisionTime = app.decisionAt?.toMillis?.() || app.updatedAt?.toMillis?.() || 0;
        return decisionTime > 0 && (now - decisionTime) > sevenDaysInMs;
      });

      if (expiredApps.length > 0) {
        // Run in sequence or batches to avoid overloading
        for (const app of expiredApps) {
          try {
            await updateDoc(doc(db, 'applications', app.id), {
              deleted: true,
              status: 'deleted',
              deletedAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              autoCleaned: true
            });
          } catch (e) {
            console.error('Auto-cleanup error:', e);
          }
        }
      }
    };

    runAutoCleanup();
  }, [applications.length, isAdmin]);

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
    return nonDeletedApps
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
  }, [nonDeletedApps]);

  const POSITION_FILTER_OPTIONS = useMemo(() => [
    { value: 'all', label: 'All Positions' },
    ...POSITION_OPTIONS.map(pos => ({ value: pos, label: pos }))
  ], []);

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
      const posMatch = appPositionFilter === 'all' || app.positionApplied === appPositionFilter;
      return (nMatch || eMatch || pMatch) && sMatch && posMatch;
    });
  }, [applications, appSearch, appStatusFilter, appPositionFilter]);

  const filteredMsgs = useMemo(() => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const sevenDays = 7 * oneDay;
    const thirtyDays = 30 * oneDay;

    let result = messages.filter((msg) => {
      const term = msgSearch.toLowerCase();
      const nMatch = (msg.name || '').toLowerCase().includes(term) ||
        (msg.email || '').toLowerCase().includes(term) ||
        (msg.subject || '').toLowerCase().includes(term);

      if (msgStatusFilter === 'trash') {
        if (!msg.deleted) return false;
      } else {
        if (msg.deleted) return false;
      }

      // If 'all', hide spam and show everything else. If specific filter, show only that.
      const sMatch = msgStatusFilter === 'all' 
        ? (msg.status !== 'spam') 
        : (msgStatusFilter === 'trash' || msg.status === msgStatusFilter);
      
      if (!(nMatch && sMatch)) return false;

      // Date Filtering
      if (msgDateFilter !== 'all') {
        const msgDate = msg.createdAt?.toDate ? msg.createdAt.toDate() : new Date(msg.createdAt || 0);
        const diff = now - msgDate;
        if (msgDateFilter === 'today' && diff > oneDay) return false;
        if (msgDateFilter === 'week' && diff > sevenDays) return false;
        if (msgDateFilter === 'month' && diff > thirtyDays) return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      // Primary sort: status (resolved at the bottom)
      if (a.status === 'resolved' && b.status !== 'resolved') return 1;
      if (a.status !== 'resolved' && b.status === 'resolved') return -1;

      // Secondary sort: date
      const getTime = (val) => val?.toMillis ? val.toMillis() : (val instanceof Date ? val.getTime() : new Date(val || 0).getTime());
      if (msgSortOrder === 'date_asc') return getTime(a.createdAt) - getTime(b.createdAt);
      return getTime(b.createdAt) - getTime(a.createdAt);
    });

    return result;
  }, [messages, msgSearch, msgStatusFilter, msgDateFilter, msgSortOrder]);

  const { pagedMsgs, maxMsgPages } = useMemo(() => {
    const start = (msgPage - 1) * 10;
    const end = start + 10;
    return {
      pagedMsgs: filteredMsgs.slice(start, end),
      maxMsgPages: Math.max(1, Math.ceil(filteredMsgs.length / 10))
    };
  }, [filteredMsgs, msgPage]);

  const { pagedLogs, maxLogPages } = useMemo(() => {
    const start = (logPage - 1) * 10;
    const end = start + 10;
    return {
      pagedLogs: activityLogs.slice(start, end),
      maxLogPages: Math.max(1, Math.ceil(activityLogs.length / 10))
    };
  }, [activityLogs, logPage]);

  // Reset page when filters change
  useEffect(() => {
    setMsgPage(1);
  }, [msgSearch, msgStatusFilter, msgDateFilter]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      totalApps: nonDeletedApps.length,
      acceptedApps: nonDeletedApps.filter(app => app.status === 'accepted').length,
      pendingApps: nonDeletedApps.filter((a) => a.status === 'pending').length,
      resolvedInquiries: nonDeletedMsgs.filter(m => m.status === 'resolved').length,
      pendingInquiries: nonDeletedMsgs.filter(m => m.status === 'new' || !m.status).length,
      todayMsgs: nonDeletedMsgs.filter((m) => {
        if (!m.createdAt || m.status === 'spam') return false;
        const d = m.createdAt.toDate ? m.createdAt.toDate() : new Date(m.createdAt);
        return d >= today;
      }).length,
    };
  }, [nonDeletedApps, nonDeletedMsgs]);

  if (authLoading) {
    return (
      <main className="min-h-screen bg-white/40 flex flex-col items-center justify-center p-8 backdrop-blur-xl">
        <div className="relative w-24 h-24 mb-10 group">
          <div className="absolute inset-0 border-4 border-[#133020]/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#133020] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-4 flex items-center justify-center">
            <img src={logo} alt="Lifewood Admin" className="w-12 h-12 object-contain opacity-20 group-hover:opacity-40 transition-opacity" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-bold text-[#133020]">Initialising Admin Panel</h2>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-black/10 animate-pulse"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-black/20 animate-pulse delay-75"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-black/30 animate-pulse delay-150"></div>
          </div>
          <p className="text-xs font-bold tracking-widest text-[#133020]/40 uppercase mt-4">Safe & Secure Environment</p>
        </div>
      </main>
    );
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
                  ? "bg-black text-white font-semibold scale-100"
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
            onClick={() => setActiveTab('account')}
            className={`flex items-center justify-center transition-all duration-300 w-12 h-12 rounded-full ${activeTab === 'account'
              ? "bg-black text-white font-semibold scale-100"
              : "text-gray-500 hover:bg-black/5 hover:text-gray-900"
              }`}
            title="Account Settings"
          >
            <IoPersonOutline size={20} />
          </button>

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
      <nav className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#133020]/60 backdrop-blur-xl border-b border-white/20 z-50 flex items-center justify-between px-4">
        <div className="flex items-center shrink-0">
          <img
            src={logo}
            alt="Lifewood Admin"
            className="h-8 w-auto object-contain brightness-0 invert"
          />
        </div>
        <div className="flex items-center gap-1">
          <div className="flex flex-col items-end mr-2 scale-75 origin-right">
            <span className="text-[14px] font-bold text-white leading-none">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-[8px] font-bold text-white/40 uppercase tracking-tighter">
              {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="scale-90 origin-right">
            <NotificationBell 
              applications={adminRole === 'inquiry_admin' ? [] : applications} 
              messages={adminRole === 'app_admin' ? [] : messages} 
              onItemClick={(item) => item.type === 'application' ? setSelectedAppDetails(item) : setSelectedMessage(item)}
            />
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2.5 rounded-2xl hover:bg-white/10 transition-all text-white active:scale-95"
            aria-label="Open menu"
          >
            <IoMenuOutline size={24} />
          </button>
        </div>
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
              className="absolute right-0 top-0 bottom-0 w-[280px] bg-[#133020]/60 backdrop-blur-2xl shadow-2xl flex flex-col border-l border-white/20"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <img
                  src={logo}
                  alt="Lifewood Admin"
                  className="h-8 w-auto object-contain brightness-0 invert"
                />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2.5 rounded-2xl hover:bg-white/10 transition-all text-white/80 hover:text-white active:scale-95"
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
                      className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all text-left ${isActive
                        ? "bg-white/20 text-white backdrop-blur-md border border-white/20"
                        : "text-white/50 hover:bg-white/5 hover:text-white/90"
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
                    setActiveTab('account');
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all text-left ${activeTab === 'account'
                    ? "bg-white/20 text-white backdrop-blur-md border border-white/20"
                    : "text-white/50 hover:bg-white/5 hover:text-white/90"
                    }`}
                >
                  <IoPersonOutline size={18} />
                  Account
                </button>

                <button
                  onClick={() => {
                    setShowSignOutConfirm(true);
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all text-white/50 hover:bg-red-500/20 hover:text-red-300 w-full text-left"
                >
                  <IoLogOutOutline size={18} />
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
        <header className="hidden md:flex px-4 pt-8 pb-4 items-center justify-end w-full gap-6">
          <div className="relative px-6 py-2.5 rounded-2xl overflow-hidden border border-white/20 shadow-sm flex items-center gap-4 group">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] z-[1]"></div>
            <div className="relative z-10 flex flex-col items-end">
              <span className="text-xl font-black text-[#133020] leading-none tracking-tight">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
              <span className="text-[10px] font-bold text-[#133020]/40 uppercase tracking-[0.2em] mt-0.5">
                {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
          <NotificationBell 
            applications={adminRole === 'inquiry_admin' ? [] : applications} 
            messages={adminRole === 'app_admin' ? [] : messages} 
            onItemClick={(item) => item.type === 'application' ? setSelectedAppDetails(item) : setSelectedMessage(item)}
          />
        </header>
        <main className="flex-1 p-4 sm:p-8 w-full">
          <AnimatePresence>
            {selectedMessage && (
              <MessageSidePanel
                isOpen={!!selectedMessage}
                message={selectedMessage}
                onClose={() => setSelectedMessage(null)}
                onStatusUpdate={handleMessageStatusUpdate}
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
                {isDataLoading && (
                  <div className="mb-6 mx-4 sm:mx-0 flex items-center gap-4 p-4 bg-[#133020]/5 rounded-3xl border border-[#133020]/10 animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#133020]"></div>
                    <span className="text-[10px] font-bold text-[#133020] tracking-widest uppercase">Synchronizing Database</span>
                  </div>
                )}

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

                    <div className={`relative z-10 grid grid-cols-2 ${adminRole === 'super_admin' ? 'lg:grid-cols-5' : 'lg:grid-cols-3'} gap-10 w-full pt-8 border-t border-black/5`}>
                      {(adminRole === 'super_admin' || adminRole === 'app_admin') && (
                        <>
                          <div className="transition-all">
                            <h3 className="text-[10px] font-bold text-black tracking-widest mb-2">Total Applications</h3>
                            <div className="text-4xl font-bold text-gray-900 leading-none">{stats.totalApps}</div>
                          </div>
                          <div className="transition-all">
                            <h3 className="text-[10px] font-bold text-black tracking-widest mb-2">Accepted Applicants</h3>
                            <div className="text-4xl font-bold leading-none" style={{ color: '#133020' }}>{stats.acceptedApps}</div>
                          </div>
                        </>
                      )}
                      {(adminRole === 'super_admin' || adminRole === 'app_admin') && (
                        <div className="transition-all">
                          <h3 className="text-[10px] font-bold text-black tracking-widest mb-2">Pending Review</h3>
                          <div className="text-4xl font-bold text-gray-900 leading-none">{stats.pendingApps}</div>
                        </div>
                      )}
                      {(adminRole === 'super_admin' || adminRole === 'inquiry_admin') && (
                        <>
                          <div className="transition-all">
                            <h3 className="text-[10px] font-bold text-black tracking-widest mb-2">Resolved Inquiries</h3>
                            <div className="text-4xl font-bold text-gray-900 leading-none">{stats.resolvedInquiries}</div>
                          </div>
                          <div className="transition-all">
                            <h3 className="text-[10px] font-bold text-black tracking-widest mb-2">Pending Review</h3>
                            <div className="text-4xl font-bold text-gray-900 leading-none">{stats.pendingInquiries}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col xl:flex-row gap-6 w-full items-stretch xl:h-[340px] h-auto mb-6">
                    <div className={`flex-[3] min-w-0 h-full ${adminRole !== 'super_admin' ? 'w-full' : ''}`}>
                      <ActivityChart 
                        applications={adminRole === 'inquiry_admin' ? [] : nonDeletedApps} 
                        messages={adminRole === 'app_admin' ? [] : nonDeletedMsgs} 
                      />
                    </div>
                    {adminRole !== 'inquiry_admin' && (
                      <div className="flex-[2] min-w-0 h-full">
                        <OutcomeChartWidget applications={nonDeletedApps} />
                      </div>
                    )}
                  </div>
                  <div className={`grid gap-6 ${adminRole === 'super_admin' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
                    {(adminRole === 'super_admin' || adminRole === 'app_admin') && (
                      <RecentActivityCard
                        title="Recent Applications"
                        items={nonDeletedApps}
                        type="application"
                        onViewAll={() => setActiveTab('applications')}
                      />
                    )}
                    {(adminRole === 'super_admin' || adminRole === 'inquiry_admin') && (
                      <RecentActivityCard
                        title="Recent Inquiries"
                        items={nonDeletedMsgs.filter(m => m.status !== 'spam')}
                        type="message"
                        onViewAll={() => setActiveTab('messages')}
                      />
                    )}
                  </div>
                </div>

                <div className="lg:col-span-1 w-full flex flex-col gap-6">
                  <CalendarWidget 
                    applications={adminRole === 'inquiry_admin' ? [] : nonDeletedApps} 
                    messages={adminRole === 'app_admin' ? [] : nonDeletedMsgs} 
                  />
                  {(adminRole === 'super_admin' || adminRole === 'app_admin') && (
                    <ScheduledInterviewsCard interviews={upcomingInterviews} onItemClick={setSelectedAppDetails} />
                  )}
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'applications' && (adminRole === 'super_admin' || adminRole === 'app_admin')) && (
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
                  <CustomMessageFilterSelect
                    value={appPositionFilter}
                    onChange={(val) => setAppPositionFilter(val)}
                    options={POSITION_FILTER_OPTIONS}
                    prefix="Position"
                    dropdownClassName="w-full sm:min-w-[320px] sm:w-auto"
                  />
                </div>
              </div>

              <div className={`grid gap-6 w-full items-start transition-all duration-300 ${expandedColumn ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
                {[
                  { title: 'Applied', status: 'pending' },
                  { title: 'Interview', status: 'interview' },
                  { title: 'Accepted', status: 'accepted' },
                  { title: 'Rejected', status: 'rejected' },
                  ...(appStatusFilter === 'withdrew' ? [{ title: 'Withdrew / Dropped Out', status: 'withdrew' }] : []),
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

                  const isExpanded = expandedColumn === col.status;
                  const totalItemsCount = items.length;
                  const pageSize = isExpanded ? 10 : 5;
                  const maxPages = Math.ceil(totalItemsCount / pageSize);
                  const currentPage = columnPages[col.status] || 1;
                  const pagedItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

                  const isHidden = expandedColumn !== null && !isExpanded;

                  return (
                    <div
                      key={col.status}
                      className={`flex flex-col gap-3 transition-all duration-300 ${isHidden ? 'hidden' : ''}`}
                    >
                      <div className="flex items-center justify-between px-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[11px] font-bold text-gray-400 tracking-widest">{col.title}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#FFB347] text-white`}>{totalItemsCount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ColumnSortSelect
                            value={columnSorts[col.status]}
                            onChange={(val) => setColumnSorts(prev => ({ ...prev, [col.status]: val }))}
                          />
                          <button
                            onClick={() => setExpandedColumn(isExpanded ? null : col.status)}
                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all active:scale-95"
                            title={isExpanded ? 'Collapse column' : 'Expand column'}
                          >
                            {isExpanded ? <IoContractOutline size={14} /> : <IoExpandOutline size={14} />}
                          </button>
                        </div>
                      </div>

                      <div className={`bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm ${isExpanded ? '' : 'flex flex-col h-[650px]'}`}>
                        {/* Expanded column headers */}
                        {isExpanded && (
                          <div
                            style={{ gridTemplateColumns: '200px 200px 220px 140px 110px 120px' }}
                            className="grid items-center px-5 py-2.5 border-b border-gray-100 bg-gray-50/70 sticky top-0 gap-4"
                          >
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Name</div>
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Position Applied</div>
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Email</div>
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Date Applied</div>
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</div>
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</div>
                          </div>
                        )}
                        <div className={`pr-1 custom-scrollbar ${isExpanded ? 'overflow-y-auto max-h-[800px]' : 'flex-1 overflow-y-auto'}`}>
                          {pagedItems.length > 0 ? (
                            pagedItems.map((item, idx) => (
                              <div
                                key={item.id}
                                onClick={() => setSelectedAppDetails(item)}
                                style={isExpanded ? { gridTemplateColumns: '200px 200px 220px 140px 110px 120px' } : {}}
                                className={`hover:bg-black/5 transition-colors cursor-pointer group ${idx !== pagedItems.length - 1 ? 'border-b border-gray-100' : ''} ${isExpanded ? 'grid items-center gap-4 px-5 py-3' : 'p-5 flex flex-col gap-3'}`}
                              >
                                {/* ... (rest of applicant item remains the same) */}
                                {/* Avatar + Name */}
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0 border border-black group-hover:scale-105 transition-transform">
                                    {item.firstName?.[0]}{item.lastName?.[0]}
                                  </div>
                                  {isExpanded ? (
                                    <h4 className="font-bold text-gray-900 leading-tight truncate">{item.firstName} {item.lastName}</h4>
                                  ) : (
                                    <div className="flex flex-col gap-0.5 overflow-hidden">
                                      <h4 className="font-bold text-gray-900 leading-tight truncate">{item.firstName} {item.lastName}</h4>
                                      <p className="text-[10px] text-gray-400 font-bold tracking-wider truncate">{item.positionApplied}</p>
                                    </div>
                                  )}
                                </div>

                                {/* Position Applied column (expanded only) */}
                                {isExpanded && (
                                  <div className="overflow-hidden">
                                    <p className="text-[11px] text-gray-500 font-bold tracking-wide truncate">{item.positionApplied}</p>
                                  </div>
                                )}

                                {/* Email column (expanded only) */}
                                {isExpanded && (
                                  <div className="overflow-hidden">
                                    <p className="text-[11px] text-gray-500 font-medium truncate">{item.emailAddress || <span className="text-gray-300">—</span>}</p>
                                  </div>
                                )}

                                {/* Date Applied column (expanded only) */}
                                {isExpanded && (
                                  <div>
                                    {(() => {
                                      const d = item.createdAt?.toDate ? item.createdAt.toDate() : (item.createdAt ? new Date(item.createdAt) : null);
                                      return d ? (
                                        <span className="text-[11px] font-black text-gray-900">{d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                      ) : <span className="text-[11px] text-gray-300 font-bold">—</span>;
                                    })()}
                                  </div>
                                )}

                                {/* Status column (expanded only) */}
                                {isExpanded && (
                                  <div>
                                    {(() => {
                                      const s = item.deleted ? 'trash' : (item.status || 'pending');
                                      const styles = {
                                        pending:     'bg-blue-50 text-blue-600',
                                        interview:   'bg-amber-50 text-amber-600',
                                        accepted:    'bg-green-50 text-green-700',
                                        rejected:    'bg-red-50 text-red-500',
                                        withdrew:    'bg-purple-50 text-purple-600',
                                        trash:       'bg-gray-100 text-gray-400',
                                      };
                                      const labels = {
                                        pending:     'Applied',
                                        interview:   'Interview',
                                        accepted:    'Accepted',
                                        rejected:    'Rejected',
                                        withdrew:    'Withdrew / Dropped Out',
                                        trash:       'Trash',
                                      };
                                      return (
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${styles[s] || styles.pending}`}>
                                          <span className={`w-1.5 h-1.5 rounded-full ${
                                            s === 'pending' ? 'bg-blue-400' :
                                            s === 'interview' ? 'bg-amber-400' :
                                            s === 'accepted' ? 'bg-green-400' :
                                            s === 'rejected' ? 'bg-red-400' :
                                            s === 'withdrew' ? 'bg-purple-400' : 'bg-gray-300'
                                          }`} />
                                          {labels[s] || s}
                                        </span>
                                      );
                                    })()}
                                  </div>
                                )}

                                {/* Interview badge — collapsed card mode only */}
                                {!isExpanded && item.status === 'interview' && (
                                  <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500 mb-0.5">
                                      <IoTimeOutline size={10} strokeWidth={2} />
                                      <span>{item.interviewType === 'pre-screening' ? 'Pre-screening' : 'Final Interview'}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-900 ml-3.5 font-semibold leading-tight">{formatInterviewDate(item.interviewScheduledAt)}</p>
                                  </div>
                                )}

                                {/* Action icons */}
                                <div className={`flex items-center justify-end ${isExpanded ? '' : 'pt-1 border-t border-gray-50 mt-1'}`}>
                                  <div className="flex gap-1">
                                    {item.deleted ? (
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white rounded-full transition-all active:scale-95"
                                        title="Restore Applicant"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRestoreApplication(item.id);
                                        }}
                                      >
                                        <IoChevronForwardOutline size={16} className="rotate-180" />
                                      </button>
                                    ) : (
                                      <div className="flex gap-1">
                                        {(() => {
                                          const scheduledDate = item.interviewScheduledAt?.toDate ? item.interviewScheduledAt.toDate() : (item.interviewScheduledAt ? new Date(item.interviewScheduledAt) : null);
                                          const isUpcoming = scheduledDate && scheduledDate > new Date();

                                          return (
                                            <div className="flex gap-1">
                                              {isUpcoming && (
                                                <button
                                                  type="button"
                                                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white rounded-full transition-all active:scale-95"
                                                  title="Reschedule Interview"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSchedulingApp(item);
                                                  }}
                                                >
                                                  <IoCalendarOutline size={16} />
                                                </button>
                                              )}

                                              {(item.status === 'pending' || (item.status === 'interview' && !isUpcoming && item.interviewType === 'pre-screening')) && (
                                                <button
                                                  type="button"
                                                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white rounded-full transition-all active:scale-95"
                                                  title={item.status === 'interview' ? 'Schedule Final Interview' : 'Schedule Pre-screening'}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSchedulingApp(item);
                                                  }}
                                                >
                                                  <IoCalendarOutline size={16} />
                                                </button>
                                              )}
                                              <button
                                                type="button"
                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white rounded-full transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
                                                title={item.status === 'pending' ? 'Pre-screening required' : item.status === 'rejected' ? 'Cannot accept rejected applicant' : item.interviewType === 'pre-screening' ? 'Final Interview required' : 'Accept Applicant'}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setPendingDecision({ application: item, status: 'accepted' });
                                                }}
                                                disabled={item.status === 'pending' || (item.status === 'interview' && item.interviewType === 'pre-screening') || item.status === 'accepted' || item.status === 'rejected' || item.status === 'withdrew'}
                                              >
                                                <IoCheckmarkCircleOutline size={16} />
                                              </button>
                                              <button
                                                type="button"
                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white rounded-full transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
                                                title="Reject Applicant"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setPendingDecision({ application: item, status: 'rejected' });
                                                }}
                                                disabled={item.status === 'rejected' || item.status === 'withdrew'}
                                              >
                                                <IoCloseOutline size={18} />
                                              </button>
                                              <button
                                                type="button"
                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white rounded-full transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
                                                title="Mark as Withdrew / Dropped Out"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setPendingDecision({ application: item, status: 'withdrew' });
                                                }}
                                                disabled={item.status === 'withdrew' || item.status === 'accepted'}
                                              >
                                                <IoArrowBackOutline size={16} />
                                              </button>
                                            </div>
                                          );
                                        })()}
                                      </div>
                                    )}
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

                        {/* Pagination Bar */}
                        {maxPages > 1 && (
                          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Page {currentPage}/{maxPages}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setColumnPages(prev => ({ ...prev, [col.status]: Math.max(1, currentPage - 1) }))}
                                disabled={currentPage === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-400 disabled:hover:border-gray-100 active:scale-95 shadow-sm"
                              >
                                <IoChevronBackOutline size={14} />
                              </button>
                              <button
                                onClick={() => setColumnPages(prev => ({ ...prev, [col.status]: Math.min(maxPages, currentPage + 1) }))}
                                disabled={currentPage === maxPages}
                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-400 disabled:hover:border-gray-100 active:scale-95 shadow-sm"
                              >
                                <IoChevronForwardOutline size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );

                })}
              </div>
            </div>
          )}

          {(activeTab === 'messages' && (adminRole === 'super_admin' || adminRole === 'inquiry_admin')) && (
            <div className="flex flex-col gap-6 w-full mx-auto">
              <div className="px-4 sm:px-0">
                <h1 className="text-3xl font-bold text-gray-900 m-0">Inquiries</h1>
                <p className="text-gray-500 mt-2 font-medium">Manage and respond to contact form submissions.</p>
              </div>

              <div className="flex justify-end px-1 sm:px-0">
                <div className="admin-filters !mb-0 !gap-3 w-full sm:w-auto flex flex-col sm:flex-row">
                  <div className="relative flex-grow sm:w-[350px]">
                    <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      className="admin-search-input !pl-11 w-full"
                      value={msgSearch}
                      onChange={(e) => setMsgSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="admin-select flex items-center gap-2 text-gray-400 group cursor-default">
                      <IoFilterOutline size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Filters</span>
                    </div>

                    <CustomMessageFilterSelect
                      value={msgDateFilter}
                      onChange={(val) => setMsgDateFilter(val)}
                      prefix="Date:"
                      options={[
                        { value: 'all', label: 'All Time' },
                        { value: 'today', label: 'Today' },
                        { value: 'week', label: 'Past Week' },
                        { value: 'month', label: 'Past Month' },
                      ]}
                    />

                    <CustomMessageFilterSelect
                      value={msgSortOrder}
                      onChange={(val) => setMsgSortOrder(val)}
                      prefix="Sort:"
                      options={[
                        { value: 'date_desc', label: 'Newest First' },
                        { value: 'date_asc', label: 'Oldest First' },
                      ]}
                    />

                    <CustomMessageStatusSelect
                      value={msgStatusFilter}
                      onChange={(val) => setMsgStatusFilter(val)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sender</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Subject</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pagedMsgs.length > 0 ? (
                        pagedMsgs.map((item) => (
                          <tr 
                            key={item.id} 
                            onClick={() => setSelectedMessage(item)}
                            className="hover:bg-gray-50/30 transition-colors group cursor-pointer"
                          >
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shadow-lg shadow-black/5 transition-transform group-hover:scale-105 ${
                                  item.status === 'resolved' ? 'bg-green-50 text-green-700' : 'bg-[#133020] text-white'
                                }`}>
                                  {item.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-sm font-bold text-gray-900 truncate">{item.name}</span>
                                  <span className="text-[10px] text-gray-400 font-bold truncate tracking-wide">{item.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className="text-sm font-bold text-gray-900 truncate max-w-[240px] block">{item.subject}</span>
                            </td>
                            <td className="px-8 py-5">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                (item.status || 'new') === 'new' ? 'bg-blue-50 text-blue-600' :
                                item.status === 'replied' ? 'bg-amber-50 text-amber-600' :
                                item.status === 'spam' ? 'bg-red-50 text-red-600' :
                                'bg-green-50 text-green-700'
                              }`}>
                                <span className={`w-1 h-1 rounded-full ${
                                  (item.status || 'new') === 'new' ? 'bg-blue-400' :
                                  item.status === 'replied' ? 'bg-amber-400' :
                                  item.status === 'spam' ? 'bg-red-400' :
                                  'bg-green-400'
                                }`}></span>
                                {item.status === 'new' ? 'Pending' : (item.status || 'new')}
                              </span>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap">
                              <div className="flex flex-col items-start font-sans">
                                <span className="text-[11px] font-black text-gray-900">
                                  {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Today'}
                                </span>
                                <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">
                                  {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setSelectedMessage(item); }}
                                  className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-full transition-all active:scale-95"
                                  title="View Details"
                                >
                                  <IoSearchOutline size={18} />
                                </button>
                                {item.status !== 'resolved' && item.status !== 'spam' && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleMessageStatusUpdate(item.id, 'resolved'); }}
                                    disabled={item.status !== 'replied'}
                                    className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white rounded-full transition-all active:scale-95 shadow-sm disabled:opacity-20 disabled:cursor-not-allowed"
                                    title={item.status !== 'replied' ? 'Reply required before resolving' : 'Mark Resolved'}
                                  >
                                    <IoCheckmarkCircleOutline size={18} />
                                  </button>
                                )}
                                {item.status !== 'spam' && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleMessageStatusUpdate(item.id, 'spam'); }}
                                    className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white rounded-full transition-all active:scale-95 shadow-sm"
                                    title="Mark as Spam"
                                  >
                                    <IoWarningOutline size={18} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-8 py-24 text-center">
                            <div className="flex flex-col items-center justify-center opacity-10">
                              <IoChatbubbleEllipsesOutline size={64} className="mb-6" />
                              <p className="text-lg font-black tracking-[0.3em] uppercase">No Inquiries Found</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {maxMsgPages > 1 && (
                  <div className="bg-gray-50/50 px-8 py-4 flex items-center justify-between border-t border-gray-100/50">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Showing</span>
                      <div className="text-sm font-bold text-gray-900">
                        {Math.min(filteredMsgs.length, (msgPage - 1) * 10 + 1)} - {Math.min(filteredMsgs.length, msgPage * 10)} 
                        <span className="text-gray-400 font-medium ml-1">of {filteredMsgs.length} messages</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setMsgPage(prev => Math.max(1, prev - 1))}
                        disabled={msgPage === 1}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                      >
                        <IoChevronBackOutline size={18} />
                      </button>
                      <div className="px-4 py-2 bg-white border border-gray-100 rounded-2xl text-[11px] font-black text-gray-900 shadow-sm">
                        PAGE {msgPage} OF {maxMsgPages}
                      </div>
                      <button
                        onClick={() => setMsgPage(prev => Math.min(maxMsgPages, prev + 1))}
                        disabled={msgPage === maxMsgPages}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                      >
                        <IoChevronForwardOutline size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}



          {activeTab === 'logs' && adminRole === 'super_admin' && (
            <div className="flex flex-col gap-6 w-full mx-auto">
              <div className="px-4 sm:px-0">
                <h1 className="text-3xl font-bold text-gray-900 m-0">Activity Logs</h1>
                <p className="text-gray-500 mt-2 font-medium">Real-time audit trail of administrative actions.</p>
              </div>

              <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Administrator</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Target</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pagedLogs.length > 0 ? (
                        pagedLogs.map((log) => (
                          <tr key={log.id} onClick={() => setSelectedLog(log)} className="hover:bg-gray-50/30 transition-colors group cursor-pointer">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black">
                                  {log.adminEmail?.[0].toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-gray-900">{log.adminEmail}</span>
                                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{log.adminRole?.replace('_', ' ')}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  log.actionType?.includes('delete') ? 'bg-red-500' :
                                  log.actionType?.includes('status') ? 'bg-blue-500' :
                                  log.actionType?.includes('schedule') ? 'bg-amber-500' :
                                  'bg-green-500'
                                }`} />
                                <span className="text-sm font-semibold text-gray-700 capitalize">
                                  {log.actionType?.replace(/_/g, ' ')}
                                </span>
                              </div>
                              {log.details?.status && (
                                <span className="text-[10px] font-bold text-gray-400 ml-4">
                                  to {log.details.status}
                                </span>
                              )}
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{log.targetName}</span>
                                <span className="text-[10px] text-gray-400 font-medium">ID: {log.targetId?.slice(0, 8)}...</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="flex flex-col font-sans">
                                <span className="text-[11px] font-black text-gray-900">
                                  {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending'}
                                </span>
                                <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">
                                  {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-8 py-24 text-center">
                            <div className="flex flex-col items-center justify-center opacity-10">
                              <IoListOutline size={64} className="mb-6" />
                              <p className="text-lg font-black tracking-[0.3em] uppercase">No Activity Logs</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls for Logs */}
                {maxLogPages > 1 && (
                  <div className="bg-gray-50/50 px-8 py-4 flex items-center justify-between border-t border-gray-100/50">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Showing</span>
                      <div className="text-sm font-bold text-gray-900">
                        {Math.min(activityLogs.length, (logPage - 1) * 10 + 1)} - {Math.min(activityLogs.length, logPage * 10)} 
                        <span className="text-gray-400 font-medium ml-1">of {activityLogs.length} logs</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setLogPage(prev => Math.max(1, prev - 1))}
                        disabled={logPage === 1}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                      >
                        <IoChevronBackOutline size={18} />
                      </button>
                      <div className="px-4 py-2 bg-white border border-gray-100 rounded-2xl text-[11px] font-black text-gray-900 shadow-sm">
                        PAGE {logPage} OF {maxLogPages}
                      </div>
                      <button
                        onClick={() => setLogPage(prev => Math.min(maxLogPages, prev + 1))}
                        disabled={logPage === maxLogPages}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                      >
                        <IoChevronForwardOutline size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}



          {activeTab === 'account' && (
            <div className="flex flex-col gap-6 max-w-4xl mx-auto md:mx-0">
              <div className="px-4 sm:px-0">
                <h1 className="text-3xl font-bold text-gray-900 m-0">Account Settings</h1>
                <p className="text-gray-500 mt-2 font-medium">Manage your administrative profile and preferences.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
                {/* Profile Card */}
                <div className="lg:col-span-12 flex flex-col gap-6">
                  <div className="p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-10">
                    <div className="relative group shrink-0">
                      <div className="w-40 h-40 rounded-full bg-gray-100 overflow-hidden border-[6px] border-white shadow-xl flex items-center justify-center relative">
                        {(newPhotoURL || editingAdmin?.photoURL) ? (
                          <img src={newPhotoURL || editingAdmin?.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#133020] text-white flex items-center justify-center text-5xl font-bold">
                            {editingAdmin?.displayName?.[0] || editingAdmin?.id?.[0]?.toUpperCase() || 'A'}
                          </div>
                        )}
                      {/* Shimmer/Overlay on hover - Super Admin Only */}
                      {adminRole === 'super_admin' && (
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                          <IoCameraOutline size={32} className="text-white transform scale-90 group-hover:scale-100 transition-transform" />
                        </div>
                      )}
                        {isUpdatingProfile && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                        {adminRole === 'super_admin' && (
                          <label className="absolute bottom-1 right-1 w-12 h-12 bg-[#FFB347] text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#ffb347]/90 transition-all group-hover:scale-110 border-4 border-white active:scale-95">
                            <input type="file" className="hidden" accept="image/*" onChange={handleProfileImageUpload} disabled={isUpdatingProfile} />
                            <IoCameraOutline size={22} />
                          </label>
                        )}
                      </div>

                    <div className="flex-1 flex flex-col gap-6 w-full pt-2">
                      <div className="flex flex-col gap-2 w-full">
                        <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">Admin Identity</label>
                        <input 
                          type="text" 
                          value={newName} 
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="Your Display Name"
                          disabled={adminRole !== 'super_admin'}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[24px] text-base font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">Connected Email</label>
                        <div className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[24px] text-base font-bold text-gray-400 flex items-center gap-3">
                           <IoMailOutline size={18} />
                           {editingAdmin?.id || currentUser?.email || ''}
                        </div>
                        <p className="text-[10px] text-gray-400 ml-1 font-bold italic tracking-wide uppercase">System Locked Address</p>
                      </div>
                      
                      {adminRole === 'super_admin' && (
                        <div className="pt-4 flex flex-col gap-2">
                          <button 
                            onClick={handleUpdateProfile}
                            disabled={isUpdatingProfile || (newName === (editingAdmin?.displayName || currentUser?.displayName))}
                            className={`min-w-[180px] py-4 rounded-[20px] text-sm font-black uppercase tracking-[0.15em] transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
                              (newName !== (editingAdmin?.displayName || currentUser?.displayName)) ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {isUpdatingProfile ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                Processing...
                              </>
                            ) : 'Apply Changes'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Selector for Super Admin */}
                {adminRole === 'super_admin' && (
                  <div className="lg:col-span-12 mt-4 px-4 sm:px-0">
                    <h3 className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1 mb-6">Select Admin Profile to Manage</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 'admin@lifewood.com', role: 'super_admin', label: 'Super Admin' },
                        { id: 'applicants@lifewood.com', role: 'app_admin', label: 'App Admin' },
                        { id: 'support@lifewood.com', role: 'inquiry_admin', label: 'Inquiry Admin' }
                      ].map((adm) => {
                        const profile = adminProfiles.find(p => p.id === adm.id) || adm;
                        const isSelected = editingAdmin?.id === adm.id;
                        
                        return (
                          <div 
                            key={adm.id}
                            onClick={() => {
                              setEditingAdmin(profile);
                              setNewName(profile.displayName || '');
                              setNewPhotoURL(profile.photoURL || '');
                            }}
                            className={`p-6 rounded-[32px] border transition-all cursor-pointer flex items-center gap-4 ${
                              isSelected ? 'bg-black text-white border-black shadow-xl scale-[1.02]' : 'bg-white text-gray-900 border-gray-100 hover:border-gray-300'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-bold text-sm ${isSelected ? 'bg-white/20 text-white' : 'bg-[#133020] text-white'}`}>
                              {profile.photoURL ? (
                                <img src={profile.photoURL} alt="" className="w-full h-full object-cover rounded-full" />
                              ) : (
                                (profile.displayName?.[0] || profile.id?.[0]?.toUpperCase() || 'A')
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold truncate">{profile.displayName || 'Unnamed Admin'}</span>
                              <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>
                                {adm.label}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <AnimatePresence>
            <LogDetailsModal 
              isOpen={!!selectedLog} 
              onClose={() => setSelectedLog(null)} 
              log={selectedLog} 
            />
          </AnimatePresence>

        </main>
      </div>
    </div>
  );
}
