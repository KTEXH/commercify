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
        <div className='h-full'>
            <div className={`${process.product === true ? 'relative' : 'hidden'}`}>
                <div className='relative'>
                    <img src={data?.getProduct?.thumbnail} className='w-full object-cover bg-zinc-100' />
                    <div className="absolute top-5 right-5 rounded-2xl flex items-center justify-center w-10 h-10 bg-black/20 backdrop-blur-sm">
                        <EllipsisHorizontalIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute top-5 left-5 rounded-2xl flex items-center justify-center w-10 h-10 bg-black/20 backdrop-blur-sm">
                        <BellAlertIcon className="w-4 h-4 text-white" />
                    </div>
                </div>
                <div className='mt-[-32px] bg-white w-full h-full flex px-6 pt-6 pb-28 flex-col z-20 relative rounded-t-3xl'>
                    <div className='text-sm font-["Semibold"] text-zinc-950'>${product.price}</div>
                    <div className='text-3xl font-["Semibold"] mt-1 text-zinc-900'>{data?.getProduct?.title}</div>
                    <div className='mt-4 flex flex-col self-stretch gap-4'>
                        {product.colors?.length > 0 && (
                            <div>
                                <div className='text-xs font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-2'>Colors</div>
                                <div className='flex items-center gap-2 flex-wrap'>
                                    {product.colors.map(item => (
                                        <div key={item} className='flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-["Semibold"]'>
                                            <div style={{ backgroundColor: item }} className='w-3.5 h-3.5 rounded-full border border-black/10' />
                                            <span className='text-zinc-600'>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className='font-["Medium"] text-sm text-zinc-500 leading-relaxed'>{product.description}</div>
                    </div>
                </div>
                <div className='flex items-center z-40 bottom-0 gap-3 px-6 py-4 fixed w-full bg-white border-t border-zinc-100'>
                    <div className='p-3.5 border border-zinc-200 flex justify-center items-center rounded-2xl'>
                        <ArrowBigLeft className='w-5 h-5 text-zinc-600' />
                    </div>
                    {product?.type === 'Merchandise'
                        ? <button onClick={() => setSingleProcess('shipping')} className='flex-1 bg-zinc-950 hover:bg-zinc-800 transition-colors py-3.5 rounded-2xl text-white font-["Semibold"] text-sm'>Buy Now</button>
                        : <button className='flex-1 bg-zinc-950 hover:bg-zinc-800 transition-colors py-3.5 rounded-2xl text-white font-["Semibold"] text-sm'>Buy Now</button>
                    }
                </div>
            </div>
            <div className={`${process.shipping === true ? 'relative' : 'hidden'}`}>

                <div className='self-stretch p-7'>
                    <div className='flex items-center justify-between mb-6'>
                        <div className='text-2xl font-["Semibold"] text-zinc-900'>Shipping</div>
                        <img src={product.thumbnail} className='w-10 h-10 rounded-2xl object-cover' />
                    </div>

                    <div className={`${product?.type === 'Merchandise' ? 'block' : 'hidden'} mb-5`}>
                        {product?.sizes?.length > 0 && (
                            <div className='mb-4'>
                                <div className='text-xs font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-2'>Size</div>
                                <div className='flex items-center gap-2 flex-wrap'>
                                    {product?.sizes?.map(item => (
                                        <div
                                            onClick={() => setSize(item)}
                                            key={item}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-["Semibold"] border cursor-pointer transition-colors ${size === item ? 'bg-zinc-950 text-white border-zinc-950' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'}`}
                                        >{item}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {product?.colors?.length > 0 && (
                            <div>
                                <div className='text-xs font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-2'>Color</div>
                                <div className='flex items-center gap-2 flex-wrap'>
                                    {product?.colors?.map(item => (
                                        <div
                                            onClick={() => setColor(item)}
                                            key={item}
                                            className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 font-["Semibold"] border cursor-pointer transition-colors ${color === item ? 'bg-zinc-950 text-white border-zinc-950' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'}`}
                                        >
                                            <div className='h-3.5 w-3.5 border border-black/10 rounded-full' style={{ backgroundColor: item }} />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <form>
                        <div className='text-xs font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-2'>Address & Zip</div>
                        <div className='border border-zinc-200 overflow-hidden rounded-2xl bg-white'>
                            <input
                                type="text"
                                name="address"
                                value={shippingData.address}
                                onChange={handleShippingInputChange}
                                className="w-full py-3.5 font-['Medium'] text-sm focus:outline-none px-4 border-0"
                                placeholder="123 John Doe Ln"
                            />
                            <div className='border-t border-zinc-100' />
                            <div className='flex px-4 items-center'>
                                <img src={flag} className='w-4 h-4 mr-3' />
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={shippingData.zipCode}
                                    onChange={handleShippingInputChange}
                                    className="flex-1 py-3.5 font-['Medium'] text-sm focus:outline-none border-0 outline-0"
                                    placeholder="Zip code"
                                />
                            </div>
                        </div>
                        <div className='text-xs font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-2 mt-4'>City, State & Country</div>
                        <div className='border border-zinc-200 overflow-hidden rounded-2xl bg-white'>
                            <input
                                placeholder="Country"
                                type="text"
                                name="country"
                                value={shippingData.country}
                                onChange={handleShippingInputChange}
                                className='w-full px-4 py-3.5 font-["Medium"] text-sm focus:outline-none border-0'
                            />
                            <div className='border-t border-zinc-100' />
                            <input
                                placeholder="State"
                                type="text"
                                name="state"
                                value={shippingData.state}
                                onChange={handleShippingInputChange}
                                className='w-full px-4 py-3.5 font-["Medium"] text-sm focus:outline-none border-0'
                            />
                            <div className='border-t border-zinc-100' />
                            <input
                                placeholder="City"
                                type="text"
                                name="city"
                                value={shippingData.city}
                                onChange={handleShippingInputChange}
                                className='w-full px-4 py-3.5 font-["Medium"] text-sm focus:outline-none border-0'
                            />
                        </div>
                    </form>

                </div>
                <div className='flex items-center z-40 bottom-0 gap-3 px-6 py-4 fixed w-full bg-white border-t border-zinc-100'>
                    <div className='p-3.5 border border-zinc-200 flex justify-center items-center rounded-2xl'>
                        <ArrowBigLeft className='w-5 h-5 text-zinc-600' />
                    </div>
                    {product?.type === 'Merchandise'
                        ? <button onClick={() => setSingleProcess('payment')} className='flex-1 bg-zinc-950 hover:bg-zinc-800 transition-colors py-3.5 rounded-2xl text-white font-["Semibold"] text-sm'>Continue</button>
                        : <button className='flex-1 bg-zinc-950 hover:bg-zinc-800 transition-colors py-3.5 rounded-2xl text-white font-["Semibold"] text-sm'>Continue</button>
                    }
                </div>
            </div>
            <div className={`${process.payment === true ? 'relative p-7' : 'hidden'}`}>
                <div className="my-2 flex flex-col w-full mt-2">
                    {/* Booking date/time picker for services */}
                    <div className={`${product?.serviceOrProduct === 'Product' ? 'hidden' : 'block'} mb-5`}>
                        <div className='text-xs font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-2'>Select Date</div>
                        <div className='flex flex-wrap gap-2'>
                            {bookableDates.map((d, i) => {
                                const isSelected = d.toDateString() === date.toDateString();
                                return (
                                    <div
                                        key={i}
                                        onClick={() => setDate(d)}
                                        className={`px-3 py-2 rounded-xl text-xs font-["Semibold"] border cursor-pointer transition-colors ${isSelected ? 'bg-zinc-950 text-white border-zinc-950' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'}`}
                                    >
                                        {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                );
                            })}
                        </div>
                        <div className='text-xs font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-2 mt-4'>Available Times</div>
                        <div className='border border-zinc-200 rounded-2xl overflow-hidden bg-white'>
                            <select
                                onChange={(e) => setSelectedTime(e.target.value)}
                                value={selectedTime}
                                className='w-full px-4 py-3.5 font-["Medium"] text-sm focus:outline-none border-0 bg-transparent appearance-none cursor-pointer'
                            >
                                <option value="">Select a time</option>
                                {availableTimes.length > 0
                                    ? availableTimes.map(time => <option key={time} value={time}>{time}</option>)
                                    : <option disabled>No times available for this day</option>
                                }
                            </select>
                        </div>
                    </div>

                    <div className='text-xs font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-2'>Name & Email</div>
                    <div className='border border-zinc-200 overflow-hidden rounded-2xl bg-white'>
                        <input
                            value={name}
                            onChange={handleNameChange}
                            className="w-full py-3.5 font-['Medium'] text-sm focus:outline-none px-4 border-0"
                            placeholder="John Doe"
                        />
                        <div className='border-t border-zinc-100' />
                        <input
                            value={email}
                            onChange={handleEmailChange}
                            className="w-full py-3.5 font-['Medium'] text-sm focus:outline-none px-4 border-0 outline-0"
                            placeholder="doe@example.com"
                        />
                    </div>

                    <div className='text-xs font-["Semibold"] text-zinc-400 uppercase tracking-widest mb-2 mt-4'>Card Information</div>
                    <div className="px-4 py-4 border border-zinc-200 text-sm rounded-2xl bg-white">
                        <CardElement options={CARD_OPTIONS} />
                    </div>
                    <div className='mt-3 flex flex-row items-center gap-2 text-zinc-400'>
                        <Check className='w-3.5 h-3.5' />
                        <div className='font-["Semibold"] text-xs'>Guaranteed safe & secure checkout</div>
                    </div>
                </div>
                <form className={`${(product?.type === 'Merchandise' ? 'hidden' : 'flex')} ${product?.serviceOrProduct === 'Service' ? 'hidden' : 'flex w-full'}`} onSubmit={handleSendDigital}>
                    <button type='submit' className='w-full py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 transition-colors border-0 text-white font-["Semibold"] text-sm'>
                        Pay ${product.price}
                    </button>
                </form>
                <button onClick={handleSubmit} className={`w-full py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 transition-colors text-sm ${isDigital ? 'hidden' : 'flex justify-center items-center'} border-0 text-white font-["Semibold"]`}>
                    Pay ${product.price}
                </button>
            </div>
        </div>
    )
}

export default ProductOne