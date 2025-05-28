import React, { useEffect, useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom';
import { ArrowBigLeft, Check } from 'lucide-react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { BellAlertIcon } from '@heroicons/react/24/outline';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import emailjs from '@emailjs/browser'
import flag from '../../components/assets/united-states.png'


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

const GET_PRODUCT = gql`
  query getProduct($slug: String!) {
    getProduct(slug: $slug) {
      id
      price
      slug
      title
      thumbnail
      serviceOrProduct
      sizes
      description
      type
      colors
      author{
      id
      }
    }
  }
`;

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



const ProductOne = () => {
    const { slug } = useParams();
    const { data, error, loading } = useQuery(GET_PRODUCT, {
        variables: { slug: slug }
    })
    const product = data?.getProduct

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
        if (product) {
            const selectedDay = date.toLocaleDateString('en-US', { weekday: 'long' });
            setFormattedDate(date.toDateString());

            if (product?.availablityDays?.includes(selectedDay)) {
                setAvailableTimes(product.availablityHours);
            } else {
                setAvailableTimes([]);
            }
        }
    }, [date, product]);


    useEffect(() => {
        if (product) {
            const bookable = generateBookableDates(product.availablityDays);
            setBookableDates(bookable);
        }
    }, [product]);

    const [success, setSuccess] = React.useState(false)
    const stripe = useStripe()
    const elements = useElements()
    const [pay, { paymentInfo }] = useMutation(CREATE_PAYMENT)

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
                        amount: product?.price + '00', // Stripe expects cents
                        id: stripePaymentId,
                        payment_method: paymentMethod.id,  // Stripe PaymentMethod ID
                        email: email,
                        file: product.file,
                        title: product.title,
                        idNumber: data?.ClothingPayment?.id || 'defaultIdNumber',
                        name: product?.author?.name,
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
            amount: product?.price,
            id: product?.author?.id,
            email,
            name,
            productId: product?.id,
            product: product?.title,
            type: product?.isService ? 'Booking' : 'Purchase',
        };

        try {
            const { paymentInfo } = await pay({
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

            console.log('GraphQL Payment saved:', paymentInfo);
        } catch (error) {
            console.error('GraphQL mutation error:', error);
        }
    };


    const isDigital = ['Digital Download', 'Ebook', 'Audio'].includes(product?.type);


    const handleShippingInputChange = (e) => {
        const { name, value } = e.target;

        // If the input name is "zipCode," parse the value as an integer
        const parsedValue = name === 'zipCode' ? parseInt(value, 10) || 0 : value;

        setShippingData({
            ...shippingData,
            [name]: parsedValue,
        });
    };



    const [process, setProcess] = useState({
        product: true,
        shipping: false,
        payment: false
    })

    const setSingleProcess = (key) => {
        setProcess({
            product: key === 'product',
            shipping: key === 'shipping',
            payment: key === 'payment',
        });
    };

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>
    return (
        <div class='h-full'>
            <div class={`${process.product === true ? 'relative' : 'hidden'}`}>
                <div class='relative'>
                    <img src={data?.getProduct?.thumbnail} class='bg-black' />
                    <div className="absolute top-5 right-5 rounded-full flex items-center justify-center w-11 h-11 bg-black bg-opacity-10">
                        <EllipsisHorizontalIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute top-5 left-1/2 transform -translate-x-1/2">
                        <span className="text-white font-medium">Centered Text or Element</span>
                    </div>
                    <div className="absolute top-5 left-5 rounded-full flex items-center justify-center w-11 h-11 bg-black bg-opacity-10">
                        <BellAlertIcon className="w-4 h-4 text-white" />
                    </div>
                </div>
                <div class='mt-[-50px] bg-white w-full h-full flex p-7 flex-col z-20 relative rounded-t-[50px]'>
                    <div class='text-lg font-["Semibold"]'>${product.price}</div>
                    <div class='text-4xl font-["Semibold"]'>{data?.getProduct?.title}</div>
                    <div class='mt-2 flex flex-col self-stretch justify-between'>
                        <div class='w-full'>
                            <div class='text-xs font-["Semibold"]'>Colors</div>
                            <div class='flex items-cneter gap-3 mt-2 flex-wrap'>
                                {product.colors.map(item => (<div class='text-xs font-["Semibold"] flex items-center gap-2 p-1 rounded-full border'><div style={{ backgroundColor: item }} class='w-4 h-4 rounded-full border' /></div>))}
                            </div>
                        </div>
                        <div class='font-["Medium"] mt-2 text-sm text-gray-500'>{product.description}</div>

                    </div>

                </div>
                <div class='flex items-center z-40 bottom-0 gap-3 px-7 py-3 fixed w-full bg-white'>
                    <div class='p-4 border flex justify-center items-center rounded-full'>
                        <ArrowBigLeft />
                    </div>
                    {product?.type === 'Merchandise' ? <button onClick={() => setSingleProcess('shipping')} class='w-full bg-black py-4 rounded-full text-white font-["Semibold"]'>Buy Now</button>
                        : <button class='w-full bg-black py-4 rounded-full text-white font-["Semibold"]'>Buy Now</button>
                    }
                </div>
            </div>
            <div class={`${process.shipping === true ? 'relative' : 'hidden'}`}>

                <div class='self-stretch p-7'>
                    <div class='flex items-center justify-between mb-4'>
                        <div class='text-2xl w-2/3' style={{ fontFamily: 'Semibold' }}>Shipping</div>
                        <img src={product.thumbnail || logo} class='w-10 h-10 rounded-full' />
                    </div>

                    <div class={`${product?.type === 'Merchandise' ? 'flex' : 'hidden'}`}>
                        <div>
                            <div>
                                <div class='font-["Semibold"] text-sm'>Sizes</div>
                                <div class='flex items-center gap-3 mt-2'>
                                    {product?.sizes?.map(item => (
                                        <div class='px-3 py-2 rounded-full text-xs font-["Semibold"] border' onClick={() => setSize(item)} key={item}>{item}</div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div class='font-["Semibold"] mt-2 text-sm'>Colors</div>
                                <div class='flex items-center gap-3 mt-2'>
                                    {product?.colors?.map(item => (
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
                <div class='flex items-center z-40 bottom-0 gap-3 px-7 py-3 fixed w-full bg-white'>
                    <div class='p-4 border flex justify-center items-center rounded-full'>
                        <ArrowBigLeft />
                    </div>
                    {product?.type === 'Merchandise' ? <button onClick={() => setSingleProcess('payment')} class='w-full bg-black py-4 rounded-full text-white font-["Semibold"]'>Buy Now</button>
                        : <button class='w-full bg-black py-4 rounded-full text-white font-["Semibold"]'>Buy Now</button>
                    }
                </div>
            </div>
            <div class={`${process.payment === true ? 'relative p-7' : 'hidden'}`}>
                <div className="my-2 flex flex-col w-full mt-2">
                    <div class={`${product?.serviceOrProduct === 'Product' && 'hidden'}`}>
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
                    <div class='font-["Semibold"] mb-2 mt-4 text-sm'>Card Information</div>

                    <div className="p-3 font-['Medium'] py-4 border text-sm rounded-full shadow-sm my-3">
                        <CardElement options={CARD_OPTIONS} />
                    </div>
                    <div class='mt-3 flex flex-row items-center gap-2'>
                        <Check class='w-4 h-4' />
                        <div class='font-["Semibold"] text-xs'>Guaranteed safe & secure payments</div>
                    </div>
                </div>
                <form class={`${(product?.type === 'Merchandise' ? 'hidden' : 'flex')} ${product?.serviceOrProduct === 'Service' ? 'hidden' : 'flex w-full'}`} onSubmit={handleSendDigital}>
                    <button type='submit' class='w-full py-3 w-full rounded-full bg-black text-[15px] outline-0 border-0 text-white rounded-[16px] font-bold font-["Semibold"]'>
                        Pay ${product.price}
                    </button>
                </form>
                <button onClick={handleSubmit} class={`w-full py-3 rounded-full bg-black text-sm ${isDigital ? 'hidden' : 'flex justify-center items-center'} outline-0 border-0 text-white rounded-[16px] font-bold font-["Semibold"]`}>
                    Pay ${product.price}
                </button>
            </div>
        </div>
    )
}

export default ProductOne