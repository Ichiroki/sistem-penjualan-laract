import { Incoming } from '@/API/Incoming'
import { Product } from '@/API/Product'
import { Vehicles } from '@/API/Vehicle'
import Button from '@/Components/Button'
import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import Modal from '@/Components/Modal'
import SignatureInput from '@/Components/SignatureInput'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import formatRupiah from '@/utils/formatRupiah'
import { Head } from '@inertiajs/react'
import axios from 'axios'
import { ChangeEvent, useState } from 'react'

interface IncomingDetail {
    incoming: {
        incoming_invoice: string,
        supplier_name: string,
        received_to: string,
        number_plate: string,
        subtotal: number,
        date_incoming: Date | undefined,
        time_incoming: Date,
    }
    details: [] | any
}

function ProductIndex({auth}) {

    let i = 1
    let total = 0

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

    const [invoice, setInvoice] = useState('')
    const [supplierName, setSupplierName] = useState('')
    const [receivedTo, setReceivedTo] = useState('')
    const [numberPlate, setNumberPlate] = useState('')

    // signature
    const [signature, setSignature] = useState(null)

    // save signature
    const handleSaveSignature = (data) => {
        setSignature(data)
    }

    // clear signature
    const handleClearSignature = () => {
        setSignature(null)
    }

    const resetInput = () => {
        setInvoice('')
        setSupplierName('')
        setReceivedTo('')
    }

    const [editIncomingData, setEditIncomingData] = useState({
        incoming_invoice: '',
        delivery_name: '',
        customer_name: '',
        customer_address: '',
        batch_number: '',
        products: []
    })

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)

    const [deleteProductId, setDeleteProductId] = useState(null)

    const [detailIncomingId, setDetailIncomingId] = useState<IncomingDetail | null>(null)

    const handleEditModal = (invoice) => {
        const selectedProduct: any = incomings.find((p) => p.incoming_invoice === invoice)
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
                received_to: receivedTo,
                number_plate: numberPlate,
                products: productField
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

    let detailIncomingData = async (invoice) => {
        try {
            await axios.get(`/incoming/${invoice}`)
            .then((res) => {
                console.log(res.data)
                setDetailIncomingId(res.data)
                setShowDetailModal(true)

                console.log(detailIncomingId)
            })
        } catch(e) {
            console.log(e)
        }
    }

    let editIncomingIdData = async (productId) => {
        try {
            // await axios.put(`/incomings/${productId}`, {
            //     incoming_invoice : editIncomingData.delivery_id,
            //     supplier_name : editIncomingData.input_date,
            //     received_to : editIncomingData.product_code
            //     number_plates : editIncomingData.number
            // })
            // .then(() => {
            //     resetInput()
            //     setShowEditModal(false)
            //     getIncomingsData()
            // })
            // .catch((error) => {
            //     if(error.response) {
            //         const getError = error.response.data.errors
            //         console.log(error.response)
            //         setErrorInputDate(getError.input_date[0])
            //         setErrorDeliveryId(getError.delivery_id[0])
            //         setErrorProductCode(getError.product_code[0])
            //     }
            // })
        } catch(e) {
            console.error('Internal server error, please wait' + e)
        }
    }

    let deleteIncomingData = async (invoice) => {
        try {
            await axios.delete(`/incomings/${invoice}`)
            .then(() => {
                const updateProductList = incomings.filter((p) => p.incoming_invoice !== invoice)
                setIncomings(updateProductList)
                setDeleteProductId(null)
                setShowDeleteModal(false)
            })
        } catch(e) {
            console.error('Internal Server Error, Please Wait' + e)
        }
    }

    const [productField, setProductField] = useState([{
        id:'',
        code: '',
        quantity: '',
    }])

    // Add new field for product

    const addFields = () => {
        let newFields = { id: '', code: '', quantity: ''}

        setProductField([...productField, newFields])
    }

    // handling value changes on form

    const handleFormChange = (index: number, event: ChangeEvent<HTMLInputElement>|ChangeEvent<HTMLSelectElement>) => {
        let data = [...productField]
        let {name, value} = event.target
        data[index] = {...data[index], [name]: value}
        setProductField(data)
    }

    // remove field for product

    const removeField = (index) => {
        let data = [...productField]
        data.splice(index, 1)
        setProductField(data)
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
                                <Modal show={showCreateModal} onClose={() => {
                                    resetInput();
                                    setShowCreateModal(false)
                                }}>
                                    <div className='p-5'>
                                        <div className='flex justify-between pb-4 border-b'>
                                            <h1 className='text-medium text-xl'>Create Incoming</h1>
                                            <button onClick={() => setShowCreateModal(!showCreateModal)}>X</button>
                                        </div>
                                        <form onSubmit={createIncomingData}>
                                            <div className='my-4 overflow-y-scroll scrollbar-hide h-96'>
                                                <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                    <div className='flex flex-col lg:flex-row justify-between w-full gap-5'>
                                                        <div className='mb-4 w-full'>
                                                            <InputLabel value="Incoming Invoice" className='mb-2' htmlFor="incoming_invoice"/>
                                                            <TextInput id="incoming_invoice" className='w-full' onChange={(e) => setInvoice(e.target.value)}/>
                                                        </div>
                                                        <div className='mb-4 w-full'>
                                                            <InputLabel value="Supplier Name" className='mb-2' htmlFor="supplier_name"/>
                                                            <TextInput id="supplier_name" className='w-full' onChange={(e) => setSupplierName(e.target.value)}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                    <div className='flex flex-col lg:flex-row justify-between w-full gap-5'>
                                                        <div className='mb-4 w-full'>
                                                            <InputLabel value="Received To" className='mb-2' htmlFor="received_to"/>
                                                            <TextInput id="received_to" className='w-full' onChange={(e) => setReceivedTo(e.target.value)}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                    <div className='flex flex-col lg:flex-row justify-between w-full gap-5'>
                                                        <div className='mb-4 w-full'>
                                                            <InputLabel value="Number Plate" className='mb-2' htmlFor="number_plate"/>
                                                            <TextInput id="number_plate" className='w-full' onChange={(e) => setNumberPlate(e.target.value)}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                    <div className='flex flex-col lg:flex-row justify-between w-full gap-5'>
                                                        <div className='mb-4 w-full'>
                                                            {/* <SignatureInput onSave={handleSaveSignature} onClear={handleClearSignature}/> */}
                                                            {/* {signature && (
                                                                <div>
                                                                    <h2>Saved Signature</h2>
                                                                    <img src={signature} alt="Signature" className="border w-full h-40 rounded-md" />
                                                                </div>
                                                            )} */}
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
                                                    <Button children={`+`} color='success' type="button" onClick={addFields}/>
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
                                                <th scope="col" className="px-6 py-4">Invoice</th>
                                                <th scope="col" className="px-6 py-4">Supplier Name</th>
                                                <th scope="col" className="px-6 py-4">Number Plate</th>
                                                <th scope="col" className="px-6 py-4">Received To</th>
                                                <th scope="col" className="px-6 py-4">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {incomings.map((d) => (
                                                <tr
                                                className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600" key={d.incoming_invoice}>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">{i++}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{d.incoming_invoice}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{d.supplier_name}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{d.number_plate}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{d.received_to}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className='flex gap-3'>
                                                        <Button color="primary" onClick={() => detailIncomingData(d.incoming_invoice)}>Detail</Button>
                                                                {detailIncomingId && (
                                                                    <Modal show={showDetailModal} onClose={() => {
                                                                        resetInput();
                                                                        setShowDetailModal(false)
                                                                    }}>
                                                                        <div className='p-5'>
                                                                            <div className='flex justify-between pb-4 border-b'>
                                                                                <h1 className='text-medium text-xl w-8/12 lg:w-full'>Detail Pengiriman</h1>
                                                                                <button onClick={() => setShowDetailModal(!showDetailModal)}>X</button>
                                                                            </div>
                                                                            <div className='my-4 flex flex-col overflow-scroll scrollbar-hide'>
                                                                                <div className='flex gap-3'>
                                                                                    <h1 className="w-6/12">Invoice</h1>
                                                                                    <p>:</p>
                                                                                    <p className="w-6/12">{detailIncomingId?.incoming.incoming_invoice}</p>
                                                                                </div>
                                                                                <div className='flex gap-3'>
                                                                                    <h1 className="w-6/12">Supplier Name</h1>
                                                                                    <p>:</p>
                                                                                    <p className="w-6/12">{detailIncomingId?.incoming.supplier_name}</p>
                                                                                </div>
                                                                                <div className='flex gap-3'>
                                                                                    <h1 className="w-6/12">Number Plate</h1>
                                                                                    <p>:</p>
                                                                                    <p className="w-6/12">{detailIncomingId?.incoming.number_plate}</p>
                                                                                </div>
                                                                                <div className='flex gap-3'>
                                                                                    <h1 className="w-6/12">Received To</h1>
                                                                                    <p>:</p>
                                                                                    <p className="w-6/12">{detailIncomingId?.incoming.received_to}</p>
                                                                                </div>
                                                                                <div className='flex gap-3'>
                                                                                    <h1 className="w-6/12">Date Incoming</h1>
                                                                                    <p>:</p>
                                                                                    <p className="w-6/12">{`${detailIncomingId?.incoming.date_incoming}`}</p>
                                                                                </div>
                                                                                <div className='flex gap-3'>
                                                                                    <h1 className="w-6/12">Time Incoming</h1>
                                                                                    <p>:</p>
                                                                                    <p className="w-6/12">{` ${detailIncomingId?.incoming.time_incoming}`}</p>
                                                                                </div>
                                                                                <table className="mt-5 overflow-scroll w-full">
                                                                                    <thead>
                                                                                        <tr className='border'>
                                                                                            <td className="p-2">No</td>
                                                                                            <td className="p-2">Product Code</td>
                                                                                            <td className="p-2">Product Name</td>
                                                                                            <td className="p-2">Quantity</td>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                    {detailIncomingId.details.map((d, i) => (
                                                                                        <>
                                                                                            <tr className={i % 2 === 1 ? 'border' : 'border bg-gray-200'}>
                                                                                                <td className="p-2">{i + 1}</td>
                                                                                                <td className="p-2">{d.product_code}</td>
                                                                                                <td className="p-2">{d.product_name}</td>
                                                                                                <td className="p-2">{d.quantity}</td>
                                                                                            </tr>

                                                                                        </>
                                                                                    ))}
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    </Modal>
                                                                )}
                                                            <Button color="warning" onClick={() => handleEditModal(d.incoming_invoice)}>Edit</Button>
                                                            {editIncomingData && editIncomingData.incoming_invoice === d.incoming_invoice && (
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
                                                                                        </div>
                                                                                        <div className='mb-4 w-full'>
                                                                                            <InputLabel value="Kode Produk" className='mb-2' htmlFor="productCode"/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='flex justify-end gap-3 mt-6 pt-6 border-t'>
                                                                                <Button color="light" type="button" onClick={() => setShowEditModal(!showEditModal)}>Close</Button>
                                                                                <Button color="success" type="button" onClick={() => editIncomingIdData(d.incoming_invoice)}>Submit</Button>
                                                                            </div>
                                                                        </form>
                                                                        </div>
                                                                </Modal>
                                                            )}
                                                            <Button color="danger" onClick={() => handleDeleteModal(d.incoming_invoice)}>Delete</Button>
                                                            {deleteProductId && deleteProductId === d.incoming_invoice && (
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
                                                                            <Button color="danger" onClick={() => deleteIncomingData(d.incoming_invoice)}>Delete</Button>
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
