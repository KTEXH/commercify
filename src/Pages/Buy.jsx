import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const GET_SERVICE = gql`
  query GetService($id: Int!) {
    getService(id: $id) {
      id
      title
      availablityDays
      availablityHours
      specifications
      tag
      description
      author{
      id
      }
    }
  }
`;

const CREATE_BOOKING = gql`
  mutation createBooking(
    $productId: Int!,
    $id: Int!,
    $bookingDay: String,
    $bookingTime: String,
    $amount: Int,
    $formattedDate: String,
    $specification: String,
    $currency: String,
    $name: String,
    $email: String
  ) {
    createBooking(
      productId: $productId,
      id: $id,
      specification: $specification,
      bookingDay: $bookingDay,
      bookingTime: $bookingTime,
      formattedDate: $formattedDate,
      amount: $amount,
      currency: $currency,
      name: $name,
      email: $email
    ) {
      id
     
    }
  }
`;

const Booking = ({ productId, userId }) => {
  const [date, setDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [amount, setAmount] = useState(30); // Default amount
  const [currency, setCurrency] = useState('USD'); // Default currency
  const [name, setName] = useState('');
  const [formattedDate, setFormattedDate] = useState('')
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [specification, setSpecification] = useState('')
  const { data, loading, error } = useQuery(GET_SERVICE, {
    variables: { id: productId },
  });

  const [createBooking] = useMutation(CREATE_BOOKING);

  // Function to check if the selected day of the week is available
  const isDayAvailable = (day) => {
    if (data && data.getService) {
      const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
      return data.getService.availablityDays.includes(dayName);
    }
    return false;
  };

  useEffect(() => {
    if (data && data.getService) {
      const selectedDay = date.toLocaleDateString('en-US', { weekday: 'long' });
      setFormattedDate(selectedDay)
      if (isDayAvailable(date)) {
        setAvailableTimes(data.getService.availablityHours); // Show available times for valid day
      } else {
        setAvailableTimes([]); // No available times for invalid day
      }
    }
  }, [data, date]);

  const handleBooking = async () => {
    if (!selectedTime) {
      setStatus('Please select a time.');
      return;
    }

    try {
      await createBooking({
        variables: {
          productId: productId,
          id: data.getService.author.id,
          bookingDay: date.toLocaleDateString('en-US', { weekday: 'long' }),
          bookingTime: selectedTime,
          amount,
          date: formattedDate,
          formattedDate: date.toDateString(),
          specification: specification,
          currency,
          tag: data.getService.tag,
          name,
          email,
        },
      });
      setStatus('Booking confirmed!');
    } catch (error) {
      setStatus('Error creating booking: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Book a Service</h2>

      {loading ? (
        <p>Loading service...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          <h3>{data.getService.title}</h3>

          <Calendar
            onChange={setDate}
            value={date}
            tileClassName={({ date }) => (isDayAvailable(date) ? 'available-day' : 'unavailable-day')}
          />

          <h3>Available Times for {date.toDateString()}:</h3>
          <select onChange={(e) => setSelectedTime(e.target.value)} value={selectedTime}>
            <option value="">Select a time</option>
            {availableTimes.length > 0 ? (
              availableTimes.map((time) => (
                <option key={time} onClick={() => setSelectedTime(time)} value={time}>
                  {time}
                </option>
              ))
            ) : (
              <option value="" disabled>No available times for selected day</option>
            )}
          </select>

          <h3>Payment Details</h3>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
          />
          <input
            type="text"
            placeholder="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />
          <div>
            {data.getService.specifications.map((item, index) => (
              <div key={index} onClick={() => setSpecification(item)}>
                {item}
              </div>
            ))}
          </div>
          <div>{specification}</div>

          <button onClick={handleBooking}>Book Now</button>

          {status && <p>{status}</p>}
        </>
      )}
    </div>
  );
};

export default Booking;
