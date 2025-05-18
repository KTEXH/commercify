import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useMutation } from '@apollo/client'
import { gql } from 'graphql-tag'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import emailjs from '@emailjs/browser'
const CREATE_PAYMENT = gql`
  mutation CreatePayment(
    $id: Int!
    $amount: Int
    $product: String
    $email: String
    $name: String
    $type: String
    $productId: Int!
    $color: String
    $formattedDate: String
    $bookingDay: String
    $bookingTime: String
    $size: String
    $shipping: ShippingCreateInput
  ) {
    createPayment(
      id: $id
      amount: $amount
      product: $product
      email: $email
      name: $name
      color: $color
      size: $size
      type: $type
      bookingDay: $bookingDay,
      bookingTime: $bookingTime,
      formattedDate: $formattedDate,
      productId: $productId
      shipping: $shipping
    ) {
      id
      amount
      email
      name
      Shipping {
        id
        address
        city
        zipCode
        country
      }
    }
  }
`;

const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
        base: {
            iconColor: "#000",
            color: "#000",
            fontWeight: 500,
            fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
            fontSize: "16px",
            fontSmoothing: "antialiased",
            ":-webkit-autofill": { color: "#000" },
            "::placeholder": { color: "#000" },
            backgroundColor: "#fff", // Optional: Add a background color
            border: "1px solid #e0e0e0", // Optional: Add a border color
            borderRadius: "8px", // Curved edges
            padding: "10px" // Optional: Add padding for better spacing
        },
        invalid: {
            iconColor: "#ffc7ee",
            color: "#ffc7ee",
            borderColor: "#ffc7ee", // Add a border color for invalid state
            borderRadius: "8px" // Curved edges for invalid state
        }
    }
}

