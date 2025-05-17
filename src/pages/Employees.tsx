
import { useState } from 'react';
import { useSchedule } from '../contexts/ScheduleContext';
import Layout from '../components/layout/Layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, User, Search, Check } from 'lucide-react';
import ShiftCodeBadge from '../components/ShiftCodeBadge';
import { useToast } from '@/hooks/use-toast';
import { Employee } from '../types/schedule';

const Employees = () => {
  const { scheduleData, updateEmployee, addEmployee, updateMultipleShiftCodes } = useSchedule();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkActionDialogOpen, setIsBulkActionDialogOpen] = useState(false);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
  const [selectedShiftCode, setSelectedShiftCode] = useState('');
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'>>({
    name: '',
    defaultShiftCode: 'A',
    isActive: true,
  });
  const { toast } = useToast();

  const { employees, shiftCodes } = scheduleData;

  const filteredEmployees = searchQuery 
    ? employees.filter(emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase())) 
    : employees;

  const handleStatusChange = (employeeId: number, isActive: boolean) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      updateEmployee({ ...employee, isActive });
      toast({
        title: isActive ? "Colaborador ativado" : "Colaborador desativado",
        description: `${employee.name} foi ${isActive ? 'ativado' : 'desativado'} com sucesso.`
      });
    }
  };

  const handleShiftCodeChange = (employeeId: number, shiftCode: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      updateEmployee({ ...employee, defaultShiftCode: shiftCode });
      toast({
        title: "Turno padrão atualizado",
        description: `O turno padrão de ${employee.name} foi alterado para ${shiftCode}.`
      });
    }
  };

  const handleAddNewEmployee = () => {
    if (!newEmployee.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome do colaborador é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    addEmployee(newEmployee);
    toast({
      title: "Colaborador adicionado",
      description: `${newEmployee.name} foi adicionado com sucesso.`
    });
    
    setNewEmployee({
      name: '',
      defaultShiftCode: 'A',
      isActive: true,
    });
    
    setIsAddDialogOpen(false);
  };

  const handleEmployeeSelection = (employeeId: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedEmployeeIds(prev => [...prev, employeeId]);
    } else {
      setSelectedEmployeeIds(prev => prev.filter(id => id !== employeeId));
    }
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedEmployeeIds(filteredEmployees.map(emp => emp.id));
    } else {
      setSelectedEmployeeIds([]);
    }
  };

  const handleBulkUpdateShiftCode = () => {
    if (!selectedShiftCode || selectedEmployeeIds.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione um turno e pelo menos um colaborador.",
        variant: "destructive"
      });
      return;
    }

    // Aplicamos a mesma alteração para todos os funcionários selecionados
    selectedEmployeeIds.forEach(employeeId => {
      const employee = employees.find(emp => emp.id === employeeId);
      if (employee) {
        updateEmployee({ ...employee, defaultShiftCode: selectedShiftCode });
      }
    });

    // Mensagem para mostrar quantos colaboradores foram atualizados
    toast({
      title: "Turnos atualizados em massa",
      description: `${selectedEmployeeIds.length} colaborador(es) atualizados para o turno ${selectedShiftCode}.`
    });

    // Limpar seleção e fechar o diálogo
    setSelectedEmployeeIds([]);
    setSelectedShiftCode('');
    setIsBulkActionDialogOpen(false);
  };

  return (
    <Layout title="Gestão de Colaboradores">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            className="pl-8"
            placeholder="Buscar colaborador..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsBulkActionDialogOpen(true)}
            disabled={selectedEmployeeIds.length === 0}
          >
            <Check className="mr-1 h-4 w-4" />
            Atualizar Turnos ({selectedEmployeeIds.length})
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1 h-4 w-4" />
                Novo Colaborador
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Colaborador</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    placeholder="Nome do colaborador"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Turno Padrão</Label>
                  <Select
                    value={newEmployee.defaultShiftCode}
                    onValueChange={(value) => setNewEmployee({ ...newEmployee, defaultShiftCode: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o turno" />
                    </SelectTrigger>
                    <SelectContent>
                      {shiftCodes.map((code) => (
                        <SelectItem key={code.code} value={code.code}>
                          <div className="flex items-center">
                            <ShiftCodeBadge code={code.code} shiftCodes={shiftCodes} size="sm" />
                            <span className="ml-2">{code.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active-status"
                    checked={newEmployee.isActive}
                    onCheckedChange={(checked) => setNewEmployee({ ...newEmployee, isActive: checked })}
                  />
                  <Label htmlFor="active-status">Ativo</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddNewEmployee}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Diálogo para atualização em massa de turnos */}
      <Dialog open={isBulkActionDialogOpen} onOpenChange={setIsBulkActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Turnos em Massa</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                Selecione o turno padrão para aplicar a {selectedEmployeeIds.length} colaborador(es) selecionado(s)
              </p>
              <Select value={selectedShiftCode} onValueChange={setSelectedShiftCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o turno para aplicar" />
                </SelectTrigger>
                <SelectContent>
                  {shiftCodes.map((code) => (
                    <SelectItem key={code.code} value={code.code}>
                      <div className="flex items-center">
                        <ShiftCodeBadge code={code.code} shiftCodes={shiftCodes} size="sm" />
                        <span className="ml-2">{code.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="border rounded p-2 max-h-40 overflow-y-auto">
              <p className="font-medium mb-2 text-sm">Colaboradores selecionados:</p>
              <div className="space-y-1">
                {selectedEmployeeIds.map((id) => {
                  const employee = employees.find(emp => emp.id === id);
                  return (
                    <div key={id} className="text-sm px-2 py-1 bg-gray-50 rounded flex items-center justify-between">
                      <span>{employee?.name}</span>
                      <ShiftCodeBadge 
                        code={employee?.defaultShiftCode || ''} 
                        shiftCodes={shiftCodes} 
                        size="sm" 
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkActionDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleBulkUpdateShiftCode}>
              Aplicar Turno
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-lg shadow overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox 
                  onCheckedChange={handleSelectAll}
                  checked={selectedEmployeeIds.length > 0 && selectedEmployeeIds.length === filteredEmployees.length} 
                  indeterminate={selectedEmployeeIds.length > 0 && selectedEmployeeIds.length < filteredEmployees.length}
                />
              </TableHead>
              <TableHead className="w-[60px]">#</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Turno Padrão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedEmployeeIds.includes(employee.id)}
                    onCheckedChange={(checked) => handleEmployeeSelection(employee.id, !!checked)}
                  />
                </TableCell>
                <TableCell className="font-medium">{employee.id}</TableCell>
                <TableCell className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-gray-400" />
                  {employee.name}
                </TableCell>
                <TableCell>
                  <Select
                    value={employee.defaultShiftCode}
                    onValueChange={(value) => handleShiftCodeChange(employee.id, value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {shiftCodes.map((code) => (
                        <SelectItem key={code.code} value={code.code}>
                          <div className="flex items-center">
                            <ShiftCodeBadge code={code.code} shiftCodes={shiftCodes} size="sm" />
                            <span className="ml-2">{code.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge variant={employee.isActive ? "default" : "secondary"}>
                    {employee.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={employee.isActive}
                        onCheckedChange={(checked) => handleStatusChange(employee.id, checked)}
                      />
                      <Label>{employee.isActive ? "Ativo" : "Inativo"}</Label>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
};

export default Employees;
