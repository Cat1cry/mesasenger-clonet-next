"use client";

import EmptyState from "../components/EmptyState";

const Users = () => {
    return (
        <div className='hidden lg:block lg:pl-80 h-full bg-dark-300'>
            <EmptyState />
        </div>
    );
};

export default Users;
