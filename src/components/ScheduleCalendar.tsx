import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Edit, Calendar } from 'lucide-react';
import { ScheduleData } from '../types/schedule';
import ShiftCodeBadge from './ShiftCodeBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSchedule } from '../contexts/ScheduleContext';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface ScheduleCalendarProps {
  employeeId?: number;
  isAdmin?: boolean;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ employeeId, isAdmin = false }) => {
  const isMobile = useIsMobile();
  const {
    scheduleData,
    currentMonth,
    currentYear,
    changeMonth,
    updateShiftCode,
    updateMultipleShiftCodes
  } = useSchedule();

  const [selectedCell, setSelectedCell] = useState<{ employeeId: number, date: string } | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedShiftCode, setSelectedShiftCode] = useState('');
  const [isMassEditOpen, setIsMassEditOpen] = useState(false);

  const { employees, schedules, shiftCodes } = scheduleData;

  const days = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [currentMonth, currentYear]);

  const filteredSchedules = useMemo(() => {
    if (employeeId) {
      return schedules.filter(schedule => schedule.employeeId === employeeId);
    }
    return schedules;
  }, [schedules, employeeId]);

  const handlePreviousMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;

    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }

    changeMonth(newMonth, newYear);
  };

  const handleNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }

    changeMonth(newMonth, newYear);
  };

  const handleShiftCodeSelect = (code: string) => {
    if (selectedCell && isAdmin) {
      updateShiftCode(selectedCell.employeeId, selectedCell.date, code);
      setSelectedCell(null);
    }
  };

  const getMonthName = (month: number) => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[month - 1];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="font-semibold px-2">
            {getMonthName(currentMonth)} {currentYear}
          </div>
          <Button variant="ghost" onClick={handleNextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="ml-2">
              <Calendar className="mr-1 h-4 w-4" />
              Legenda
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Legenda de Turnos</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              {shiftCodes.map((code) => (
                <div key={code.code} className="flex items-center space-x-3">
                  <ShiftCodeBadge code={code.code} shiftCodes={shiftCodes} />
                  <div>
                    <p className="font-medium">{code.name}</p>
                    {code.startTime && (
                      <p className="text-sm text-gray-500">
                        {code.startTime} - {code.endTime}
                        {code.breakTime && ` (Intervalo: ${code.breakTime})`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-3 border border-gray-200 font-medium text-left sticky left-0 bg-gray-50 z-10 min-w-[150px]">
                Colaborador
              </th>
              {days.map((day) => {
                const date = new Date(currentYear, currentMonth - 1, day);
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                const dateString = date.toISOString().split('T')[0];
                return (
                  <th key={day} className={`py-2 px-1 text-center border border-gray-200 w-12 min-w-12 ${isWeekend ? 'bg-gray-100' : ''}`}>
                    <Checkbox
                      checked={selectedDates.includes(dateString)}
                      onCheckedChange={(checked) => {
                        setSelectedDates((prev) =>
                          checked ? [...prev, dateString] : prev.filter(d => d !== dateString)
                        );
                      }}
                      className="mb-1"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][date.getDay()]}
                      </span>
                      <span className="font-medium">{day}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map((schedule) => (
              <tr key={schedule.employeeId} className="hover:bg-gray-50">
                <td className="py-2 px-3 border border-gray-200 font-medium sticky left-0 bg-white z-10">
                  <Checkbox
                    checked={selectedEmployees.includes(schedule.employeeId)}
                    onCheckedChange={(checked) => {
                      setSelectedEmployees((prev) =>
                        checked ? [...prev, schedule.employeeId] : prev.filter(id => id !== schedule.employeeId)
                      );
                    }}
                    className="mr-2"
                  />
                  {schedule.employeeName}
                </td>
                {days.map((day) => {
                  const dateString = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                  const shiftCode = schedule.days[dateString] || '';
                  const date = new Date(currentYear, currentMonth - 1, day);
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  return (
                    <td key={`${schedule.employeeId}-${day}`} className={`border border-gray-200 p-1 text-center ${isWeekend ? 'bg-gray-50' : ''}`}>
                      {isAdmin ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="w-full h-full flex items-center justify-center group">
                              <div className="relative">
                                <ShiftCodeBadge code={shiftCode} shiftCodes={shiftCodes} size="md" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Edit className="h-3 w-3 text-gray-700" />
                                </div>
                              </div>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-2">
                            <div className="grid grid-cols-4 gap-2">
                              {shiftCodes.map((code) => (
                                <button
                                  key={code.code}
                                  className="p-1 hover:bg-gray-100 rounded"
                                  onClick={() => updateShiftCode(schedule.employeeId, dateString, code.code)}
                                >
                                  <ShiftCodeBadge code={code.code} shiftCodes={shiftCodes} size="sm" />
                                </button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <ShiftCodeBadge code={shiftCode} shiftCodes={shiftCodes} size="md" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedEmployees.length > 0 && selectedDates.length > 0 && (
        <Button
          onClick={() => setIsMassEditOpen(true)}
          className="fixed bottom-4 right-4 z-50"
        >
          Editar Turno em Massa
        </Button>
      )}

{isMassEditOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl border animate-fade-in">
      <h2 className="text-lg font-bold mb-4 text-center">Aplicar Turno</h2>
      <Select value={selectedShiftCode} onValueChange={setSelectedShiftCode}>
        <SelectTrigger className="w-full transition-shadow focus:ring-2 focus:ring-primary">
          <SelectValue placeholder="Selecione um turno" />
        </SelectTrigger>
        <SelectContent className="max-h-80 overflow-y-auto">
          <div className="grid grid-cols-1 gap-1">
            {shiftCodes.map((code) => (
              <SelectItem key={code.code} value={code.code} className="p-0">
                <div className="flex items-center gap-3 px-3 py-2 hover:bg-muted rounded cursor-pointer">
                  <ShiftCodeBadge code={code.code} shiftCodes={shiftCodes} size="sm" />
                  <div className="text-left">
                    <p className="text-sm font-medium leading-none">{code.name}</p>
                    {code.startTime && (
                      <p className="text-xs text-muted-foreground">
                        {code.startTime} - {code.endTime}
                        {code.breakTime && ` (Intervalo: ${code.breakTime})`}
                      </p>
                    )}
                  </div>
                </div>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="ghost" onClick={() => setIsMassEditOpen(false)} className="transition-colors">
          Cancelar
        </Button>
        <Button
          disabled={!selectedShiftCode}
          onClick={() => {
            updateMultipleShiftCodes(selectedEmployees, selectedDates, selectedShiftCode);
            setIsMassEditOpen(false);
            setSelectedEmployees([]);
            setSelectedDates([]);
            setSelectedShiftCode('');
          }}
          className="transition-all"
        >
          Aplicar
        </Button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ScheduleCalendar;
