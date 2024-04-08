import DeliveriesChart from '@/Components/Dashboard/DeliveriesChart'
import ProductChart from '@/Components/Dashboard/ProductChart'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { PageProps } from '@/types'
import { Head } from '@inertiajs/react'

export default function Dashboard({ auth }: PageProps) {


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <ProductChart />
                            <DeliveriesChart />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
