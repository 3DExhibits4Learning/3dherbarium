'use client'

export default function Leaderboards(props: { identifiers: any[] | undefined, observers: any[] | undefined }) {
    return (
        <>
            {
                props.observers &&
                <div className='grid grid-cols-3 w-[95%] h-[45%] my-4 border rounded-xl'>
                    <div className="flex border-b justify-center items-center">#</div>
                    <div className="flex border-b justify-center items-center">Observer</div>
                    <div className="flex border-b justify-center items-center">Observations</div>
                    {props.observers.map((observer, index) => {
                        //@ts-ignore
                        if (index == props.observers.length - 1) {
                            return (
                                <>
                                    <div className="flex justify-center items-center">{index + 1}</div>
                                    <div className="flex justify-center items-center">{observer.user.login_exact}</div>
                                    <div className="flex justify-center items-center">{observer.count}</div>
                                </>
                            )
                        }
                        return (
                            <>
                                <div className="flex border-b justify-center items-center">{index + 1}</div>
                                <div className="flex border-b justify-center items-center">{observer.user.login_exact}</div>
                                <div className="flex border-b justify-center items-center">{observer.observation_count}</div>
                            </>
                        )
                    })}
                </div>

            }
            {
                props.identifiers &&
                <div className='grid grid-cols-3 w-[95%] h-[45%] my-4 border rounded-xl'>
                    <div className="flex border-b justify-center items-center">#</div>
                    <div className="flex border-b justify-center items-center">Identifier</div>
                    <div className="flex border-b justify-center items-center">Identifications</div>
                    {props.identifiers.map((identifier, index) => {
                        //@ts-ignore
                        if (index == props.identifiers.length - 1) {
                            return (
                                <>
                                    <div className="flex justify-center items-center">{index + 1}</div>
                                    <div className="flex justify-center items-center">{identifier.user.login_exact}</div>
                                    <div className="flex justify-center items-center">{identifier.count}</div>
                                </>
                            )
                        }
                        return (
                            <>
                                <div className="flex border-b justify-center items-center">{index + 1}</div>
                                <div className="flex border-b justify-center items-center">{identifier.user.login_exact}</div>
                                <div className="flex border-b justify-center items-center">{identifier.count}</div>
                            </>
                        )
                    })}
                </div>
            }
        </>
    )
}