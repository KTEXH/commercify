import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useMutation } from '@apollo/client'
import { gql } from 'graphql-tag'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import emailjs from '@emailjs/browser'
import logo from './assets/logo.svg'
import { Check } from "lucide-react";
import flag from './assets/united-states.png'
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
    let [isShipping, setIsShipping] = useState(false)
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

    function closeModalShipping() {
        setIsPaying(false)
        setShipping(false)
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
        zipCode: '',
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
            <Dialog
                open={isOpen}
                onClose={close}
            >
                <div className="">




                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="p-5 rounded-t-3xl w-full fixed bg-white bottom-0 transform transition-transform duration-300">



                            {isOpen && item !== null && ( // Check if item is not null
                                // Render your dialog content here, including item details
                                <div className="overflow-y-scroll w-full max-h-screen">

                                    <div class='w-full'>
                                        <div class='flex flex-col w-full'>
                                            <img src={item.thumbnail || logo} className="w-full" />
                                        </div>

                                        <div class='mt-2 mb-4 font-["Medium"] text-gray-500 w-full flex-grow min-w-full text-sm pr-3'>{item.description}</div>


                                        <Transition show={isPaying} as={Fragment}>
                                            <Dialog
                                                as="div"
                                                className="fixed inset-0 z-50"
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
                                                                            <div class='text-2xl w-2/3' style={{ fontFamily: 'Semibold' }}>Shipping</div>
                                                                            <img src={item.thumbnail || logo} class='w-10 h-10 rounded-full' />
                                                                        </div>

                                                                        <div class={`${item?.type === 'Merchandise' ? 'flex' : 'hidden'}`}>
                                                                            <div>
                                                                                <div>
                                                                                    <div class='font-["Semibold"] text-sm'>Sizes</div>
                                                                                    <div class='flex items-center gap-3 mt-2'>
                                                                                        {item?.sizes?.map(item => (
                                                                                            <div class='px-3 py-2 rounded-full text-xs font-["Semibold"] border' onClick={() => setSize(item)} key={item}>{item}</div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <div class='font-["Semibold"] mt-2 text-sm'>Colors</div>
                                                                                    <div class='flex items-center gap-3 mt-2'>
                                                                                        {item?.colors?.map(item => (
                                                                                            <div class='px-3 py-2 rounded-full text-xs flex items-center gap-2 font-["Semibold"] border' onClick={() => setColor(item)} key={item}>
                                                                                                <div class='h-4 w-4 border rounded-full' style={{ backgroundColor: item }} />
                                                                                                <div>{item}</div>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                        </div>

                                                                        <form>

                                                                            <div class='font-["Semibold"] text-sm my-4'>Address & Zip</div>
                                                                            <div class='border overflow-hidden mt-2 rounded-3xl'>
                                                                                <input
                                                                                    type="text"
                                                                                    name="address"
                                                                                    value={shippingData.address}
                                                                                    onChange={handleShippingInputChange}
                                                                                    className="py-4 font-['Medium'] text-sm focus:outline-none focus:ring-0 border-solid px-4 self-stretch outline-0 border-0 border-gainsboro rounded-t-[14px]"
                                                                                    placeholder="123 John Doe Ln"
                                                                                />
                                                                                <div class='border-t w-full'></div>
                                                                                <div class='flex px-5 items-center'>
                                                                                    <img src={flag} class='w-5 h-5' />
                                                                                    <input
                                                                                        style={{ fontFamily: 'Medium' }}
                                                                                        type="text"
                                                                                        name="zipCode"
                                                                                        value={shippingData.zipCode}
                                                                                        onChange={handleShippingInputChange}
                                                                                        className="py-4 font-['Medium'] text-sm focus:outline-none focus:ring-0 px-4 self-stretch border-solid border-0 border-gainsboro rounded-b-[14px] outline-0"
                                                                                        placeholder="12345"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div class='my-4 font-["Semibold"] text-sm'>Specifics</div>
                                                                            <div className="flex overflow-hidden mt-2 border rounded-full items-center">
                                                                                <div className="w-full">

                                                                                    <input
                                                                                        placeholder="Country"
                                                                                        type="text"
                                                                                        name="country"
                                                                                        value={shippingData.country}
                                                                                        onChange={handleShippingInputChange}
                                                                                        class='px-4 py-3 font-["Medium"] text-sm w-full'
                                                                                    />
                                                                                </div>
                                                                                <div className="w-full border-l">

                                                                                    <input
                                                                                        placeholder="State"
                                                                                        type="text"
                                                                                        name="state"
                                                                                        value={shippingData.state}
                                                                                        onChange={handleShippingInputChange}
                                                                                        class='px-4 py-3 font-["Medium"]  text-sm w-full' />
                                                                                </div>
                                                                                <div className="w-full border-l">

                                                                                    <input
                                                                                        placeholder="City"
                                                                                        type="text"
                                                                                        name="city"
                                                                                        value={shippingData.city}
                                                                                        onChange={handleShippingInputChange}
                                                                                        class='px-4 py-3 font-["Medium"] text-sm w-full' />
                                                                                </div>
                                                                            </div>


                                                                        </form>



                                                                    </div>
                                                                )}

                                                                <div class={`${shipping === false && 'hidden'} mt-3 flex items-center gap-4`}>
                                                                    <button onClick={closeModalShipping} class='text-sm w-full py-3 rounded-full border shadow-sm font-["Semibold"]'>Back</button>
                                                                    <button onClick={() => setShipping(false)} class='bg-black text-white w-full text-sm py-3 rounded-full font-["Semibold"]'>Checkout</button>
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
                                                                        <div class='font-["Semibold"] mb-2 mt-4 text-sm'>Name & Email</div>
                                                                        <div class='border overflow-hidden shadow-sm rounded-3xl'>
                                                                            <input
                                                                                value={name}
                                                                                onChange={handleNameChange}
                                                                                className="py-4 font-['Medium'] text-sm focus:outline-none focus:ring-0 border-solid px-4 self-stretch outline-0 border-0 border-gainsboro rounded-t-[14px]"
                                                                                placeholder="John Doe"
                                                                            />
                                                                            <div class='border-t w-full'></div>
                                                                            <input
                                                                                value={email}
                                                                                onChange={handleEmailChange}
                                                                                className="py-4 font-['Medium'] text-sm focus:outline-none focus:ring-0 px-4 self-stretch border-solid border-0 border-gainsboro rounded-b-[14px] outline-0"
                                                                                placeholder="doe@example.com"
                                                                            />
                                                                        </div>
                                                                    </div>


                                                                    <div>
                                                                        <div class='font-["Semibold"] mb-2 mt-4 text-sm'>Card Information</div>

                                                                        <div className="p-3 font-['Medium'] py-4 border text-sm rounded-full shadow-sm my-3">
                                                                            <CardElement options={CARD_OPTIONS} />
                                                                        </div>
                                                                        <div class='mt-3 flex flex-row items-center gap-2'>
                                                                            <Check class='w-4 h-4' />
                                                                            <div class='font-["Semibold"] text-xs'>Guaranteed safe & secure payments</div>
                                                                        </div>
                                                                        {success === true && (<div class='text-sm py-2 font-["Semi"]'>Purchase succesful 🎉</div>)}
                                                                        <div class='flex items-center w-full mt-3 gap-4'>
                                                                            <button
                                                                                type="button"
                                                                                style={{ fontFamily: 'Semibold' }}
                                                                                className={`w-full py-3 border outline-0 text-sm rounded-full text-black shadow-sm`}
                                                                                onClick={closeModal}
                                                                            >
                                                                                Close
                                                                            </button>
                                                                            <form class={`${(item?.type === 'Merchandise' ? 'hidden' : 'flex')} ${item?.serviceOrProduct === 'Service' ? 'hidden' : 'flex w-full'}`} onSubmit={handleSendDigital}>
                                                                                <button type='submit' class='w-full py-3 w-full rounded-full bg-black text-[15px] outline-0 border-0 text-white rounded-[16px] font-bold font-["Semibold"]'>
                                                                                    Pay ${item.price}
                                                                                </button>
                                                                            </form>
                                                                            <button onClick={handleSubmit} class={`w-full py-3 rounded-full bg-black text-sm ${isDigital ? 'hidden' : 'flex justify-center items-center'} outline-0 border-0 text-white rounded-[16px] font-bold font-["Semibold"]`}>
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

                                    </div>

                                    <div className="mt-3 flex items-center gap-4">
                                        <button onClick={(e) => onClose()}>ffkrkr</button>
                                        {item?.type === 'Merchandise' ? (
                                            <button onClick={opneModalShipping} type='submit' class='w-full py-3 bg-black focus:outline-none focus:ring-0 text-[15px] outline-0 border-0 text-white rounded-full font-["Semibold"]'>
                                                Shipping
                                            </button>)
                                            :
                                            (
                                                <button onClick={openModal} type='submit' class='w-full py-3 bg-black focus:outline-none focus:ring-0 text-[15px] outline-0 border-0 text-white rounded-full font-["Semibold"]'>
                                                    Purchase
                                                </button>
                                            )}

                                    </div>
                                    {/* Close button */}
                                </div>
                            )}


                        </div>
                    </Transition.Child>

                </div>
            </Dialog>
        </div>
    );
}

export default ProductDialog;