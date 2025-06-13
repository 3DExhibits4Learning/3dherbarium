// 'use client'

// import { Button } from "@heroui/react"

// export default function updateThumbnail() {
//     return (
//         <>
//             <div className="h-full w-1/3 flex flex-col items-center border border-[#004C46]">
//                 <label className='text-2xl block mb-2'>Update Model Thumbnail</label>
//                 <input
//                     ref={uid as LegacyRef<HTMLInputElement>}
//                     type='text'
//                     className={`w-3/5 max-w-[500px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
//                     placeholder="Enter UID"
//                 >
//                 </input>
//                 <Button
//                     className="w-1/2 text-white bg-[#004C46]"
//                     onClick={() => thumbnailHandler((uid.current as HTMLInputElement).value, false)}
//                 >
//                     Update
//                 </Button>
//             </div>

//             <div className="h-full w-1/3 flex flex-col items-center border border-[#004C46]">
//                 <label className='text-2xl block mb-2'>Update Community Thumbnail</label>
//                 <input
//                     ref={communityUid as LegacyRef<HTMLInputElement>}
//                     type='text'
//                     className={`w-3/5 max-w-[500px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
//                     placeholder="Enter UID"
//                 >
//                 </input>
//                 <Button
//                     className="w-1/2 text-white bg-[#004C46]"
//                     onClick={() => thumbnailHandler((communityUid.current as HTMLInputElement).value, true)}
//                 >
//                     Update
//                 </Button>
//             </div>
//         </>
//     )
// }