export default async function refreshAccessToken() {
    const refreshOptions = {
        client_id: process.env.REACT_APP_GOOGLE_ACCOUNT_CLIENT_ID,
        client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
        refresh_token: process.env.REACT_APP_GOOGLE_SHEET_REFRESH_TOKEN,
        grant_type: 'refresh_token'
    }
    const fetchOptions = {
        method: 'POST',
        body: JSON.stringify(refreshOptions)
    }
    const refreshResponse = await fetch('https://www.googleapis.com/oauth2/v3/token', fetchOptions)
    if (!refreshResponse.ok) {
        throw new Error(`Token refresh failed`)
    }
    const json = await refreshResponse.json()
    // console.log(json, "accessToken")
    return json.access_token
}



