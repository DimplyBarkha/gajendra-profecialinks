const { transform } = require('./format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  async function addRecommendedProducts () {
    const cookieId = window.dataLayerObject.userId;
    const response = await fetch(`https://cors-anywhere.herokuapp.com/https://e.cquotient.com/recs/bdwn-STFI/basic-product-recommendation?cookieId=${cookieId}`, {
      headers: {
        accept: '*/*',
        'accept-language': 'en-GB,en;q=0.9',
        'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
        'sec-ch-ua-mobile': '?0',
        'sec-fetch-dest': 'script',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'cross-site',
      },
      referrerPolicy: 'same-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
    });
    const json = await response.json();
    const pdp = Object.values(json).find(key => key.hasOwnProperty('recs')).recs.map(product => product.product_name).join('|');
    document.body.setAttribute('updp', pdp);
  }
  try {
    await context.evaluate(addRecommendedProducts);
  } catch (err) {
    console.log('Error adding UPDP', err);
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'stockmann',
    transform,
    domain: 'stockmann.com',
    zipcode: '',
  },
  implementation,
};
