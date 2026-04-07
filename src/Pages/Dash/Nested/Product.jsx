import React, { useEffect, useState } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import { NavBar } from '../../../components/NavBar';
import { ME_QUERY } from '../../../Data/Me';
import logo from '../../../components/assets/logo.svg'
import { Add, Banner } from '../Home';
import { useParams } from 'react-router-dom';

const GET_PRODUCT = gql`
  query getService($id: Int!) {
    getService(id: $id) {
      id
      price
      title
      thumbnail
      description
    }
  }
`;

const DELETE = gql`
   mutation deleteProduct($id: Int!, $isDeleted: Boolean!){
             deleteProduct(id: $id, isDeleted: $isDeleted){
             id
             }
   }
`

const EDIT = gql`
   mutation updateProduct($id: Int!, $title: String, $description: String){
    updateProduct(id: $id, title: $title, description: $description){
            id
            title
            description
        }
   }
`

export const Product = () => {
    const { id } = useParams();
    const numericId = parseInt(id, 10);
    const { data, error, loading } = useQuery(ME_QUERY)
    const [edit] = useMutation(EDIT)
    const [remove] = useMutation(DELETE)
    const { data: product, error: perror, loading: ploading } = useQuery(GET_PRODUCT, {
        variables: { id: numericId }
    })
    const [selectedPage, setSelectedPage] = useState(null);

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            await remove({
                variables: {
                    id: idNumber,
                    isDeleted: true
                }
            });
            alert("Products archived!");
        } catch (err) {
            console.error("Link creation failed:", err.message);
        }
    }

    useEffect(() => {
        if (data?.me?.Pages?.length > 0 && !selectedPage) {
            setSelectedPage(data.me.Pages[0]); // Set first page as default
        }
    }, [data, selectedPage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await edit({
                variables: {
                    id: product?.getService?.id,
                    title: title,
                    description: description
                }
            });
            alert("Revisions made!");
        } catch (err) {
            console.error("Link creation failed:", err.message);
        }
    };

   useEffect(() => {
    if (product?.getService) {
        setDescription(product.getService.description || "");
        setTitle(product.getService.title || "");
        setIdNumber(product.getService.id);
    }
}, [product]);


    const [title, setTitle] = useState(product?.getService?.title)
    const [description, setDescription] = useState(product?.getService?.description)
    const [idNumber, setIdNumber] = useState(product?.getService?.id)

    if (loading || ploading) return <div>Loading...</div>
    if (error || perror) return <div>{error.message || perror.message}</div>
    return (
        <div>
            <Banner />

            {/* Curved panel overlapping the banner */}
            <div className="flex h-screen bg-gray-50 rounded-t-3xl -mt-5 relative z-20">
                <div className='w-16 mt-5 flex flex-col space-y-3 items-center'>
                    {data?.me?.Pages?.map(item => (
                        <div key={item.id} className="relative flex items-center">
                            {/* Left curved indicator */}
                            {selectedPage?.id === item.id && (
                                <div className="absolute left-[37px] top-1/2 -translate-y-1/2 w-3 h-5 bg-white border-l border-t border-b rounded-l-lg"
                                ></div>
                            )}
                            <img key={item.id} onClick={() => setSelectedPage(item)} className='h-8 rounded-full' src={!item?.headerImage ? logo : item?.headerImage} />
                        </div>
                    ))}
                    <Add />
                </div>
                <NavBar home={false} products={true} workshop={selectedPage?.workshop} form={selectedPage?.form} linkinbio={selectedPage?.linkinbio} storefront={selectedPage?.storefront} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <div className="border-b items-center px-6 py-4">
                        <div className='flex items-center gap-2'>
                            <img src={selectedPage?.headerImage ? selectedPage?.headerImage : logo} className='w-8 rounded-lg h-8' />
                            <span className="text-lg font-['Semibold'] text-sm">cmhq.me/{selectedPage?.subdomain}</span>
                        </div>
                        <div className="flex items-center gap-4">

                        </div>
                    </div>
                    <main className="flex-1 relative overflow-y-auto py-2">
                        <div className='px-16'>
                            <div className='flex items-center justify-between w-full'>
                                <div className='mt-7 font-["Semibold"] mb-3 text-3xl'>{product?.getService?.title}</div>
                                <img src={product?.getService?.thumbnail || logo} className='w-12 h-12 rounded-full' />
                            </div>
                            <div className='w-full flex gap-5 mt-5'>
                                <div className='h-64 w-1/3 rounded-3xl border shadow-sm p-5 bg-white'>
                                    <img src={product?.getService?.thumbnail || logo} className='w-full rounded-3xl h-full' />
                                </div>
                                <div className='bg-white px-10 py-5 border shadow-sm rounded-3xl w-2/3'>
                                    <div className='flex gap-3 w-full'>
                                        <div className='w-full'>
                                            <div className='text-sm font-["Semibold"]'>Title</div>
                                            <input
                                                type='text'
                                                placeholder='Title'
                                                onChange={(e) => setTitle(e.target.value)}
                                                value={title}
                                                className='px-3 py-2 mt-2 w-full font-["Medium"] rounded-full text-sm border' />
                                        </div>
                                        <div className='w-full'>
                                            <div className='text-sm font-["Semibold"]'>Description</div>
                                            <textarea
                                                type='text'
                                                placeholder='Description'
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className='px-3 py-2 mt-2 w-full font-["Medium"] rounded-3xl text-sm border' />
                                        </div>
                                    </div>
                                    <div className='mt-2'>
                                        <div>Details</div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className='p-3 fixed bottom-0 w-[calc(100%-335px)] flex items-center gap-5 border-t '>
                            <form className='w-full' onSubmit={handleSubmit}>
                                <button type='submit' className='w-full py-3 rounded-full bg-zinc-950 text-white font-["Semibold"]'>Edit</button>
                            </form>
                            <form onSubmit={handleDelete}>
                                <button type='submit' className='w-full py-3 shadow-sm font-["Semibold"] rounded-full border'>Delete</button>
                            </form>
                        </div>
                    </main>
                </div>

            </div>

        </div>
    )
}