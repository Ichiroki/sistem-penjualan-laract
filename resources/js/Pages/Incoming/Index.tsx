import { Product } from '@/API/Product'
import Button from '@/Components/Button'
import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import Modal from '@/Components/Modal'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { useState } from 'react'
import axios from 'axios'
import { Incoming } from '@/API/Incoming'
import { Delivery } from '@/API/Delivery'

function ProductIndex({auth}) {

    let i = 1

    const {
        incomings,
        setIncomings,
        search,
        setSearch,
        getIncomingsData
    } = Incoming()

    const {
        deliveries
    } = Delivery()

    const {
        product
    } = Product()

    console.log(incomings)

    const [errorInputDate, setErrorInputDate] = useState('')
    const [errorDeliveryId, setErrorDeliveryId] = useState('')
    const [errorProductCode, setErrorProductCode] = useState('')

    const [inputDate, setInputDate] = useState('')
    const [deliveryId, setDeliveryId] = useState(1)
    const [productCode, setProductCode] = useState('')

    const resetInput = () => {
        setInputDate('')
        setDeliveryId(1)
        setProductCode('')
    }

    const [editIncomingData, setEditIncomingData] = useState({
        id: 0,
        input_date: '',
        number_plates: '',
        delivery_id: 0,
        product_code: '',
    })

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [deleteProductId, setDeleteProductId] = useState(null)

    const handleEditModal = (productId) => {
        const selectedProduct: any = incomings.find((p) => p.id === productId)
        setEditIncomingData(selectedProduct)
        setShowEditModal(!showEditModal)
    }

    const handleDeleteModal = (productId) => {
        setDeleteProductId(productId)
        setShowDeleteModal(!showDeleteModal)
    }

    let createIncomingData = async (e) => {
        e.preventDefault()
        try {
            axios.post('/incomings',
            {
                input_date: inputDate,
                delivery_id: deliveryId,
                product_code: productCode
            })
            .then((res) => {
                console.log(res.data)
                resetInput()
                getIncomingsData()
                setShowCreateModal(false)
            })
            .catch((error) => {
                console.log(error)
                if(error.response) {
                    const getError = error.response.data.errors

                    // Error message
                    setErrorInputDate(getError.input_date[0])
                    setErrorDeliveryId(getError.delivery_id[0])
                    setErrorProductCode(getError.product_code[0])
                    //
                }
            })
        } catch(e) {
            console.error('Internal server error, please wait')
        }
    }

    let editIncomingIdData = async (productId) => {
        try {
            await axios.put(`/incomings/${productId}`, {
                input_date : editIncomingData.input_date,
                delivery_id : editIncomingData.delivery_id,
                product_code : editIncomingData.product_code
            })
            .then(() => {
                resetInput()
                setShowEditModal(false)
                getIncomingsData()
            })
            .catch((error) => {
                if(error.response) {
                    const getError = error.response.data.errors
                    console.log(error.response)
                    setErrorInputDate(getError.input_date[0])
                    setErrorDeliveryId(getError.delivery_id[0])
                    setErrorProductCode(getError.product_code[0])
                }
            })
        } catch(e) {
            console.error('Internal server error, please wait' + e)
        }
    }

    let deleteIncomingData = async (productId) => {
        try {
            await axios.delete(`/incomings/${productId}`)
            .then(() => {
                const updateProductList = incomings.filter((p) => p.id !== productId)
                setIncomings(updateProductList)
                setDeleteProductId(null)
                setShowDeleteModal(false)
            })
        } catch(e) {
            console.error('Internal Server Error, Please Wait' + e)
        }
    }

    return (
        <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Incoming</h2>}
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
                                        <h1 className='text-medium text-xl'>Create Incoming</h1>
                                        <button onClick={() => setShowCreateModal(!showCreateModal)}>X</button>
                                    </div>
                                    <form onSubmit={createIncomingData}>
                                        <div className='my-4'>
                                            <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                <div className='mb-4 w-full'>
                                                    <InputLabel value="Input Date" className='mb-2' htmlFor="Input Date"/>
                                                    <TextInput type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} className={errorInputDate ? "w-full border-pink-700 text-pink-700 focus:border-pink-700 focus:ring-pink-700" : "w-full"} id="nama"/>
                                                    {errorInputDate ? (
                                                        <InputError message={errorInputDate}/>
                                                    ) : (
                                                        <>
                                                        </>
                                                    )}
                                                </div>
                                                <div className='flex justify-between w-full gap-5'>
                                                    <div className='mb-4 w-full'>
                                                        <InputLabel value="Plat Nomor" className='mb-2' htmlFor="delivery_id"/>
                                                        <select id="delivery_id" className='w-full outline-none rounded-lg selection::border-slate-900' onChange={(e) => setDeliveryId(parseInt(e.target.value))}>
                                                            <option value="" key="">Select Vehicle</option>
                                                            {deliveries.map((p) => (
                                                                <option value={p.id} key={p.id}>{p.number_plates}</option>
                                                            ))}
                                                        </select>
                                                        {errorDeliveryId ? (
                                                            <InputError message={errorDeliveryId}/>
                                                        ) : (
                                                            <>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className='mb-4 w-full'>
                                                        <InputLabel value="Kode Produk" className='mb-2' htmlFor="productCode"/>
                                                        <select className='w-full outline-none rounded-lg selection::border-slate-900' id="productCode" onChange={(e) => setProductCode(e.target.value)}>
                                                            <option value="" key="">Select Product</option>
                                                            {product.map((p) => (
                                                                <option value={p.code} key={p.code}>{p.name}</option>
                                                            ))}
                                                        </select>
                                                        {errorProductCode ? (
                                                            <InputError message={errorProductCode}/>
                                                        ) : (
                                                            <>
                                                            </>
                                                        )}
                                                    </div>
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
                                                <th scope="col" className="px-6 py-4">Tanggal Masuk</th>
                                                <th scope="col" className="px-6 py-4">Plat Nomor</th>
                                                <th scope="col" className="px-6 py-4">Kode Produk</th>
                                                <th scope="col" className="px-6 py-4">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {incomings.map((d) => (
                                                <tr
                                                className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600" key={d.id}>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">{i++}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{d.input_date}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{d.delivery[0].vehicle.number_plates}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{d.product[0].code}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className='flex gap-3'>
                                                            <Button color="warning" onClick={() => handleEditModal(d.id)}>Edit</Button>
                                                            {editIncomingData && editIncomingData.id === d.id && (
                                                                <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                                                                    <div className='p-5'>
                                                                        <div className='flex justify-between pb-4 border-b'>
                                                                            <h1 className='text-medium text-xl'>Edit product</h1>
                                                                            <button onClick={() => setShowEditModal(!showEditModal)}>X</button>
                                                                        </div>
                                                                        <form onSubmit={editIncomingIdData}>
                                                                            <div className='my-4'>
                                                                                <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                                                    <div className='mb-4 w-full'>
                                                                                            <InputLabel value="Input Date" className='mb-2' htmlFor="Input Date"/>
                                                                                            <TextInput type="date" value={editIncomingData.input_date} onChange={(e) => setEditIncomingData((prevData) => ({
                                                                                                ...prevData,
                                                                                                input_date: e.target.value
                                                                                            }))} className={errorInputDate ? "w-full border-pink-700 text-pink-700 focus:border-pink-700 focus:ring-pink-700" : "w-full"} id="nama"/>
                                                                                            {errorInputDate ? (
                                                                                                <InputError message={errorInputDate}/>
                                                                                            ) : (
                                                                                                <>
                                                                                                </>
                                                                                            )}
                                                                                    </div>
                                                                                    <div className='flex justify-between w-full gap-5'>

                                                                                        <div className='mb-4 w-full'>
                                                                                            <InputLabel value="Plat Nomor" className='mb-2' htmlFor="delivery_id"/>
                                                                                            <select id="delivery_id" className='w-full outline-none rounded-lg selection::border-slate-900' onChange={(e) => setEditIncomingData((prevData) => ({
                                                                                                ...prevData,
                                                                                                delivery_id: parseInt(e.target.value)
                                                                                            }))}>
                                                                                                <option value="" key="">Select Vehicle</option>
                                                                                                {deliveries.map((p) => (
                                                                                                    <option value={p.id} key={p.id} selected={editIncomingData.delivery_id === p.id}>{p.number_plates}</option>
                                                                                                ))}
                                                                                            </select>
                                                                                            {errorDeliveryId ? (
                                                                                                <InputError message={errorDeliveryId}/>
                                                                                            ) : (
                                                                                                <>
                                                                                                </>
                                                                                            )}
                                                                                        </div>
                                                                                        <div className='mb-4 w-full'>
                                                                                            <InputLabel value="Kode Produk" className='mb-2' htmlFor="productCode"/>
                                                                                            <select className='w-full outline-none rounded-lg selection::border-slate-900' id="productCode" onChange={(e) => setEditIncomingData((prevData) => ({
                                                                                                ...prevData,
                                                                                                product_code: e.target.value
                                                                                            }))}>
                                                                                                <option value="" key="">Select Product</option>
                                                                                                {product.map((p) => (
                                                                                                    <option value={p.code} key={p.code} selected={editIncomingData.product_code === p.code}>{p.name}</option>
                                                                                                ))}
                                                                                            </select>
                                                                                            {errorProductCode ? (
                                                                                                <InputError message={errorProductCode}/>
                                                                                            ) : (
                                                                                                <>
                                                                                                </>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='flex justify-end gap-3 mt-6 pt-6 border-t'>
                                                                                <Button color="light" type="button" onClick={() => setShowEditModal(!showEditModal)}>Close</Button>
                                                                                <Button color="success" type="button" onClick={() => editIncomingIdData(d.id)}>Submit</Button>
                                                                            </div>
                                                                        </form>
                                                                        </div>
                                                                </Modal>
                                                            )}
                                                            <Button color="danger" onClick={() => handleDeleteModal(d.id)}>Delete</Button>
                                                            {deleteProductId && deleteProductId === d.id && (
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
                                                                            <Button color="danger" onClick={() => deleteIncomingData(d.id)}>Delete</Button>
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
