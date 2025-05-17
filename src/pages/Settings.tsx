
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const [notifyTwoConsecutiveSundays, setNotifyTwoConsecutiveSundays] = useState(true);
  const [notifySingleEmployeeShift, setNotifySingleEmployeeShift] = useState(true);
  const [notifyConsecutiveAbsences, setNotifyConsecutiveAbsences] = useState(true);
  const [consecutiveAbsencesThreshold, setConsecutiveAbsencesThreshold] = useState(3);
  const [autoAssignRestDays, setAutoAssignRestDays] = useState(true);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram salvas com sucesso.",
    });
  };

  return (
    <Layout title="Configurações">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notificações e Alertas</CardTitle>
            <CardDescription>
              Configure quais notificações e alertas você deseja receber
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notify-consecutive-sundays">Domingos consecutivos</Label>
                <p className="text-sm text-gray-500">
                  Alertar quando um colaborador trabalha dois domingos consecutivos
                </p>
              </div>
              <Switch
                id="notify-consecutive-sundays"
                checked={notifyTwoConsecutiveSundays}
                onCheckedChange={setNotifyTwoConsecutiveSundays}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notify-single-employee">Turno com um único colaborador</Label>
                <p className="text-sm text-gray-500">
                  Alertar quando apenas uma pessoa está escalada em um turno
                </p>
              </div>
              <Switch
                id="notify-single-employee"
                checked={notifySingleEmployeeShift}
                onCheckedChange={setNotifySingleEmployeeShift}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notify-absences">Faltas consecutivas</Label>
                  <p className="text-sm text-gray-500">
                    Alertar quando um colaborador acumula faltas consecutivas
                  </p>
                </div>
                <Switch
                  id="notify-absences"
                  checked={notifyConsecutiveAbsences}
                  onCheckedChange={setNotifyConsecutiveAbsences}
                />
              </div>
              
              {notifyConsecutiveAbsences && (
                <div className="pl-6 border-l-2 border-gray-100 ml-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="absences-threshold">Número de faltas consecutivas</Label>
                    <Input
                      id="absences-threshold"
                      type="number"
                      min={1}
                      max={10}
                      value={consecutiveAbsencesThreshold}
                      onChange={(e) => setConsecutiveAbsencesThreshold(parseInt(e.target.value) || 1)}
                      className="w-16"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Automação</CardTitle>
            <CardDescription>
              Configure recursos automáticos para facilitar a gestão de escalas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-assign-rest">Atribuir DSR automaticamente</Label>
                <p className="text-sm text-gray-500">
                  Atribuir automaticamente "DSR" para todos nos domingos
                </p>
              </div>
              <Switch
                id="auto-assign-rest"
                checked={autoAssignRestDays}
                onCheckedChange={setAutoAssignRestDays}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sobre o Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Versão</span>
              <Badge variant="outline">1.0.0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Última atualização</span>
              <span className="text-sm text-gray-500">Dezembro 2024</span>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline">Restaurar Padrões</Button>
          <Button onClick={handleSave}>Salvar Configurações</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
