import { Delivery } from '@/API/Delivery'
import { Product } from '@/API/Product'
import { Vehicles } from '@/API/Vehicle'
import Button from '@/Components/Button'
import InputLabel from '@/Components/InputLabel'
import Modal from '@/Components/Modal'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import axios from 'axios'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'

interface Product {
    id: number
    code?: string
    quantity?: number
}

function DeliveryIndex({auth}) {
    let i = 1

    const {
        deliveries,
        setDeliveries,
        search,
        setSearch,
        getDeliveriesData
    } = Delivery()

    const {
        product,
    } = Product()

    const {
        vehicles
    } = Vehicles()

    const [showCreateModal, setShowCreateModal] = useState(false)

    const [invoice, setInvoice] = useState('')
    const [namaPengirim, setNamaPengirim] = useState('')
    const [namaKustomer, setNamaKustomer] = useState('')
    const [alamatKustomer, setAlamatKustomer] = useState('')
    const [platNomor, setPlatNomor] = useState('')
    const [batchNumber, setBatchNumber] = useState('')

    const [productField, setProductField] = useState([{
        id:'',
        code: '',
        quantity: '',
    }])

    const [errorVehicleId, setErrorVehicleId] = useState('')
    const [errorProductCode, setErrorProductCode] = useState('')
    const [errorTargetDelivery, setErrorTargetDelivery] = useState('')
    const [errorActualDelivery, setErrorActualDelivery] = useState('')

    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [deletePengirimanId, setDeletePengirimanId] = useState(null)

    const resetInput = () => {
        setInvoice('')
        setNamaPengirim('')
        setNamaKustomer('')
        setAlamatKustomer('')
        setPlatNomor('')
        setBatchNumber('')
    }

    const handleEditModal = (pengirimanId) => {
        const selectedPengiriman: any = deliveries.find((p) => p.id === pengirimanId)
        setEditPengirimanData(selectedPengiriman)
        setShowEditModal(!showEditModal)
    }

    const handleDeleteModal = (pengirimanId) => {
        setDeletePengirimanId(pengirimanId)
        setShowDeleteModal(!showDeleteModal)
    }

    const [editPengirimanData, setEditPengirimanData] = useState({
        id: 0,
        vehicle_id: '',
        product_code: '',
        target_delivery: '',
        actual_delivery: ''
    })

    let createPengirimanData = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/deliveries',
            {
                delivery_invoice: invoice,
                delivery_name: namaPengirim,
                customer_name: namaKustomer,
                customer_address: alamatKustomer,
                number_plates: platNomor,
                batch_number: batchNumber,
                products: productField,
            }).then((res) =>{
                console.log(res)
                getDeliveriesData()
                resetInput()
                setShowCreateModal(false)
            }).catch((e) => {
                if(e.response) {
                    console.log(e.response)
                    const getError = e.response.data.errors

                    setErrorVehicleId(getError.vehicle_id[0])
                    setErrorProductCode(getError.product_code[0])
                    setErrorTargetDelivery(getError.target_delivery[0])
                    setErrorActualDelivery(getError.actual_delivery[0])
                }
            })
        } catch(e) {
            console.error('Internal server error, please wait')
        }
    }

    let editPengirimanIdData = async (deliveryId) => {
        try {
            await axios.put(`/deliveries/${deliveryId}`, {
                vehicle_id : editPengirimanData.vehicle_id,
                product_code : editPengirimanData.product_code,
                target_delivery : editPengirimanData.target_delivery,
                actual_delivery : editPengirimanData.actual_delivery
            })
            .then(() => {
                getDeliveriesData()
                resetInput()
                setShowEditModal(false)
            })
            .catch((e) => {
                console.error(e)
            })
        } catch(e) {
            if(e){
                console.log(e)
            }
        }
    }

    let deletePengirimanData = async (pengirimanId) => {
        try {
            await axios.delete(`/deliveries/${deletePengirimanId}`)
            .then(() => {
                const updatePengirimanList = deliveries.filter((p) => p.id !== pengirimanId)
                setDeliveries(updatePengirimanList)
                setDeletePengirimanId(null)
                setShowDeleteModal(false)
            })
        } catch(e) {
            console.error('Internal Server Error, Please Wait' + e)
        }
    }

    const addFields = () => {
        let newFields = { id:'', code: '', quantity: '' }

        setProductField([...productField, newFields])
    }

    const handleFormChange = (index: number, event: ChangeEvent<HTMLInputElement>|ChangeEvent<HTMLSelectElement>) => {
        let data = [...productField]
        let {name, value} = event.target
        data[index] = {...data[index], [name]: value}
        setProductField(data)
    }

    const removeField = (index) => {
        let data = [...productField]
        data.splice(index, 1)
        setProductField(data)
    }

    return (
            <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Deliveries</h2>}
            >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className='flex justify-between mb-6'>
                                <TextInput placeholder={'Search here...'} value={search} onChange={(e) => setSearch(e.target.value)} />
                                <Button onClick={() => setShowCreateModal(!showCreateModal)}>Create</Button>
                                <Modal show={showCreateModal} onClose={() => {
                                    resetInput();
                                    setShowCreateModal(false)
                                }}>
                                    <div className='p-5'>
                                        <div className='flex justify-between pb-4 border-b'>
                                            <h1 className='text-medium text-xl'>Create Pengiriman</h1>
                                            <button onClick={() => setShowCreateModal(!showCreateModal)}>X</button>
                                        </div>
                                        <form onSubmit={createPengirimanData}>
                                            <div className='my-4 overflow-y-scroll scrollbar-hide h-96'>
                                                <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                    <div className='flex flex-col lg:flex-row justify-between w-full gap-5'>
                                                        <div className='mb-4 w-full'>
                                                            <InputLabel value="Delivery Invoice" className='mb-2' htmlFor="delivery_invoice"/>
                                                            <TextInput id="delivery_invoice" className='w-full' onChange={(e) => setInvoice(e.target.value)}/>
                                                        </div>
                                                        <div className='mb-4 w-full'>
                                                            <InputLabel value="Delivery Name" className='mb-2' htmlFor="delivery_name"/>
                                                            <TextInput id="delivery_name" className='w-full' onChange={(e) => setNamaPengirim(e.target.value)}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                    <div className='flex flex-col lg:flex-row justify-between w-full gap-5'>
                                                        <div className='mb-4 w-full'>
                                                            <InputLabel value="Customer Name" className='mb-2' htmlFor="customer_name"/>
                                                            <TextInput id="customer_name" className='w-full' onChange={(e) => setNamaKustomer(e.target.value)}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                    <div className='flex flex-col lg:flex-row justify-between w-full gap-5'>
                                                        <div className='mb-4 w-full'>
                                                            <InputLabel value="Customer Address" className='mb-2' htmlFor="customer_address"/>
                                                            <textarea
                                                            name='customer_address'
                                                            id="customer_address"
                                                            onChange={(e) => {setAlamatKustomer(e.target.value)}}
                                                            className='block font-medium text-sm text-gray-700 w-full outline-none border-gray-300 rounded-lg'
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                    <div className='flex flex-col lg:flex-row justify-between w-full gap-5'>
                                                        <div className='mb-4 w-full'>
                                                            <InputLabel value="Number Plates" className='mb-2' htmlFor="plat_nomor"/>
                                                            <TextInput id="plat_nomor" className='w-full' onChange={(e) => setPlatNomor(e.target.value)}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                    <div className='flex flex-col lg:flex-row justify-between w-full gap-5'>
                                                        <div className='mb-4 w-full'>
                                                            <InputLabel value="Batch Number" className='mb-2' htmlFor="batch_number"/>
                                                            <TextInput id="batch_number" className='w-full' onChange={(e) => setBatchNumber(e.target.value)}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                {productField.map((input, index) =>
                                                <>
                                                    <div className='mb-4 w-full' key={index}>
                                                        <InputLabel children={`Product ${index + 1}`} htmlFor={`product-${index + 1}`}/>
                                                        <select name={`code`} id={`product-${index + 1}`} className='w-full border-gray-400 rounded-md outline-none' onChange={event => handleFormChange(index, event)}>
                                                            <option value="">Select Product</option>
                                                            {product.map((p) =>
                                                                <option value={p.code}>{`${p.name} (${p.code})`}</option>
                                                            )}
                                                        </select>
                                                    </div>
                                                    <div className='mb-4 w-full'>
                                                        <InputLabel children={`Quantity-${index + 1}`} htmlFor={`Quantity-${index + 1}`}/>
                                                        <TextInput className="w-full" id={`Quantity-${index + 1}`} name="quantity" onChange={event => handleFormChange(index, event)}/>
                                                    </div>
                                                    <Button children={`-`} color='danger' onClick={() => removeField(index)}/>
                                                </>
                                                )}
                                                    <Button children={`+`} color='success' onClick={addFields}/>
                                                </div>
                                            </div>
                                            <div className='flex justify-end gap-3 mt-6 pt-6 border-t'>
                                                <Button color="light" type="button" onClick={() =>{
                                                    resetInput();
                                                    setShowCreateModal(!showCreateModal)
                                                }}>Close</Button>
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
                                                    <th scope="col" className="px-6 py-4">Number Plates</th>
                                                    <th scope="col" className="px-6 py-4">Vehicle Type</th>
                                                    <th scope="col" className='px-6 py-4'>Product Code</th>
                                                    <th scope="col" className='px-6 py-4'>Product Name</th>
                                                    <th scope="col" className="px-6 py-4">Target Package</th>
                                                    <th scope="col" className="px-6 py-4">Actual Package</th>
                                                    <th scope="col" className="px-6 py-4">Percentage</th>
                                                    <th scope="col" className="px-6 py-4">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {deliveries && deliveries.map((p) => (
                                                    <tr
                                                    className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600" key={p.id}>
                                                        <td className="whitespace-nowrap px-6 py-4 font-medium">{i++}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{p.vehicle.number_plates}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{p.vehicle.vehicle_type}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{p.product[0].code}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{p.product[0].name}</td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-center">{p.target_delivery}</td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-center">{p.actual_delivery}</td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-center">{Math.ceil(p.percentage) + ' %'}</td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-center">
                                                            <div className='flex gap-3'>
                                                                <Button color="warning" onClick={() => handleEditModal(p.id)}>Edit</Button>
                                                                {editPengirimanData && editPengirimanData.id === p.id && (
                                                                    <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                                                                        <div className='p-5'>
                                                                            <div className='flex justify-between pb-4 border-b'>
                                                                                <h1 className='text-medium text-xl'>Edit Pengiriman</h1>
                                                                                <button onClick={() => setShowEditModal(!showEditModal)}>X</button>
                                                                            </div>
                                                                            <div className='my-4 flex items-center justify-center'>
                                                                            <form onSubmit={editPengirimanIdData}>
                                                                                <div className='my-4'>
                                                                                    <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                                                        <div className='mb-4 w-full lg:w-1/2'>
                                                                                            <InputLabel value="Vehicle" className='mb-2' htmlFor="vehicle"/>
                                                                                            <select className='w-full outline-none rounded-lg selection::border-slate-900' onChange={(e) => setEditPengirimanData((prevData) => ({
                                                                                                ...prevData,
                                                                                                vehicle_id: e.target.value
                                                                                            }))}>
                                                                                                {vehicles.map((v) => (
                                                                                                    <option value={v.id} key={v.id} selected={parseInt(editPengirimanData.vehicle_id) === v.id}>{v.number_plates}</option>
                                                                                                ))}
                                                                                            </select>
                                                                                        </div>
                                                                                        <div className='mb-4 w-full'>
                                                                                            <InputLabel value="Product Code" className='mb-2' htmlFor="productCode"/>
                                                                                            <select className='w-full outline-none rounded-lg selection::border-slate-900' onChange={(e) => setEditPengirimanData((prevData) => ({
                                                                                                ...prevData,
                                                                                                product_code: e.target.value
                                                                                            }))}>
                                                                                                {product.map((p) => (
                                                                                                    <option value={p.code} key={p.code} selected={editPengirimanData.product_code === p.code}>{p.name}</option>
                                                                                                ))}
                                                                                            </select>
                                                                                        </div>
                                                                                        <div className='mb-4 w-full flex justify-between gap-5'>
                                                                                            <div className='w-1/2'>
                                                                                                <InputLabel value="Target Pengiriman" className='mb-2' htmlFor="targetPengiriman"/>
                                                                                                <TextInput value={editPengirimanData.target_delivery} onChange={(e) =>
                                                                                                    setEditPengirimanData((prevData) => ({
                                                                                                    ...prevData,
                                                                                                    target_delivery: e.target.value
                                                                                                    }))
                                                                                                } className="w-full" id="targetPengiriman"/>
                                                                                            </div>
                                                                                            <div className='w-1/2'>
                                                                                                <InputLabel value="Actual Pengiriman" className='mb-2' htmlFor="actualPengiriman"/>
                                                                                                <TextInput value={editPengirimanData.actual_delivery} onChange={(e) =>
                                                                                                    setEditPengirimanData((prevData) => ({
                                                                                                    ...prevData,
                                                                                                    actual_delivery: e.target.value
                                                                                                    }))
                                                                                                } className="w-full" id="actualDelivery"/>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='mb-4 w-full flex justify-between gap-5'>
                                                                                            <div className='w-1/2'>
                                                                                                <InputLabel value="Batch Number" className='mb-2' htmlFor="batch_number"/>
                                                                                                <TextInput value={editPengirimanData.target_delivery} onChange={(e) =>
                                                                                                    setBatchNumber(e.target.value)
                                                                                                } className="w-full" id="batch_number"/>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='flex justify-end gap-3 mt-6 pt-6 border-t'>
                                                                                    <Button color="light" type="button" onClick={() => setShowEditModal(!showEditModal)}>Close</Button>
                                                                                    <Button color="success" type="button" onClick={() => editPengirimanIdData(p.id)}>Submit</Button>
                                                                                </div>
                                                                            </form>
                                                                            </div>
                                                                        </div>
                                                                    </Modal>
                                                                )}
                                                                <Button color="danger" onClick={() => handleDeleteModal(p.id)}>Delete</Button>
                                                                {deletePengirimanId && deletePengirimanId === p.id && (
                                                                    <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                                                                        <div className='p-5'>
                                                                            <div className='flex justify-between pb-4 border-b'>
                                                                                <h1 className='text-medium text-xl'>Delete pengiriman</h1>
                                                                                <button onClick={() => setShowDeleteModal(!showDeleteModal)}>X</button>
                                                                            </div>
                                                                            <div className='my-4 flex items-center justify-center'>
                                                                                <p className='text-lg'>Are you sure want to delete this pengiriman ?</p>
                                                                            </div>
                                                                            <div className='flex justify-end gap-3 mt-6 pt-6 border-t'>
                                                                                <Button color="light" type="button" onClick={() => setShowDeleteModal(!showDeleteModal)}>Close</Button>
                                                                                <Button color="danger" onClick={() => deletePengirimanData(p.id)}>Delete</Button>
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

export default DeliveryIndex
