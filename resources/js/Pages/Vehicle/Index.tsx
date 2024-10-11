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

function VehicleIndex({auth}) {

    let i = 1

    const { vehicles, setVehicles, search, setSearch, getVehiclesData } = Vehicles()

    const [errorNumberPlates, setErrorNumberPlates] = useState('')
    const [errorVehicleType, setErrorVehicleType] = useState('')

    const [numberPlates, setNumberPlates] = useState('')
    const [vehicleType, setVehicleType] = useState('')


    const resetInput = () => {
        setNumberPlates('')
        setVehicleType('')
    }

    const [editVehicleData, setEditVehicleData] = useState({
        id: 0,
        number_plates: '',
        vehicle_type: '',
    })

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [deleteVehicleId, setDeleteVehicleId] = useState(null)

    const handleEditModal = (vehicleId) => {
        const selectedVehicle: any = vehicles.find((v) => v.id === vehicleId)
        setEditVehicleData(selectedVehicle)
        setShowEditModal(!showEditModal)
    }

    const handleDeleteModal = (vehicleId) => {
        setDeleteVehicleId(vehicleId)
        setShowDeleteModal(!showDeleteModal)
    }

    let createVehicleData = async (e) => {
        e.preventDefault()
        try {
            axios.post('/vehicles',
            {
                number_plates: numberPlates,
                vehicle_type: vehicleType,
            })
            .then(() => {
                resetInput()
                getVehiclesData()
                setShowCreateModal(false)
            })
            .catch((error) => {
                console.log(error)
                if(error.response) {
                    const getError = error.response.data.errors
                    // Error message
                    setErrorNumberPlates(getError.number_plates[0])
                    setErrorVehicleType(getError.vehicle_type[0])
                    //
                }
            })
        } catch(e) { console.error('Internal server error, please wait') }
    }

    let editVehicleIdData = async (vehicleId) => {
        try {
            await axios.put(`/vehicles/${vehicleId}`, {
                number_plates : editVehicleData.number_plates,
                vehicle_type : editVehicleData.vehicle_type,
            })
            .then(() => {
                getVehiclesData()
                resetInput()
                setShowEditModal(false)
            })
            .catch((error) => {
                if(error.response) {
                    const getError = error.response.data.errors
                    setErrorNumberPlates(getError.number_plates[0])
                    setErrorVehicleType(getError.vehicle_type[0])
                }
            })
        } catch(e) { console.error('Internal server error, please wait' + e) }
    }

    let deleteVehicleData = async (vehicleId) => {
        try {
            await axios.delete(`/vehicles/${vehicleId}`)
            .then(() => {
                const updateVehicleList = vehicles.filter((v) => v.id !== vehicleId)
                setVehicles(updateVehicleList)
                setDeleteVehicleId(null)
                setShowDeleteModal(false)
            })
        } catch(e) { console.error('Internal Server Error, Please Wait' + e) }
    }

    return (
        <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Vehicles</h2>}
        >
        <Head title="Dashboard" />

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className='flex justify-between mb-6'>
                            <TextInput placeholder={'Search here...'} value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button onClick={() => setShowCreateModal(!showCreateModal)}>Create</Button>
                        </div>
                        <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
                            <div className='p-5'>
                                <div className='flex justify-between pb-4 border-b'>
                                    <h1 className='text-medium text-xl'>Delete vehicle</h1>
                                    <button onClick={() => setShowCreateModal(!showCreateModal)}>X</button>
                                </div>
                                <form onSubmit={createVehicleData}>
                                    <div className='my-4'>
                                            <div className='flex flex-col lg:flex-row justify-between gap-5'>
                                                <div className='mb-4 lg:w-1/2'>
                                                    <InputLabel value="Number Plates" className='mb-2' htmlFor="number_plates" />
                                                    <TextInput value={numberPlates} onChange={(e) => setNumberPlates(e.target.value)} className={errorNumberPlates ? "w-full border-pink-700 text-pink-700 focus:border-pink-700 focus:ring-pink-700" : "w-full"} id="number_plates"/>
                                                    {errorNumberPlates && errorNumberPlates !== '' ? (
                                                        <InputError message={errorNumberPlates}/>
                                                    ) : (
                                                        <>
                                                        </>
                                                    )}
                                                </div>
                                                <div className='mb-4 lg:w-1/2'>
                                                    <InputLabel value="Vehicle Type" className='mb-2' htmlFor="vehicle_type"/>
                                                    <TextInput value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className={errorVehicleType ? "w-full border-pink-700 text-pink-700 focus:border-pink-700 focus:ring-pink-700" : "w-full"} id="vehicle_type"/>
                                                    {errorVehicleType ? (
                                                        <InputError message={errorVehicleType}/>
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
                        <div className=''>
                            <div className="flex flex-col">
                                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                        <div className="overflow-hidden">
                                            <table className="min-w-full text-left text-sm font-light">
                                            <thead className="border-b font-medium dark:border-neutral-500">
                                                <tr>
                                                <th scope="col" className="px-6 py-4">#</th>
                                                <th scope="col" className="px-6 py-4">Plat Nomor</th>
                                                <th scope="col" className="px-6 py-4">Nama Kendaraan</th>
                                                <th scope="col" className="px-6 py-4">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {vehicles.map((v) => (
                                                <tr
                                                className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600" key={v.id}>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">{i++}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{v.number_plates}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{v.vehicle_type}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className='flex gap-3'>
                                                            <Button color="warning" onClick={() => handleEditModal(v.id)}>Edit</Button>
                                                            {editVehicleData && editVehicleData.id === v.id && (
                                                                <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                                                                    <div className='p-5'>
                                                                        <div className='flex justify-between pb-4 border-b'>
                                                                            <h1 className='text-medium text-xl'>Edit vehicle</h1>
                                                                            <button onClick={() => setShowEditModal(!showEditModal)}>X</button>
                                                                        </div>
                                                                        <div className='my-4'>
                                                                        <form onSubmit={editVehicleIdData}>
                                                                            <div className='my-4'>
                                                                                <div className='flex flex-col lg:flex-row justify-between w-full gap-5'>
                                                                                    <div className='mb-4 lg:w-1/2'>
                                                                                        <InputLabel value="Number Plates" className='mb-2' htmlFor="number_plates" />
                                                                                        <TextInput value={editVehicleData.number_plates} onChange={(e) =>
                                                                                            setEditVehicleData((prevData) => ({
                                                                                            ...prevData,
                                                                                            number_plates: e.target.value
                                                                                            }))
                                                                                        } className="w-full" id="number_plates"/>
                                                                                    </div>
                                                                                    <div className='mb-4 lg:w-1/2'>
                                                                                        <InputLabel value="Vehicle Type" className='mb-2' htmlFor="vehicle_type"/>
                                                                                        <TextInput value={editVehicleData.vehicle_type} onChange={(e) =>
                                                                                            setEditVehicleData((prevData) => ({
                                                                                            ...prevData,
                                                                                            vehicle_type: e.target.value
                                                                                            }))
                                                                                        } className="w-full" id="vehicle_type"/>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='flex justify-end gap-3 mt-6 pt-6 border-t'>
                                                                                <Button color="light" type="button" onClick={() => setShowEditModal(!showEditModal)}>Close</Button>
                                                                                <Button color="success" type="button" onClick={() => editVehicleIdData(v.id)}>Submit</Button>
                                                                            </div>
                                                                        </form>
                                                                        </div>
                                                                    </div>
                                                                </Modal>
                                                            )}
                                                            <Button color="danger" onClick={() => handleDeleteModal(v.id)}>Delete</Button>
                                                            {deleteVehicleId && deleteVehicleId === v.id && (
                                                                <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                                                                    <div className='p-5'>
                                                                        <div className='flex justify-between pb-4 border-b'>
                                                                            <h1 className='text-medium text-xl'>Delete vehicle</h1>
                                                                            <button onClick={() => setShowDeleteModal(!showDeleteModal)}>X</button>
                                                                        </div>
                                                                        <div className='my-4 flex items-center justify-center'>
                                                                            <p className='text-lg'>Are you sure want to delete this vehicle ?</p>
                                                                        </div>
                                                                        <div className='flex justify-end gap-3 mt-6 pt-6 border-t'>
                                                                            <Button color="light" type="button" onClick={() => setShowDeleteModal(!showDeleteModal)}>Close</Button>
                                                                            <Button color="danger" onClick={() => deleteVehicleData(v.id)}>Delete</Button>
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

export default VehicleIndex;
