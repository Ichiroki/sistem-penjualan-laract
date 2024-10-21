import { Incoming } from '@/API/Incoming'
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
import { ChangeEvent, useState } from 'react'

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
        product
    } = Product()

    const [errorInputDate, setErrorInputDate] = useState('')
    const [errorDeliveryId, setErrorDeliveryId] = useState('')
    const [errorProductCode, setErrorProductCode] = useState('')

    // const [inputDate, setInputDate] = useState('')
    // const [deliveryId, setDeliveryId] = useState(1)
    // const [productCode, setProductCode] = useState('')

    const [invoice, setInvoice] = useState('')
    const [supplierName, setSupplierName] = useState('')
    const [receivedTo, setReceivedTo] = useState('')

    const [inputField, setInputField] = useState([{
        id:'',
        code: '',
        quantity: '',
    }])

    const resetInput = () => {
        setInvoice('')
        setSupplierName('')
        setReceivedTo('')
    }

    const [editIncomingData, setEditIncomingData] = useState({
        invoice: '',
        delivery_name: '',
        customer_name: '',
        customer_address: '',
        batch_number: '',
        products: []
    })

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [deleteProductId, setDeleteProductId] = useState(null)

    const handleEditModal = (invoice) => {
        const selectedProduct: any = incomings.find((p) => p.invoice === invoice)
        console.log(selectedProduct)
        // setEditIncomingData(selectedProduct)
        // setShowEditModal(!showEditModal)
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
                incoming_invoice: invoice,
                supplier_name: supplierName,
                received_to: receivedTo
            })
            .then((res) => {
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

    let deleteIncomingData = async (invoice) => {
        try {
            await axios.delete(`/incomings/${invoice}`)
            .then(() => {
                const updateProductList = incomings.filter((p) => p.invoice !== invoice)
                setIncomings(updateProductList)
                setDeleteProductId(null)
                setShowDeleteModal(false)
            })
        } catch(e) {
            console.error('Internal Server Error, Please Wait' + e)
        }
    }

    // Add new field for product

    const addFields = () => {
        let newFields = { id: '', code: '', quantity: ''}

        setInputField([...inputField, newFields])
    }

    // handling value changes on form

    const handleFormChange = (index: number, event: ChangeEvent<HTMLInputElement>|ChangeEvent<HTMLSelectElement>) => {
        let data = [...inputField]
        let {name, value} = event.target
        data[index] = {...data[index], [name]: value}
        setInputField(data)
    }

    // remove field for product

    const removeField = (index) => {
        let data = [...inputField]
        data.splice(index, 1)
        setInputField(data)
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
                                        <div className='my-4 overflow-y-scroll scrollbar-hide'>
                                            <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                <div className='mb-4 w-full'>
                                                    <InputLabel value="Invoice" className='mb-2' htmlFor="Input Date"/>
                                                    <TextInput value={invoice} onChange={(e) => setInvoice(e.target.value)} className={errorInputDate ? "w-full border-pink-700 text-pink-700 focus:border-pink-700 focus:ring-pink-700" : "w-full"} id="nama"/>
                                                    {errorInputDate ? (
                                                        <InputError message={errorInputDate}/>
                                                    ) : (
                                                        <>
                                                        </>
                                                    )}
                                                </div>
                                                <div className='mb-4 w-full'>
                                                    <InputLabel value="Supplier Name" className='mb-2' htmlFor="Input Date"/>
                                                    <TextInput value={supplierName} onChange={(e) => setSupplierName(e.target.value)} className={errorInputDate ? "w-full border-pink-700 text-pink-700 focus:border-pink-700 focus:ring-pink-700" : "w-full"} id="nama"/>
                                                    {errorInputDate ? (
                                                        <InputError message={errorInputDate}/>
                                                    ) : (
                                                        <>
                                                        </>
                                                    )}
                                                </div>
                                                <div className='mb-4 w-full'>
                                                    <InputLabel value="Received To" className='mb-2' htmlFor="Input Date"/>
                                                    <TextInput value={receivedTo} onChange={(e) => setReceivedTo(e.target.value)} className={errorInputDate ? "w-full border-pink-700 text-pink-700 focus:border-pink-700 focus:ring-pink-700" : "w-full"} id="nama"/>
                                                    {errorInputDate ? (
                                                        <InputError message={errorInputDate}/>
                                                    ) : (
                                                        <>
                                                        </>
                                                    )}
                                                </div>
                                                {inputField.map((input, index) =>
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
                                                className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600" key={d.invoice}>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">{i++}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{d.input_date.slice(0, 10)}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{d.number_plates}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{d.code}</td>
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
                                                                                                {/* {vehicles.map((p) => (
                                                                                                    <option value={p.id} key={p.id} selected={editIncomingData.delivery_id === p.id}>{p.vehicle.number_plates}</option>
                                                                                                ))} */}
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
