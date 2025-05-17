
import { useState, useMemo } from 'react';
import { useSchedule } from '../contexts/ScheduleContext';
import Layout from '../components/layout/Layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import ShiftCodeBadge from '../components/ShiftCodeBadge';

interface WorkHourSummary {
  employeeId: number;
  employeeName: string;
  defaultShiftCode: string;
  totalDays: number;
  workDays: number;
  restDays: number;
  vacationDays: number;
  otherDays: number;
  estimatedHours: number;
  excessHours: number;
}

const Calculator = () => {
  const { scheduleData, currentMonth, currentYear } = useSchedule();
  const [searchQuery, setSearchQuery] = useState('');
  const [standardHoursPerMonth, setStandardHoursPerMonth] = useState(176); // Default to 8h x 22 days = 176h
  
  const { employees, schedules, shiftCodes } = scheduleData;

  // Calculate work hours per shift code
  const hoursPerShiftCode = useMemo(() => {
    const result: Record<string, number> = {};
    
    shiftCodes.forEach(code => {
      if (code.startTime && code.endTime) {
        const [startHour, startMin] = code.startTime.split(':').map(Number);
        const [endHour, endMin] = code.endTime.split(':').map(Number);
        
        let hours = endHour - startHour;
        let minutes = endMin - startMin;
        
        if (minutes < 0) {
          hours -= 1;
          minutes += 60;
        }
        
        // If there's a break time, subtract it (assuming format is HH:MM)
        if (code.breakTime) {
          const [breakHour, breakMin] = code.breakTime.split(':').map(Number);
          
          // Assuming breakTime is used for lunch break duration
          // For simplicity, let's assume it's 1 hour
          hours -= 1;
        }
        
        result[code.code] = hours + minutes / 60;
      } else {
        // If no time defined, assume 0 hours
        result[code.code] = 0;
      }
    });
    
    return result;
  }, [shiftCodes]);

  // Calculate summary for all employees
  const workHourSummaries = useMemo(() => {
    const summaries: WorkHourSummary[] = [];
    
    employees.forEach(employee => {
      const employeeSchedule = schedules.find(s => s.employeeId === employee.id);
      
      if (employeeSchedule) {
        let workDays = 0;
        let restDays = 0;
        let vacationDays = 0;
        let otherDays = 0;
        
        // Count different types of days
        Object.values(employeeSchedule.days).forEach(shiftCode => {
          if (['A', 'B', 'C'].includes(shiftCode)) {
            workDays++;
          } else if (['DSR', 'F', 'Fo'].includes(shiftCode)) {
            restDays++;
          } else if (shiftCode === 'V') {
            vacationDays++;
          } else {
            otherDays++;
          }
        });
        
        // Calculate estimated hours based on shift codes
        let estimatedHours = 0;
        Object.entries(employeeSchedule.days).forEach(([date, shiftCode]) => {
          if (hoursPerShiftCode[shiftCode]) {
            estimatedHours += hoursPerShiftCode[shiftCode];
          }
        });
        
        summaries.push({
          employeeId: employee.id,
          employeeName: employee.name,
          defaultShiftCode: employee.defaultShiftCode,
          totalDays: Object.keys(employeeSchedule.days).length,
          workDays,
          restDays,
          vacationDays,
          otherDays,
          estimatedHours,
          excessHours: estimatedHours - standardHoursPerMonth
        });
      }
    });
    
    return summaries;
  }, [employees, schedules, hoursPerShiftCode, standardHoursPerMonth]);

  // Filter by search query
  const filteredSummaries = searchQuery 
    ? workHourSummaries.filter(summary => 
        summary.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
      ) 
    : workHourSummaries;
  
  // Get month name
  const getMonthName = (month: number) => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[month - 1];
  };

  return (
    <Layout title="Calculadora de Jornadas">
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base">Período</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold">
              {getMonthName(currentMonth)} {currentYear}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base">Horas padrão/mês</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Input 
              type="number" 
              value={standardHoursPerMonth} 
              onChange={(e) => setStandardHoursPerMonth(parseInt(e.target.value) || 0)}
              className="w-24 text-2xl font-semibold"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base">Filtro</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Input
              placeholder="Buscar colaborador..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="overflow-auto rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Colaborador</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead className="text-center">Dias Trabalhados</TableHead>
              <TableHead className="text-center">Dias de Folga</TableHead>
              <TableHead className="text-center">Horas Estimadas</TableHead>
              <TableHead className="text-center">Diferença</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSummaries.map((summary) => (
              <TableRow key={summary.employeeId}>
                <TableCell className="font-medium">{summary.employeeName}</TableCell>
                <TableCell>
                  <ShiftCodeBadge code={summary.defaultShiftCode} shiftCodes={shiftCodes} size="sm" />
                </TableCell>
                <TableCell className="text-center">
                  {summary.workDays}
                  <div className="text-xs text-gray-500">
                    {summary.vacationDays > 0 && `(+ ${summary.vacationDays} férias)`}
                    {summary.otherDays > 0 && `(+ ${summary.otherDays} outros)`}
                  </div>
                </TableCell>
                <TableCell className="text-center">{summary.restDays}</TableCell>
                <TableCell className="text-center font-semibold">{summary.estimatedHours.toFixed(1)}h</TableCell>
                <TableCell className={`text-center font-semibold ${
                  summary.excessHours > 8 ? 'text-red-600' : 
                  summary.excessHours > 0 ? 'text-orange-600' : 
                  'text-green-600'
                }`}>
                  {summary.excessHours > 0 ? '+' : ''}{summary.excessHours.toFixed(1)}h
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {filteredSummaries.some(s => s.excessHours > 8) && (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            Alguns colaboradores excedem em mais de 8 horas a jornada mensal padrão.
            Considere ajustar as escalas para evitar excesso de horas extras.
          </AlertDescription>
        </Alert>
      )}
    </Layout>
  );
};

export default Calculator;
