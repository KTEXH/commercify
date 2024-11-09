import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable

const BookingsCalendar = ({ events }) => {
  // Function to handle date click (if you want to handle clicks on dates)
  const handleDateClick = (arg) => {
    alert(`Date clicked: ${arg.dateStr}`);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth" // Change this to "timeGridWeek" for a week view
        events={events} // Pass your events here
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        dateClick={handleDateClick} // Handle date clicks
        eventColor="#000" // Customize the color of booked events
        eventDisplay="block"
        eventContent={(eventInfo) => (
          <div class='bg-black p-2 px-3'>
            {eventInfo.event.title} at {eventInfo.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
        style={{ borderRadius: '12px' }} // Custom border radius for the calendar
      />
    </div>
  );
};

export default BookingsCalendar;
