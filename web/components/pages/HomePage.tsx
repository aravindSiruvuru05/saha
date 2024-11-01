import { Car, Home, GraduationCap, BellDotIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIonRouter } from '@ionic/react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { MainLayout } from '../ui/commonComponents/MainLayout';

interface IService {
  icon: JSX.Element;
  title: string;
  route: string;
  description: string;
}
export const HomePage = () => {
  const router = useIonRouter();

  const services: IService[] = [
    {
      icon: <Car className="h-8 w-8 text-primary" />,
      title: 'Rides',
      route: 'rides-home',
      description:
        'Find or offer rides to your destination. Save money and reduce your carbon footprint.',
    },
    {
      icon: <Home className="h-8 w-8 text-primary" />,
      title: 'Accomodations',
      route: 'accomodations-home',
      description:
        'Discover comfortable and affordable places to stay during your travels or studies.',
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      title: 'Scholarships',
      route: '/scholarships-home',
      description:
        'Explore scholarship opportunities to support your educational journey.',
    },
  ];
  return (
    <MainLayout>
      <div className="max-h-screen bg-background p-6 flex flex-col items-center">
        <ScrollArea className="flex-grow overflow-auto">
          <h1 className="text-xl font-bold mb-8">
            Welcome, International Students! Discover Our Services Just for You.
          </h1>
          <Button
            size="icon"
            className="fixed bottom-10 right-8 rounded-full bg-primary text-white shadow-lg transition-all w-12 h-12"
            onClick={() => {
              router.push('/notifications');
            }}
          >
            <BellDotIcon className="h-7 w-7" />
          </Button>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
            {services.map(service => {
              return (
                <Card
                  className="transition-all hover:shadow-lg hover:-translate-y-1 hover:bg-accent active:bg-accent cursor-pointer"
                  onClick={() => router.push(service.route)}
                  key={service.title}
                >
                  <CardHeader className="flex flex-col items-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                      {service.icon}
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-muted-foreground text-md hidden sm:block">
                    {service.description}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </MainLayout>
  );
};
