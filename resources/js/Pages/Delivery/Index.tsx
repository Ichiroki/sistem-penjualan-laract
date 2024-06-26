import { Delivery } from '@/API/Delivery'
import { Product } from '@/API/Product'
import { Vehicles } from '@/API/Vehicle'
import Button from '@/Components/Button'
import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import Modal from '@/Components/Modal'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import axios from 'axios'
import { useState } from 'react'

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

    const [vehicleId, setVehicleId] = useState('')
    const [kodeProduct, setKodeProduct] = useState('')
    const [targetPengiriman, setTargetPengiriman] = useState('')
    const [actualPengiriman, setActualPengiriman] = useState('')

    const [errorVehicleId, setErrorVehicleId] = useState('')
    const [errorProductCode, setErrorProductCode] = useState('')
    const [errorTargetDelivery, setErrorTargetDelivery] = useState('')
    const [errorActualDelivery, setErrorActualDelivery] = useState('')

    const [selectedProduct, setSelectedProduct] = useState([])

    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [deletePengirimanId, setDeletePengirimanId] = useState(null)

    const resetInput = () => {
        setVehicleId('')
        setKodeProduct('')
        setTargetPengiriman('')
        setActualPengiriman('')
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
                vehicle_id: parseInt(vehicleId),
                product_code: kodeProduct,
                target_delivery: targetPengiriman,
                actual_delivery: actualPengiriman
            }).then((res) =>{
                console.log(res.data)
                getDeliveriesData()
                resetInput()
                setShowCreateModal(false)
            }).catch((e) => {
                if(e.response) {
                    const getError = e.response.data.errors
                    setErrorVehicleId(getError.vehicle_id)
                    setErrorProductCode(getError.product_code)
                    setErrorTargetDelivery(getError.vehicle_id)
                    setErrorActualDelivery(getError.actual_delivery)
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
            .then((res) => {
                const updatePengirimanList = deliveries.filter((p) => p.id !== pengirimanId)
                setDeliveries(updatePengirimanList)
                setDeletePengirimanId(null)
                setShowDeleteModal(false)
            })
        } catch(e) {
            console.error('Internal Server Error, Please Wait' + e)
        }
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
                                            <div className='my-4'>
                                                <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                    <div className='flex  flex-col lg:flex-row justify-between w-full gap-5'>
                                                        <div className='mb-4 w-full lg:w-1/2'>
                                                            <InputLabel value="Vehicle" className='mb-2' htmlFor="vehicle"/>
                                                            <select
                                                            className='w-full outline-none rounded-lg selection::border-slate-900'
                                                            onChange={e => setVehicleId(e.target.value)}
                                                            >
                                                            <InputLabel value="Vehicle" className='mb-2' htmlFor="vehicle" />
                                                                <option value="">Select Vehicle</option>
                                                                {vehicles.map((v) => (
                                                                    <option value={v.id}>{v.number_plates}</option>
                                                                ))}
                                                            </select>
                                                            {errorVehicleId ? (
                                                                <InputError message={errorVehicleId}/>
                                                            ) : (
                                                                <>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className='mb-4 w-full lg:w-1/2'>
                                                            <InputLabel value="Product Code" className='mb-2' htmlFor="productCode"/>
                                                            <select className='w-full outline-none rounded-lg selection::border-slate-900' onChange={(e) => setKodeProduct(e.target.value)}>
                                                                <option value="" key={""} id="productCode">Select Product</option>
                                                                {product.map((p) => (
                                                                    <option value={p.code} key={p.code}>{p.code}</option>
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
                                                    <div className='mb-4 w-full flex justify-between gap-3'>
                                                        <div className='w-1/2'>
                                                            <InputLabel value="Target Pengiriman" className='mb-2' htmlFor="targetPengiriman"/>
                                                            <TextInput type="number" value={targetPengiriman} onChange={(e) => setTargetPengiriman(e.target.value)} className="w-full" id="targetPengiriman"/>
                                                            {errorTargetDelivery ? (
                                                                <InputError message={errorTargetDelivery}/>
                                                            ) : (
                                                                <>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className='w-1/2'>
                                                            <InputLabel value="Actual Pengiriman" className='mb-2' htmlFor="actualPengiriman"/>
                                                            <TextInput type="number" value={actualPengiriman} onChange={(e) => setActualPengiriman(e.target.value)} className="w-full" id="actualPengiriman"/>
                                                            {errorActualDelivery ? (
                                                                <InputError message={errorActualDelivery}/>
                                                            ) : (
                                                                <>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
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
