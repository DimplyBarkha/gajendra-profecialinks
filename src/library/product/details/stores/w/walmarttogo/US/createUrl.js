async function implementation (inputs,parameters,context,dependencies) {
  const { id } = inputs;
  const { domain, prefix, suffix } = parameters;
  /* API to get storeID from zipcode, currently hardcoding using storeIdObj as API might get blocked.
  async function getStoreId(zipcode) {
    const response = await fetch(`https://www.walmart.com/grocery/v4/api/serviceAvailability?postalCode=${zipcode}`, {
    "headers": {
      "accept": "application/json",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,de;q=0.7,fi;q=0.6,sv;q=0.5,nb;q=0.4,ja;q=0.3,he;q=0.2,ro;q=0.1,pl;q=0.1,th;q=0.1,nl;q=0.1,pt;q=0.1",
      "content-type": "application/json",
      "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  });
  const json = await response.json();
  return json.accessPointList[0].assortmentStoreId || json.accessPointList[0].dispenseStoreId;
  }*/

  // Add zipCode-StoreId map.
  const storeIdObj = {
    '20166': '2038'
  }
  if(!inputs.storeId && inputs.zipcode) {
    inputs.storeId = storeIdObj[inputs.zipcode] && storeIdObj[inputs.zipcode.toString()];
  }
  if (parameters.url) {
    let storeId = inputs.storeId || 5334;
    let zipcode = inputs.zipcode || '';
    const url = parameters.url.replace('{id}', encodeURIComponent(id));
    return url + `&storeId=${storeId}#zipcode=${zipcode}`;
  }
}
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'walmarttogo.api',
    prefix: null,
    url: 'https://www.walmart.com/grocery/v3/api/products/{id}?itemFields=all&nutritionPrescriptive=true',
    country: 'US',
    store: 'walmarttogo',
  },
  implementation
};
