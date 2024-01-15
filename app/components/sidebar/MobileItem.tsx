"use client";

import Link from "next/link";
import clsx from "clsx";
import React from "react";

interface MobileItemProps {
    href: string;
    icon: any;
    onClick?: () => void;
    active?: boolean;
}

const MobileItem: React.FC<MobileItemProps> = ({
    href,
    icon: Icon,
    onClick,
    active,
}) => {
    const handleClick = () => {
        if (onClick) {
            return onClick();
        }
    };
    return (
        <Link
            onClick={onClick}
            href={href}
            className={clsx(
                `
                group
                flex
                w-full
                justify-center
                gap-x-3
                p-4 text-sm
                font-semibold
                leading-6
                text-gray-500
                hover:bg-gray-100
                hover:text-sky-600`,
                active && "bg-gray-100 text-sky-600",
            )}
        >
            <Icon className='h-6 w-6' />
        </Link>
    );
};

export default MobileItem;
