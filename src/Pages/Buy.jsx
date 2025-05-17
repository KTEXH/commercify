import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

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
      author {
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
  const [bookableDates, setBookableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [amount, setAmount] = useState(30);
  const [currency, setCurrency] = useState('USD');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [specification, setSpecification] = useState('');
  const [formattedDate, setFormattedDate] = useState('');

  const { data, loading, error } = useQuery(GET_SERVICE, {
    variables: { id: productId },
  });

  const [createBooking] = useMutation(CREATE_BOOKING);

  const generateBookableDates = (daysArray) => {
    const upcomingDates = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      const dayName = futureDate.toLocaleDateString('en-US', { weekday: 'long' });
      if (daysArray.includes(dayName)) {
        upcomingDates.push(futureDate);
      }
    }
    return upcomingDates;
  };

  useEffect(() => {
    if (data && data.getService) {
      const bookable = generateBookableDates(data.getService.availablityDays);
      setBookableDates(bookable);
    }
  }, [data]);

  useEffect(() => {
    if (data && data.getService) {
      const selectedDay = date.toLocaleDateString('en-US', { weekday: 'long' });
      setFormattedDate(date.toDateString());
      if (data.getService.availablityDays.includes(selectedDay)) {
        setAvailableTimes(data.getService.availablityHours);
      } else {
        setAvailableTimes([]);
      }
    }
  }, [date, data]);

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
          formattedDate: date.toDateString(),
          specification,
          currency,
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
    <div style={{ padding: '20px' }}>
      <h2>Book a Service</h2>

      {loading ? (
        <p>Loading service...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          <h3>{data.getService.title}</h3>

          <h3>Select a Date:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {bookableDates.map((d, i) => {
              const isSelected = d.toDateString() === date.toDateString();
              return (
                <div
                  key={i}
                  onClick={() => setDate(d)}
                  style={{
                    padding: '10px 15px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    backgroundColor: isSelected ? '#4CAF50' : '#f9f9f9',
                    color: isSelected ? '#fff' : '#000',
                    cursor: 'pointer',
                  }}
                >
                  {d.toDateString()}
                </div>
              );
            })}
          </div>

          <h3>Available Times for {date.toDateString()}:</h3>
          <select onChange={(e) => setSelectedTime(e.target.value)} value={selectedTime}>
            <option value="">Select a time</option>
            {availableTimes.length > 0 ? (
              availableTimes.map((time) => (
                <option key={time} value={time}>
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

          <h3>Select a Specification</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {data.getService.specifications.map((item, index) => (
              <div
                key={index}
                onClick={() => setSpecification(item)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  backgroundColor: specification === item ? '#4CAF50' : '#f1f1f1',
                  color: specification === item ? '#fff' : '#000',
                }}
              >
                {item}
              </div>
            ))}
          </div>

          <button onClick={handleBooking} style={{ marginTop: '20px' }}>
            Book Now
          </button>

          {status && <p>{status}</p>}
        </>
      )}
    </div>
  );
};

export default Booking;
