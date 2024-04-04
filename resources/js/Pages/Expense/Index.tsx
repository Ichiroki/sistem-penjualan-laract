import { Delivery } from '@/API/Delivery';
import { Expense } from '@/API/Expense';
import { Product } from '@/API/Product';
import Button from '@/Components/Button';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

function ExpenseIndex({auth}) {

    let i = 1

    const {
        expenses,
        setExpenses,
        search,
        setSearch,
        getExpensesData
    } = Expense()

    const {
        deliveries
    } = Delivery()

    const {
        product
    } = Product()

    const [errorInputDate, setErrorInputDate] = useState('')
    const [errorNumberPlates, setErrorNumberPlates] = useState('')
    const [errorProductCode, setErrorProductCode] = useState('')
    const [errorQuantity, setErrorQuantity] = useState('')

    const [inputDate, setInputDate] = useState('')
    const [numberPlates, setNumberPlates] = useState('')
    const [productCode, setProductCode] = useState('')
    const [quantity, setQuantity] = useState('')


    const resetInput = () => {
        setInputDate('')
        setNumberPlates('')
        setProductCode('')
        setQuantity('')
    }

    const [editExpenseData, setEditExpenseData] = useState({
        id: 0,
        input_date: '',
        number_plates: '',
        product_code: '',
        quantity: '',
    })

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [deleteProductId, setDeleteProductId] = useState(null)

    const handleEditModal = (productId) => {
        const selectedProduct: any = expenses.find((p) => p.id === productId)
        setEditExpenseData(selectedProduct)
        setShowEditModal(!showEditModal)
    }

    const handleDeleteModal = (productId) => {
        setDeleteProductId(productId)
        setShowDeleteModal(!showDeleteModal)
    }

    let createIncomingData = async (e) => {
        e.preventDefault()
        try {
            axios.post('/expenses',
            {
                input_date: inputDate,
                number_plates: numberPlates,
                product_code: productCode,
                quantity
            })
            .then(() => {
                resetInput()
                getExpensesData()
                setShowCreateModal(false)
            })
            .catch((error) => {
                console.log(error)
                if(error.response) {
                    const getError = error.response.data.errors
                    console.log(error.response)
                    // Error message
                    setErrorInputDate(getError.input_date[0])
                    setErrorNumberPlates(getError.number_plates[0])
                    setErrorProductCode(getError.product_code[0])
                    setErrorQuantity(getError.quantity[0])
                    //
                }
            })
        } catch(e) {
            console.error('Internal server error, please wait')
        }
    }

    let editExpensesIdData = async (productId) => {
        try {
            await axios.put(`/expenses/${productId}`, {
                input_date : editExpenseData.input_date,
                number_plates : editExpenseData.number_plates,
                product_code : editExpenseData.product_code,
                quantity : parseInt(editExpenseData.quantity)
            })
            .then(() => {
                getExpensesData()
                resetInput()
                setShowEditModal(false)
            })
            .catch((error) => {
                if(error.response) {
                    const getError = error.response.data.errors
                    console.log(error.response)
                    setErrorInputDate(getError.input_date[0])
                    setErrorNumberPlates(getError.number_plates[0])
                    setErrorProductCode(getError.product_code[0])
                    setErrorQuantity(getError.quantity[0])
                }
            })
        } catch(e) {
            console.error('Internal server error, please wait' + e)
        }
    }

    let deleteExpensesData = async (productId) => {
        try {
            await axios.delete(`/expenses/${productId}`)
            .then(() => {
                const updateProductList = expenses.filter((p) => p.id !== productId)
                setExpenses(updateProductList)
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
        header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Pengeluaran</h2>}
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
                                                            <InputLabel value="Plat Nomor" className='mb-2' htmlFor="numberPlates"/>
                                                            <select id="numberPlates" className='w-full outline-none rounded-lg selection::border-slate-900' onChange={(e) => setNumberPlates(e.target.value)}>
                                                                <option value="">Select deliveries</option>
                                                                {deliveries.map((p) => (
                                                                    <option value={p.number_plates} key={p.number_plates}>{p.number_plates}</option>
                                                                ))}
                                                            </select>
                                                            {errorNumberPlates ? (
                                                                <InputError message={errorNumberPlates}/>
                                                            ) : (
                                                                <>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className='mb-4 w-full'>
                                                            <InputLabel value="Kode Produk" className='mb-2' htmlFor="productCode"/>
                                                            <select className='w-full outline-none rounded-lg selection::border-slate-900' id="productCode" onChange={(e) => setProductCode(e.target.value)}>
                                                                <option value="">Select a product</option>
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
                                                    <div className='mb-4 w-full'>
                                                        <InputLabel value="Quantity" className='mb-2' htmlFor="Quantity"/>
                                                        <TextInput type="number" autoComplete='off' value={quantity} onChange={(e) => setQuantity(e.target.value)} className={errorQuantity ? "w-full border-pink-700 text-pink-700 focus:border-pink-700 focus:ring-pink-700" : "w-full"} id="nama"/>
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
                                                    <th scope="col" className="px-6 py-4">Tanggal Masuk</th>
                                                    <th scope="col" className="px-6 py-4">Plat Nomor</th>
                                                    <th scope="col" className="px-6 py-4">Kode Produk</th>
                                                    <th scope="col" className="px-6 py-4">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {expenses.map((d) => (
                                                    <tr
                                                    className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600" key={d.id}>
                                                        <td className="whitespace-nowrap px-6 py-4 font-medium">{i++}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{d.input_date}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{d.number_plates}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{d.product_code}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            <div className='flex gap-3'>
                                                                <Button color="warning" onClick={() => handleEditModal(d.id)}>Edit</Button>
                                                                {editExpenseData && editExpenseData.id === d.id && (
                                                                    <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                                                                        <div className='p-5'>
                                                                            <div className='flex justify-between pb-4 border-b'>
                                                                                <h1 className='text-medium text-xl'>Edit Pengeluaran</h1>
                                                                                <button onClick={() => setShowEditModal(!showEditModal)}>X</button>
                                                                            </div>
                                                                            <div className='my-4 flex items-center justify-center'>
                                                                            <form onSubmit={editExpensesIdData}>
                                                                            <div className='my-4'>
                                                                                <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                                                    <div className='mb-4 w-full'>
                                                                                        <InputLabel value="Input Date" className='mb-2' htmlFor="Input Date"/>
                                                                                        <TextInput type="date" value={editExpenseData.input_date} onChange={(e) => setEditExpenseData((prevData) => ({
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
                                                                                            <InputLabel value="Plat Nomor" className='mb-2' htmlFor="numberPlates"/>
                                                                                            <select id="numberPlates" className='w-full outline-none rounded-lg selection::border-slate-900' onChange={(e) => setEditExpenseData((prevData) => ({
                                                                                                ...prevData,
                                                                                                number_plates: e.target.value
                                                                                            }))}>
                                                                                                <option value="">Select deliveries</option>
                                                                                                {deliveries.map((p) => (
                                                                                                    <option value={p.number_plates} key={p.number_plates} selected={editExpenseData.number_plates === p.number_plates}>{p.number_plates}</option>
                                                                                                ))}
                                                                                            </select>
                                                                                            {errorNumberPlates ? (
                                                                                                <InputError message={errorNumberPlates}/>
                                                                                            ) : (
                                                                                                <>
                                                                                                </>
                                                                                            )}
                                                                                        </div>
                                                                                        <div className='mb-4 w-full'>
                                                                                            <InputLabel value="Kode Produk" className='mb-2' htmlFor="productCode"/>
                                                                                            <select className='w-full outline-none rounded-lg selection::border-slate-900' id="productCode" onChange={(e) => setEditExpenseData((prevData) => ({
                                                                                                ...prevData,
                                                                                                product_code: e.target.value
                                                                                            }))}>
                                                                                                <option value="">Select a product</option>
                                                                                                {product.map((p) => (
                                                                                                    <option value={p.code} key={p.code} selected={editExpenseData.product_code === p.code}>{p.name}</option>
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
                                                                                    <div className='mb-4 w-full'>
                                                                                        <InputLabel value="Quantity" className='mb-2' htmlFor="Quantity"/>
                                                                                        <TextInput type="number" autoComplete='off' value={editExpenseData.quantity} onChange={(e) => setEditExpenseData((prevData) => ({
                                                                                            ...prevData,
                                                                                            quantity: e.target.value
                                                                                        }))} className={errorQuantity ? "w-full border-pink-700 text-pink-700 focus:border-pink-700 focus:ring-pink-700" : "w-full"} id="nama"/>
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
                                                                                <Button color="success" type="button" onClick={() => editExpensesIdData(editExpenseData.id)}>Submit</Button>
                                                                            </div>
                                                                            </form>
                                                                            </div>
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
                                                                                <Button color="danger" onClick={() => deleteExpensesData(d.id)}>Delete</Button>
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

export default ExpenseIndex;
