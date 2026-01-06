
export interface Attendee {
  id: string;
  name: string;
  company: string;
  role?: string;
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  role?: string;
  lastInteraction?: string;
}

export interface Group {
  id: string;
  name: string;
  members: Attendee[];
  color: string;
}

export interface Appointment {
  id: string;
  title: string;
  location: string;
  locationPhotoUrl?: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  attendees: Attendee[];
  agenda: string;
  notes: string;
  notesVisibleToAttendees?: boolean;
  color: string;
  groupId?: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export type ViewType = 'day' | 'week' | 'month' | 'quarter';

export type ColorLabels = Record<string, string>;
