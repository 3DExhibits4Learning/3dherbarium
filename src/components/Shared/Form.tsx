'use client'

import { ReactNode } from "react";

export default function Form({ children, title, width }: { children?: ReactNode, title?: string, width?: string }) {
    return (
        <>
            <form className={`flex-col h-full ${width ? width : 'w-full'} px-12 pt-8 pb-12 bg-[#D5CB9F] dark:bg-[#212121] rounded-xl border-2 dark:border-1 border-[#004C46] dark:border-[#F5F3E7]`}>
                {
                    title &&
                    <h1 className="text-3xl font-medium text-center mb-6">{title}</h1>
                }
                {children}
            </form>
        </>
    )
}