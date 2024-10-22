import { isValid } from 'date-fns';

export const getFullName = ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) => {
  return firstName + ' ' + lastName;
};
export const getStartAndEndOfDay = (
  isoString: string,
): {
  startOfLocalDayISO: string | null;
  endOfLocalDayISO: string | null;
} => {
  const result = {
    startOfLocalDayISO: null,
    endOfLocalDayISO: null,
  };
  if (!isoString || isValid(isoString)) {
    return result;
  }
  // Create a Date object from the ISO string
  const date = new Date(isoString);

  // Get local date components
  const localDate = new Date(
    date.toLocaleString('en-US', {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
  );

  // Get start of the day
  const startOfLocalDay = new Date(localDate.setHours(0, 0, 0, 0));

  // Get end of the day
  const endOfLocalDay = new Date(localDate.setHours(23, 59, 59, 999));
  // Convert to ISO strings
  const startOfLocalDayISO = startOfLocalDay.toISOString();
  const endOfLocalDayISO = endOfLocalDay.toISOString();

  return {
    startOfLocalDayISO,
    endOfLocalDayISO,
  };
};
