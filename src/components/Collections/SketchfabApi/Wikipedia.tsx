'use client'

export default function Wikipedia(props: { sketchfabApi: any }) {

    const sketchfabApi = props.sketchfabApi

    return (
        <>
            {
                sketchfabApi.s.wikiSummary &&
                <>
                    <br></br>
                    <h1 className='fade text-center text-[1.5rem]'>Description</h1>
                    <p dangerouslySetInnerHTML={{ __html: sketchfabApi.s.wikiSummary.extract_html }} className='fade text-center pr-[1.5%] pl-[0.5%]'></p>
                    <br></br>
                    <p className='fade text-center text-[0.9rem]'>from <a href={sketchfabApi.s.wikiSummary.content_urls.desktop.page} target='_blank'><u>Wikipedia</u></a></p>
                </>
            }
        </>
    )
}