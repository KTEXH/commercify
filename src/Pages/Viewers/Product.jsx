import React, { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom';


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
                <img src={data?.getProduct?.thumbnail} class='bg-black' />
                <div class='mt-[-50px] bg-white w-full h-full flex p-7 flex-col z-20 relative rounded-t-[50px]'>
                    <div class='text-2xl font-["Semibold"]'>{data?.getProduct?.title}</div>
                    <div class='text-2xl font-["Semibold"]'>${product.price}</div>
                    <div class='text-sm font-["Medium"] text-gray-500'>{data?.getProduct?.description}</div>
                    <div class='mt-7 flex self-stretch justify-between'>
                        <div class='w-full'>
                            <div class='text-sm font-["Semibold"]'>Sizes</div>
                            <div class='flex items-cneter gap-1 mt-2 flex-wrap'>
                                {product.sizes.map(item => (<div class='text-xs font-["Semibold"] px-3 py-1 rounded-full border'>{item}</div>))}
                            </div>
                        </div>
                        <div class='w-full'>
                            <div class='text-sm font-["Semibold"]'>Colors</div>
                            <div class='flex items-cneter gap-1 mt-2 flex-wrap'>
                                {product.colors.map(item => (<div class='text-xs font-["Semibold"] flex items-center gap-2 px-2 py-1 rounded-full border'><div style={{ backgroundColor: item }} class='w-3 h-3 rounded-full border' />{item}</div>))}
                            </div>
                        </div>
                    </div>

                </div>
                <div class='flex items-center z-40 bottom-0 gap-3 px-7 py-3 fixed w-full bg-white'>
                    <button class='w-full bg-black py-3 rounded-full text-white text-sm font-["Semibold"]'>Purchase</button>
                </div>
            </div>
        </div>
    )
}

export default ProductOne