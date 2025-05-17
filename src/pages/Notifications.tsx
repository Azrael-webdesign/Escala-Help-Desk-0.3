
import { useSchedule } from '../contexts/ScheduleContext';
import Layout from '../components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle } from 'lucide-react';

const Notifications = () => {
  const { notifications, markNotificationAsResolved } = useSchedule();

  // Sort notifications - unresolved first, then by date descending
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'consecutive_sundays':
        return '🔄';
      case 'single_employee_shift':
        return '👤';
      case 'consecutive_absences':
        return '❌';
      default:
        return '📝';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout title="Notificações e Alertas">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {notifications.length} {notifications.length === 1 ? 'notificação' : 'notificações'} total
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-white">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            Não resolvido
          </Badge>
          <Badge variant="outline" className="bg-white">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            Resolvido
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        {sortedNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">Sem notificações</h3>
              <p className="text-gray-500">
                Não há notificações ou alertas para exibir neste momento.
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedNotifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`border-l-4 ${
                notification.resolved ? 'border-l-green-500' : 'border-l-red-500'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{notification.message}</h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.details}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Criada em: {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div>
                    {notification.resolved ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Resolvido
                      </Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => markNotificationAsResolved(notification.id)}
                      >
                        Marcar como resolvido
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
