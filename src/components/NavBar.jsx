import React, { useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Dialog, DialogPanel } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { createClient } from "@supabase/supabase-js";
import Group from "./assets/Group";
import { ME_QUERY } from '../Data/Me';

const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
    }
  }
`;

export const NavBar = ({ products, home, audience, pages, orders, settings, bookings, analytics, workshop, builder, storefront, linkinbio }) => {

  const { data, error, loading } = useState(ME_QUERY)
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

      const supabase = createClient(
        'https://rbsteedexxccoqrnyczp.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJic3RlZWRleHhjY29xcm55Y3pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU5MzIwMTksImV4cCI6MjAwMTUwODAxOX0.FT3oCWVeAGjrMRhLTdCFBSOtIdMDeZj6ApuALkJ185A'
      );
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      setFilename(fileName)
      setFileUrl(filePath);
      let { error: uploadError } = await supabase.storage.from('conten').upload(filePath, file);
      let { data } = supabase.storage.from('conten').getPublicUrl(`${filePath}`);

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


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProduct({
        variables: {
          input: {
            title,
            description,
            price: parseFloat(price),
            thumbnail,
            file: publicFile,
            images,
            sizes,
            availablityHours: availabilityTime,
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

  if (error) return <div>{error.message}</div>
  if (loading) return <div>Loading...</div>

  return (
    <div class='h-full'>
      <aside className="w-[275px] h-full bg-white border-l border-r p-6 shadow-sm">
        <nav className="px-5 mt-5">
          <div class='text-xs font-["Semibold"] text-gray-300'>Navigation</div>
          <div class='space-y-4 mt-3'>
            <div className={home === true ? 'text-black' : 'text-gray-400'}>
              <a href='/dashboard' class='font-["Semibold"] mt-3 text-sm'>Dashboard</a>
            </div>
            <div className={builder === true ? 'text-black' : 'text-gray-400'}>
              <a href='/editor' class='font-["Semibold"] text-sm'>Page Editor</a>
            </div>
            <div className={`${orders === true ? 'text-black' : 'text-gray-400'} ${linkinbio === true && 'hidden'}`}>
              <a href='/orders' class='font-["Semibold"] text-sm'>{storefront === true && 'Orders'} {workshop === true && 'Bookings'}</a>
            </div>
            <div className={`${audience === true ? 'text-black' : 'text-gray-400'} ${linkinbio === true && 'hidden'}`}>
              <a href='/audience' class='font-["Semibold"] text-sm'>Customers</a>
            </div>
            <div className={products === true ? 'text-black' : 'text-gray-400'}>
              <a href='/products' class='font-["Semibold"] text-sm'>{storefront === true && 'Products'} {linkinbio === true && 'Links'} {workshop === true && 'Services'}</a>
            </div>
            <div className={analytics === true ? 'text-black' : 'text-gray-400'}>
              <a href='/stats' class='font-["Semibold"] text-sm'>Stats</a>
            </div>
            <div className={settings === true ? 'text-black' : 'text-gray-400'}>
              <a href='/settings' class='font-["Semibold"] text-sm'>Settings</a>
            </div>
          </div>
          <div class='mt-20'>
            <div class='text-xs font-["Semibold"] text-gray-300'>Account</div>
            <div class='space-y-4 mt-4'>
              <div class='text-gray-400 font-["Semibold"] text-sm'>Stats</div>
              <div class='text-gray-400 font-["Semibold"] text-sm'>Settings</div>
            </div>
            <button onClick={() => setIsOpen(true)} class='bg-black text-white font-["Semibold"] rounded-full w-full py-4 mt-5 text-sm'>Create</button>
          </div>
        </nav>
      </aside>



      <Dialog open={isFinishing} onClose={() => setIsFinishing(false)} class='relative font-general-sans z-50'>
        <div className="fixed inset-0 flex bg-opacity-70 w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-2xl w-full space-y-4 flex-col flex  border rounded-xl bg-white p-10">
            <div style={{ fontFamily: 'Semibold' }} class='text-3xl mb-2'>Finalizing {product.product === true ? 'Product' : 'Service'}</div>
            <div class='font-["Medium"] text-gray-500 w-3/4 text-sm'>Tell us more about workspace so we can provide you a personalized expirience tailored to your needs and preferences</div>
            <div class='border gap-4 p-5 mt-5 flex items-center rounded-xl w-full'>
              <div>
                {thumbnail === "" ? (
                  <img />
                ) : (
                  <div class='w-28 h-28 rounded-xl bg-sky-100 flex items-center justify-center font-["Bold"] text-lg'>
                    {title.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <label class='text-xs font-["Semibold"]'>{title} • ${price}</label>
                <div class='text-gray-400 font-["Medium"] text-xs'>{description}</div>
                <div class='flex items-center gap-3 mt-2'>
                  <div class='flex items-center gap-1'>
                    <label class='text-[10px] font-["Semibold"]'>Type: </label>
                    <div class='text-[10px] font-["Semibold"] border px-2 py-1 rounded-full'>{product.product ? 'Product' : 'Service'}</div>
                  </div>
                  <div class={`flex items-center ${product.service ? 'flex' : 'hidden'} gap-1`}>
                    <label class='text-[10px] font-["Semibold"]'>Duration: </label>
                    <div class='text-[10px] font-["Semibold"] border px-2 py-1 rounded-full'>{duration} Minutes</div>
                  </div>
                  <div class='flex items-center gap-1'>
                    <label class='text-[10px] font-["Semibold"]'>Tag: </label>
                    <div class='text-[10px] font-["Semibold"] capitalize border px-2 py-1 rounded-full'>{tag}</div>
                  </div>
                  <div class={`flex items-center ${productType.merchandise && 'hidden'} ${product.service && 'hidden'} gap-2`}>
                    <label class='font-["Semibold"] text-[10px]'>File: </label>
                    <div class='text-[10px] font-["Semibold"] border rounded-full px-3 py-1'>
                      {fileName}
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div class={`${product.service ? 'flex flex-col' : 'hidden'}`}>
              <div>
                <label class='text-xs font-["Semibold"]'>Availability</label>
                <div class='flex items-center gap-5'>
                  <div class='flex w-full gap-3'>
                    <label class='text-[10px] font-["Semibold"]'>Days:</label>
                    <div class='gap-2 flex items-center flex-wrap'>
                      {availabilityDays.map(item => (
                        <div class='text-[10px] font-["Semibold"] px-2 py-1 border rounded-full'>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div class='flex w-full gap-3'>
                    <label class='text-[10px] font-["Semibold"]'>Hours:</label>
                    <div class='gap-2 flex items-center flex-wrap'>
                      {availabilityHours.map(item => (
                        <div class='text-[10px] font-["Semibold"] px-2 py-1 border rounded-full'>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div class='mt-3 flex'>
                <div class='w-full'>
                  <label class='text-xs font-["Semibold"]'>Specifications</label>
                  <div class='gap-2 flex items-center flex-wrap'>
                    {specifications.map(item => (
                      <div class='text-[10px] font-["Semibold"] px-2 py-1 border rounded-full'>{item}</div>
                    ))}
                  </div>
                </div>
                <div class='w-full'>
                  <label class='text-xs font-["Semibold"]'>Payments options</label>
                  <div class='flex items-center justify-between gap-5'>
                    <div class='flex items-center gap-2'>
                      <label class='text-xs font-["Semibold"]'>In-Person: </label>
                      <div onClick={() => handleInPersonPayments()} class={`w-7 flex items-center justify-center h-7 border rounded-full`}>
                        {inPersonPayment && (<CheckIcon class='h-4 w-4' />)}
                      </div>
                    </div>
                    <div class='flex items-center gap-1'>
                      <div class='flex items-center gap-2'>
                        <label class='text-xs font-["Semibold"]'>Virtual: </label>
                        <div onClick={() => handleVirtualPayments()} class={`w-7 flex items-center justify-center h-7 border rounded-full`}>
                          {virtualPayment && (<CheckIcon class='h-4 w-4' />)}

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class='font-["Semibold"] flex items-center gap-3'>
              <form onSubmit={handleSubmit} class='w-full'>
                <button type='submit' class='bg-black text-white w-full py-2.5 rounded-xl'>Create</button>
              </form>
              <button class='border text-black w-full py-2.5 rounded-xl'>Cancel</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <Dialog open={isFile} onClose={() => setIsFile(false)} class='relative font-general-sans z-50'>
        <div className="fixed inset-0 flex bg-opacity-70 w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-2xl w-full space-y-4 flex-col flex  border rounded-xl bg-white p-10">
            <div class='flex items-start justify-start flex-col'>
              <div style={{ fontFamily: 'Semibold' }} class='text-3xl mb-2'>Finishing {product.product === true ? 'Product' : 'Service'}</div>
              <div class='font-["Medium"] text-gray-500 w-3/4 text-sm'>Tell us more about workspace so we can provide you a personalized expirience tailored to your needs and preferences</div>
              <div class={`${product.service === true && 'hidden'} ${productType.merchandise === true && 'hidden'}`}>
                <label htmlFor="photo" style={{ fontFamily: 'Semibold' }} className="block text-xs leading-6 mb-3 mt-6 text-black">
                  File upload
                </label>
                <div className="flex gap-3 items-center">
                  <div className={`${thumbnail ? "hidden" : "h-20 w-20  capitalize rounded-lg text-xl font-['Semibold'] text-black items-center bg-sky-100 justify-center flex"}`} aria-hidden="true" >
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
                            class='h-12 w-12 rounded-full '
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

                  <div class='gap-y-2 flex flex-col'>
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
                    <div class='text-xs text-gray-500 font-["Medium"]'>.png, .jpeg, .gif files up to 8MB. Recommended size 256x256px.</div>
                  </div>
                </div>

              </div>
              <div class={`${product.service === true && 'hidden'} ${productType.merchandise === false && 'hidden'}`}>
                <label htmlFor="photo" style={{ fontFamily: 'Semibold' }} className="block text-xs leading-6 mb-3 mt-6 text-black">
                  Upload Images of Product
                </label>
                <div className="flex gap-3 items-center">
                  <div className={`${thumbnail ? "hidden" : "h-20 w-20  capitalize rounded-lg text-xl font-['Semibold'] text-black items-center bg-sky-100 justify-center flex"}`} aria-hidden="true" >
                    {title.charAt(0)}
                  </div>


                  <div class='gap-y-2 flex flex-col'>
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
                    <div class='text-xs text-gray-500 font-["Medium"]'>.png, .jpeg, .gif files up to 8MB. Recommended size 256x256px.</div>
                  </div>
                </div>
                {imagesLoading ? (
                  <h3>Loading...</h3>
                ) : (
                  <div>
                    {images && (
                      <div class='flex items-center gap-3'>
                        {images.map(item => (
                          <img class='w-28 h-28 rounded-xl' />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div class='flex flex-col gap-2 mt-5'>
                <label class='text-xs font-["Semibold"]'>{productType.custom ? '' : 'Tags'}</label>
                {productType.digitalDownload === true && (
                  <div class='flex items-center font-["Semibold"] gap-2'>
                    <div onClick={() => setTag('Music')} class={`rounded-full flex ${tag === 'Music' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Music</div>
                    </div>
                    <div onClick={() => setTag('Software')} class={`rounded-full flex ${tag === 'Software' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Software</div>
                    </div>
                    <div onClick={() => setTag('Document')} class={`rounded-full flex ${tag === 'Document' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Document</div>
                    </div>
                    <div onClick={() => setTag('Video')} class={`rounded-full flex ${tag === 'Video' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Video</div>
                    </div>
                    <div onClick={() => setTag('Template')} class={`rounded-full flex ${tag === 'Template' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Template</div>
                    </div>
                    <div onClick={() => setTag('Guide')} class={`rounded-full flex ${tag === 'Guide' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Guide</div>
                    </div>
                    <div onClick={() => setTag('Image')} class={`rounded-full flex ${tag === 'Image' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Image</div>
                    </div>
                    <div onClick={() => setTag('Other')} class={`rounded-full flex ${tag === 'Other' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Other</div>
                    </div>
                  </div>
                )}

                {productType.hair === true && (
                  <div class='flex items-center font-["Semibold"] gap-2'>
                    <div onClick={() => setTag('Haircut')} class={`rounded-full flex ${tag === 'Haircut' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Haircut</div>
                    </div>

                    <div onClick={() => setTag('Hairstyle')} class={`rounded-full flex ${tag === 'Hairstyle' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Hairstyle</div>
                    </div>

                    <div onClick={() => setTag('Other')} class={`rounded-full flex ${tag === 'Other' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Other</div>
                    </div>
                  </div>
                )}

                {productType.catering === true && (
                  <div class='flex items-center font-["Semibold"] gap-2'>
                    <div onClick={() => setTag('Wedding')} class={`rounded-full flex ${tag === 'Wedding' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Wedding</div>
                    </div>

                    <div onClick={() => setTag('Corporate')} class={`rounded-full flex ${tag === 'Corporate' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Corporate</div>
                    </div>

                    <div onClick={() => setTag('Social Event')} class={`rounded-full flex ${tag === 'Social Event' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Social Event</div>
                    </div>

                    <div onClick={() => setTag('Concessions')} class={`rounded-full flex ${tag === 'Concessions' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Concessions</div>
                    </div>
                  </div>
                )}

                {productType.cosmetic === true && (
                  <div class='flex items-center font-["Semibold"] gap-2'>
                    <div onClick={() => setTag('Makeup')} class={`rounded-full flex ${tag === 'Makeup' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Makeup</div>
                    </div>

                    <div onClick={() => setTag('Nails')} class={`rounded-full flex ${tag === 'Nails' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Nails</div>
                    </div>

                    <div onClick={() => setTag('Lashes')} class={`rounded-full flex ${tag === 'Lashes' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Lashes</div>
                    </div>
                    <div onClick={() => setTag('Waxing')} class={`rounded-full flex ${tag === 'Waxing' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Waxing</div>
                    </div>
                    <div onClick={() => setTag('Facial')} class={`rounded-full flex ${tag === 'Facial' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Facial</div>
                    </div>
                    <div onClick={() => setTag('Other')} class={`rounded-full flex ${tag === 'Other' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Other</div>
                    </div>
                  </div>
                )}

                {productType.audio === true && (
                  <div class='flex items-center font-["Semibold"] gap-2'>
                    <div onClick={() => setTag('Audiobook')} class={`rounded-full flex ${tag === 'Audiobook' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Audiobook</div>
                    </div>

                    <div onClick={() => setTag('Podcast')} class={`rounded-full flex ${tag === 'Podcast' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Podcast</div>
                    </div>
                    <div onClick={() => setTag('Music track')} class={`rounded-full flex ${tag === 'Music track' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Music track</div>
                    </div>
                    <div onClick={() => setTag('Sound effect')} class={`rounded-full flex ${tag === 'Sound effect' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Sound effect</div>
                    </div>

                    <div onClick={() => setTag('Other')} class={`rounded-full flex ${tag === 'Other' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Other</div>
                    </div>
                  </div>
                )}

                {productType.ebook === true && (
                  <div class='flex items-center font-["Semibold"] gap-2'>
                    <div onClick={() => setTag('Comic')} class={`rounded-full flex ${tag === 'Comic' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Comic</div>
                    </div>

                    <div onClick={() => setTag('Novel')} class={`rounded-full flex ${tag === 'Novel' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Novels</div>
                    </div>
                    <div onClick={() => setTag('Guides')} class={`rounded-full flex ${tag === 'Guides' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Guides</div>
                    </div>
                    <div onClick={() => setTag('Manuals')} class={`rounded-full flex ${tag === 'Manuals' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Manuals</div>
                    </div>

                    <div onClick={() => setTag('Other')} class={`rounded-full flex ${tag === 'Other' ? 'border-2 border-black' : 'border'} items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Other</div>
                    </div>
                  </div>
                )}

                {productType.merchandise === true && (
                  <div class='flex items-center flex-wrap font-["Semibold"] gap-2'>
                    <div onClick={() => handleMerchandise('clothing')} class={`rounded-full flex ${merchandise.clothing === true ? 'border-2 border-black' : 'border'}  items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Clothing</div>
                    </div>

                    <div onClick={() => handleMerchandise('accesories')} class={`rounded-full flex ${merchandise.accesories === true ? 'border-2 border-black' : 'border'}  items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Accessories</div>
                    </div>
                    <div onClick={() => handleMerchandise('electronics')} class={`rounded-full flex ${merchandise.electronics === true ? 'border-2 border-black' : 'border'}  items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Electronics</div>
                    </div>
                    <div onClick={() => handleMerchandise('food')} class={`rounded-full flex ${merchandise.food === true ? 'border-2 border-black' : 'border'}  items-center gap-1 text-xs px-3 py-1.5`}>
                      <div class='flex-nowrap flex'>Food & Beverages</div>
                    </div>

                    <div onClick={() => handleMerchandise('other')} class={`rounded-full flex ${merchandise.other === true ? 'border-2 border-black' : 'border'}  items-center gap-1 text-xs px-3 py-1.5`}>
                      <div>Other</div>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {product.service === true && (
              <div class='w-full'>
                <div class='w-full flex items-center gap-5'>

                  <div class='w-full flex flex-col gap-2'>
                    <label className="text-xs font-['Semibold']">Name</label>
                    <input
                      class='py-3 px-3 w-full text-xs font-["Medium"] rounded-xl border'
                      defaultValue={title}
                    />
                  </div>
                  <div class='w-full flex flex-col gap-2'>
                    <label className="text-xs font-['Semibold']">Duration</label>
                    <input
                      class='py-3 px-3 w-full text-xs font-["Medium"] rounded-xl border'
                      value={duration}
                      type='number'

                      onChange={e => setDuration(e.target.value)}
                    />
                  </div>
                </div>
                <div class='w-full flex mt-5 gap-5'>

                  <div class='w-full flex flex-col gap-2'>
                    <label className="text-xs font-['Semibold']">Availblity Days</label>
                    <div class='flex items-center flex-wrap gap-2'>
                      {availability.map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => toggleAvailabilityDays(days)}
                          class={`px-3 py-1.5 rounded-full ${availabilityDays.includes(days) ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}

                        >
                          {days}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div class='w-full flex flex-col gap-2'>
                    <label className="text-xs font-['Semibold']">Time</label>
                    <div class='flex items-center flex-wrap gap-2'>
                      {availabilityTime.map((hours) => (
                        <button
                          key={hours}
                          type="button"
                          onClick={() => toggleAvailabilityTime(hours)}
                          class={`px-3 py-1.5 rounded-full ${availabilityHours.includes(hours) ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}

                        >
                          {hours}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div class='w-full flex flex-col gap-2 mt-5'>
                  <label className="text-xs font-['Semibold']">Specifications</label>
                  <div class=''>
                    <div class='flex items-center gap-3'>
                      <div class='w-full'>
                        {specifications.length > 0 && (
                          <div class='flex items-center flex-wrap mt-2 gap-3'>
                            {specifications.map((spec, index) => (
                              <div class='px-3 flex items-center gap-2 border py-1 rounded-full text-xs font-["Semibold"]'>
                                {spec}
                                <XMarkIcon onClick={() => handleRemoveSpecification(spec)}
                                  class='w-4 h-4 text-gray-200' />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div class='w-full flex items-center gap-3'>
                        <input
                          type="text"
                          value={specInput}
                          onChange={(e) => setSpecInput(e.target.value)}
                          placeholder="Ex: Taper, Ovals, Cornrows, "
                          className="py-3 px-3 w-full text-xs placeholder:text-gray-300 font-medium rounded-xl border"
                        />
                        <button onClick={handleAddSpecification}
                          class='py-3 px-3 bg-black text-xs rounded-xl text-white font-["Medium"]'>
                          Add
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}


            {merchandise.food && productType.merchandise === true && (
              <div class='w-full flex items-center gap-10'>
                <div class='w-full'>
                  <div class='flex flex-col'>
                    <label class='font-["Semibold"] text-xs'>Type</label>
                  </div>
                  <div class='gap-2 grid w-full grid-cols-3 mt-2'>
                    <div onClick={() => setClothingType("Exotic Snacks")} class={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Exotic Snacks' ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}>
                      <div>Exotic Snacks</div>
                      <div class={`w-3 h-3 rounded-full ${clothingType === 'Exotic Snacks' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Seasonings")} class={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Seasonings' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Seasonings</div>
                      <div class={`w-3 h-3 rounded-full ${clothingType === 'Seasonings' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Chips")} class={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Chips' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Chips</div>
                      <div class={`w-3 h-3 rounded-full ${clothingType === 'Chips' ? 'border-4 border-black' : 'border'} `} />
                    </div>

                    <div onClick={() => setClothingType("Candy")} class={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Candy' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Candy</div>
                      <div class={`w-3 h-3 rounded-full ${clothingType === 'Candy' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Beverage")} class={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Beverage' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Beverage</div>
                      <div class={`w-3 h-3 rounded-full ${clothingType === 'Beverage' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                  </div>
                </div>

              </div>
            )}
            {merchandise.clothing && productType.merchandise && product.product === true && (
              <div class='w-full flex items-center gap-10'>
                <div class='w-full'>
                  <div class='flex flex-col'>
                    <label class='font-["Semibold"] text-xs'>Clothing type</label>
                  </div>
                  <div class='gap-2 grid w-full grid-cols-2 mt-2'>
                    <div onClick={() => setClothingType("Hat")} class={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Hat' ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}>
                      <div>Hats</div>
                      <div class={`w-3 h-3 rounded-full ${clothingType === 'Hat' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Bottom")} class={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Bottom' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Bottoms</div>
                      <div class={`w-3 h-3 rounded-full ${clothingType === 'Bottom' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Top")} class={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Top' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Tops</div>
                      <div class={`w-3 h-3 rounded-full ${clothingType === 'Top' ? 'border-4 border-black' : 'border'} `} />
                    </div>

                    <div onClick={() => setClothingType("Hoodie")} class={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Hoodie' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Hoodies</div>
                      <div class={`w-3 h-3 rounded-full ${clothingType === 'Hoodie' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                  </div>
                </div>
                <div class=''>
                  <div class='flex flex-col'>
                    <label class='font-["Semibold"] text-xs'>Sizes available</label>
                  </div>
                  <div class='flex items-center gap-2 w-full flex-wrap mt-2'>
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        class={`px-3 py-1.5 rounded-full ${sizes.includes(size) ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}

                      >
                        {size}
                      </button>
                    ))}

                  </div>
                </div>
              </div>
            )}

            {merchandise.electronics && productType.merchandise === true && (
              <div class='w-full flex items-center gap-10'>
                <div class='w-full'>
                  <div class='flex flex-col'>
                    <label class='font-["Semibold"] text-xs'>Electronic</label>
                  </div>
                  <div class='gap-2 grid w-full grid-cols-2 mt-2'>
                    <div onClick={() => setClothingType("Phone")} class={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Phone' ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}>
                      <div>Phone</div>
                      <div class={`w-3 h-3 rounded-full ${clothingType === 'Phone' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Cases")} class={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Cases' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Cases</div>
                      <div class={`w-3 h-3 rounded-full ${clothingType === 'Cases' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Top")} class={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Headphones' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Headphones</div>
                      <div class={`w-3 h-3 rounded-full ${clothingType === 'Headphones' ? 'border-4 border-black' : 'border'} `} />
                    </div>

                    <div onClick={() => setClothingType("Laptop")} class={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Laptop' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Laptop</div>
                      <div class={`w-3 h-3 rounded-full ${clothingType === 'Laptop' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Tablet")} class={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Tablet' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Tablet</div>
                      <div class={`w-3 h-3 rounded-full ${clothingType === 'Tablet' ? 'border-4 border-black' : 'border'} `} />
                    </div>

                    <div onClick={() => setClothingType("Other")} class={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Other' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Other</div>
                      <div class={`w-3 h-3 rounded-full ${clothingType === 'Other' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                  </div>
                </div>
                <div class=''>
                  <div class='flex flex-col'>
                    <label class='font-["Semibold"] text-xs'>Brand</label>
                  </div>
                  <div class='flex items-center gap-2 w-full flex-wrap mt-2'>
                    <div class='px-3 py-1.5 rounded-full border font-["Semibold"] text-xs'>
                      Apple
                    </div>
                    <div class='px-3 py-1.5 rounded-full border font-["Semibold"] text-xs'>
                      Samsung
                    </div>
                    <div class='px-3 py-1.5 rounded-full border font-["Semibold"] text-xs'>
                      Beats
                    </div>
                    <div class='px-3 py-1.5 rounded-full border font-["Semibold"] text-xs'>
                      Lenovo
                    </div>
                    <div class='px-3 py-1.5 rounded-full border font-["Semibold"] text-xs'>
                      Dell
                    </div>
                    <div class='px-3 py-1.5 rounded-full border font-["Semibold"] text-xs'>
                      HP
                    </div>

                  </div>
                </div>
              </div>
            )}

            {merchandise.accesories && productType.merchandise === true && (
              <div class='w-full flex items-center gap-10'>
                <div class='w-full'>
                  <div class='flex flex-col'>
                    <label class='font-["Semibold"] text-xs'>Accessory type</label>
                  </div>
                  <div class='gap-2 grid w-full grid-cols-2 mt-2'>
                    <div onClick={() => setClothingType("Bracelet")} class={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Bracelet' ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}>
                      <div>Bracelet</div>
                      <div class={`w-3 h-3 rounded-full ${clothingType === 'Bracelet' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Necklace")} class={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Necklace' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Necklace</div>
                      <div class={`w-3 h-3 rounded-full ${clothingType === 'Necklace' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                    <div onClick={() => setClothingType("Ring")} class={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Ring' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Ring</div>
                      <div class={`w-3 h-3 rounded-full ${clothingType === 'Ring' ? 'border-4 border-black' : 'border'} `} />
                    </div>

                    <div onClick={() => setClothingType("Earing")} class={`w-full py-2 px-2 flex items-center justify-between rounded-xl ${clothingType === 'Earing' ? 'border-2 border-black' : 'border'}  font-["Semibold"] text-xs`}>
                      <div>Earing</div>
                      <div class={`w-3 h-3 rounded-full ${clothingType === 'Earing' ? 'border-4 border-black' : 'border'} `} />
                    </div>
                  </div>
                </div>
                <div class=''>
                  <div class='flex flex-col'>
                    <label class='font-["Semibold"] text-xs'>Sizes available</label>
                  </div>
                  {clothingType === 'Bracelet' && (
                    <div class='flex items-center gap-2 w-full flex-wrap mt-2'>
                      {braceletSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          class={`px-3 py-1.5 rounded-full ${sizes.includes(size) ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}

                        >
                          {size}
                        </button>
                      ))}

                    </div>
                  )}
                  {clothingType === 'Necklace' && (
                    <div class='flex items-center gap-2 w-full flex-wrap mt-2'>
                      {braceletSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          class={`px-3 py-1.5 rounded-full ${sizes.includes(size) ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}

                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}

                  {clothingType === 'Ring' && (
                    <div class='flex items-center gap-2 w-full flex-wrap mt-2'>
                      {ringSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          class={`px-3 py-1.5 rounded-full ${sizes.includes(size) ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}

                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            )}
            <div class={`w-full flex ${merchandise.food === true && 'hidden'} ${productType.merchandise === false && 'hidden'} flex-col gap-2`}>
              <label class='font-["Semibold"] text-xs'>Colors available</label>
              <div class='flex items-center gap-2 w-full flex-wrap mt-2'>
                <div class='flex items-center flex-wrap gap-2'>
                  {colorAvailable.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => toggleColors(color)}
                      class={`px-3 py-1.5 flex items-center gap-2 rounded-full ${colors.includes(color) ? 'border-2 border-black' : 'border'} font-["Semibold"] text-xs`}

                    >
                      <div style={{ backgroundColor: color }} class='w-3 h-3 rounded-full' />
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div class='w-full flex flex-col gap-2'>
              <label class='font-["Semibold"] text-xs'>Description</label>
              <input
                class='py-3 px-3 w-full text-xs font-["Medium"] rounded-xl border'
                value={description}
                type='text'
                placeholder='Description of product...'
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div class='font-["Semibold"] flex items-center gap-3'>
              <button onClick={finishingModal} class='bg-black text-white w-full py-2.5 rounded-xl'>Continue</button>
              <button class='border text-black w-full py-2.5 rounded-xl'>Cancel</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <Dialog open={isCreate} onClose={() => setIsCreate(false)} class='relative font-general-sans z-50'>
        <div className="fixed inset-0 flex bg-opacity-70 w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-2xl w-full space-y-4 flex-col flex  border rounded-xl bg-white p-10">
            <div class='flex items-start justify-start flex-col'>
              <div style={{ fontFamily: 'Semibold' }} class='text-3xl mb-2'>Create {product.product === true ? 'Product' : 'Service'}</div>
              <div class='font-["Medium"] text-gray-500 w-3/4 text-sm'>Tell us more about workspace so we can provide you a personalized expirience tailored to your needs and preferences</div>
            </div>

            <label htmlFor="photo" style={{ fontFamily: 'Semibold' }} className="block text-xs leading-6 mb-3 mt-6 text-black">
              Product thumbnail
            </label>
            <div className="flex gap-3 items-center">
              <div className={`${thumbnail ? "hidden" : "h-20 w-20  capitalize rounded-lg text-xl font-['Semibold'] text-black items-center bg-sky-100 justify-center flex"}`} aria-hidden="true" >
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
                        class='h-12 w-12 rounded-full '
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

              <div class='gap-y-2 flex flex-col'>
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
                <div class='text-xs text-gray-500 font-["Medium"]'>.png, .jpeg, .gif files up to 8MB. Recommended size 256x256px.</div>
              </div>
            </div>

            <div class='flex items-center w-full gap-3'>
              <div class='w-full flex flex-col gap-2'>
                <label class='font-["Semibold"] text-xs'>Name</label>
                <input
                  class='py-3 px-3 w-full text-xs font-["Medium"] rounded-xl border'
                  type="text"
                  value={title}
                  id={title}
                  name='title'
                  onChange={e => setTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div class='w-full flex flex-col gap-2'>
                <label class='font-["Semibold"] text-xs'>Price</label>
                <input
                  class='py-3 px-3 w-full text-xs font-["Medium"] rounded-xl border'
                  value={price}
                  type='number'
                  onChange={e => setPrice(e.target.value)}
                />
              </div>
            </div>
            {product.product === true ? (
              <div class='w-full flex flex-col gap-2'>

                <label class='font-["Semibold"] text-xs'>Type</label>
                <div class='grid grid-cols-2 w-full gap-3'>
                  <div onClick={() => handleProduct('digitalDownload')} class={`${productType.digitalDownload === true ? 'border-black border-2' : 'border'} flex flex-col gap-1 relative rounded-xl p-3`}>
                    <div class={`absolute right-3 top-3 ${productType.digitalDownload === true ? 'border-black border-4' : 'border'} rounded-full w-3 h-3`} />
                    <div class='font-["Semibold"] text-xs'>
                      Digital Download
                    </div>
                    <div class='text-gray-400 font-["Medium"] text-xs'>
                      Create and sell digital products like E-books, Music, Videos, Software, and Templates.
                    </div>
                  </div>
                  <div onClick={() => handleProduct('audio')} class={`${productType.audio === true ? 'border-black border-2' : 'border'} flex flex-col gap-1 relative rounded-xl p-3`}>
                    <div class={`absolute right-3 top-3 ${productType.audio === true ? 'border-black border-4' : 'border'} rounded-full w-3 h-3`} />
                    <div class='font-["Semibold"] text-xs'>
                      Audios
                    </div>
                    <div class='text-gray-400 font-["Medium"] text-xs'>
                      Upload and sell audio content like Podcasts, Music Tracks, Audiobooks, and Sound Effects.
                    </div>
                  </div>
                  <div onClick={() => handleProduct('ebook')} class={`${productType.ebook === true ? 'border-black border-2' : 'border'} flex flex-col gap-1 relative rounded-xl p-3`}>
                    <div class={`absolute right-3 top-3 ${productType.ebook === true ? 'border-black border-4' : 'border'} rounded-full w-3 h-3`} />
                    <div class='font-["Semibold"] text-xs'>
                      Ebooks
                    </div>
                    <div class='text-gray-400 font-["Medium"] text-xs'>
                      Create and sell e-books such as Novels, Guides, Manuals, and Comics.
                    </div>
                  </div>
                  <div onClick={() => handleProduct('merchandise')} class={`${productType.merchandise === true ? 'border-black border-2' : 'border'} flex flex-col gap-1 relative rounded-xl p-3`}>
                    <div class={`absolute right-3 top-3 ${productType.merchandise === true ? 'border-black border-4' : 'border'} rounded-full w-3 h-3`} />
                    <div class='font-["Semibold"] text-xs'>
                      Merchandise
                    </div>
                    <div class='text-gray-400 font-["Medium"] text-xs'>
                      Design and sell merchandise such as T-shirts, Hats, Mugs, Hoodies, and Custom Accessories.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div class='w-full flex flex-col gap-2'>

                <label class='font-["Semibold"] text-xs'>Type</label>
                <div class='grid grid-cols-2 w-full gap-3'>
                  <div onClick={() => handleProduct('hair')} class={`${productType.hair === true ? 'border-black border-2' : 'border'} flex flex-col gap-1 relative rounded-xl p-3`}>
                    <div class={`absolute right-3 top-3 ${productType.hair === true ? 'border-black border-4' : 'border'} rounded-full w-3 h-3`} />
                    <div class='font-["Semibold"] text-xs'>
                      Hair Services
                    </div>
                    <div class='text-gray-400 font-["Medium"] text-xs'>
                      Create and sell digital products like E-books, Music, Videos, Software, and Templates.
                    </div>
                  </div>
                  <div onClick={() => handleProduct('cosmetic')} class={`${productType.cosmetic === true ? 'border-black border-2' : 'border'} flex flex-col gap-1 relative rounded-xl p-3`}>
                    <div class={`absolute right-3 top-3 ${productType.cosmetic === true ? 'border-black border-4' : 'border'} rounded-full w-3 h-3`} />
                    <div class='font-["Semibold"] text-xs'>
                      Cosmetic Services
                    </div>
                    <div class='text-gray-400 font-["Medium"] text-xs'>
                      Upload and sell audio content like Podcasts, Music Tracks, Audiobooks, and Sound Effects.
                    </div>
                  </div>
                  <div onClick={() => handleProduct('catering')} class={`${productType.catering === true ? 'border-black border-2' : 'border'} flex flex-col gap-1 relative rounded-xl p-3`}>
                    <div class={`absolute right-3 top-3 ${productType.catering === true ? 'border-black border-4' : 'border'} rounded-full w-3 h-3`} />
                    <div class='font-["Semibold"] text-xs'>
                      Catering Service
                    </div>
                    <div class='text-gray-400 font-["Medium"] text-xs'>
                      Create and sell e-books such as Novels, Guides, Manuals, and Comics.
                    </div>
                  </div>
                  <div onClick={() => handleProduct('custom')} class={`${productType.custom === true ? 'border-black border-2' : 'border'} flex flex-col gap-1 relative rounded-xl p-3`}>
                    <div class={`absolute right-3 top-3 ${productType.custom === true ? 'border-black border-4' : 'border'} rounded-full w-3 h-3`} />
                    <div class='font-["Semibold"] text-xs'>
                      Custom Services
                    </div>
                    <div class='text-gray-400 font-["Medium"] text-xs'>
                      Design and sell merchandise such as T-shirts, Hats, Mugs, Hoodies, and Custom Accessories.
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div class='w-full flex flex-col gap-2'>
              <label class='font-["Semibold"] text-xs'>Description</label>
              <input
                class='py-3 px-3 w-full text-xs font-["Medium"] rounded-xl border'
                value={description}
                type='text'
                placeholder='Description of product...'
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div class='font-["Semibold"] flex items-center gap-3'>
              <button onClick={fileModal} class='bg-black text-white w-full py-2.5 rounded-xl'>Continue</button>
              <button class='border text-black w-full py-2.5 rounded-xl'>Cancel</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative font-general-sans z-50">
        <div className="fixed inset-0 flex bg-opacity-70 w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-xl w-full space-y-4 flex-col flex items-center justify-center border rounded-xl bg-white p-10">

            <div class='flex items-start justify-start flex-col'>
              <div style={{ fontFamily: 'Semibold' }} class='text-3xl mb-2'>Add a product</div>
              <div class='font-["Medium"] text-gray-500 text-sm'>Tell us more about workspace so we can provide you a personalized expirience tailored to your needs and preferences</div>
            </div>



            <div class='flex items-start justify-start flex-col  w-full font-["Semibold"] gap-4'>
              <label class='text-xs'>Type</label>
              <div class='flex w-full gap-2'>
                <div onClick={() => handleToggle('product')} class={`w-full ${product.product === true ? 'border-black border-2' : 'border'} p-3 px-4 justify-between flex items-center gap-1 rounded-xl`}>
                  <div class='flex flex-col gap-[2px]'>
                    <div class='bg-gray-100 h-7 w-7 flex items-center justify-center rounded-md inline-block'>
                      <img
                        className="h-5 w-5 flex-shrink-0"
                        src="/assets/IconSet7.svg"
                        loading="lazy"
                      />
                    </div>
                    <div class='text-xs'>Products</div>
                    <div class='text-xs text-gray-400 font-["Medium"]'>Create and manage various products such as Digital Downloads, Audios, Videos, E-books, and Physical Products.
                    </div>
                  </div>
                  <div>
                    <div class={`w-5 h-5 rounded-full  ${product.product === true ? 'border-black border-8' : 'border'}`} />
                  </div>
                </div>
                <div onClick={() => handleToggle('service')} class={`w-full ${product.service === true ? 'border-black border-2' : 'border'} p-3 px-4 justify-between flex items-center gap-1 rounded-xl`}>
                  <div class='flex flex-col gap-[2px]'>
                    <div class='bg-gray-100 h-7 w-7 flex items-center justify-center rounded-md inline-block'>
                      <img
                        className="h-5 w-5 flex-shrink-0"
                        src="/assets/HandCoins.svg"
                        loading="lazy"
                      />
                    </div>
                    <div class='text-xs'>Services</div>
                    <div class='text-xs text-gray-400 font-["Medium"]'>Offer various services such as Consultations, Online Courses, Coaching Sessions, Webinars, and Workshops.
                    </div>
                  </div>
                  <div>
                    <div class={`w-5 h-5 rounded-full  ${product.service === true ? 'border-black border-8' : 'border'}`} />
                  </div>
                </div>
              </div>

            </div>
            <div className="flex w-full gap-4">
              <button class='w-full bg-black text-white py-2 rounded-xl text-sm font-["Semibold"]' onClick={() => create()}>Continue</button>
              <button class='w-full bg-white border bg-white rounded-xl text-sm font-["Medium"]' onClick={() => setIsOpen(false)}>Cancel</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}
