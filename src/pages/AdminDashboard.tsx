
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import ScheduleCalendar from '../components/ScheduleCalendar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Search, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterShift, setFilterShift] = useState('all');
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <Layout title="Escala de Trabalho">
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex">
            <Input
              placeholder="Buscar colaborador..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <div>
            <Select value={filterShift} onValueChange={setFilterShift}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os turnos</SelectItem>
                <SelectItem value="A">Turno A</SelectItem>
                <SelectItem value="B">Turno B</SelectItem>
                <SelectItem value="C">Turno C</SelectItem>
                <SelectItem value="DSR">Descanso (DSR)</SelectItem>
                <SelectItem value="F">Folga</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal w-full",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'dd/MM/yyyy') : <span>Escolher data...</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <ScheduleCalendar isAdmin={true} />
      </div>
    </Layout>
  );
};

export default AdminDashboard;
