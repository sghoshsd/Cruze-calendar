
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import DailyView from './components/DailyView';
import WeekView from './components/WeekView';
import MonthView from './components/MonthView';
import QuarterView from './components/QuarterView';
import TodoList from './components/TodoList';
import AddAppointmentModal from './components/AddAppointmentModal';
import DataModal from './components/DataModal';
import GroupManagementModal from './components/GroupManagementModal';
import ExpandedEventModal from './components/ExpandedEventModal';
import ContactListModal from './components/ContactListModal';
import { Appointment, Todo, ColorLabels, ViewType, Group, Contact } from './types';
import { INITIAL_APPOINTMENTS, INITIAL_TODOS, COLORS, DEFAULT_COLOR_LABELS, INITIAL_GROUPS } from './constants';

const STORAGE_KEY_APPS = 'cruze_calendar_appointments';
const STORAGE_KEY_TODOS = 'cruze_calendar_todos';
const STORAGE_KEY_LABELS = 'cruze_calendar_color_labels';
const STORAGE_KEY_GROUPS = 'cruze_calendar_groups';
const STORAGE_KEY_CONTACTS = 'cruze_calendar_contacts';

const App: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_APPS);
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });
  
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TODOS);
    return saved ? JSON.parse(saved) : INITIAL_TODOS;
  });

  const [colorLabels, setColorLabels] = useState<ColorLabels>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LABELS);
    return saved ? JSON.parse(saved) : DEFAULT_COLOR_LABELS;
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_GROUPS);
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CONTACTS);
    if (saved) return JSON.parse(saved);
    // Seed contacts from initial attendees
    const initialContacts: Contact[] = [];
    INITIAL_APPOINTMENTS.forEach(app => {
      app.attendees.forEach(a => {
        if (!initialContacts.find(c => c.name === a.name)) {
          initialContacts.push({ ...a, lastInteraction: app.startTime });
        }
      });
    });
    return initialContacts;
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('day');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [focusedAppointment, setFocusedAppointment] = useState<Appointment | null>(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isGroupsModalOpen, setIsGroupsModalOpen] = useState(false);
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  
  const [sharedEvent, setSharedEvent] = useState<Appointment | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('share');
    if (sharedData) {
      try {
        const decoded = JSON.parse(atob(sharedData));
        setSharedEvent(decoded);
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error('Failed to parse shared event');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LABELS, JSON.stringify(colorLabels));
  }, [colorLabels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(contacts));
  }, [contacts]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      const appDate = new Date(app.startTime);
      let inView = false;
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0,0,0,0);
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23,59,59,999);

      if (viewType === 'day') {
        inView = appDate >= startOfDay && appDate <= endOfDay;
      } else if (viewType === 'week') {
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23,59,59,999);
        inView = appDate >= startOfWeek && appDate <= endOfWeek;
      } else if (viewType === 'month') {
        inView = appDate.getMonth() === currentDate.getMonth() && appDate.getFullYear() === currentDate.getFullYear();
      } else if (viewType === 'quarter') {
        const quarter = Math.floor(currentDate.getMonth() / 3);
        const appQuarter = Math.floor(appDate.getMonth() / 3);
        inView = quarter === appQuarter && appDate.getFullYear() === currentDate.getFullYear();
      }

      if (!inView) return false;
      if (!searchTerm.trim()) return true;

      const lowerSearch = searchTerm.toLowerCase();
      return (
        app.title.toLowerCase().includes(lowerSearch) ||
        app.location.toLowerCase().includes(lowerSearch) ||
        app.attendees.some(a => a.name.toLowerCase().includes(lowerSearch)) ||
        (colorLabels[app.color] || '').toLowerCase().includes(lowerSearch) ||
        groups.find(g => g.id === app.groupId)?.name.toLowerCase().includes(lowerSearch)
      );
    });
  }, [appointments, currentDate, searchTerm, colorLabels, viewType, groups]);

  const handleSaveAppointment = (savedApp: Appointment) => {
    setAppointments(prev => {
      const exists = prev.find(a => a.id === savedApp.id);
      if (exists) return prev.map(a => a.id === savedApp.id ? savedApp : a);
      return [...prev, savedApp];
    });
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const handleCreateGroup = (newGroup: Group) => {
    setGroups(prev => [...prev, newGroup]);
  };

  const handleSaveContact = (contact: Contact) => {
    setContacts(prev => {
      const exists = prev.find(c => c.id === contact.id || c.name === contact.name);
      if (exists) return prev.map(c => c.name === contact.name ? { ...c, ...contact } : c);
      return [...prev, contact];
    });
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const handleEditAppointment = (app: Appointment) => {
    setEditingAppointment(app);
    setIsModalOpen(true);
  };

  const handleFocusAppointment = (app: Appointment) => {
    setFocusedAppointment(app);
  };

  const handleDateChange = (direction: number) => {
    const nextDate = new Date(currentDate);
    if (viewType === 'day') nextDate.setDate(nextDate.getDate() + direction);
    else if (viewType === 'week') nextDate.setDate(nextDate.getDate() + (direction * 7));
    else if (viewType === 'month') nextDate.setMonth(nextDate.getMonth() + direction);
    else if (viewType === 'quarter') nextDate.setMonth(nextDate.getMonth() + (direction * 3));
    setCurrentDate(nextDate);
  };

  const handleTaskDrop = (todoId: string, hour: number, date?: Date) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;
    const targetDate = date ? new Date(date) : new Date(currentDate);
    targetDate.setHours(hour, 0, 0, 0);
    const newAppointment: Appointment = {
      id: Math.random().toString(),
      title: todo.text,
      location: 'Unspecified',
      startTime: targetDate.toISOString(),
      endTime: new Date(targetDate.getTime() + 30*60000).toISOString(),
      attendees: [],
      agenda: 'Scheduled from task list.',
      notes: '',
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
    setAppointments(prev => [...prev, newAppointment]);
    setTodos(prev => prev.filter(t => t.id !== todoId));
  };

  const handleExportCSV = () => {
    if (filteredAppointments.length === 0) return;
    
    const headers = ["Meeting Name", "Date", "Start Time", "End Time", "Location", "Category", "Group", "Attendees", "Agenda", "Notes", "Notes Visibility"];
    
    const csvRows = filteredAppointments.map(app => {
      const startDate = new Date(app.startTime);
      const endDate = new Date(app.endTime);
      const groupName = groups.find(g => g.id === app.groupId)?.name || "N/A";
      const attendeeList = app.attendees.map(a => `${a.name} (${a.company})`).join('; ');
      const category = colorLabels[app.color] || "Other";
      
      const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;
      
      return [
        escape(app.title),
        escape(startDate.toLocaleDateString()),
        escape(startDate.toLocaleTimeString()),
        escape(endDate.toLocaleTimeString()),
        escape(app.location),
        escape(category),
        escape(groupName),
        escape(attendeeList),
        escape(app.agenda),
        escape(app.notes),
        escape(app.notesVisibleToAttendees ? "Visible to All" : "Private")
      ].join(',');
    });

    const csvString = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Cruze_Search_Results_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderView = () => {
    const commonProps = {
      appointments: filteredAppointments,
      groups: groups,
      onEdit: handleEditAppointment,
      onDelete: handleDeleteAppointment,
      onDoubleClick: handleFocusAppointment
    };
    switch (viewType) {
      case 'day': return <DailyView {...commonProps} onTaskDrop={handleTaskDrop} />;
      case 'week': return <WeekView {...commonProps} currentDate={currentDate} onTaskDrop={handleTaskDrop} />;
      case 'month': return <MonthView {...commonProps} currentDate={currentDate} />;
      case 'quarter': return <QuarterView {...commonProps} currentDate={currentDate} />;
      default: return <DailyView {...commonProps} onTaskDrop={handleTaskDrop} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header 
        currentDate={currentDate} 
        searchTerm={searchTerm}
        viewType={viewType}
        onViewTypeChange={setViewType}
        onSearchChange={setSearchTerm}
        onPrevDay={() => handleDateChange(-1)}
        onNextDay={() => handleDateChange(1)}
        onToday={() => setCurrentDate(new Date())}
        onAddClick={() => { setEditingAppointment(null); setIsModalOpen(true); }}
        onDataClick={() => setIsDataModalOpen(true)}
        onGroupsClick={() => setIsGroupsModalOpen(true)}
        onContactsClick={() => setIsContactsModalOpen(true)}
        onExportCSV={handleExportCSV}
        hasResults={filteredAppointments.length > 0}
      />
      
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 relative">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col xl:flex-row gap-8 relative">
            <div className="flex-1 min-w-0 group relative">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px]">
                {renderView()}
              </div>
            </div>
            <div className="w-full xl:w-80 shrink-0">
              <TodoList 
                todos={todos}
                onToggle={id => setTodos(t => t.map(x => x.id === id ? {...x, completed: !x.completed} : x))}
                onDelete={id => setTodos(t => t.filter(x => x.id !== id))}
                onAdd={text => setTodos(t => [{id: Math.random().toString(), text, completed: false, createdAt: new Date().toISOString()}, ...t])}
              />
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <AddAppointmentModal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setEditingAppointment(null); }} 
          onSubmit={handleSaveAppointment}
          currentDate={currentDate}
          colorLabels={colorLabels}
          onUpdateColorLabels={setColorLabels}
          groups={groups}
          contacts={contacts}
          onSaveContact={handleSaveContact}
          onCreateGroup={handleCreateGroup}
          initialData={editingAppointment}
        />
      )}

      {isGroupsModalOpen && (
        <GroupManagementModal 
          isOpen={isGroupsModalOpen}
          onClose={() => setIsGroupsModalOpen(false)}
          groups={groups}
          contacts={contacts}
          onSaveGroups={setGroups}
        />
      )}

      {isContactsModalOpen && (
        <ContactListModal 
          isOpen={isContactsModalOpen}
          onClose={() => setIsContactsModalOpen(false)}
          contacts={contacts}
          onSaveContact={handleSaveContact}
          onDeleteContact={handleDeleteContact}
        />
      )}

      {isDataModalOpen && (
        <DataModal 
          isOpen={isDataModalOpen}
          onClose={() => setIsDataModalOpen(false)}
          appointments={appointments}
          todos={todos}
          colorLabels={colorLabels}
          onImport={data => {
            setAppointments(a => [...a, ...data.appointments.filter(x => !a.find(y => y.id === x.id))]);
            setTodos(t => [...t, ...data.todos.filter(x => !t.find(y => y.id === x.id))]);
            setColorLabels(l => ({...l, ...data.colorLabels}));
          }}
        />
      )}

      {focusedAppointment && (
        <ExpandedEventModal 
          appointment={focusedAppointment}
          groups={groups}
          onClose={() => setFocusedAppointment(null)}
        />
      )}

      {sharedEvent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-2">New Event Shared!</h2>
            <p className="text-slate-500 mb-8">Add <strong>"{sharedEvent.title}"</strong> to your Cruze Calendar?</p>
            <div className="w-full flex gap-3">
              <button onClick={() => setSharedEvent(null)} className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 rounded-2xl">Discard</button>
              <button onClick={() => { handleSaveAppointment({ ...sharedEvent, id: Math.random().toString() }); setSharedEvent(null); }} className="flex-[2] py-4 font-bold text-white bg-indigo-600 rounded-2xl shadow-lg">Add to Calendar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
