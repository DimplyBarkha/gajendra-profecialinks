module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'drizly.com',
    timeout: 30000,
    jsonToTable: null,
    country: 'US',
    store: 'drizly',
    zipcode: '',
    storeaddress: '',
    storecity: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.stop();
    async function getJsonData (url) {
      await context.goto(url, { timeout: 60000, waitUntil: 'networkidle0', checkBlocked: false });
      const json = await context.evaluate(() => document.body.innerText);
      return JSON.parse(json);
    }
    async function getJsonDataFetch (url) {
      const jsonResponse = await context.evaluate(async function (url) {
        const response = await fetch(url, {
          accept: 'application/json, text/plain, */*',
          referrer: window.location.href,
          referrerPolicy: 'no-referrer-when-downgrade',
          body: null,
          method: 'GET',
          mode: 'cors',
        });
        if (response && response.status === 404) {
          return null;
        }

        if (response && response.status === 200) {
          return await response.json();
        }
      }, url);
      return jsonResponse;
    };
    await context.goto('https://drizly.com/home', { timeout: 60000, waitUntil: 'networkidle0', checkBlocked: false });
    const jsonLatLong = await getJsonDataFetch('https://e09fh9i12d.execute-api.us-east-1.amazonaws.com/dev/zip-code-radius-solve?radius=0');

    let foundLatLong = null;
    for (let i = 0; i < jsonLatLong.length; i++) {
      if (jsonLatLong[i][0] === zipcode) {
        foundLatLong = jsonLatLong[i];
        break;
      }
    }
    console.log('jsonlatlongg  ');
    // console.log(jsonLatLong);
    console.log(foundLatLong)
    if (!foundLatLong) {
      throw new Error('No Zip code found.');
    }
    const storeInfo = await getJsonDataFetch(`https://drizly.com/modal/resolve_stores.json?latitude=${foundLatLong[2]}&longitude=${foundLatLong[1]}&zip=${zipcode}`);
    const { address, city, state, zip, delivery_type, latitude, longitude} = storeInfo.stores[0];

    await context.evaluate(async function (address, city, state, zip, delivery_type, latitude, longitude) {
      const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

      const response = await fetch('https://drizly.com/location/async_create', {
        headers: {
          accept: 'application/json',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          pragma: 'no-cache',
          'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-csrf-token': csrf,
          'x-requested-with': 'XMLHttpRequest',
        },
        referrer: window.location.href,
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `{"persist":false,"address":{"address1":"${address}","city":"${city}","state":"${state}","zip":"${zip}","country_code":"US","latitude":${latitude},"longitude":${longitude}},"delivery_types":${delivery_type},"is_gift_browse_experience":false}`,
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
      });
      if (response && response.status === 400) {
        throw new Error('Error when calling API');
      }

      if (response && response.status === 404) {
        console.log('stateIsoCode Not Found!!!!');
      }

      if (response && response.status === 200) {
        const json = await response.text();
        console.log('json fdfdf');
        console.log(json);
        return json;
      }
    }, address, city, state, zip, delivery_type, latitude, longitude);

    await context.goto(url, { timeout: 60000, waitUntil: 'networkidle0', checkBlocked: false });
    // await context.goto('https://drizly.com/liquor/whiskey/american-whiskey/jack-daniels-gentleman-jack-tennessee-whiskey/p3473?variant=4606', { timeout: 60000, waitUntil: 'networkidle0', checkBlocked: false });
  },
};
