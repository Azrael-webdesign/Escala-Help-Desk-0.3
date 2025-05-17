
import { useState } from 'react';
import { useSchedule } from '../contexts/ScheduleContext';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShiftCode } from '../types/schedule';
import ShiftCodeBadge from '../components/ShiftCodeBadge';

const ShiftCodes = () => {
  const { scheduleData, updateShiftCodeDefinition } = useSchedule();
  const { shiftCodes } = scheduleData;
  const { toast } = useToast();
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editValues, setEditValues] = useState<{ [key: string]: ShiftCode }>({});

  const handleEdit = (code: string) => {
    const shiftCode = shiftCodes.find((sc) => sc.code === code);
    if (shiftCode) {
      setEditValues({ ...editValues, [code]: { ...shiftCode } });
      setEditMode({ ...editMode, [code]: true });
    }
  };

  const handleCancel = (code: string) => {
    setEditMode({ ...editMode, [code]: false });
  };

  const handleSave = (code: string) => {
    const updatedShiftCode = editValues[code];
    updateShiftCodeDefinition(updatedShiftCode);
    setEditMode({ ...editMode, [code]: false });
    toast({
      title: "Turno atualizado",
      description: `As informações do turno ${code} foram atualizadas com sucesso.`
    });
  };

  const handleChange = (code: string, field: keyof ShiftCode, value: string) => {
    setEditValues({
      ...editValues,
      [code]: {
        ...editValues[code],
        [field]: value
      }
    });
  };

  return (
    <Layout title="Gestão de Turnos e Siglas">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {shiftCodes.map((shiftCode) => {
          const isEditing = editMode[shiftCode.code];
          const currentValues = isEditing ? editValues[shiftCode.code] : shiftCode;
          
          return (
            <Card key={shiftCode.code} className={`border-l-4 ${shiftCode.color.replace('bg-', 'border-')}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <ShiftCodeBadge code={shiftCode.code} shiftCodes={shiftCodes} />
                  <span className="ml-2">{shiftCode.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`name-${shiftCode.code}`}>Nome do Turno</Label>
                      <Input
                        id={`name-${shiftCode.code}`}
                        value={currentValues.name}
                        onChange={(e) => handleChange(shiftCode.code, 'name', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label htmlFor={`start-${shiftCode.code}`}>Entrada</Label>
                        <Input
                          id={`start-${shiftCode.code}`}
                          value={currentValues.startTime || ''}
                          onChange={(e) => handleChange(shiftCode.code, 'startTime', e.target.value)}
                          placeholder="--:--"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`break-${shiftCode.code}`}>Intervalo</Label>
                        <Input
                          id={`break-${shiftCode.code}`}
                          value={currentValues.breakTime || ''}
                          onChange={(e) => handleChange(shiftCode.code, 'breakTime', e.target.value)}
                          placeholder="--:--"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`end-${shiftCode.code}`}>Saída</Label>
                        <Input
                          id={`end-${shiftCode.code}`}
                          value={currentValues.endTime || ''}
                          onChange={(e) => handleChange(shiftCode.code, 'endTime', e.target.value)}
                          placeholder="--:--"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`notes-${shiftCode.code}`}>Observações</Label>
                      <Input
                        id={`notes-${shiftCode.code}`}
                        value={currentValues.notes || ''}
                        onChange={(e) => handleChange(shiftCode.code, 'notes', e.target.value)}
                        placeholder="Observações adicionais..."
                      />
                    </div>
                    <div className="pt-2 flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => handleCancel(shiftCode.code)}>
                        Cancelar
                      </Button>
                      <Button onClick={() => handleSave(shiftCode.code)}>
                        Salvar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <div className="text-gray-500">Entrada</div>
                        <div>{shiftCode.startTime || '--:--'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Intervalo</div>
                        <div>{shiftCode.breakTime || '--:--'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Saída</div>
                        <div>{shiftCode.endTime || '--:--'}</div>
                      </div>
                    </div>
                    {shiftCode.notes && (
                      <div className="text-sm italic text-gray-600">
                        {shiftCode.notes}
                      </div>
                    )}
                    <div className="pt-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(shiftCode.code)}>
                        Editar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Layout>
  );
};

export default ShiftCodes;
