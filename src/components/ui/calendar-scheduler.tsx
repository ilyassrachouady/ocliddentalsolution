"use client";

import * as React from "react";
import { format, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isBefore } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

export interface CalendarSchedulerProps {
  timeSlots?: string[];
  onConfirm?: (value: { date?: Date; time?: string }) => void;
  onDateChange?: (date: Date | undefined) => void;
  disabledDates?: (date: Date) => boolean;
  showButtons?: boolean;
  onTimeSelect?: (time: string) => void;
}

// Helper to generate consistent random availability for a date
const getDateAvailability = (date: Date): boolean => {
  const dateStr = date.toISOString().split('T')[0];
  const hash = dateStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return hash % 5 !== 0; // ~80% available, ~20% fully booked
};

// Helper to generate consistent random availability for a time slot
const getTimeSlotAvailability = (date: Date, time: string): boolean => {
  const dateStr = date.toISOString().split('T')[0];
  // First check if the entire day is unavailable
  if (!getDateAvailability(date)) {
    return false; // Entire day is unavailable
  }
  const combined = `${dateStr}-${time}`;
  const hash = combined.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return hash % 2 === 0;
};

// Helper to check if any time slot is available on a given date
const hasAvailableSlots = (date: Date, slots: string[]): boolean => {
  return slots.some(slot => getTimeSlotAvailability(date, slot));
};

function CalendarScheduler({
  timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ],
  onConfirm,
  onDateChange,
  disabledDates,
  showButtons = true,
  onTimeSelect,
}: CalendarSchedulerProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = React.useState<string | undefined>();
  const [showTimeModal, setShowTimeModal] = React.useState(false);
  const [modalDate, setModalDate] = React.useState<Date | undefined>();
  // Use default slots if none provided
  const slotsToUse = timeSlots && timeSlots.length > 0 ? timeSlots : [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const handleDateSelect = (date: Date) => {
    if (disabledDates?.(date)) return;
    // Only allow selecting if day has available slots
    if (!hasAvailableSlots(date, slotsToUse)) return;
    setModalDate(date);
    setShowTimeModal(true);
    setSelectedDate(date);
    setSelectedTime(undefined);
    onDateChange?.(date);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => addDays(prev, -32));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addDays(prev, 32));
  };

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Pad with previous and next month days for complete grid
  const firstDayOfWeek = getDay(monthStart);
  const prevMonthDays = Array(firstDayOfWeek).fill(null).map((_, i) => addDays(monthStart, -(firstDayOfWeek - i)));
  const allDays = [...prevMonthDays, ...calendarDays];
  
  // Add remaining days to complete the last week
  const remainingDays = 42 - allDays.length;
  const nextMonthDays = Array(remainingDays).fill(null).map((_, i) => addDays(monthEnd, i + 1));
  const gridDays = [...allDays, ...nextMonthDays];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="w-full space-y-1.5 sm:space-y-3 md:space-y-4">
      {/* Calendar */}
      <div className="bg-white rounded-lg border border-gray-200 p-1.5 sm:p-2 md:p-3 lg:p-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-1.5 sm:mb-2 md:mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevMonth}
              className="h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9 p-0"
            >
              <ChevronLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            </Button>
            <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold">
              {format(currentMonth, "MMM yyyy", { locale: fr })}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className="h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9 p-0"
            >
              <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            </Button>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-0 mb-1">
            {["D", "L", "M", "M", "J", "V", "S"].map((day, i) => (
              <div key={`${day}-${i}`} className="h-5 sm:h-6 md:h-7 flex items-center justify-center text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0">
            {gridDays.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isPastDate = isBefore(day, today);
              const isExternallyDisabled = disabledDates?.(day);
              const dayHasAvailableSlots = isCurrentMonth && !isPastDate && !isExternallyDisabled && hasAvailableSlots(day, slotsToUse);
              const isToday = isSameDay(day, today);

              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(day)}
                  disabled={!dayHasAvailableSlots || isExternallyDisabled || isPastDate}
                  className={cn(
                    "h-6 sm:h-7 md:h-8 w-full rounded sm:rounded-md font-medium text-[9px] sm:text-[10px] md:text-xs transition-all",
                    isCurrentMonth ? "text-gray-900" : "text-gray-300",
                    isSelected && "bg-blue-600 text-white shadow-md ring-1 ring-blue-500",
                    !isSelected && dayHasAvailableSlots && "bg-green-100 text-green-900 border border-green-300 hover:bg-green-200 cursor-pointer",
                    !isSelected && !dayHasAvailableSlots && isCurrentMonth && !isPastDate && !isExternallyDisabled && "bg-red-100 text-red-900 border border-red-300 cursor-not-allowed opacity-60",
                    (isPastDate || isExternallyDisabled) && !isSelected && "opacity-50 cursor-not-allowed bg-gray-100",
                    isToday && !isSelected && "ring-1 ring-blue-300",
                  )}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
      </div>

      {/* Time Slot Modal */}
      <Dialog open={showTimeModal} onOpenChange={setShowTimeModal}>
        <DialogContent className="w-[96vw] max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm sm:text-base">Créneaux disponibles</span>
              </div>
              <div className="text-xs font-normal text-gray-600 mt-1">
                {modalDate ? format(modalDate, "EEEE d MMMM yyyy", { locale: fr }) : ''}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-2 sm:p-3">
            {slotsToUse.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs sm:text-sm">Aucun créneau disponible</p>
                <p className="text-xs sm:text-sm">pour cette date</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-[250px] sm:max-h-[300px] overflow-y-auto">
                {slotsToUse.map((slot) => {
                  const isAvailable = modalDate ? getTimeSlotAvailability(modalDate, slot) : false;
                  const isSelected = selectedTime === slot;

                  return (
                    <Button
                      key={slot}
                      onClick={() => {
                        if (isAvailable && modalDate) {
                          setSelectedTime(slot);
                          setSelectedDate(modalDate);
                          onTimeSelect?.(slot);
                          setShowTimeModal(false); // Close modal after selection
                        }
                      }}
                      disabled={!isAvailable}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "h-11 sm:h-12 transition-all font-semibold text-xs",
                        isSelected && "bg-blue-600 hover:bg-blue-700 text-white shadow-md ring-1 ring-blue-300",
                        !isSelected && isAvailable && "bg-green-50 text-green-800 border border-green-300 hover:bg-green-100",
                        !isSelected && !isAvailable && "bg-red-50 text-red-700 border border-red-200 cursor-not-allowed opacity-60",
                      )}
                    >
                      <div className="text-center">
                        <div className="font-bold text-xs sm:text-sm">{slot}</div>
                        {!isAvailable && <div className="text-[9px] sm:text-[10px]">Complet</div>}
                        {isAvailable && !isSelected && <div className="text-[9px] sm:text-[10px] text-green-600">Dispo</div>}
                        {isSelected && <div className="text-[9px] sm:text-[10px] text-blue-200">Sélectionné</div>}
                      </div>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Actions */}
      {showButtons && (
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedDate(undefined);
              setSelectedTime(undefined);
              setCurrentMonth(new Date());
            }}
            className="px-3 sm:px-4 h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
          >
            Réinitialiser
          </Button>
          <Button
            onClick={() => onConfirm?.({ date: selectedDate, time: selectedTime })}
            disabled={!selectedDate || !selectedTime}
            className="px-4 sm:px-6 h-8 sm:h-9 md:h-10 bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
          >
            Confirmer
          </Button>
        </div>
      )}
    </div>
  );
}

export { CalendarScheduler };
