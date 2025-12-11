'use client';

import * as React from 'react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export type CalendarProps<T extends DayPickerProps = DayPickerProps> = T & {
  className?: string;
};

function CalendarInternal<T extends DayPickerProps = DayPickerProps>(
  { className, mode = 'single', ...props }: CalendarProps<T>,
  ref: React.Ref<HTMLDivElement>
) {
  const dayPickerProps = {
    mode,
    fixedWeeks: true,
    components: {
      Chevron: ({ orientation }) => {
        const Icon = orientation === 'left' ? ChevronLeft : ChevronRight;
        return <Icon className="h-4 w-4" />;
      },
    },
    ...props,
  } as T;

  return (
    <div ref={ref} className={cn('p-3', className)}>
      <DayPicker {...dayPickerProps} />
    </div>
  );
}

export const Calendar = React.forwardRef(CalendarInternal) as (<
  T extends DayPickerProps = DayPickerProps
>(
  props: CalendarProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement) & { displayName?: string };

Calendar.displayName = 'Calendar';
