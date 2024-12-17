import Header from "@/components/Header/Header"
import Foot from "@/components/Shared/Foot"

export default function Page() {
    return (
        <>
            <Header headerTitle="Model Contribution FAQ" pageRoute="collections" />
            <main className="min-h-[calc(100vh-177px)] px-8 py-8">
                <h1 className="text-3xl mb-12">About 3D model contribution</h1>
                <h2 className="text-2xl mb-2">How it works</h2>
                <p className="mb-12">
                    Once you have uploaded your 3D model, it will be reviewed and processed so that it optimally appears on the 3D herbarium. Your model will be &quot;pending&quot; during this time.
                    Once approved, it will appear on the collections page with the &quot;community&quot; label in the thumbnail.
                    For wild specimen, an iNaturalist post will also be linked with your model contribution for community identification.
                    Your model will be available to view, update or delete on your dashboard. Contributors agree to submit models/photos under a CC-BY-NC-SA license.
                </p>
                <h2 className="text-2xl mb-2">How long will publishing take?</h2>
                <p className="mb-12">
                    Generally, a business day or two. You will be emailed a confirmation upon upload and a notification when your model is published.
                </p>
                <h2 className="text-2xl mb-2">What changes will be made to my model?</h2>
                <p className="mb-12">
                    The background will be made black to highlight the specimen, any watermarks will be removed, lighting/orientation may be adjusted to make a clear thumbnail.
                </p>
                <h2 className="text-2xl mb-2">What else will be done with my model?</h2>
                <p className="mb-12">
                    Nothing - it will simply be displayed/indexed on the 3D herbarium along with its metadata. We do not share or reproduce contributed models in any way.
                    If you decide to delete your model from the 3D herbarium, we cannot retrieve it.
                </p>
                <h2 className="text-2xl mb-2">Can I contribute on behalf of an institution or organization?</h2>
                <p className="mb-12">
                    We are considering offering instances of the 3D herbarium and 3D exhibits4Learning as a SaaS/CMS,
                    allowing institutions or organizations to customize their own 3D digital herbaria as they wish. 
                    Potential stakeholders should contact ab632@humboldt.edu
                </p>
            </main>
            <Foot />
        </>
    )
}