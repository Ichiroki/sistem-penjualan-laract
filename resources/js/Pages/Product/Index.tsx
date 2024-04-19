import { Product } from '@/API/Product'
import Button from '@/Components/Button'
import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import Modal from '@/Components/Modal'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import axios from 'axios'
import { useState } from 'react'

function ProductIndex({auth}) {

    let i = 1

    const { product, setProduct, search, setSearch, getProductData } = Product()

    const [errorCode, setErrorCode] = useState('')
    const [errorName, setErrorName] = useState('')
    const [errorQuantity, setErrorQuantity] = useState('')

    const [code, setCode] = useState('')
    const [name, setName] = useState('')
    const [quantity, setQuantity] = useState('')


    const resetInput = () => {
        setCode('')
        setName('')
        setQuantity('')
    }

    const [editProductData, setEditProductData] = useState({
        code: '',
        name: '',
        quantity: '',
    })

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [deleteProductId, setDeleteProductId] = useState(null)

    const handleEditModal = (productId) => {
        const selectedProduct: any = product.find((p) => p.code === productId)
        setEditProductData(selectedProduct)
        setShowEditModal(!showEditModal)
    }

    const handleDeleteModal = (productId) => {
        setDeleteProductId(productId)
        console.log(deleteProductId)
        setShowDeleteModal(!showDeleteModal)
    }

    let createProductData = async (e) => {
        e.preventDefault()
        try {
            axios.post('/products',
            {
                code, name, quantity
            })
            .then(() => {
                resetInput()
                getProductData()
                setShowCreateModal(false)
            })
            .catch((error) => {
                console.log(error)
                if(error.response) {
                    const getError = error.response.data.errors
                    console.log(error.response)
                    // Error message
                    setErrorCode(getError.code[0])
                    setErrorName(getError.name[0])
                    setErrorQuantity(getError.quantity[0])
                    //
                }
            })
        } catch(e) { console.error('Internal server error, please wait') }
    }

    let editProductIdData = async (productId) => {
        try {
            await axios.put(`/products/${productId}`, {
                code : editProductData.code,
                name : editProductData.name,
                quantity : editProductData.quantity
            })
            .then(() => {
                getProductData()
                resetInput()
                setShowEditModal(false)
            })
            .catch((error) => {
                if(error.response) {
                    const getError = error.response.data.errors
                    console.log(error.response)
                    setErrorCode(getError.code[0])
                    setErrorName(getError.name[0])
                    setErrorQuantity(getError.quantity[0])
                }
            })
        } catch(e) { console.error('Internal server error, please wait' + e) }
    }

    let deleteProductData = async (productId) => {
        try {
            await axios.delete(`/products/${productId}`)
            .then(() => {
                const updateProductList = product.filter((p) => p.code !== productId)
                setProduct(updateProductList)
                setDeleteProductId(null)
                setShowDeleteModal(false)
            })
        } catch(e) { console.error('Internal Server Error, Please Wait' + e) }
    }

    return (
        <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Product</h2>}
        >
        <Head title="Dashboard" />

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className='flex justify-between mb-6'>
                            <TextInput placeholder={'Search here...'} value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button onClick={() => setShowCreateModal(!showCreateModal)}>Create</Button>
                            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
                                <div className='p-5'>
                                    <div className='flex justify-between pb-4 border-b'>
                                        <h1 className='text-medium text-xl'>Delete product</h1>
                                        <button onClick={() => setShowCreateModal(!showCreateModal)}>X</button>
                                    </div>
                                    <form onSubmit={createProductData}>
                                        <div className='my-4'>
                                            <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                <div className='flex justify-between w-full gap-5'>
                                                    <div className='mb-4 w-1/2'>
                                                        <InputLabel value="Kode" className='mb-2' htmlFor="kode" />
                                                        <TextInput value={code} onChange={(e) => setCode(e.target.value)} className={errorCode ? "w-full border-pink-700 text-pink-700 focus:border-pink-700 focus:ring-pink-700" : "w-full"} id="kode"/>
                                                        {errorCode && errorCode !== '' ? (
                                                            <InputError message={errorCode}/>
                                                        ) : (
                                                            <>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className='mb-4 w-1/2'>
                                                        <InputLabel value="Nama" className='mb-2' htmlFor="nama"/>
                                                        <TextInput value={name} onChange={(e) => setName(e.target.value)} className={errorName ? "w-full border-pink-700 text-pink-700 focus:border-pink-700 focus:ring-pink-700" : "w-full"} id="nama"/>
                                                        {errorName ? (
                                                            <InputError message={errorName}/>
                                                        ) : (
                                                            <>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className='mb-4 w-full'>
                                                    <InputLabel value="Jumlah" className='mb-2' htmlFor="jumlah"/>
                                                    <TextInput value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full" id="quantity"/>
                                                    {errorQuantity ? (
                                                        <InputError message={errorQuantity}/>
                                                    ) : (
                                                        <>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex justify-end gap-3 mt-6 pt-6 border-t'>
                                            <Button color="light" type="button" onClick={() => setShowCreateModal(!showCreateModal)}>Close</Button>
                                            <Button color="success" type="submit">Submit</Button>
                                        </div>
                                    </form>
                                </div>
                            </Modal>
                        </div>
                        <div className=''>
                            <div className="flex flex-col">
                                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                        <div className="overflow-hidden">
                                            <table className="min-w-full text-left text-sm font-light">
                                            <thead className="border-b font-medium dark:border-neutral-500">
                                                <tr>
                                                <th scope="col" className="px-6 py-4">#</th>
                                                <th scope="col" className="px-6 py-4">Kode</th>
                                                <th scope="col" className="px-6 py-4">Nama</th>
                                                <th scope="col" className="px-6 py-4">Jumlah</th>
                                                <th scope="col" className="px-6 py-4">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {product.map((p) => (
                                                <tr
                                                className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600" key={p.code}>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">{i++}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{p.code}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{p.name}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{p.quantity}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className='flex gap-3'>
                                                            <Button color="warning" onClick={() => handleEditModal(p.code)}>Edit</Button>
                                                            {editProductData && editProductData.code === p.code && (
                                                                <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                                                                    <div className='p-5'>
                                                                        <div className='flex justify-between pb-4 border-b'>
                                                                            <h1 className='text-medium text-xl'>Edit product</h1>
                                                                            <button onClick={() => setShowEditModal(!showEditModal)}>X</button>
                                                                        </div>
                                                                        <div className='my-4 flex items-center justify-center'>
                                                                        <form onSubmit={editProductIdData}>
                                                                            <div className='my-4'>
                                                                                <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                                                    <div className='flex justify-between w-full gap-5'>
                                                                                        <div className='mb-4 w-1/2'>
                                                                                            <InputLabel value="Kode" className='mb-2' htmlFor="kode" />
                                                                                            <TextInput value={editProductData.code} onChange={(e) =>
                                                                                                setEditProductData((prevData) => ({
                                                                                                ...prevData,
                                                                                                code: e.target.value
                                                                                                }))
                                                                                            } className="w-full" id="kode" disabled={true}/>
                                                                                        </div>
                                                                                        <div className='mb-4 w-1/2'>
                                                                                            <InputLabel value="Nama" className='mb-2' htmlFor="nama"/>
                                                                                            <TextInput value={editProductData.name} onChange={(e) =>
                                                                                                setEditProductData((prevData) => ({
                                                                                                ...prevData,
                                                                                                name: e.target.value
                                                                                                }))
                                                                                            } className="w-full" id="nama"/>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className='mb-4 w-full'>
                                                                                        <InputLabel value="Jumlah" className='mb-2' htmlFor="jumlah"/>
                                                                                        <TextInput value={editProductData.quantity} onChange={(e) =>
                                                                                            setEditProductData((prevData) => ({
                                                                                            ...prevData,
                                                                                            quantity: e.target.value
                                                                                            }))
                                                                                        } className="w-full" id="jumlah"/>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='flex justify-end gap-3 mt-6 pt-6 border-t'>
                                                                                <Button color="light" type="button" onClick={() => setShowEditModal(!showEditModal)}>Close</Button>
                                                                                <Button color="success" type="button" onClick={() => editProductIdData(p.code)}>Submit</Button>
                                                                            </div>
                                                                        </form>
                                                                        </div>
                                                                    </div>
                                                                </Modal>
                                                            )}
                                                            <Button color="danger" onClick={() => handleDeleteModal(p.code)}>Delete</Button>
                                                            {deleteProductId && deleteProductId === p.code && (
                                                                <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                                                                    <div className='p-5'>
                                                                        <div className='flex justify-between pb-4 border-b'>
                                                                            <h1 className='text-medium text-xl'>Delete product</h1>
                                                                            <button onClick={() => setShowDeleteModal(!showDeleteModal)}>X</button>
                                                                        </div>
                                                                        <div className='my-4 flex items-center justify-center'>
                                                                            <p className='text-lg'>Are you sure want to delete this product ?</p>
                                                                        </div>
                                                                        <div className='flex justify-end gap-3 mt-6 pt-6 border-t'>
                                                                            <Button color="light" type="button" onClick={() => setShowDeleteModal(!showDeleteModal)}>Close</Button>
                                                                            <Button color="danger" onClick={() => deleteProductData(p.code)}>Delete</Button>
                                                                        </div>
                                                                    </div>
                                                                </Modal>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                                ))}
                                            </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
    );
}

export default ProductIndex;
