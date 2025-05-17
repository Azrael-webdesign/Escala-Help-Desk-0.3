
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import ScheduleCalendar from '../components/ScheduleCalendar';
import { useAuth } from '../contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>('current'); // 'prev', 'current', 'next'

  // Get employee ID from auth context
  const employeeId = user?.id;

  // Function to determine month based on filter
  const getFilteredMonth = () => {
    const now = new Date();
    let month = now.getMonth() + 1; // 1-12
    let year = now.getFullYear();

    if (filter === 'prev') {
      month -= 1;
      if (month < 1) {
        month = 12;
        year -= 1;
      }
    } else if (filter === 'next') {
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }

    return { month, year };
  };

  return (
    <Layout title="Minha Escala">
      <div className="mb-4">
        <div className="flex justify-end mb-4">
          <div className="w-48">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prev">Mês Anterior</SelectItem>
                <SelectItem value="current">Mês Atual</SelectItem>
                <SelectItem value="next">Próximo Mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {employeeId && (
          <ScheduleCalendar employeeId={employeeId} />
        )}
      </div>
    </Layout>
  );
};

export default EmployeeDashboard;
