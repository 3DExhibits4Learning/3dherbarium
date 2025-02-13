import { OAuthConfig, OAuthUserConfig } from "next-auth/providers/index"
import { TokenSet } from "next-auth"

function iNaturalistProvider(options: OAuthUserConfig<Record<string, any>>): OAuthConfig<Record<string, any>> {
    return {
        id: "inaturalist",
        name: "iNaturalist",
        type: "oauth",
        authorization: {
            url: "https://inaturalist.org/oauth/authorize",
            params: { scope: 'write' }
        },
        token: {
            async request(context) {

                // iNaturalist JWT's expire after 24 hours

                const getExpirationDate = () => {
                    const date = new Date()
                    const dateWithoutMilleseconds = Math.round(date.getTime() / 1000)
                    const expiration = dateWithoutMilleseconds + 86399
                    return expiration
                }

                // POST request object to send to older api

                const credentials = {
                    'client_id': process.env.INATURALIST_ID,
                    'client_secret': process.env.INATURALIST_SECRET,
                    'code': context.params.code,
                    'redirect_uri': process.env.INATURALIST_REDIRECT,
                    'grant_type': 'authorization_code'
                }

                // Fetching oauth access_token from older api

                const old_token = await fetch("https://www.inaturalist.org/oauth/token", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(credentials)
                })
                    .then(res => res.json())
                    .then(json => json.access_token)

                // Fetching oauth api_token from newer api

                const tokens : TokenSet = {
                    access_token: await fetch("https://www.inaturalist.org/users/api_token", {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${old_token}`
                        }
                    })
                        .then(res => res.json())
                        .then(json => json.api_token),
                    expires_at: getExpirationDate()
                }
                return { tokens }
            }
        },
        userinfo: "https://www.inaturalist.org/users/edit.json",
        profile(profile: any) {
            return {
                id: profile.id,
                name: profile.name,
                email: profile.email,
            }
        },
        style: {
            logo: '../../iNatLogo.png',
            bg: "#FFFFFF",
            text: "#000000"
        },
        options
    }
}
export default iNaturalistProvider 