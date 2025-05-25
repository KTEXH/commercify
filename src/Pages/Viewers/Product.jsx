import React, { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom';
import { ArrowBigLeft } from 'lucide-react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { BellAlertIcon } from '@heroicons/react/24/outline';


const GET_PRODUCT = gql`
  query getProduct($slug: String!) {
    getProduct(slug: $slug) {
      id
      price
      slug
      title
      thumbnail
      sizes
      description
      colors
    }
  }
`;



const ProductOne = () => {
    const { slug } = useParams();
    const { data, error, loading } = useQuery(GET_PRODUCT, {
        variables: { slug: slug }
    })

    const [process, setProcess] = useState({
        product: true,
        shipping: false,
        payment: false
    })

    const product = data?.getProduct

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
                    <button class='w-full bg-black py-4 rounded-full text-white font-["Semibold"]'>Buy Now</button>
                </div>
            </div>
        </div>
    )
}

export default ProductOne