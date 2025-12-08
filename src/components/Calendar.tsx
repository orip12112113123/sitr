'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDates?: string[]; // Array of selected date strings (YYYY-MM-DD)
  onDateSelect?: (date: string) => void;
  onDateDeselect?: (date: string) => void;
  mode?: 'select' | 'view'; // select for babysitters, view for parents
  bookedDates?: string[]; // Already booked dates
}

export default function Calendar({
  selectedDates = [],
  onDateSelect,
  onDateDeselect,
  mode = 'view',
  bookedDates = [],
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isDateSelected = (dateStr: string) => {
    return selectedDates.includes(dateStr);
  };

  const isDateBooked = (dateStr: string) => {
    return bookedDates.includes(dateStr);
  };

  const isDatePast = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (year: number, month: number, day: number) => {
    if (mode !== 'select') return;
    if (isDatePast(year, month, day)) return;

    const dateStr = formatDate(year, month, day);

    if (isDateSelected(dateStr)) {
      onDateDeselect?.(dateStr);
    } else {
      onDateSelect?.(dateStr);
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="text-lg font-semibold text-gray-800">
          {monthNames[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateStr = formatDate(year, month, day);
          const isSelected = isDateSelected(dateStr);
          const isBooked = isDateBooked(dateStr);
          const isPast = isDatePast(year, month, day);

          return (
            <button
              key={day}
              onClick={() => handleDateClick(year, month, day)}
              disabled={isPast || (mode === 'view' && !isSelected && !isBooked)}
              className={`
                aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                ${isPast ? 'text-gray-300 cursor-not-allowed' : ''}
                ${isSelected && !isPast ? 'bg-peach-500 text-white hover:bg-peach-600' : ''}
                ${isBooked && !isSelected && !isPast ? 'bg-pink-100 text-pink-700 border-2 border-pink-500' : ''}
                ${!isSelected && !isBooked && !isPast && mode === 'select' ? 'hover:bg-gray-100 text-gray-700' : ''}
                ${!isSelected && !isBooked && !isPast && mode === 'view' ? 'text-gray-400' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        {mode === 'select' && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-peach-500 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
        )}
        {mode === 'view' && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-peach-500 rounded"></div>
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pink-100 border-2 border-pink-500 rounded"></div>
              <span className="text-gray-600">Booked</span>
            </div>
          </>
        )}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span className="text-gray-600">Past/Unavailable</span>
        </div>
      </div>
    </div>
  );
}
