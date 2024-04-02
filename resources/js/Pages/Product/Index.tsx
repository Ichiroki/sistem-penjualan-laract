import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

function ProductIndex({auth}) {
    return (
        <Authenticated
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Product</h2>}>
            <Head title="Product" />
        </Authenticated>
    );
}

export default ProductIndex;
