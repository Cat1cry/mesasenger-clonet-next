"use client";

import { User } from "@prisma/client";
import React from "react";
import UserBox from "./UserBox";

interface UserListProps {
    items: User[];
}

const UserList: React.FC<UserListProps> = ({ items }) => {
    return (
        <aside className=' border-gray-200pb-20 fixed inset-y-0 left-0 block w-full overflow-y-auto border-r lg:left-20 lg:block lg:w-80 lg:pb-0'>
            <div className='px-5'>
                <div className='flex-col '>
                    <div className='py-2 text-2xl font-bold text-neutral-800'>
                        People
                    </div>
                </div>
                {items.map((item) => (
                    <UserBox key={item.id} data={item} />
                ))}
            </div>
        </aside>
    );
};

export default UserList;
