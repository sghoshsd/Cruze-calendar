
import { Appointment, Todo, ColorLabels, Group } from './types';

export const COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-indigo-500',
];

export const GROUP_COLORS = [
  'bg-slate-700',
  'bg-cyan-600',
  'bg-pink-600',
  'bg-teal-600',
  'bg-orange-600',
  'bg-violet-600',
  'bg-lime-600',
  'bg-fuchsia-600',
  'bg-stone-600',
  'bg-sky-600',
  'bg-emerald-700',
  'bg-rose-700',
];

export const DEFAULT_COLOR_LABELS: ColorLabels = {
  'bg-blue-500': 'Work',
  'bg-purple-500': 'Personal',
  'bg-emerald-500': 'Health',
  'bg-rose-500': 'Urgent',
  'bg-amber-500': 'Family',
  'bg-indigo-500': 'Other',
};

const today = new Date();
today.setHours(0, 0, 0, 0);

const createDate = (hours: number, minutes: number = 0) => {
  const d = new Date(today);
  d.setHours(hours, minutes);
  return d.toISOString();
};

export const INITIAL_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'NovaTech Core',
    color: 'bg-slate-700',
    members: [
      { id: 'a1', name: 'Sarah Chen', company: 'NovaTech' },
      { id: 'a5', name: 'Alex Rivera', company: 'NovaTech' }
    ]
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    title: 'Q4 Product Strategy Sync',
    location: 'Conference Room Alpha',
    locationPhotoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200&h=200',
    startTime: createDate(9, 0),
    endTime: createDate(10, 30),
    color: 'bg-blue-500',
    groupId: 'g1',
    attendees: [
      { id: 'a1', name: 'Sarah Chen', company: 'NovaTech' },
      { id: 'a2', name: 'James Wilson', company: 'Global Solutions' }
    ],
    agenda: '1. Review Q3 performance\n2. Align on Q4 feature roadmap\n3. Budget allocation for AI research',
    notes: 'Remember to bring the latest prototype designs. Sarah needs a final answer on the hiring plan.'
  },
  {
    id: '2',
    title: 'Client Partnership Review',
    location: 'Main St. Cafe / Virtual',
    locationPhotoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=200&h=200',
    startTime: createDate(11, 0),
    endTime: createDate(12, 0),
    color: 'bg-emerald-500',
    attendees: [
      { id: 'a3', name: 'Elena Rodriguez', company: 'Starlight Retail' },
      { id: 'a4', name: 'Marcus Thorne', company: 'Starlight Retail' }
    ],
    agenda: 'Customer satisfaction survey results review and contract renewal discussion.',
    notes: 'Focus on the new multi-region support feature. They were concerned about latency.'
  },
  {
    id: '3',
    title: 'Developer Workshop: Gemini API',
    location: 'Innovation Lab - Floor 4',
    locationPhotoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200&h=200',
    startTime: createDate(14, 0),
    endTime: createDate(16, 0),
    color: 'bg-indigo-500',
    attendees: [
      { id: 'a5', name: 'Alex Rivera', company: 'NovaTech' },
      { id: 'a6', name: 'Priya Sharma', company: 'OpenSource Labs' },
      { id: 'a7', name: 'David Kim', company: 'CloudFlow' }
    ],
    agenda: 'Hands-on session with the new Gemini 3.0 Pro endpoints.',
    notes: 'Bring laptops with Node environment set up. Need to check quota limits before starting.'
  }
];

export const INITIAL_TODOS: Todo[] = [
  { id: 't1', text: 'Prepare Q4 slide deck', completed: false, createdAt: new Date().toISOString() },
  { id: 't2', text: 'Review feedback on PR #442', completed: true, createdAt: new Date().toISOString() },
  { id: 't3', text: 'Email Elena regarding renewal', completed: false, createdAt: new Date().toISOString() },
  { id: 't4', text: 'Update documentation for Gemini SDK', completed: false, createdAt: new Date().toISOString() }
];
