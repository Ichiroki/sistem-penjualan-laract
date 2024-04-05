import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import PieChart from '@/Components/PieChart';

export default function Dashboard({ auth }: PageProps) {

    

    const chartData = {
        labels: ['A', 'B', 'C'],
        datasets: [
            {
                data: [30, 50, 20],
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56']
            }
        ]
    };

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
                        <PieChart data={chartData}/>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
