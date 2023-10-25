import refreshAccessToken from "./refreshAccessToken";

export default async function fetchSheet(sheetsUrls = []) {
    let accessToken = process.env.REACT_APP_GOOGLE_SHEET_TOKEN;
    const expirationTimestamp = localStorage.getItem('tokenExpiration');
    //if (!accessToken || (expirationTimestamp && Date.now() > parseInt(expirationTimestamp))) {
    // Token is expired or not available, refresh it
    accessToken = await refreshAccessToken();
    localStorage.setItem('tokenExpiration', Date.now() + 3600 * 1000); // Set token expiration to 1 hour from now
    //}
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    const result = await fetchUrls(sheetsUrls, headers)

    return result;
}

function fetchUrls(urlList, headers) {
    let promises = [];
    for (let i = 0; i < urlList.length; i++) {
        if (urlList[i]) {
            promises.push(fetch(urlList[i], { headers }).then(r => r.json()));
        }
    }
    return Promise.all(promises);
}

export async function fetchCoordinates() {
    let accessToken = process.env.REACT_APP_GOOGLE_SHEET_TOKEN;
    const expirationTimestamp = localStorage.getItem('tokenExpiration');
    //if (!accessToken || (expirationTimestamp && Date.now() > parseInt(expirationTimestamp))) {
    // Token is expired or not available, refresh it
    accessToken = await refreshAccessToken();
    localStorage.setItem('tokenExpiration', Date.now() + 3600 * 1000); // Set token expiration to 1 hour from now
    //}
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };
    const response1 = await fetch(process.env.REACT_APP_GOOGLE_SHEET_URL_COORDINATES + 'sheet1', { headers });
    const response2 = await fetch(process.env.REACT_APP_GOOGLE_SHEET_URL_COORDINATES + 'sheet2', { headers });
    const response3 = await fetch(process.env.REACT_APP_GOOGLE_SHEET_URL_COORDINATES + 'sheet3', { headers });

    if (!response1.ok, !response2.ok, !response3.ok) {
        throw new Error(`Sheets request failed with status ${response1.status, response2.status, response3.status}`);
    }
    const json1 = await response1.json();
    const json2 = await response2.json();
    const json3 = await response3.json();

    console.log(json1)

    const jsonArr = [
        ...parseLoc(json1.values),
        ...parseLoc(json2.values),
        ...parseLoc(json3.values),
    ]

    return jsonArr
}

function parseLoc(arr) {
    return arr?.map(([address, geo]) => {
        if (geo && address) {
            const [lat, long] = geo.split(':')
            return {
                address,
                lat, long
            }
        }

        return null
    }) || []
}


// export default async function fetchSheets(sheetUrls) {
//   let accessToken = process.env.REACT_APP_GOOGLE_SHEET_TOKEN;
//   const expirationTimestamp = localStorage.getItem('tokenExpiration');

//   if (!accessToken || (expirationTimestamp && Date.now() > parseInt(expirationTimestamp))) {
//     // Refresh token if needed
//     accessToken = await refreshAccessToken(); 
//     localStorage.setItem('tokenExpiration', Date.now() + 3600 * 1000); 
//   }

//   const headers = {
//     Authorization: `Bearer ${accessToken}`
//   };

//   const sheetPromises = sheetUrls.map(url => {
//     return fetch(url, {headers})
//       .then(res => {
//         if (!res.ok) {
//           throw new Error(`Fetch failed with status ${res.status}`);
//         }
//         return res.json();  
//       })
//   });

//   return Promise.all(sheetPromises);
// }

// // Usage

// const sheetUrls = [
//   process.env.REACT_APP_GOOGLE_SHEET_URL2, 
//   process.env.REACT_APP_GOOGLE_SHEET_URL3,
//   process.env.REACT_APP_GOOGLE_SHEET_URL4
// ];

// const sheets = await fetchSheets(sheetUrls);