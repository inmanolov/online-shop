import React from "react";
import { useRouter } from "next/router";

const Unauthorized = () => {
    const router = useRouter();
    const { message } = router.query;

    return(
        <div>
            <h1 className="text-xl">Access Denied</h1>
            {message && <div className="mb-4 text-red-500">{message}</div>}
        </div>
    );
};

export default Unauthorized;