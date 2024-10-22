import { Delivery } from '@/API/Delivery'
import { Product } from '@/API/Product'
import { Retur } from '@/API/Retur'
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

interface ReturType {
    retur: {
        retur_invoice: string,
        retur_name: string,
        customer_name: string
        customer_address: string
        batch_number: string,
        date_retur: Date | undefined,
        time_retur: Date,
    }
    details: [] | any
}

function ReturIndex({auth}) {
    let i = 1

    const {
        returs,
        setReturs,
        search,
        setSearch,
        getRetursData
    } = Retur()

    const {
        product,
    } = Product()

    const {
        vehicles
    } = Vehicles()

    const [showCreateModal, setShowCreateModal] = useState(false)

    const [invoice, setInvoice] = useState('')
    const [namaRetur, setNamaRetur] = useState('')
    const [namaKustomer, setNamaKustomer] = useState('')
    const [alamatKustomer, setAlamatKustomer] = useState('')
    const [platNomor, setPlatNomor] = useState('')
    const [batchNumber, setBatchNumber] = useState('')

    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)

    const [deleteReturId, setDeleteReturId] = useState(null)

    const [detailReturId, setDetailReturId] = useState<ReturType | null>(null)

    const resetInput = () => {
        setInvoice('')
        setNamaRetur('')
        setNamaKustomer('')
        setAlamatKustomer('')
        setPlatNomor('')
        setBatchNumber('')
    }

    const handleEditModal = (invoice) => {
        const selectedRetur: any = returs.find((r) => r.retur_invoice === invoice)
        setEditReturData(selectedRetur)
        setShowEditModal(!showEditModal)
    }

    const handleDeleteModal = (returId) => {
        setDeleteReturId(returId)
        setShowDeleteModal(!showDeleteModal)
    }

    const [editReturData, setEditReturData] = useState({
        invoice: '',
        retur_name: '',
        customer_name: '',
        customer_address: '',
        batch_number: '',
    })

    let createReturData = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/returs',
            {
                retur_invoice: invoice,
                retur_name: namaRetur,
                customer_name: namaKustomer,
                customer_address: alamatKustomer,
                number_plate: platNomor,
                batch_number: batchNumber,
                products: productField,
            }).then((res) =>{
                console.log(res)
                getRetursData()
                resetInput()
                setShowCreateModal(false)
            }).catch((e) => {
                if(e.response) {
                    console.log(e.response)
                    const getError = e.response.data.errors

                    // setErrorVehicleId(getError.vehicle_id[0])
                    // setErrorProductCode(getError.product_code[0])
                    // setErrorTargetDelivery(getError.target_delivery[0])
                    // setErrorActualDelivery(getError.actual_delivery[0])
                }
            })
        } catch(e) {
            console.error('Internal server error, please wait')
        }
    }

    let detailPengirimanData = async (invoice) => {
        try {
            await axios.get(`/returs/${invoice}`)
            .then((res) => {
                setDetailReturId(res.data)
                setShowDetailModal(true)
            })
        } catch(e) {
            console.log(e)
        }
    }

    // let editPengirimanIdData = async (deliveryId) => {
    //     try {
    //         await axios.put(`/deliveries/${deliveryId}`, {
    //             vehicle_id : editReturData.inv,
    //             product_code : editReturData.product_code,
    //             target_delivery : editReturData.target_delivery,
    //             actual_delivery : editReturData.actual_delivery
    //         })
    //         .then(() => {
    //             getRetursData()
    //             resetInput()
    //             setShowEditModal(false)
    //         })
    //         .catch((e) => {
    //             console.error(e)
    //         })
    //     } catch(e) {
    //         if(e){
    //             console.log(e)
    //         }
    //     }
    // }

    let deletePengirimanData = async (invoice) => {
        try {
            await axios.delete(`/returs/${invoice}`)
            .then(() => {
                const updatePengirimanList = returs.filter((r) => r.retur_invoice !== invoice)
                setReturs(updatePengirimanList)
                setDeleteReturId(null)
                setShowDeleteModal(false)
            })
        } catch(e) {
            console.error('Internal Server Error, Please Wait' + e)
        }
    }

    // State for add form input

    const [productField, setProductField] = useState([{
        code: '',
        name: '',
        quantity: '',
    }])

    // Function to add input

    const addFields = () => {
        let newFields = { code:'', name: '', quantity: '' }

        setProductField([...productField, newFields])
    }

    // Function for handle change for input value

    const handleFormChange = (index: number, event: ChangeEvent<HTMLInputElement>|ChangeEvent<HTMLSelectElement>) => {
        let data = [...productField]
        let {name, value} = event.target
        data[index] = {...data[index], [name]: value}
        setProductField(data)
    }

    // Function to remove one input

    const removeField = (index) => {
        let data = [...productField]
        data.splice(index, 1)
        setProductField(data)
    }

    return (
            <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Retur</h2>}
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
                                            <h1 className='text-medium text-xl'>Create Retur</h1>
                                            <button onClick={() => setShowCreateModal(!showCreateModal)}>X</button>
                                        </div>
                                        <form onSubmit={createReturData}>
                                            <div className='my-4 overflow-y-scroll scrollbar-hide h-96'>
                                                <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                    <div className='flex flex-col lg:flex-row justify-between w-full gap-5'>
                                                        <div className='mb-4 w-full'>
                                                            <InputLabel value="Retur Invoice" className='mb-2' htmlFor="retur_invoice"/>
                                                            <TextInput id="retur_invoice" className='w-full' onChange={(e) => setInvoice(e.target.value)}/>
                                                        </div>
                                                        <div className='mb-4 w-full'>
                                                            <InputLabel value="Retur Name" className='mb-2' htmlFor="retur_name"/>
                                                            <TextInput id="retur_name" className='w-full' onChange={(e) => setNamaRetur(e.target.value)}/>
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
                                                            <select id="plat_nomor" onChange={e => setPlatNomor(e.target.value)} className='border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full'>
                                                                <option value="">Select Product</option>
                                                                {vehicles.map((p) =>
                                                                    <option value={p.number_plates}>{`${p.number_plates} (${p.vehicle_type})`}</option>
                                                                )}
                                                            </select>
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
                                                        <select name={`code`} id={`product-${index + 1}`} className='border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full' onChange={event => handleFormChange(index, event)}>
                                                            <option value="">Select Product</option>
                                                            {product.map((p) =>
                                                                <option value={p.code}>{`${p.name} (${p.code})`}</option>
                                                            )}
                                                        </select>
                                                    </div>
                                                    <div className='mb-4 w-full'>
                                                        <InputLabel children={`Quantity ${index + 1}`} htmlFor={`Quantity ${index + 1}`}/>
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
                                                    <th scope="col" className="px-6 py-4">Retur Invoice</th>
                                                    <th scope="col" className="px-6 py-4">Retur Name</th>
                                                    <th scope="col" className="px-6 py-4">Customer Name</th>
                                                    <th scope="col" className="px-6 py-4">Customer Address</th>
                                                    <th scope="col" className="px-6 py-4">Batch Number</th>
                                                    <th scope="col" className="px-6 py-4">Retur Date</th>
                                                    <th scope="col" className="px-6 py-4">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {returs && returs.map((r) => (
                                                    <tr
                                                    className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600" key={r.retur_invoice}>
                                                        <td className="whitespace-nowrap px-6 py-4 font-medium">{i++}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{r.retur_invoice}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{r.retur_name}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{r.customer_name}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{r.customer_address}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{r.batch_number}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{`${r.date_retur}` + ` ${r.time_retur}`}</td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-center">
                                                            <div className='flex gap-3'>
                                                                <Button color="primary" onClick={() => detailPengirimanData(r.retur_invoice)}>Detail</Button>
                                                                {detailReturId && (
                                                                    <Modal show={showDetailModal} onClose={() => {
                                                                        resetInput();
                                                                        setShowDetailModal(false)
                                                                    }}>
                                                                        <div className='p-5'>
                                                                            <div className='flex justify-between pb-4 border-b'>
                                                                                <h1 className='text-medium text-xl w-6/12 lg:w-full'>Detail Retur</h1>
                                                                                <button onClick={() => setShowDetailModal(!showDetailModal)}>X</button>
                                                                            </div>
                                                                            <div className='my-4 flex flex-col'>
                                                                                <div className='flex gap-3'>
                                                                                    <h1 className="w-6/12">Invoice</h1>
                                                                                    <p>:</p>
                                                                                    <p className="w-6/12">{detailReturId?.retur.retur_invoice}</p>
                                                                                </div>
                                                                                <div className='flex gap-3'>
                                                                                    <h1 className="w-6/12">Retur Name</h1>
                                                                                    <p>:</p>
                                                                                    <p className="w-6/12">{detailReturId?.retur.retur_name}</p>
                                                                                </div>
                                                                                <div className='flex gap-3'>
                                                                                    <h1 className="w-6/12">Customer Name</h1>
                                                                                    <p>:</p>
                                                                                    <p className="w-6/12">{detailReturId?.retur.customer_name}</p>
                                                                                </div>
                                                                                <div className='flex gap-3'>
                                                                                    <h1 className="w-6/12">Address</h1>
                                                                                    <p>:</p>
                                                                                    <p className="w-6/12">{detailReturId?.retur.customer_address}</p>
                                                                                </div>
                                                                                <div className='flex gap-3'>
                                                                                    <h1 className="w-6/12">Date Retur</h1>
                                                                                    <p>:</p>
                                                                                    <p className="w-6/12">{`${detailReturId?.retur.date_retur}`}</p>
                                                                                </div>
                                                                                <div className='flex gap-3'>
                                                                                    <h1 className="w-6/12">Time Retur</h1>
                                                                                    <p>:</p>
                                                                                    <p className="w-6/12">{` ${detailReturId?.retur.time_retur}`}</p>
                                                                                </div>
                                                                                <table className="mt-5">
                                                                                    <thead>
                                                                                        <tr className='border'>
                                                                                            <td className="p-2">No</td>
                                                                                            <td className="p-2">Product Code</td>
                                                                                            <td className="p-2">Product Name</td>
                                                                                            <td className="p-2">Quantity</td>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                    {detailReturId.details.map((d, i) => (
                                                                                        <tr className={i % 2 === 1 ? 'border' : 'border bg-gray-200'}>
                                                                                            <td className="p-2">{i + 1}</td>
                                                                                            <td className="p-2">{d.product_code}</td>
                                                                                            <td className="p-2">{d.product_name}</td>
                                                                                            <td className="p-2">{d.quantity}</td>
                                                                                        </tr>
                                                                                    ))}
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    </Modal>
                                                                )}
                                                                {/* <Button color="warning" onClick={() => handleEditModal(r.retur_invoice)}>Edit</Button> */}
                                                                {editReturData && editReturData.invoice === r.retur_invoice && (
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
                                                                <Button color="danger" onClick={() => handleDeleteModal(r.retur_invoice)}>Delete</Button>
                                                                {deleteReturId && deleteReturId === r.retur_invoice && (
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
                                                                                <Button color="danger" onClick={() => deletePengirimanData(r.retur_invoice)}>Delete</Button>
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

export default ReturIndex
