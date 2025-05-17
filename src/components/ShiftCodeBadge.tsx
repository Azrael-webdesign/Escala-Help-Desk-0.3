
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ShiftCode } from "../types/schedule";

interface ShiftCodeBadgeProps {
  code: string;
  shiftCodes: ShiftCode[];
  size?: 'sm' | 'md' | 'lg';
}

const ShiftCodeBadge: React.FC<ShiftCodeBadgeProps> = ({ code, shiftCodes, size = 'md' }) => {
  const shiftCode = shiftCodes.find((sc) => sc.code === code);
  
  if (!shiftCode) return <div className="bg-gray-200 text-gray-700 font-medium rounded flex items-center justify-center">{code}</div>;
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const tooltipContent = (
    <div className="text-sm">
      <p className="font-semibold">{shiftCode.name}</p>
      {shiftCode.startTime && (
        <p>
          {shiftCode.startTime} - {shiftCode.endTime}
          {shiftCode.breakTime && ` (Intervalo: ${shiftCode.breakTime})`}
        </p>
      )}
      {shiftCode.notes && <p className="italic text-xs mt-1">{shiftCode.notes}</p>}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`${shiftCode.color} ${sizeClasses[size]} rounded flex items-center justify-center font-medium shadow-sm`}>
            {code}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ShiftCodeBadge;
