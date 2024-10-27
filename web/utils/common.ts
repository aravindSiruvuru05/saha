import { isValid } from 'date-fns';
import { IPlaceDetails } from './google_places';

export const getFullName = ({
  firstName,
  lastName,
}: {
  firstName?: string;
  lastName?: string;
}) => {
  if (!firstName) firstName = '';
  if (!lastName) lastName = '';
  return firstName + ' ' + lastName;
};

export const getInitialsOfName = ({
  firstName,
  lastName,
}: {
  firstName?: string;
  lastName?: string;
}) => {
  if (!firstName) firstName = '';
  if (!lastName) lastName = '';
  return firstName[0] + ' ' + lastName[0];
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

export const getLocationLable = (location?: IPlaceDetails): string => {
  if (!location) return '';
  return `${location.neighborhood || location.locality}, ${location.city}`;
};
