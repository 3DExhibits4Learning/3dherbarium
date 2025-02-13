import { OAuthConfig, OAuthUserConfig } from "next-auth/providers/index"

function SketchfabProvider(options: OAuthUserConfig<Record<string, any>>): OAuthConfig<Record<string, any>> {
    return {
        id: "sketchfab",
        name: "Sketchfab",
        type: "oauth",
        authorization: {
            url: "https://sketchfab.com/oauth2/authorize",
            params: { scope: 'read write' }
        },
        token: "https://sketchfab.com/oauth2/token/",
        userinfo: "https://api.sketchfab.com/v3/me",
        profile(profile: any) {
            return {
                id: profile.uid,
                name: profile.username,
                email: profile.email,
                image: profile.avatar.images[0]?.url,
            }
        },
        style: {
            logo: '../../sketchfab-logo.svg',
            bg: "#FFFFFF",
            text: "#000000"
        },
        options
    }
}
export default SketchfabProvider