function ProductDialog({ item, isOpen, onClose }) {
    let [isPaying, setIsPaying] = useState(false)
    const [date, setDate] = useState(new Date());
    const [bookableDates, setBookableDates] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [formattedDate, setFormattedDate] = useState('');
    const [size, setSize] = useState('')
    const [color, setColor] = useState('')
    const generateBookableDates = (daysArray) => {
        if (!Array.isArray(daysArray)) return [];

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
        if (item) {
            const selectedDay = date.toLocaleDateString('en-US', { weekday: 'long' });
            setFormattedDate(date.toDateString());

            if (item?.availablityDays?.includes(selectedDay)) {
                setAvailableTimes(item.availablityHours);
            } else {
                setAvailableTimes([]);
            }
        }
    }, [date, item]);


    useEffect(() => {
        if (item) {
            const bookable = generateBookableDates(item.availablityDays);
            setBookableDates(bookable);
        }
    }, [item]);
    function closeModal() {
        setIsPaying(false)
    }

    function openModal() {
        setIsPaying(true)
    }

    function opneModalShipping() {
        setIsPaying(true)
        setShipping(true)
    }
    const [success, setSuccess] = React.useState(false)
    const stripe = useStripe()
    const elements = useElements()
    const [pay, { data }] = useMutation(CREATE_PAYMENT)

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    // Handle changes to the email input
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };


    // Handle changes to the name input
    const handleNameChange = (event) => {
        setName(event.target.value);
    };


    const [shippingData, setShippingData] = useState({
        criteria: '',
        address: '',
        zipCode: 0,
        state: '',
        city: '',
        country: '',
        name: name,
        emailAdress: email,
    });
    const zipCode = parseInt(shippingData.zipCode, 10);

    const handleSend = async (e) => {

        try {
            const templateParams = {
                email,
                subject: "Your download link",
                message: `Here's the link to download your file: ${item?.file}`, // Make sure this is a valid URL
            };

            const res = await emailjs.send(
                "service_0iow4v4",
                "template_ypeihpp",
                templateParams,
                "QayTo8tYY4xV-J-Bh"
            );

            console.log("Email sent:", res.status);
        } catch (err) {
            console.error("EmailJS error:", err);
        }
    };



    const handleSendDigital = async (e) => {
        e.preventDefault();

        const paymentSuccess = await handleSubmit(); // wait for payment
        if (paymentSuccess) {
            try {
                await handleSend(); // only send email if payment was successful
                console.log("File sent via email.");
            } catch (err) {
                console.error("Failed to send file:", err);
            }
        }
    };

    const handleSubmit = async () => {

        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
            billing_details: { email },
        });

        if (!error) {
            const stripePaymentId = paymentMethod.id;

            try {
                // Call your backend to actually create the Stripe charge
                const response = await fetch('https://paymentserver-40nh.onrender.com/createPayment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: item?.price + '00', // Stripe expects cents
                        id: stripePaymentId,
                        payment_method: paymentMethod.id,  // Stripe PaymentMethod ID
                        email: email,
                        file: item.file,
                        title: item.title,
                        idNumber: data?.ClothingPayment?.id || 'defaultIdNumber',
                        name: item?.author?.name,
                        customer: name,
                    }),
                });

                const resData = await response.json();
                console.log('Stripe charge successful:', resData);

                // Call your GraphQL backend to log the payment + shipping
                await handlePaymentSubmit();

                setSuccess(true);
                setTimeout(() => setSuccess(false), 5000);
                return true
            } catch (err) {
                console.error('Stripe payment failed:', err);
            }
        } else {
            console.error('Stripe error:', error.message);
        }
    };

    const handlePaymentSubmit = async () => {
        const paymentData = {
            amount: item?.price,
            id: item?.author?.id,
            email,
            name,
            productId: item?.id,
            product: item?.title,
            type: item?.isService ? 'Booking' : 'Purchase',
        };

        try {
            const { data } = await pay({
                variables: {
                    ...paymentData,
                    color,
                    size,
                    formattedDate: formattedDate,
                    bookingDay: date.toLocaleDateString('en-US', { weekday: 'long' }),
                    bookingTime: selectedTime,
                    shipping: {
                        address: shippingData.address,
                        city: shippingData.city,
                        zipCode: parseInt(shippingData.zipCode),
                        country: shippingData.country,
                        state: shippingData.state,
                        name: shippingData.name,
                        emailAdress: shippingData.emailAdress,
                        criteria: shippingData.criteria
                    }
                },
            });

            console.log('GraphQL Payment saved:', data);
        } catch (error) {
            console.error('GraphQL mutation error:', error);
        }
    };

    const handleSizeClick = (size) => {
        // When a size is clicked, update the criteria in the state
        setShippingData({
            ...shippingData,
            criteria: size,
        });
    };

    const isDigital = ['Digital Download', 'Ebook', 'Audio'].includes(item?.type);


    const handleShippingInputChange = (e) => {
        const { name, value } = e.target;

        // If the input name is "zipCode," parse the value as an integer
        const parsedValue = name === 'zipCode' ? parseInt(value, 10) || 0 : value;

        setShippingData({
            ...shippingData,
            [name]: parsedValue,
        });
    };



    const [shipping, setShipping] = useState(false)



    return (
        <div>
            <Transition show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="inset-0"
                    onClose={onClose}
                >
                    <div className="min-h-screen">




                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="p-5 rounded-t-3xl self-stretch fixed bg-white bottom-0 transform transition-transform duration-300">



                                {isOpen && item !== null && ( // Check if item is not null
                                    // Render your dialog content here, including item details
                                    <div className="overflow-y-scroll max-h-screen">

                                        <div>
                                            <div class='w-full'>
                                                <div class='flex items-center justify-between self-stretch'>
                                                    <div class='my-3 text-2xl font-["Semibold"]'>{item.title}</div>
                                                    <img src={item.thumbnail} className="w-10 rounded-full h-10" />
                                                </div>
                                                <div class='flex items-center py-2 gap-3'>
                                                    <div class='font-["Semibold"] text-lg'>${item.price}</div>
                                                    <div class='h-5 w-[1px] bg-gray-300' />
                                                    <div class='flex items-center gap-x-2'>
                                                        <img src='/rating.svg' class='xs:h-auto h-4' />
                                                        <div class='text-gray-500 font-["Medium"] text-sm'>{item.isDonation ? 'Donation rating' : 'Rated by others'}</div>
                                                    </div>
                                                </div>
                                                <div class='mt-2 mb-4 font-["Medium"] text-gray-500 w-full flex-grow min-w-full text-sm pr-3'>{item.description}</div>


                                                <Transition show={isPaying} as={Fragment}>
                                                    <Dialog
                                                        as="div"
                                                        className="fixed inset-0 z-10"
                                                        onClose={onClose}
                                                    >
                                                        <div className="min-h-screen">




                                                            <Transition.Child
                                                                as={Fragment}
                                                                enter="ease-out duration-300"
                                                                enterFrom="opacity-0 scale-95"
                                                                enterTo="opacity-100 scale-100"
                                                                leave="ease-in duration-200"
                                                                leaveFrom="opacity-100 scale-100"
                                                                leaveTo="opacity-0 scale-95"
                                                            >
                                                                <div className="rounded-t-3xl w-full fixed bg-white bottom-0 transform transition-transform duration-300">

                                                                    <div class='p-5'>

                                                                        {shipping === true && (
                                                                            <div class='self-stretch'>
                                                                                <div class='flex items-center justify-between mb-4'>
                                                                                    <div class='text-2xl w-2/3' style={{ fontFamily: 'Bold' }}>Shipping</div>
                                                                                    <img src={item.thumbnail} class='w-10 h-10 rounded-full' />
                                                                                </div>
                                                                                <div class='my-3 flex items-center border-solid border-gainsboro border-[1px] rounded-xl overflow-hidden gap-3'>
                                                                                    <img src={item.thumbnail} class='w-24 h-24' />
                                                                                    <div class='py-2 pr-3'>
                                                                                        <div class='font-["Semibold"] line-clamp-1 text-sm'>{item.title}</div>
                                                                                        <div class='line-clamp-3 text-xs text-gray-500 font-["Face"] mb-2 mt-1'>{item.description}</div>

                                                                                    </div>
                                                                                </div>
                                                                                <div class={`${item?.type === 'Merchandise' ? 'flex' : 'hidden'}`}>
                                                                                    <div>
                                                                                        <div>
                                                                                            <div>Sizes</div>
                                                                                            {item?.sizes?.map(item => (
                                                                                                <div onClick={() => setSize(item)} key={item}>{item}</div>
                                                                                            ))}
                                                                                        </div>
                                                                                        <div>
                                                                                            <div>Colors</div>
                                                                                            {item?.colors?.map(item => (
                                                                                                <div onClick={() => setColor(item)} key={item}>{item}</div>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>

                                                                                </div>

                                                                                <form>
                                                                                    <div class='font-["Semibold"] my-4 text-sm'>Shipping Information</div>

                                                                                    <div className="flex my-4 w-full overflow-hidden border-[1px] border-gainsboro border-solid rounded-[14px] items-center">
                                                                                        <div class='w-full'>
                                                                                            <input
                                                                                                style={{ fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif' }}
                                                                                                type="text"
                                                                                                name="name"
                                                                                                placeholder="Name"
                                                                                                value={name}
                                                                                                onChange={handleNameChange}
                                                                                                className="h-12 px-3 w-full border-0 font-semi text-sm outline-0 box-border"
                                                                                            />
                                                                                        </div>
                                                                                        <div className="w-[2px] h-12 bg-gainsboro"></div> {/* Divider */}
                                                                                        <div class='w-full'>
                                                                                            <input
                                                                                                style={{ fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif' }}
                                                                                                type="text"
                                                                                                placeholder="Email"
                                                                                                name="emailAdress"
                                                                                                value={email}
                                                                                                onChange={handleEmailChange}
                                                                                                className="h-12 px-3 w-full border-0 font-semi text-sm outline-0 box-border"
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="space-y-2 mt-3 w-full">
                                                                                        <input
                                                                                            type="text"
                                                                                            name="address"
                                                                                            placeholder="Address"
                                                                                            value={shippingData.address}
                                                                                            onChange={handleShippingInputChange}
                                                                                            className="w-full h-12 px-3 border-[1px] font-semi border-gainsboro border-solid text-sm outline-0 rounded-[14px] box-border"
                                                                                            style={{ fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif' }}
                                                                                        />
                                                                                    </div>

                                                                                    <div className="flex my-4 w-full overflow-hidden border-[1px] border-gainsboro border-solid rounded-[14px] items-center">
                                                                                        <div className="w-full">
                                                                                            <input
                                                                                                placeholder="Country"
                                                                                                type="text"
                                                                                                name="country"
                                                                                                value={shippingData.country}
                                                                                                onChange={handleShippingInputChange}
                                                                                                className="h-12 px-3 w-full border-0 font-semi text-sm outline-0 box-border"
                                                                                                style={{ fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif' }}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="w-[1px] h-12 bg-gainsboro"></div> {/* Divider */}
                                                                                        <div className="w-full">
                                                                                            <input
                                                                                                placeholder="State"
                                                                                                type="text"
                                                                                                name="state"
                                                                                                value={shippingData.state}
                                                                                                style={{ fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif' }}
                                                                                                onChange={handleShippingInputChange}
                                                                                                className="h-12 px-3 font-semi w-full border-0 text-sm outline-0 box-border"
                                                                                            />
                                                                                        </div>
                                                                                        <div className="w-[1px] h-12 bg-gainsboro"></div> {/* Divider */}
                                                                                        <div className="w-full">
                                                                                            <input
                                                                                                placeholder="City"
                                                                                                type="text"
                                                                                                name="city"
                                                                                                value={shippingData.city}
                                                                                                onChange={handleShippingInputChange}
                                                                                                className="h-12 w-full px-3 border-0 text-sm font-semi outline-0 box-border"
                                                                                                style={{ fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif' }}
                                                                                            />
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class='space-y-2 mt-3'>
                                                                                        <input
                                                                                            style={{ fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif' }}
                                                                                            placeholder='Zip code'
                                                                                            type="text"
                                                                                            name="zipCode"
                                                                                            value={shippingData.zipCode}
                                                                                            onChange={handleShippingInputChange}
                                                                                            className="w-full h-12 px-3 border-[1px] border-gainsboro border-solid text-sm outline-0 font-medium rounded-[14px] box-border" />
                                                                                    </div>
                                                                                </form>



                                                                            </div>
                                                                        )}

                                                                        <div class={`${shipping === false && 'hidden'} mt-3 flex items-center gap-4`}>
                                                                            <button class='bg-black w-full py-3 text-sm text-white rounded-xl font-["Semibold"]'>Back</button>
                                                                            <button onClick={() => setShipping(false)} class='bg-gray-100 text-black w-full text-sm py-3 rounded-xl font-["Semibold"]'>Checkout</button>
                                                                        </div>


                                                                        <div class={`${shipping === true && 'hidden'}`}>
                                                                            <div className="my-2 flex flex-col w-full mt-2">
                                                                                <div class={`${item?.serviceOrProduct === 'Product' && 'hidden'}`}>
                                                                                    <div>Select time</div>
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
                                                                                </div>
                                                                                <div class='font-["Semi"] mb-2 mt-4 text-sm'>Name & Email</div>
                                                                                <div class=' border-[1px] border-solid border-gainsboro rounded-[16px]'>
                                                                                    <input
                                                                                        value={name}
                                                                                        onChange={handleNameChange}
                                                                                        className="py-4 font-['Face'] focus:outline-none focus:ring-0 border-solid px-4 self-stretch outline-0 border-0 border-gainsboro rounded-t-[14px]"
                                                                                        placeholder="John Doe"
                                                                                    />
                                                                                    <div class='h-[1px] w-full bg-gainsboro'></div>
                                                                                    <input
                                                                                        value={email}
                                                                                        onChange={handleEmailChange}
                                                                                        className="py-4 font-['Face'] focus:outline-none focus:ring-0 px-4 self-stretch border-solid border-0 border-gainsboro rounded-b-[14px] outline-0"
                                                                                        placeholder="doe@example.com"
                                                                                    />
                                                                                </div>
                                                                            </div>


                                                                            <div>
                                                                                <div class='font-["Semi"] mb-2 mt-4 text-sm'>Card Information</div>

                                                                                <div className="p-3 py-4 border-[1px] rounded-xl border-gainsboro border-solid my-3">
                                                                                    <CardElement options={CARD_OPTIONS} />
                                                                                </div>
                                                                                <div class='mt-3 flex flex-row items-center gap-2'>
                                                                                    <img src='/checks2.png' class='w-7 h-7' />
                                                                                    <div class='font-["Semi"] text-sm'>Guaranteed safe & secure payments</div>
                                                                                </div>
                                                                                {success === true && (<div class='text-sm py-2 font-["Semi"]'>Purchase succesful 🎉</div>)}
                                                                                <div class='flex items-center w-full gap-4'>
                                                                                    <button
                                                                                        type="button"
                                                                                        style={{ fontFamily: 'Semi' }}
                                                                                        className={`w-full py-4 bg-gray-100 outline-0 text-[15px] border-0 rounded-[16px] text-black bg-black`}
                                                                                        onClick={closeModal}
                                                                                    >
                                                                                        Close
                                                                                    </button>
                                                                                    <form class={`${(item?.type === 'Merchandise' ? 'hidden' : 'flex')} ${item?.serviceOrProduct === 'Service' ? 'hidden' : 'flex'}`} onSubmit={handleSendDigital}>
                                                                                        <button type='submit' class='w-full py-4 mt-3 bg-black text-[15px] outline-0 border-0 text-white rounded-[16px] font-bold font-["Semibold"]'>
                                                                                            Pay ${item.price}
                                                                                        </button>
                                                                                    </form>
                                                                                    <button onClick={handleSubmit} class={`w-full py-4 mt-3 bg-black text-[15px] ${isDigital ? 'hidden' : 'flex'} outline-0 border-0 text-white rounded-[16px] font-bold font-["Semibold"]`}>
                                                                                        Pay ${item.price}
                                                                                    </button>
                                                                                </div>


                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Transition.Child>
                                                        </div>

                                                    </Dialog>
                                                </Transition>
                                                {item?.type === 'Merchandise' ? (
                                                    <button onClick={opneModalShipping} type='submit' class='w-full py-4 bg-black focus:outline-none focus:ring-0 text-[15px] outline-0 border-0 text-white rounded-[16px] font-bold  font-["Semibold"]'>
                                                        Continue to shipping
                                                    </button>)
                                                    :
                                                    (
                                                        <button onClick={openModal} type='submit' class='w-full py-4 bg-black focus:outline-none focus:ring-0 text-[15px] outline-0 border-0 text-white rounded-[16px] font-bold  font-["Semibold"]'>
                                                            Purchase
                                                        </button>
                                                    )}
                                            </div>

                                            <div className="mt-3">
                                                <button
                                                    type="button"
                                                    style={{ fontFamily: 'Semibold' }}
                                                    className={`w-full py-4 bg-gray-100 outline-0 text-[15px] border-0 rounded-[16px] text-black bg-black`}
                                                    onClick={onClose}
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                        {/* Close button */}
                                    </div>
                                )}


                            </div>
                        </Transition.Child>

                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

export default ProductDialog;