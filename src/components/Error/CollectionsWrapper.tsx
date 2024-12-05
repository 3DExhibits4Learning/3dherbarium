'use client'

import Header from "../Header/Header"
import Foot from "../Shared/Foot"

export default function CollectionsWrapperIdError(props:{specimenName: string}) {
    return (
        <>
            <Header headerTitle={props.specimenName} pageRoute='collections' />
            <section className='min-h-[calc(100vh-177px)]'>
                <p>Model not found</p>
            </section>
            <Foot />
        </>
    )
}