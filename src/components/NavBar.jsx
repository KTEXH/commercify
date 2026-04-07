import React, { useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Dialog, DialogPanel } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { LayoutDashboard, PenSquare, ShoppingBag, Users, Package, BarChart2, Settings, LogOut, Zap } from 'lucide-react';

import slugify from 'slugify'

import { createClient } from "@supabase/supabase-js";
import Group from "./assets/Group";

import { ME_QUERY } from '../Data/Me';
import { supabase } from '../Utils/utils';
const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
    }
  }
`;


export const NavBar = ({ products, home, audience, form, orders, settings, bookings, analytics, workshop, builder, storefront, linkinbio }) => {
  const { data, error, loading } = useQuery(ME_QUERY)
  const [createProduct] = useMutation(CREATE_PRODUCT_MUTATION)
  let [isOpen, setIsOpen] = useState(false)
  let [isCreate, setIsCreate] = useState(false)
  let [isFile, setIsFile] = useState(false)
  let [isFinishing, setIsFinishing] = useState(false)
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [availabilityHours, setAvailabilityHours] = useState([]);
  const [availabilityDays, setAvailabilityDays] = useState([]);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [tag, setTag] = useState('')
  const [addOns, setAddOns] = useState([])
  const [availabilityHolidays, setAvailabilityHolidays] = useState([])
  const [colors, setColors] = useState([])
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL']; // Example sizes
  const braceletSizes = ['7', '7.5', '8', '8.5', '9',]
  const necklaceSizes = ['16', '20', '22', '24', '26',]
  const ringSizes = ['5', '6', '7', '8', '9',]

  const availability = ['Monday', 'Tuesday', 'Wednsday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const availabilityTime = ['12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM', '12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM']
  const colorAvailable = ['Black', 'White', 'Grey', 'Blue', 'Red', 'Yellow', 'Orange', 'Green', 'Gold', 'Silver']
  const toggleSize = (size) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size)); // Remove size if it's already selected
    } else {
      setSizes([...sizes, size]); // Add size if not already selected
    }
  };

  const toggleColors = (color) => {
    if (colors.includes(color)) {
      setColors(colors.filter((s) => s !== color)); // Remove size if it's already selected
    } else {
      setColors([...colors, color]); // Add size if not already selected
    }
  };

  const toggleAvailabilityDays = (availability) => {
    if (availabilityDays.includes(availability)) {
      setAvailabilityDays(availabilityDays.filter((a) => a !== availability)); // Remove size if it's already selected
    } else {
      setAvailabilityDays([...availabilityDays, availability]); // Add size if not already selected
    }
  };

  const toggleAvailabilityTime = (availability) => {
    if (availabilityHours.includes(availability)) {
      setAvailabilityHours(availabilityHours.filter((a) => a !== availability)); // Remove size if it's already selected
    } else {
      setAvailabilityHours([...availabilityHours, availability]); // Add size if not already selected
    }
  };

  const [specInput, setSpecInput] = useState(''); // For the current input
  const [specifications, setSpecifications] = useState([]); // For the list of added specs

  // Handle adding a new specification
  const handleAddSpecification = () => {
    if (specInput.trim() !== '') {
      setSpecifications([...specifications, specInput.trim()]);
      setSpecInput(''); // Clear the input after adding
    }
  };

  // Handle removing a specification
  const handleRemoveSpecification = (specToRemove) => {
    setSpecifications(specifications.filter(spec => spec !== specToRemove));
  };


  const name = data?.me?.name;
  const firstLetter = name ? name[0] : null;
  const avatarFile = React.useRef(null)


  const [thumbnail, setThumbnail] = React.useState()
  const [thumbnailLoading, setThumbnailLoading] = React.useState(false)
  const [clothingType, setClothingType] = useState('')
  const [virtualPayment, setVirtualPayment] = useState(true)
  const [inPersonPayment, setInPersonPayment] = useState(true)

  const [fileUrl, setFileUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [publicFile, setPublicFile] = useState(null);
  const [fileName, setFilename] = useState(null)
  const [merchandiseType, setMerchandiseType] = useState("")

  const uploadThumbnail = async (e) => {
    const files = e.target.files
    const data = new FormData()
    data.append("file", files[0])
    data.append("upload_preset", "kyroapp")
    setThumbnailLoading(true)
    const res = await fetch("https://api.cloudinary.com/v1_1/dapcizjsz/image/upload", {
      method: "POST",
      body: data,
    })
    const file = await res.json()

    setThumbnail(file.secure_url)
    setThumbnailLoading(false)
  }
  const create = () => {
    setIsOpen(false)
    setIsCreate(true)
  }

  const fileModal = () => {
    setIsCreate(false)
    setIsFile(true)
  }

  const finishingModal = () => {
    setIsFile(false)
    setIsFinishing(true)
  }

  async function uploadFile(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

    
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      setFilename(fileName)
      setFileUrl(filePath);
      let { error: uploadError } = await supabase.storage.from('bubble').upload(filePath, file);
      let { data } = supabase.storage.from('bubble').getPublicUrl(`${filePath}`);

      const publicFile = data.publicUrl;
      setPublicFile(publicFile);
      console.log(data.publicUrl);
      if (uploadError) {
        throw uploadError;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }
const slug = slugify(title, { lower: true, strict: true });


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProduct({
        variables: {
          input: {
            title,
            slug,
            description,
            price: parseFloat(price),
            thumbnail,
            file: publicFile,
            images,
            sizes,
            availablityHours: availabilityHours,
            specifications,
            serviceOrProduct: product.product ? 'Product' : 'Service',
            colors: colors,
            tag: tag,
            type: selectedProductType,
            availablityHolidays: availabilityHolidays,
            addOns,
            virtualPayment,
            merchandiseType: clothingType,
            inPersonPayment,
            availablityDays: availabilityDays,
            isFeatured: false,
            duration: parseInt(duration, 10),
          },
        },
      });

      alert('Product created successfully!');
      e.target.reset()
    } catch (err) {
      console.error(err);
    }
  };


  const [product, setProduct] = useState({
    product: false,
    service: false
  })

  const [productType, setProductType] = useState({
    digitalDownload: false,
    audio: false,
    ebook: false,
    merchandise: false,
    hair: false,
    cosmetic: false,
    catering: false,
    custom: false
  })


  const selectedProductType =
    (productType.digitalDownload && 'Digital Download') ||
    (productType.audio && 'Audio') ||
    (productType.ebook && 'Ebook') ||
    (productType.merchandise && 'Merchandise') ||
    (productType.hair && 'Hair') ||
    (productType.cosmetic && 'Cosmetic') ||
    (productType.catering && 'Catering') ||
    (productType.custom && 'Custom') ||
    null;



  const [merchandise, setMerchandise] = useState({
    clothing: true,
    accesories: false,
    food: false,
    electronics: false,
    collectibles: false,
    footwear: false,
    other: false
  })

  const handleInPersonPayments = () => {
    setInPersonPayment(prev => !prev);
  }

  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);

  const handleImageChange = async (e) => {
    try {
      const files = e.target.files;

      if (!files || files.length === 0) {
        return;
      }

      const data = new FormData();
      data.append('file', files[0]); // Assuming you only want to upload one image at a time
      data.append('upload_preset', 'creatorsmarket');

      setImagesLoading(true);

      const res = await fetch('https://api.cloudinary.com/v1_1/db5pewtrp/image/upload', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        console.error('Cloudinary API Error:', res.status, res.statusText);
        const errorResponse = await res.json();
        console.error('Cloudinary Error Response:', errorResponse);
        throw new Error('Failed to upload image');
      }

      const responseData = await res.json();

      if (!responseData.secure_url) {
        console.error('Invalid Cloudinary response:', responseData);
        throw new Error('Invalid Cloudinary response');
      }

      setImages((prevImages) => [...prevImages, responseData.secure_url]);
      setImagesLoading(false);
    } catch (error) {
      console.error('Error in handleImageChange:', error);
      setImagesLoading(false);
      // Handle the error as needed, e.g., show an error message to the user
    }
  };





  const handleVirtualPayments = () => {
    setVirtualPayment(prev => !prev);
  }



  const handleMerchandise = (type) => {
    setMerchandise((prevState) => ({
      clothing: type === 'clothing' ? true : false,
      accesories: type === 'accesories' ? true : false,
      electronics: type === 'electronics' ? true : false,
      food: type === 'food' ? true : false,
      collectibles: type === 'collectibles' ? true : false,
      footwear: type === 'footwear' ? true : false,
      other: type === 'other' ? true : false,
    }))
    setTag(type)
  }



  const handleProduct = (type) => {
    setProductType((prevState) => ({
      digitalDownload: type === 'digitalDownload' ? true : false,
      audio: type === 'audio' ? true : false,
      ebook: type === 'ebook' ? true : false,
      merchandise: type === 'merchandise' ? true : false,
      hair: type === 'hair' ? true : false,
      cosmetic: type === 'cosmetic' ? true : false,
      catering: type === 'catering' ? true : false,
      custom: type === 'custom' ? true : false,
    }))
  }


  const handleTitle = ((event) => {
    setTitle(event.target.value);
  });

  const handleToggle = (type) => {
    setProduct((prevState) => ({
      product: type === 'product' ? true : false,
      service: type === 'service' ? true : false,
    }));
  };

  if (error) return <div className="p-4 text-sm text-red-500">{error.message}</div>
  if (loading) return <div className="w-[220px] h-full bg-white border-r border-zinc-100 shrink-0" />

  const NavLink = ({ href, active, children, badge, icon: Icon }) => (
    <a
      href={href}
      className={`relative flex items-center justify-between px-3 py-[7px] rounded-lg text-[13px] font-["Semibold"] transition-all group ${
        active
          ? 'bg-zinc-950 text-white'
          : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
      }`}
    >
      <span className='flex items-center gap-2.5'>
        {Icon && <Icon className={`w-[15px] h-[15px] shrink-0 ${active ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-500'}`} strokeWidth={active ? 2.2 : 1.8} />}
        {children}
      </span>
      {badge != null && badge > 0 && (
        <span className={`text-[10px] min-w-[18px] text-center px-1 py-px rounded font-["Semibold"] tabular-nums ${active ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
          {badge}
        </span>
      )}
    </a>
  )

  const ordersLabel = storefront ? 'Orders' : workshop ? 'Bookings' : null;
  const audienceLabel = storefront ? 'Customers' : workshop ? 'Clients' : (linkinbio || form) ? 'Audience' : 'Audience';
  const productsLabel = storefront ? 'Products' : linkinbio ? 'Links' : form ? 'Responses' : workshop ? 'Services' : 'Products';

  return (
    <div className='h-full'>
      <aside className="w-[220px] h-full bg-white border-r border-zinc-100 flex flex-col py-4 px-3">
        {/* Logo */}
        <div className='mb-5 px-2 flex items-center gap-2'>
          <Group className='w-6 h-6' />
          <span className='font-["Bold"] text-zinc-900 text-[15px] tracking-tight'>Commercify</span>
        </div>

        {/* Main nav */}
        <div className='flex-1 space-y-px overflow-y-auto'>
          <NavLink href='/dashboard' active={home === true} icon={LayoutDashboard}>Dashboard</NavLink>
          <NavLink href='/editor' active={builder === true} icon={PenSquare}>Page Editor</NavLink>
          {!(linkinbio || form) && ordersLabel && (
            <NavLink
              href='/orders'
              active={orders === true}
              icon={ShoppingBag}
              badge={storefront ? data?.me?.Orders?.length : workshop ? data?.me?.Bookings?.length : null}
            >
              {ordersLabel}
            </NavLink>
          )}
          <NavLink href='/products' active={products === true} icon={Package}>{productsLabel}</NavLink>
          <NavLink href='/audience' active={audience === true} icon={Users}>{audienceLabel}</NavLink>

          {/* Divider + secondary section */}
          <div className='pt-3 pb-1'>
            <div className='text-[9px] font-["Semibold"] text-zinc-400 uppercase tracking-widest px-3'>More</div>
          </div>
          <NavLink href='/stats' active={analytics === true} icon={BarChart2}>Analytics</NavLink>
          <NavLink href='/settings' active={settings === true} icon={Settings}>Settings</NavLink>
        </div>

        {/* Upgrade card — matches Shopeers blue card */}
        <div className='mt-3 mx-0.5 rounded-2xl p-4 bg-zinc-950'>
          <div className='w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-2.5'>
            <Zap className='w-4 h-4 text-white' fill='white' />
          </div>
          <div className='font-["Semibold"] text-white text-xs mb-1'>Upgrade to Premium!</div>
          <p className='text-white/60 text-[10px] font-["Medium"] leading-relaxed mb-3'>
            Upgrade your account and unlock all of the benefits.
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className='w-full bg-white text-zinc-950 rounded-xl py-1.5 text-[11px] font-["Semibold"] hover:bg-zinc-100 transition-colors'
          >
            Upgrade premium
          </button>
        </div>

        {/* Log out */}
        <button
          onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
          className='mt-2 w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-["Semibold"] text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 transition-all'
        >
          <LogOut className='w-[15px] h-[15px]' strokeWidth={1.8} /> Log out
        </button>
      </aside>



      <Dialog open={isFinishing} onClose={() => setIsFinishing(false)} className='relative font-general-sans z-50'>
        <div className="fixed inset-0 flex bg-opacity-70 w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-2xl w-full space-y-4 flex-col flex  border rounded-xl bg-white p-10">
            <div style={{ fontFamily: 'Semibold' }} className='text-3xl mb-2'>Finalizing {product.product === true ? 'Product' : 'Service'}</div>
            <div className='font-["Medium"] text-gray-500 w-3/4 text-sm'>Tell us more about workspace so we can provide you a personalized expirience tailored to your needs and preferences</div>
            <div className='border gap-4 p-5 mt-5 flex items-center rounded-xl w-full'>
              <div>
                {thumbnail === "" ? (
                  <img />
                ) : (
                  <div className='w-28 h-28 rounded-xl bg-zinc-100 flex items-center justify-center font-["Bold"] text-lg'>
                    {title.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <label className='text-xs font-["Semibold"]'>{title} • ${price}</label>
                <div className='text-gray-400 font-["Medium"] text-xs'>{description}</div>
                <div className='flex items-center gap-3 mt-2'>
                  <div className='flex items-center gap-1'>
                    <label className='text-[10px] font-["Semibold"]'>Type: </label>
                    <div className='text-[10px] font-["Semibold"] border px-2 py-1 rounded-full'>{product.product ? 'Product' : 'Service'}</div>
                  </div>
                  <div className={`flex items-center ${product.service ? 'flex' : 'hidden'} gap-1`}>
                    <label className='text-[10px] font-["Semibold"]'>Duration: </label>
                    <div className='text-[10px] font-["Semibold"] border px-2 py-1 rounded-full'>{duration} Minutes</div>
                  </div>
                  <div className='flex items-center gap-1'>
                    <label className='text-[10px] font-["Semibold"]'>Tag: </label>
                    <div className='text-[10px] font-["Semibold"] capitalize border px-2 py-1 rounded-full'>{tag}</div>
                  </div>
                  <div className={`flex items-center ${productType.merchandise && 'hidden'} ${product.service && 'hidden'} gap-2`}>
                    <label className='font-["Semibold"] text-[10px]'>File: </label>
                    <div className='text-[10px] font-["Semibold"] border rounded-full px-3 py-1'>
                      {fileName}
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div className={`${product.service ? 'flex flex-col' : 'hidden'}`}>
              <div>
                <label className='text-xs font-["Semibold"]'>Availability</label>
                <div className='flex items-center gap-5'>
                  <div className='flex w-full gap-3'>
                    <label className='text-[10px] font-["Semibold"]'>Days:</label>
                    <div className='gap-2 flex items-center flex-wrap'>
                      {availabilityDays.map(item => (
                        <div className='text-[10px] font-["Semibold"] px-2 py-1 border rounded-full'>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className='flex w-full gap-3'>
                    <label className='text-[10px] font-["Semibold"]'>Hours:</label>
                    <div className='gap-2 flex items-center flex-wrap'>
                      {availabilityHours.map(item => (
                        <div className='text-[10px] font-["Semibold"] px-2 py-1 border rounded-full'>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className='mt-3 flex'>
                <div className='w-full'>
                  <label className='text-xs font-["Semibold"]'>Specifications</label>
                  <div className='gap-2 flex items-center flex-wrap'>
                    {specifications.map(item => (
                      <div className='text-[10px] font-["Semibold"] px-2 py-1 border rounded-full'>{item}</div>
                    ))}
                  </div>
                </div>
                <div className='w-full'>
                  <label className='text-xs font-["Semibold"]'>Payments options</label>
                  <div className='flex items-center justify-between gap-5'>
                    <div className='flex items-center gap-2'>
                      <label className='text-xs font-["Semibold"]'>In-Person: </label>
                      <div onClick={() => handleInPersonPayments()} className={`w-7 flex items-center justify-center h-7 border rounded-full`}>
                        {inPersonPayment && (<CheckIcon className='h-4 w-4' />)}
                      </div>
                    </div>
                    <div className='flex items-center gap-1'>
                      <div className='flex items-center gap-2'>
                        <label className='text-xs font-["Semibold"]'>Virtual: </label>
                        <div onClick={() => handleVirtualPayments()} className={`w-7 flex items-center justify-center h-7 border rounded-full`}>
                          {virtualPayment && (<CheckIcon className='h-4 w-4' />)}

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='font-["Semibold"] flex items-center gap-3'>
              <form onSubmit={handleSubmit} className='w-full'>
                <button type='submit' className='bg-zinc-950 text-white w-full py-2.5 rounded-xl'>Create</button>
              </form>
              <button className='border text-black w-full py-2.5 rounded-xl'>Cancel</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <Dialog open={isFile} onClose={() => setIsFile(false)} className='relative font-general-sans z-50'>
        <div className="fixed inset-0 flex bg-opacity-70 w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-2xl w-full space-y-4 flex-col flex  border rounded-xl bg-white p-10">
            <div className='flex items-start justify-start flex-col'>
              <div style={{ fontFamily: 'Semibold' }} className='text-3xl mb-2'>Finishing {product.product === true ? 'Product' : 'Service'}</div>
              <div className='font-["Medium"] text-gray-500 w-3/4 text-sm'>Tell us more about workspace so we can provide you a personalized expirience tailored to your needs and preferences</div>
              <div className={`${product.service === true && 'hidden'} ${productType.merchandise === true && 'hidden'}`}>
                <label htmlFor="photo" style={{ fontFamily: 'Semibold' }} className="block text-xs leading-6 mb-3 mt-6 text-black">
                  File upload
                </label>
                <div className="flex gap-3 items-center">
                  <div className={`${thumbnail ? "hidden" : "h-20 w-20  capitalize rounded-lg text-xl font-['Semibold'] text-black items-center bg-zinc-100 justify-center flex"}`} aria-hidden="true" >
                    {title.charAt(0)}
                  </div>
                  {thumbnailLoading ? (
                    <h3>Loading...</h3>
                  ) : (
                    <>
                      {thumbnail ? (
                        <span onClick={() => avatarFile.current.click()}>
                          <img
                            src={thumbnail}
                            className='h-12 w-12 rounded-full '
                            alt="avatar"
                            onClick={() => avatarFile.current.click()}

                          />

                        </span>
                      ) : (
                        <span onClick={() => avatarFile.current.click()}>
                          <i
                            className="fa fa-user fa-5x"
                            aria-hidden="true"
                            onClick={() => avatarFile.current.click()}
                          ></i>
                        </span>
                      )}
                    </>
                  )}

                  <div className='gap-y-2 flex flex-col'>
                    <div>
                      <label
                        style={{ fontFamily: 'Semibold' }}
                        htmlFor="file-upload"
                        className="cursor-pointer inline-block flex-none grow-0 rounded-lg px-6 bg-white border text-xs text-black py-2.5"
                      >
                        <span>Upload file</span>
                        <input id="file-upload" name="file-upload" type="file"
                          placeholder="Upload an image"
                          onChange={uploadFile}
                          ref={avatarFile}
                          style={{ display: "none" }} className="sr-only" />

                      </label>
                    </div>
                    <div className='text-xs text-gray-500 font-["Medium"]'>.png, .jpeg, .gif files up to 8MB. Recommended size 256x256px.</div>
                  </div>
                </div>

              </div>
              <div className={`${product.service === true && 'hidden'} ${productType.merchandise === false && 'hidden'}`}>
                <label htmlFor="photo" style={{ fontFamily: 'Semibold' }} className="block text-xs leading-6 mb-3 mt-6 text-black">
                  Upload Images of Product
                </label>
                <div className="flex gap-3 items-center">
                  <div className={`${thumbnail ? "hidden" : "h-20 w-20  capitalize rounded-lg text-xl font-['Semibold'] text-black items-center bg-zinc-100 justify-center flex"}`} aria-hidden="true" >
                    {title.charAt(0)}
                  </div>


                  <div className='gap-y-2 flex flex-col'>
                    <div>
                      <label
                        style={{ fontFamily: 'Semibold' }}
                        htmlFor="file-upload"
                        className="cursor-pointer inline-block flex-none grow-0 rounded-lg px-6 bg-white border text-xs text-black py-2.5"
                      >
                        <span>Upload Images</span>
                        <input id="file-upload" name="file-upload" type="file"
                          placeholder="Upload an image"
                          onChange={handleImageChange}
                          ref={avatarFile}
                          style={{ display: "none" }} className="sr-only" />

                      </label>
                    </div>
                    <div className='text-xs text-gray-500 font-["Medium"]'>.png, .jpeg, .gif files up to 8MB. Recommended size 256x256px.</div>
                  </div>
                </div>
                {imagesLoading ? (
                  <h3>Loading...</h3>
                ) : (
                  <div>
                    {images && (
                      <div className='flex items-center gap-3'>
                        {images.map(item => (
                          <img className='w-28 h-28 rounded-xl' />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className='flex flex-col gap-2 mt-5'>
                <label className='text-xs font-["Semibold"]'>{productType.custom ? '' : 'Tags'}</label>
                {productType.digitalDownload === true && (
                  <div className='flex items-center font-["Semibold"] gap-2'>
                    <div onClick={() => setTag('Music')} className={`rounded-full flex ${tag === 'Music' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Music</div>
                    </div>
                    <div onClick={() => setTag('Software')} className={`rounded-full flex ${tag === 'Software' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Software</div>
                    </div>
                    <div onClick={() => setTag('Document')} className={`rounded-full flex ${tag === 'Document' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Document</div>
                    </div>
                    <div onClick={() => setTag('Video')} className={`rounded-full flex ${tag === 'Video' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Video</div>
                    </div>
                    <div onClick={() => setTag('Template')} className={`rounded-full flex ${tag === 'Template' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Template</div>
                    </div>
                    <div onClick={() => setTag('Guide')} className={`rounded-full flex ${tag === 'Guide' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Guide</div>
                    </div>
                    <div onClick={() => setTag('Image')} className={`rounded-full flex ${tag === 'Image' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Image</div>
                    </div>
                    <div onClick={() => setTag('Other')} className={`rounded-full flex ${tag === 'Other' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Other</div>
                    </div>
                  </div>
                )}

                {productType.hair === true && (
                  <div className='flex items-center font-["Semibold"] gap-2'>
                    <div onClick={() => setTag('Haircut')} className={`rounded-full flex ${tag === 'Haircut' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Haircut</div>
                    </div>

                    <div onClick={() => setTag('Hairstyle')} className={`rounded-full flex ${tag === 'Hairstyle' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Hairstyle</div>
                    </div>

                    <div onClick={() => setTag('Other')} className={`rounded-full flex ${tag === 'Other' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Other</div>
                    </div>
                  </div>
                )}

                {productType.catering === true && (
                  <div className='flex items-center font-["Semibold"] gap-2'>
                    <div onClick={() => setTag('Wedding')} className={`rounded-full flex ${tag === 'Wedding' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Wedding</div>
                    </div>

                    <div onClick={() => setTag('Corporate')} className={`rounded-full flex ${tag === 'Corporate' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Corporate</div>
                    </div>

                    <div onClick={() => setTag('Social Event')} className={`rounded-full flex ${tag === 'Social Event' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Social Event</div>
                    </div>

                    <div onClick={() => setTag('Concessions')} className={`rounded-full flex ${tag === 'Concessions' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Concessions</div>
                    </div>
                  </div>
                )}

                {productType.cosmetic === true && (
                  <div className='flex items-center font-["Semibold"] gap-2'>
                    <div onClick={() => setTag('Makeup')} className={`rounded-full flex ${tag === 'Makeup' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Makeup</div>
                    </div>

                    <div onClick={() => setTag('Nails')} className={`rounded-full flex ${tag === 'Nails' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Nails</div>
                    </div>

                    <div onClick={() => setTag('Lashes')} className={`rounded-full flex ${tag === 'Lashes' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Lashes</div>
                    </div>
                    <div onClick={() => setTag('Waxing')} className={`rounded-full flex ${tag === 'Waxing' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Waxing</div>
                    </div>
                    <div onClick={() => setTag('Facial')} className={`rounded-full flex ${tag === 'Facial' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Facial</div>
                    </div>
                    <div onClick={() => setTag('Other')} className={`rounded-full flex ${tag === 'Other' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Other</div>
                    </div>
                  </div>
                )}

                {productType.audio === true && (
                  <div className='flex items-center font-["Semibold"] gap-2'>
                    <div onClick={() => setTag('Audiobook')} className={`rounded-full flex ${tag === 'Audiobook' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Audiobook</div>
                    </div>

                    <div onClick={() => setTag('Podcast')} className={`rounded-full flex ${tag === 'Podcast' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Podcast</div>
                    </div>
                    <div onClick={() => setTag('Music track')} className={`rounded-full flex ${tag === 'Music track' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Music track</div>
                    </div>
                    <div onClick={() => setTag('Sound effect')} className={`rounded-full flex ${tag === 'Sound effect' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Sound effect</div>
                    </div>

                    <div onClick={() => setTag('Other')} className={`rounded-full flex ${tag === 'Other' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Other</div>
                    </div>
                  </div>
                )}

                {productType.ebook === true && (
                  <div className='flex items-center font-["Semibold"] gap-2'>
                    <div onClick={() => setTag('Comic')} className={`rounded-full flex ${tag === 'Comic' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Comic</div>
                    </div>

                    <div onClick={() => setTag('Novel')} className={`rounded-full flex ${tag === 'Novel' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Novels</div>
                    </div>
                    <div onClick={() => setTag('Guides')} className={`rounded-full flex ${tag === 'Guides' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Guides</div>
                    </div>
                    <div onClick={() => setTag('Manuals')} className={`rounded-full flex ${tag === 'Manuals' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Manuals</div>
                    </div>

                    <div onClick={() => setTag('Other')} className={`rounded-full flex ${tag === 'Other' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Other</div>
                    </div>
                  </div>
                )}

                {productType.merchandise === true && (
                  <div className='flex items-center flex-wrap font-["Semibold"] gap-2'>
                    <div onClick={() => handleMerchandise('clothing')} className={`rounded-full flex ${merchandise.clothing === true ? 'border-2 border-black' : 'border'}  items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Clothing</div>
                    </div>

                    <div onClick={() => handleMerchandise('accesories')} className={`rounded-full flex ${merchandise.accesories === true ? 'border-2 border-black' : 'border'}  items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Accessories</div>
                    </div>
                    <div onClick={() => handleMerchandise('electronics')} className={`rounded-full flex ${merchandise.electronics === true ? 'border-2 border-black' : 'border'}  items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Electronics</div>
                    </div>
                    <div onClick={() => handleMerchandise('food')} className={`rounded-full flex ${merchandise.food === true ? 'border-2 border-black' : 'border'}  items-center gap-1 text-xs px-3 py-1.5`}>
                      <div className='flex-nowrap flex'>Food & Beverages</div>
                    </div>

                    <div onClick={() => handleMerchandise('other')} className={`rounded-full flex ${merchandise.other === true ? 'border-2 border-black' : 'border'}  items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Other</div>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {product.service === true && (
              <div className='w-full'>
                <div className='w-full flex items-center gap-5'>

                  <div className='w-full flex flex-col gap-2'>
                    <label className="text-xs font-['Semibold']">Name</label>
                    <input
                      className='py-3 px-3 w-full text-xs font-["Medium"] rounded-xl border'
                      defaultValue={title}
                    />
                  </div>
                  <div className='w-full flex flex-col gap-2'>
                    <label className="text-xs font-['Semibold']">Duration</label>
                    <input
                      className='py-3 px-3 w-full text-xs font-["Medium"] rounded-xl border'
                      value={duration}
                      type='number'

                      onChange={e => setDuration(e.target.value)}
                    />
                  </div>
                </div>
                <div className='w-full flex mt-5 gap-5'>

                  <div className='w-full flex flex-col gap-2'>
                    <label className="text-xs font-['Semibold']">Availblity Days</label>
                    <div className='flex items-center flex-wrap gap-2'>
                      {availability.map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => toggleAvailabilityDays(days)}
                          className={`px-3 py-1.5 rounded-full ${availabilityDays.includes(days) ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}

                        >
                          {days}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className='w-full flex flex-col gap-2'>
                    <label className="text-xs font-['Semibold']">Time</label>
                    <div className='flex items-center flex-wrap gap-2'>
                      {availabilityTime.map((hours) => (
                        <button
                          key={hours}
                          type="button"
                          onClick={() => toggleAvailabilityTime(hours)}
                          className={`px-3 py-1.5 rounded-full ${availabilityHours.includes(hours) ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}

                        >
                          {hours}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className='w-full flex flex-col gap-2 mt-5'>
                  <label className="text-xs font-['Semibold']">Specifications</label>
                  <div className=''>
                    <div className='flex items-center gap-3'>
                      <div className='w-full'>
                        {specifications.length > 0 && (
                          <div className='flex items-center flex-wrap mt-2 gap-3'>
                            {specifications.map((spec, index) => (
                              <div className='px-3 flex items-center gap-2 border py-1 rounded-full text-xs font-["Semibold"]'>
                                {spec}
                                <XMarkIcon onClick={() => handleRemoveSpecification(spec)}
                                  className='w-4 h-4 text-gray-200' />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className='w-full flex items-center gap-3'>
                        <input
                          type="text"
                          value={specInput}
                          onChange={(e) => setSpecInput(e.target.value)}
                          placeholder="Ex: Taper, Ovals, Cornrows, "
                          className="py-3 px-3 w-full text-xs placeholder:text-gray-300 font-medium rounded-xl border"
                        />
                        <button onClick={handleAddSpecification}
                          className='py-3 px-3 bg-zinc-950 text-xs rounded-xl text-white font-["Medium"]'>
                          Add
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}


            {merchandise.food && productType.merchandise === true && (
              <div className='w-full flex items-center gap-10'>
                <div className='w-full'>
                  <div className='flex flex-col'>
                    <label className='font-["Semibold"] text-xs'>Type</label>
                  </div>
                  <div className='gap-2 grid w-full grid-cols-3 mt-2'>
                    <div onClick={() => setClothingType("Exotic Snacks")} className={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Exotic Snacks' ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}>
                      <div>Exotic Snacks</div>
                      <div className={`w-3 h-3 rounded-full ${clothingType === 'Exotic Snacks' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Seasonings")} className={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Seasonings' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Seasonings</div>
                      <div className={`w-3 h-3 rounded-full ${clothingType === 'Seasonings' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Chips")} className={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Chips' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Chips</div>
                      <div className={`w-3 h-3 rounded-full ${clothingType === 'Chips' ? 'border-4 border-black' : 'border'} `} />
                    </div>

                    <div onClick={() => setClothingType("Candy")} className={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Candy' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Candy</div>
                      <div className={`w-3 h-3 rounded-full ${clothingType === 'Candy' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Beverage")} className={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Beverage' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Beverage</div>
                      <div className={`w-3 h-3 rounded-full ${clothingType === 'Beverage' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                  </div>
                </div>

              </div>
            )}
            {merchandise.clothing && productType.merchandise && product.product === true && (
              <div className='w-full flex items-center gap-10'>
                <div className='w-full'>
                  <div className='flex flex-col'>
                    <label className='font-["Semibold"] text-xs'>Clothing type</label>
                  </div>
                  <div className='gap-2 grid w-full grid-cols-2 mt-2'>
                    <div onClick={() => setClothingType("Hat")} className={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Hat' ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}>
                      <div>Hats</div>
                      <div className={`w-3 h-3 rounded-full ${clothingType === 'Hat' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Bottom")} className={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Bottom' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Bottoms</div>
                      <div className={`w-3 h-3 rounded-full ${clothingType === 'Bottom' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Top")} className={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Top' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Tops</div>
                      <div className={`w-3 h-3 rounded-full ${clothingType === 'Top' ? 'border-4 border-black' : 'border'} `} />
                    </div>

                    <div onClick={() => setClothingType("Hoodie")} className={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Hoodie' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Hoodies</div>
                      <div className={`w-3 h-3 rounded-full ${clothingType === 'Hoodie' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                  </div>
                </div>
                <div className=''>
                  <div className='flex flex-col'>
                    <label className='font-["Semibold"] text-xs'>Sizes available</label>
                  </div>
                  <div className='flex items-center gap-2 w-full flex-wrap mt-2'>
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1.5 rounded-full ${sizes.includes(size) ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}

                      >
                        {size}
                      </button>
                    ))}

                  </div>
                </div>
              </div>
            )}

            {merchandise.electronics && productType.merchandise === true && (
              <div className='w-full flex items-center gap-10'>
                <div className='w-full'>
                  <div className='flex flex-col'>
                    <label className='font-["Semibold"] text-xs'>Electronic</label>
                  </div>
                  <div className='gap-2 grid w-full grid-cols-2 mt-2'>
                    <div onClick={() => setClothingType("Phone")} className={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Phone' ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}>
                      <div>Phone</div>
                      <div className={`w-3 h-3 rounded-full ${clothingType === 'Phone' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Cases")} className={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Cases' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Cases</div>
                      <div className={`w-3 h-3 rounded-full ${clothingType === 'Cases' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Top")} className={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Headphones' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Headphones</div>
                      <div className={`w-3 h-3 rounded-full ${clothingType === 'Headphones' ? 'border-4 border-black' : 'border'} `} />
                    </div>

                    <div onClick={() => setClothingType("Laptop")} className={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Laptop' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Laptop</div>
                      <div className={`w-3 h-3 rounded-full ${clothingType === 'Laptop' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Tablet")} className={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Tablet' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Tablet</div>
                      <div className={`w-3 h-3 rounded-full ${clothingType === 'Tablet' ? 'border-4 border-black' : 'border'} `} />
                    </div>

                    <div onClick={() => setClothingType("Other")} className={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Other' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Other</div>
                      <div className={`w-3 h-3 rounded-full ${clothingType === 'Other' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                  </div>
                </div>
                <div className=''>
                  <div className='flex flex-col'>
                    <label className='font-["Semibold"] text-xs'>Brand</label>
                  </div>
                  <div className='flex items-center gap-2 w-full flex-wrap mt-2'>
                    <div className='px-3 py-1.5 rounded-full border font-["Semibold"] text-xs'>
                      Apple
                    </div>
                    <div className='px-3 py-1.5 rounded-full border font-["Semibold"] text-xs'>
                      Samsung
                    </div>
                    <div className='px-3 py-1.5 rounded-full border font-["Semibold"] text-xs'>
                      Beats
                    </div>
                    <div className='px-3 py-1.5 rounded-full border font-["Semibold"] text-xs'>
                      Lenovo
                    </div>
                    <div className='px-3 py-1.5 rounded-full border font-["Semibold"] text-xs'>
                      Dell
                    </div>
                    <div className='px-3 py-1.5 rounded-full border font-["Semibold"] text-xs'>
                      HP
                    </div>

                  </div>
                </div>
              </div>
            )}

            {merchandise.accesories && productType.merchandise === true && (
              <div className='w-full flex items-center gap-10'>
                <div className='w-full'>
                  <div className='flex flex-col'>
                    <label className='font-["Semibold"] text-xs'>Accessory type</label>
                  </div>
                  <div className='gap-2 grid w-full grid-cols-2 mt-2'>
                    <div onClick={() => setClothingType("Bracelet")} className={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Bracelet' ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}>
                      <div>Bracelet</div>
                      <div className={`w-3 h-3 rounded-full ${clothingType === 'Bracelet' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Necklace")} className={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Necklace' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Necklace</div>
                      <div className={`w-3 h-3 rounded-full ${clothingType === 'Necklace' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Ring")} className={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Ring' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Ring</div>
                      <div className={`w-3 h-3 rounded-full ${clothingType === 'Ring' ? 'border-4 border-black' : 'border'} `} />
                    </div>

                    <div onClick={() => setClothingType("Earing")} className={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Earing' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Earing</div>
                      <div className={`w-3 h-3 rounded-full ${clothingType === 'Earing' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                  </div>
                </div>
                <div className=''>
                  <div className='flex flex-col'>
                    <label className='font-["Semibold"] text-xs'>Sizes available</label>
                  </div>
                  {clothingType === 'Bracelet' && (
                    <div className='flex items-center gap-2 w-full flex-wrap mt-2'>
                      {braceletSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`px-3 py-1.5 rounded-full ${sizes.includes(size) ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}

                        >
                          {size}
                        </button>
                      ))}

                    </div>
                  )}
                  {clothingType === 'Necklace' && (
                    <div className='flex items-center gap-2 w-full flex-wrap mt-2'>
                      {braceletSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`px-3 py-1.5 rounded-full ${sizes.includes(size) ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}

                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}

                  {clothingType === 'Ring' && (
                    <div className='flex items-center gap-2 w-full flex-wrap mt-2'>
                      {ringSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`px-3 py-1.5 rounded-full ${sizes.includes(size) ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}

                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            )}
            <div className={`w-full flex ${merchandise.food === true && 'hidden'} ${productType.merchandise === false && 'hidden'} flex-col gap-2`}>
              <label className='font-["Semibold"] text-xs'>Colors available</label>
              <div className='flex items-center gap-2 w-full flex-wrap mt-2'>
                <div className='flex items-center flex-wrap gap-2'>
                  {colorAvailable.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => toggleColors(color)}
                      className={`px-3 py-1.5 flex items-center gap-2 rounded-full ${colors.includes(color) ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}

                    >
                      <div style={{ backgroundColor: color }} className='w-3 h-3 rounded-full' />
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className='w-full flex flex-col gap-2'>
              <label className='font-["Semibold"] text-xs'>Description</label>
              <input
                className='py-3 px-3 w-full text-xs font-["Medium"] rounded-xl border'
                value={description}
                type='text'
                placeholder='Description of product...'
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div className='font-["Semibold"] flex items-center gap-3'>
              <button onClick={finishingModal} className='bg-zinc-950 text-white w-full py-2.5 rounded-xl'>Continue</button>
              <button className='border text-black w-full py-2.5 rounded-xl'>Cancel</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <Dialog open={isCreate} onClose={() => setIsCreate(false)} className='relative font-general-sans z-50'>
        <div className="fixed inset-0 flex bg-opacity-70 w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-2xl w-full space-y-4 flex-col flex  border rounded-xl bg-white p-10">
            <div className='flex items-start justify-start flex-col'>
              <div style={{ fontFamily: 'Semibold' }} className='text-3xl mb-2'>Create {product.product === true ? 'Product' : 'Service'}</div>
              <div className='font-["Medium"] text-gray-500 w-3/4 text-sm'>Tell us more about workspace so we can provide you a personalized expirience tailored to your needs and preferences</div>
            </div>

            <label htmlFor="photo" style={{ fontFamily: 'Semibold' }} className="block text-xs leading-6 mb-3 mt-6 text-black">
              Product thumbnail
            </label>
            <div className="flex gap-3 items-center">
              <div className={`${thumbnail ? "hidden" : "h-20 w-20  capitalize rounded-lg text-xl font-['Semibold'] text-black items-center bg-zinc-100 justify-center flex"}`} aria-hidden="true" >
                {title.charAt(0)}
              </div>
              {thumbnailLoading ? (
                <h3>Loading...</h3>
              ) : (
                <>
                  {thumbnail ? (
                    <span onClick={() => avatarFile.current.click()}>
                      <img
                        src={thumbnail}
                        className='h-12 w-12 rounded-full '
                        alt="avatar"
                        onClick={() => avatarFile.current.click()}

                      />

                    </span>
                  ) : (
                    <span onClick={() => avatarFile.current.click()}>
                      <i
                        className="fa fa-user fa-5x"
                        aria-hidden="true"
                        onClick={() => avatarFile.current.click()}
                      ></i>
                    </span>
                  )}
                </>
              )}

              <div className='gap-y-2 flex flex-col'>
                <div>
                  <label
                    style={{ fontFamily: 'Semibold' }}
                    htmlFor="file-upload"
                    className="cursor-pointer inline-block flex-none grow-0 rounded-lg px-6 bg-white border text-xs text-black py-2.5"
                  >
                    <span>Upload thumbnail</span>
                    <input id="file-upload" name="file-upload" type="file"
                      placeholder="Upload an image"
                      onChange={uploadThumbnail}
                      ref={avatarFile}
                      style={{ display: "none" }} className="sr-only" />

                  </label>
                </div>
                <div className='text-xs text-gray-500 font-["Medium"]'>.png, .jpeg, .gif files up to 8MB. Recommended size 256x256px.</div>
              </div>
            </div>

            <div className='flex items-center w-full gap-3'>
              <div className='w-full flex flex-col gap-2'>
                <label className='font-["Semibold"] text-xs'>Name</label>
                <input
                  className='py-3 px-3 w-full text-xs font-["Medium"] rounded-xl border'
                  type="text"
                  value={title}
                  id={title}
                  name='title'
                  onChange={e => setTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div className='w-full flex flex-col gap-2'>
                <label className='font-["Semibold"] text-xs'>Price</label>
                <input
                  className='py-3 px-3 w-full text-xs font-["Medium"] rounded-xl border'
                  value={price}
                  type='number'
                  onChange={e => setPrice(e.target.value)}
                />
              </div>
            </div>
            {product.product === true ? (
              <div className='w-full flex flex-col gap-2'>

                <label className='font-["Semibold"] text-xs'>Type</label>
                <div className='grid grid-cols-2 w-full gap-3'>
                  <div onClick={() => handleProduct('digitalDownload')} className={`${productType.digitalDownload === true ? 'border-black border-2' : 'border'} flex flex-col gap-1 relative rounded-xl p-3`}>
                    <div className={`absolute right-3 top-3 ${productType.digitalDownload === true ? 'border-black border-4' : 'border'} rounded-full w-3 h-3`} />
                    <div className='font-["Semibold"] text-xs'>
                      Digital Download
                    </div>
                    <div className='text-gray-400 font-["Medium"] text-xs'>
                      Create and sell digital products like E-books, Music, Videos, Software, and Templates.
                    </div>
                  </div>
                  <div onClick={() => handleProduct('audio')} className={`${productType.audio === true ? 'border-black border-2' : 'border'} flex flex-col gap-1 relative rounded-xl p-3`}>
                    <div className={`absolute right-3 top-3 ${productType.audio === true ? 'border-black border-4' : 'border'} rounded-full w-3 h-3`} />
                    <div className='font-["Semibold"] text-xs'>
                      Audios
                    </div>
                    <div className='text-gray-400 font-["Medium"] text-xs'>
                      Upload and sell audio content like Podcasts, Music Tracks, Audiobooks, and Sound Effects.
                    </div>
                  </div>
                  <div onClick={() => handleProduct('ebook')} className={`${productType.ebook === true ? 'border-black border-2' : 'border'} flex flex-col gap-1 relative rounded-xl p-3`}>
                    <div className={`absolute right-3 top-3 ${productType.ebook === true ? 'border-black border-4' : 'border'} rounded-full w-3 h-3`} />
                    <div className='font-["Semibold"] text-xs'>
                      Ebooks
                    </div>
                    <div className='text-gray-400 font-["Medium"] text-xs'>
                      Create and sell e-books such as Novels, Guides, Manuals, and Comics.
                    </div>
                  </div>
                  <div onClick={() => handleProduct('merchandise')} className={`${productType.merchandise === true ? 'border-black border-2' : 'border'} flex flex-col gap-1 relative rounded-xl p-3`}>
                    <div className={`absolute right-3 top-3 ${productType.merchandise === true ? 'border-black border-4' : 'border'} rounded-full w-3 h-3`} />
                    <div className='font-["Semibold"] text-xs'>
                      Merchandise
                    </div>
                    <div className='text-gray-400 font-["Medium"] text-xs'>
                      Design and sell merchandise such as T-shirts, Hats, Mugs, Hoodies, and Custom Accessories.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='w-full flex flex-col gap-2'>

                <label className='font-["Semibold"] text-xs'>Type</label>
                <div className='grid grid-cols-2 w-full gap-3'>
                  <div onClick={() => handleProduct('hair')} className={`${productType.hair === true ? 'border-black border-2' : 'border'} flex flex-col gap-1 relative rounded-xl p-3`}>
                    <div className={`absolute right-3 top-3 ${productType.hair === true ? 'border-black border-4' : 'border'} rounded-full w-3 h-3`} />
                    <div className='font-["Semibold"] text-xs'>
                      Hair Services
                    </div>
                    <div className='text-gray-400 font-["Medium"] text-xs'>
                      Create and sell digital products like E-books, Music, Videos, Software, and Templates.
                    </div>
                  </div>
                  <div onClick={() => handleProduct('cosmetic')} className={`${productType.cosmetic === true ? 'border-black border-2' : 'border'} flex flex-col gap-1 relative rounded-xl p-3`}>
                    <div className={`absolute right-3 top-3 ${productType.cosmetic === true ? 'border-black border-4' : 'border'} rounded-full w-3 h-3`} />
                    <div className='font-["Semibold"] text-xs'>
                      Cosmetic Services
                    </div>
                    <div className='text-gray-400 font-["Medium"] text-xs'>
                      Upload and sell audio content like Podcasts, Music Tracks, Audiobooks, and Sound Effects.
                    </div>
                  </div>
                  <div onClick={() => handleProduct('catering')} className={`${productType.catering === true ? 'border-black border-2' : 'border'} flex flex-col gap-1 relative rounded-xl p-3`}>
                    <div className={`absolute right-3 top-3 ${productType.catering === true ? 'border-black border-4' : 'border'} rounded-full w-3 h-3`} />
                    <div className='font-["Semibold"] text-xs'>
                      Catering Service
                    </div>
                    <div className='text-gray-400 font-["Medium"] text-xs'>
                      Create and sell e-books such as Novels, Guides, Manuals, and Comics.
                    </div>
                  </div>
                  <div onClick={() => handleProduct('custom')} className={`${productType.custom === true ? 'border-black border-2' : 'border'} flex flex-col gap-1 relative rounded-xl p-3`}>
                    <div className={`absolute right-3 top-3 ${productType.custom === true ? 'border-black border-4' : 'border'} rounded-full w-3 h-3`} />
                    <div className='font-["Semibold"] text-xs'>
                      Custom Services
                    </div>
                    <div className='text-gray-400 font-["Medium"] text-xs'>
                      Design and sell merchandise such as T-shirts, Hats, Mugs, Hoodies, and Custom Accessories.
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className='w-full flex flex-col gap-2'>
              <label className='font-["Semibold"] text-xs'>Description</label>
              <input
                className='py-3 px-3 w-full text-xs font-["Medium"] rounded-xl border'
                value={description}
                type='text'
                placeholder='Description of product...'
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div className='font-["Semibold"] flex items-center gap-3'>
              <button onClick={fileModal} className='bg-zinc-950 text-white w-full py-2.5 rounded-xl'>Continue</button>
              <button className='border text-black w-full py-2.5 rounded-xl'>Cancel</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative font-general-sans z-50">
        <div className="fixed inset-0 flex bg-opacity-70 w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-xl w-full space-y-4 flex-col flex items-center justify-center border rounded-xl bg-white p-10">

            <div className='flex items-start justify-start flex-col'>
              <div style={{ fontFamily: 'Semibold' }} className='text-3xl mb-2'>Add a product</div>
              <div className='font-["Medium"] text-gray-500 text-sm'>Tell us more about workspace so we can provide you a personalized expirience tailored to your needs and preferences</div>
            </div>



            <div className='flex items-start justify-start flex-col  w-full font-["Semibold"] gap-4'>
              <label className='text-xs'>Type</label>
              <div className='flex w-full gap-2'>
                <div onClick={() => handleToggle('product')} className={`w-full ${product.product === true ? 'border-black border-2' : 'border'} p-3 px-4 justify-between flex items-center gap-1 rounded-xl`}>
                  <div className='flex flex-col gap-[2px]'>
                    <div className='bg-gray-100 h-7 w-7 flex items-center justify-center rounded-md inline-block'>
                      <img
                        className="h-5 w-5 flex-shrink-0"
                        src="/assets/IconSet7.svg"
                        loading="lazy"
                      />
                    </div>
                    <div className='text-xs'>Products</div>
                    <div className='text-xs text-gray-400 font-["Medium"]'>Create and manage various products such as Digital Downloads, Audios, Videos, E-books, and Physical Products.
                    </div>
                  </div>
                  <div>
                    <div className={`w-5 h-5 rounded-full  ${product.product === true ? 'border-black border-8' : 'border'}`} />
                  </div>
                </div>
                <div onClick={() => handleToggle('service')} className={`w-full ${product.service === true ? 'border-black border-2' : 'border'} p-3 px-4 justify-between flex items-center gap-1 rounded-xl`}>
                  <div className='flex flex-col gap-[2px]'>
                    <div className='bg-gray-100 h-7 w-7 flex items-center justify-center rounded-md inline-block'>
                      <img
                        className="h-5 w-5 flex-shrink-0"
                        src="/assets/HandCoins.svg"
                        loading="lazy"
                      />
                    </div>
                    <div className='text-xs'>Services</div>
                    <div className='text-xs text-gray-400 font-["Medium"]'>Offer various services such as Consultations, Online Courses, Coaching Sessions, Webinars, and Workshops.
                    </div>
                  </div>
                  <div>
                    <div className={`w-5 h-5 rounded-full  ${product.service === true ? 'border-black border-8' : 'border'}`} />
                  </div>
                </div>
              </div>

            </div>
            <div className="flex w-full gap-4">
              <button className='w-full bg-zinc-950 text-white py-2 rounded-xl text-sm font-["Semibold"]' onClick={() => create()}>Continue</button>
              <button className='w-full bg-white border bg-white rounded-xl text-sm font-["Medium"]' onClick={() => setIsOpen(false)}>Cancel</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}
