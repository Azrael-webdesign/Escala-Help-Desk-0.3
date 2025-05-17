import React, { createContext, useContext, useState, useEffect } from 'react';
import { ScheduleData, ShiftCode, Employee, EmployeeSchedule, Notification } from '../types/schedule';
import { getMockData, getMockNotifications } from '../services/mockDataService';

interface ScheduleContextType {
  scheduleData: ScheduleData;
  notifications: Notification[];
  loading: boolean;
  currentMonth: number;
  currentYear: number;
  changeMonth: (month: number, year: number) => void;
  updateShiftCode: (employeeId: number, date: string, shiftCode: string) => void;
  updateMultipleShiftCodes: (employeeIds: number[], dates: string[], shiftCode: string) => void;
  updateShiftCodeDefinition: (shiftCode: ShiftCode) => void;
  updateEmployee: (employee: Employee) => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  markNotificationAsResolved: (id: number) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scheduleData, setScheduleData] = useState<ScheduleData>({ employees: [], schedules: [], shiftCodes: [] });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Carrega os dados iniciais
  useEffect(() => {
    setLoading(true);
    const data = getMockData();
    setScheduleData(data);
    setNotifications(getMockNotifications());
    setLoading(false);
  }, []);

  const changeMonth = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const fillScheduleWithDefaultShift = (employeeId: number, defaultShiftCode: string) => {
    setScheduleData((prev) => {
      const { schedules } = prev;
      const updatedSchedules = [...schedules];

      const scheduleIndex = updatedSchedules.findIndex(s => s.employeeId === employeeId);
      const now = new Date(currentYear, currentMonth - 1, 1);
      const lastDay = new Date(currentYear, currentMonth, 0).getDate();

      const updatedDays = { ...(scheduleIndex !== -1 ? updatedSchedules[scheduleIndex].days : {}) };

      for (let day = 1; day <= lastDay; day++) {
        const date = new Date(now.getFullYear(), now.getMonth(), day);
        const iso = date.toISOString().split("T")[0];

        if (!updatedDays[iso]) {
          updatedDays[iso] = defaultShiftCode;
        }
      }

      if (scheduleIndex !== -1) {
        updatedSchedules[scheduleIndex] = {
          ...updatedSchedules[scheduleIndex],
          days: updatedDays
        };
      } else {
        const employee = prev.employees.find(e => e.id === employeeId);
        if (employee) {
          updatedSchedules.push({
            employeeId,
            employeeName: employee.name,
            days: updatedDays
          });
        }
      }

      return {
        ...prev,
        schedules: updatedSchedules
      };
    });
  };

  const updateShiftCode = (employeeId: number, date: string, shiftCode: string) => {
    setScheduleData((prev) => {
      const newSchedules = prev.schedules.map(schedule => {
        if (schedule.employeeId === employeeId) {
          return {
            ...schedule,
            days: {
              ...schedule.days,
              [date]: shiftCode
            }
          };
        }
        return schedule;
      });
      return { ...prev, schedules: newSchedules };
    });
  };

  const updateMultipleShiftCodes = (employeeIds: number[], dates: string[], shiftCode: string) => {
    setScheduleData((prev) => {
      const newSchedules = prev.schedules.map(schedule => {
        if (employeeIds.includes(schedule.employeeId)) {
          const newDays = { ...schedule.days };
          dates.forEach(date => {
            newDays[date] = shiftCode;
          });
          return {
            ...schedule,
            days: newDays
          };
        }
        return schedule;
      });
      return { ...prev, schedules: newSchedules };
    });
  };

  const updateShiftCodeDefinition = (updatedShiftCode: ShiftCode) => {
    setScheduleData((prev) => {
      const newShiftCodes = prev.shiftCodes.map(sc =>
        sc.code === updatedShiftCode.code ? updatedShiftCode : sc
      );
      return { ...prev, shiftCodes: newShiftCodes };
    });
  };

  const updateEmployee = (updatedEmployee: Employee) => {
    setScheduleData((prev) => {
      const newEmployees = prev.employees.map(emp =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      );

      return { ...prev, employees: newEmployees };
    });

    fillScheduleWithDefaultShift(updatedEmployee.id, updatedEmployee.defaultShiftCode);
  };

  const addEmployee = (newEmployee: Omit<Employee, 'id'>) => {
    setScheduleData((prev) => {
      const maxId = Math.max(...prev.employees.map(e => e.id), 0);
      const employeeWithId: Employee = {
        ...newEmployee,
        id: maxId + 1
      };

      const now = new Date(currentYear, currentMonth - 1, 1);
      const lastDay = new Date(currentYear, currentMonth, 0).getDate();
      const days: Record<string, string> = {};

      for (let day = 1; day <= lastDay; day++) {
        const date = new Date(now.getFullYear(), now.getMonth(), day);
        const iso = date.toISOString().split("T")[0];
        days[iso] = newEmployee.defaultShiftCode;
      }

      const newSchedule: EmployeeSchedule = {
        employeeId: employeeWithId.id,
        employeeName: employeeWithId.name,
        days
      };

      return {
        ...prev,
        employees: [...prev.employees, employeeWithId],
        schedules: [...prev.schedules, newSchedule]
      };
    });
  };

  const markNotificationAsResolved = (id: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, resolved: true } : notification
      )
    );
  };

  return (
    <ScheduleContext.Provider
      value={{
        scheduleData,
        notifications,
        loading,
        currentMonth,
        currentYear,
        changeMonth,
        updateShiftCode,
        updateMultipleShiftCodes,
        updateShiftCodeDefinition,
        updateEmployee,
        addEmployee,
        markNotificationAsResolved
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};
