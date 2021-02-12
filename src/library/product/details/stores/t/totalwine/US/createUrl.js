async function implementation (inputs, parameters, context, dependencies) {
  const { id } = inputs;
  const { goto } = dependencies;
  /* API to get storeID from zipcode */
  // @TODO Find an alternative to not use Fetch.
  async function getStoreId (zipcode) {
    const response = await fetch('https://www.totalwine.com/registry/', {
      headers: {
        accept: 'application/vnd.oc.unrendered+json',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,de;q=0.7,fi;q=0.6,sv;q=0.5,nb;q=0.4,ja;q=0.3,he;q=0.2,ro;q=0.1,pl;q=0.1,th;q=0.1,nl;q=0.1,pt;q=0.1',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
      },
      body: `components%5B0%5D%5Bname%5D=location-slideout-component&components%5B0%5D%5Bversion%5D=1.0.42&components%5B0%5D%5Bparameters%5D%5Btype%5D=GET_STORES&components%5B0%5D%5Bparameters%5D%5Bquery%5D=${zipcode}`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });
    const json = await response.text();
    return json.match(/storeNumber":"([^"]+)/)[1];
  }
  await context.stop();
  // await context.goto('https://www.totalwine.com/', { first_request_timeout: 660000, timeout: 65000, waitUntil: 'load', anti_fingerprint: true, });
  // await new Promise((resolve, reject) => setTimeout(resolve, 35000));
  // const mainurl = 'https://www.totalwine.com/' + '#[!opt!]{"cookie_jar":[{"name":"twm-userStoreInformation","value":"ispStore~402:ifcStore~null@ifcStoreState~US-MD@method~INSTORE_PICKUP"}]}[/!opt!]'
  // await context.goto(mainurl, { first_request_timeout: 660000, timeout: 65000, waitUntil: 'load', anti_fingerprint: true, checkBlocked: false });
  // await new Promise((resolve, reject) => setTimeout(resolve, 93000));


  // async function getStateIsoCode (storeId) {
  //   const stateIsoCode = async function (storeId) {
  //     const response = await fetch(`https://www.totalwine.com/product/api/store/storelocator/v1/store/${storeId}`, {
  //       method: 'GET',
  //       headers: {
  //         accept: 'application/vnd.oc.unrendered+json',
  //         'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,de;q=0.7,fi;q=0.6,sv;q=0.5,nb;q=0.4,ja;q=0.3,he;q=0.2,ro;q=0.1,pl;q=0.1,th;q=0.1,nl;q=0.1,pt;q=0.1',
  //         'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  //         'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
  //         'sec-ch-ua-mobile': '?0',
  //         'sec-fetch-dest': 'empty',
  //         'sec-fetch-mode': 'cors',
  //         'sec-fetch-site': 'same-origin',
  //       },
  //       body: null,
  //       redirect: 'follow',
  //       mode: 'cors',
  //       credentials: 'include',
  //     });
  //     if (response && response.status === 400) {
  //       throw new Error('Error when calling API');
  //     }

  //     if (response && response.status === 404) {
  //       console.log('stateIsoCode Not Found!!!!');
  //     }

  //     if (response && response.status === 200) {
  //       const json = await response.text();
  //       return json.match(/stateIsoCode":"([^"]+)/)[1];
  //     }
  //   // return response.json();
  //   };
  //   // const data = await context.evaluate(stateIsoCode);
  //   // if (data) {
  //   //   return data;
  //   // }
  //   // return null;
  //   try {
  //     const data = await context.evaluate(await stateIsoCode(storeId));
  //     console.log('data');
  //     console.log(data);
  //   } catch (err) {
  //     console.log({ err });
  //     throw new Error('Error when calling API');
  //   }
  // }
  const storeId = inputs.storeId || inputs.StoreID || '1127';
  async function getJsonData (url) {
    // await goto({ url });
    await context.goto(url + '#[!opt!]{"cookie_jar":[{"name":"twm-userStoreInformation","value":"ispStore~402:ifcStore~null@ifcStoreState~US-MD@method~INSTORE_PICKUP"}]}[/!opt!]', { first_request_timeout: 660000, timeout: 65000, waitUntil: 'load', anti_fingerprint: true, checkBlocked: false });
    const json = await context.evaluate(() => document.body.innerText);
    return JSON.parse(json);
  }
  const json = await getJsonData(`https://www.totalwine.com/product/api/store/storelocator/v1/store/${storeId}`);
  const storeIsoCode = json.stateIsoCode;
  const storeName = json.storeName;
  const zipcode = json.zipcode;
  if (!(inputs.storeId || inputs.StoreID) && inputs.zipcode) {
    // API Would require initial goto so avoiding it.
    // inputs.storeId = await getStoreId(inputs.zipcode);

  }
  if (parameters.url) {
    const storeId = inputs.storeId || inputs.StoreID || '1127';
    const zipcode = inputs.zipcode || inputs.Postcode || '95129';
    // const storeIsoCode = await getStateIsoCode(inputs.storeId);
    const url = parameters.url.replace('{id}', encodeURIComponent(id));
    // return url + `&storeId=${storeId}&zipcode=${zipcode}`;
    return url + `&storeId=${storeId}&zipcode=${zipcode}&stateIsoCode=${storeIsoCode}`;
  }
}
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'totalwine.com',
    prefix: null,
    // url: 'https://www.totalwine.com/product/api/product/product-detail/v1/getProduct/{id}?shoppingMethod=INSTORE_PICKUP',

    url: 'https://www.totalwine.com/product/api/product/product-detail/v1/getProduct/{id}?shoppingMethod=INSTORE_PICKUP&state=US-CA',
    country: 'US',
    store: 'totalwine',
    zipcode: '',
  },
  implementation,
};
