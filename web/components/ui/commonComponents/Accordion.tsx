import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../card';
import { ChevronRight } from 'lucide-react';

export const Accordion = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-4">
      <CardHeader
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between">
          {title}
          <ChevronRight
            className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          />
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent
          className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}
        >
          {children}
        </CardContent>
      )}
    </Card>
  );
};
