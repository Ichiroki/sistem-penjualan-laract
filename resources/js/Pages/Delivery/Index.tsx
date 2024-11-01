import { Delivery } from '@/API/Delivery'
import { Product } from '@/API/Product'
import { Vehicles } from '@/API/Vehicle'
import Button from '@/Components/Button'
import Dropdown from '@/Components/Dropdown'
import InputLabel from '@/Components/InputLabel'
import Modal from '@/Components/Modal'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import axios from 'axios'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { ChangeEvent, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import * as XLSX from 'xlsx'

interface Product {
    id: number
    code?: string
    quantity?: number
}

interface DeliveryDetail {
    delivery: {
        delivery_invoice: string,
        delivery_name: string,
        customer_name: string,
        customer_address: string,
        date_delivery: Date | undefined,
        time_delivery: Date,
    }
    delivery_invoice: string
    delivery_name: string
    customer_name: string
    customer_address: string
    details: [] | any
}

function DeliveryIndex({auth}) {
    let i = 1
    let j = 1

    const {
        deliveries,
        setDeliveries,
        deliverDetail,
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

    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)

    const [deletePengirimanId, setDeletePengirimanId] = useState(null)

    const [detailPengirimanId, setDetailPengirimanId] = useState<DeliveryDetail | null>(null)

    const resetInput = () => {
        setInvoice('')
        setNamaPengirim('')
        setNamaKustomer('')
        setAlamatKustomer('')
        setPlatNomor('')
        setBatchNumber('')
    }

    const handleEditModal = (invoice) => {
        const selectedPengiriman: any = deliveries.find((p) => p.delivery_invoice === invoice)
        console.log(selectedPengiriman)
        // setEditPengirimanData(selectedPengiriman)
        // setShowEditModal(!showEditModal)
    }

    const handleDeleteModal = (invoice) => {
        setDeletePengirimanId(invoice)
        setShowDeleteModal(!showDeleteModal)
    }

    const [editPengirimanData, setEditPengirimanData] = useState({
        invoice: '',
        delivery_name: '',
        customer_name: '',
        customer_address: '',
        batch_number: ''
    })

    const excelDownload = (data, fileName) => {
        try {
            const worksheet = XLSX.utils.json_to_sheet(data)

            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")

            return XLSX.writeFile(workbook, fileName)
        } catch(e) {
            console.log(e)
        }
    }

    const pdfDownload = (deliveries, deliverDetail) => {
        const pdf = new jsPDF()
        const tableContent = deliveries.map((d, i) => `
            <tr>
                <td style="border: 1px solid black; padding: 4px;">${i + 1}</td>
                <td style="border: 1px solid black; padding: 4px;">${d.delivery_invoice}</td>
                <td style="border: 1px solid black; padding: 4px;">${d.delivery_name}</td>
                <td style="border: 1px solid black; padding: 4px;">${d.customer_name}</td>
                <td style="border: 1px solid black; padding: 4px;">${d.customer_address}</td>
                <td style="border: 1px solid black; padding: 4px;">${d.batch_number}</td>
                <td style="border: 1px solid black; padding: 4px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        ${deliverDetail.map(dd => `
                            <tr>
                                <td style="padding-right: 6px;">${dd.product_name}</td>
                                <td style="padding-left: 6px;">${dd.quantity}</td>
                            </tr>
                        `).join('')}
                    </table>
                </td>
            </tr>
        `).join('')

        const htmlContent = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid black; padding: 4px;">No</th>
                        <th style="border: 1px solid black; padding: 4px;">Delivery Invoice</th>
                        <th style="border: 1px solid black; padding: 4px;">Delivery Name</th>
                        <th style="border: 1px solid black; padding: 4px;">Customer Name</th>
                        <th style="border: 1px solid black; padding: 4px;">Customer Address</th>
                        <th style="border: 1px solid black; padding: 4px;">Batch Number</th>
                        <th style="border: 1px solid black; padding: 4px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <th style="text-align:center;" colspan="3">Product</th>
                                </tr>
                                <tr>
                                    <th style="padding-right: 6px; text-align:center;">Name</th>
                                    <th style="padding-left: 6px; text-align:center;">Quantity</th>
                                </tr>
                            </table>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${tableContent}
                </tbody>
            </table>
        `

        pdf.html(htmlContent, {
            callback: function(doc) {
                doc.save('sample_document.pdf');
            },
            x: 15,
            y: 10,
            width: 170,
            windowWidth: 650,
        });
    }

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
                toast(res.data.message)
            }).catch((e) => {
                if(e.response) {
                    console.log(e.response)
                    const getError = e.response.data.errors
                }
            })
        } catch(e) {
            console.error('Internal server error, please wait')
        }
    }

    let detailPengirimanData = async (invoice) => {
        try {
            await axios.get(`/deliveries/${invoice}`)
            .then((res) => {
                setDetailPengirimanId(res.data)
                setShowDetailModal(true)

                console.log(detailPengirimanId)
            })
        } catch(e) {
            console.log(e)
        }
    }

    let editPengirimanIdData = async (deliveryId) => {
        try {
            await axios.put(`/deliveries/${deliveryId}`, {
                delivery_invoice : editPengirimanData.invoice,
                delivery_name : editPengirimanData.delivery_name,
                customer_name : editPengirimanData.customer_name,
                customer_address : editPengirimanData.customer_address,
                batch_number: editPengirimanData.batch_number
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
                toast(res.data.message)
            })
        } catch(e) {
            console.error('Internal Server Error, Please Wait' + e)
        }
    }

    // Add new field for product

    const addFields = () => {
        let newFields = { id:'', code: '', quantity: '' }

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
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Deliveries</h2>}
            >
            <Head title="Dashboard" />
            <ToastContainer
                theme='light'
                draggable
            />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className='flex flex-col md:flex-row justify-between mb-6 gap-3'>
                                <div>
                                    <TextInput placeholder={'Search here...'} value={search} className='w-full' onChange={(e) => setSearch(e.target.value)} />
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <div>
                                        <button onClick={() => setShowCreateModal(!showCreateModal)} className="w-full md:w-[8.5rem] h-[2.5rem] transition-all duration-[0.3s] enabled:cursor-pointer font-[550] rounded-xl border-2 border-solid border-slate-600 enabled:hover:text-white enabled:hover:bg-slate-600">Create</button>
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
                                    <div>
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span>
                                                    <button className="w-full md:w-[8.5rem] h-[2.5rem] transition-all duration-[0.3s] enabled:cursor-pointer font-[550] rounded-xl border-2 border-solid border-slate-600 enabled:hover:text-white enabled:hover:bg-slate-600">
                                                        <span className='inline-flex items-center'>
                                                            Download To
                                                            <svg
                                                                className="ms-2 -me-0.5 h-4 w-4"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>
                                            <Dropdown.Content contentClasses={'flex flex-col justify-left items-start z-10 bg-slate-50 overflow-hidden'}>
                                                <button className='py-2 pl-3 w-full text-left transition duration-150 hover:bg-slate-300' onClick={() => excelDownload(deliveries, 'Deliveries.xlsx')}>
                                                    Excel
                                                </button>
                                                <button className='py-2 pl-3 w-full text-left transition duration-150 hover:bg-slate-300' onClick={() => pdfDownload(deliveries, deliverDetail)}>
                                                    PDF
                                                </button>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>
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
                                                    <th scope="col" className="px-6 py-4">Delivery Invoice</th>
                                                    <th scope="col" className="px-6 py-4">Number Plates</th>
                                                    <th scope="col" className="px-6 py-4">Delivery Date</th>
                                                    <th scope="col" className="px-6 py-4">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {deliveries && deliveries.map((p) => (
                                                    <tr
                                                    className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600" key={p.id}>
                                                        <td className="whitespace-nowrap px-6 py-4 font-medium">{i++}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{p.delivery_invoice}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{p.number_plates}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{`${p.date_delivery}` + ` ${p.time_delivery}`}</td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-center">
                                                            <div className='flex gap-3'>
                                                                <Button color="primary" onClick={() => detailPengirimanData(p.delivery_invoice)}>Detail</Button>
                                                                {detailPengirimanId && (
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
                                                                                    <p className="w-6/12">{detailPengirimanId?.delivery.delivery_invoice}</p>
                                                                                </div>
                                                                                <div className='flex gap-3'>
                                                                                    <h1 className="w-6/12">Delivery Name</h1>
                                                                                    <p>:</p>
                                                                                    <p className="w-6/12">{detailPengirimanId?.delivery.delivery_name}</p>
                                                                                </div>
                                                                                <div className='flex gap-3'>
                                                                                    <h1 className="w-6/12">Customer Name</h1>
                                                                                    <p>:</p>
                                                                                    <p className="w-6/12">{detailPengirimanId?.delivery.customer_name}</p>
                                                                                </div>
                                                                                <div className='flex gap-3'>
                                                                                    <h1 className="w-6/12">Address</h1>
                                                                                    <p>:</p>
                                                                                    <p className="w-6/12">{detailPengirimanId?.delivery.customer_address}</p>
                                                                                </div>
                                                                                <div className='flex gap-3'>
                                                                                    <h1 className="w-6/12">Date Delivery</h1>
                                                                                    <p>:</p>
                                                                                    <p className="w-6/12">{`${detailPengirimanId?.delivery.date_delivery}`}</p>
                                                                                </div>
                                                                                <div className='flex gap-3'>
                                                                                    <h1 className="w-6/12">Time Delivery</h1>
                                                                                    <p>:</p>
                                                                                    <p className="w-6/12">{` ${detailPengirimanId?.delivery.time_delivery}`}</p>
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
                                                                                    {detailPengirimanId.details.map((d, i) => (
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
                                                                <Button color="warning" onClick={() => handleEditModal(p.delivery_invoice)}>Edit</Button>
                                                                {/* {editPengirimanData && editPengirimanData.invoice === p.delivery_invoice && (
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
                                                                )} */}
                                                                <Button color="danger" onClick={() => handleDeleteModal(p.delivery_invoice)}>Delete</Button>
                                                                {deletePengirimanId && deletePengirimanId === p.delivery_invoice && (
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
                                                                                <Button color="danger" onClick={() => deletePengirimanData(p.delivery_invoice)}>Delete</Button>
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
