
export type ShiftCode = {
  code: string;
  name: string;
  startTime?: string;
  breakTime?: string;
  endTime?: string;
  color: string;
  notes?: string;
};

export type EmployeeSchedule = {
  employeeId: number;
  employeeName: string;
  days: { [key: string]: string }; // date as key (format: YYYY-MM-DD), shift code as value
};

export type Employee = {
  id: number;
  name: string;
  defaultShiftCode: string;
  isActive: boolean;
};

export type ScheduleData = {
  employees: Employee[];
  schedules: EmployeeSchedule[];
  shiftCodes: ShiftCode[];
};

export type Notification = {
  id: number;
  type: 'consecutive_sundays' | 'single_employee_shift' | 'consecutive_absences';
  message: string;
  details: string;
  createdAt: string;
  resolved: boolean;
};
