const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  async function getAPIData () {
    const searchTerms = document.querySelector('[placeholder="Marca, tipo de producto ..."]').value;
    const body = { searchTerms };
    const response = await fetch('https://www.veepee.es/ns-sd/frontservices/2.1/salespace/search', {
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
      method: 'POST',
    });
    const data = await response.json();
    return data;
  }
  async function scrollProducts (apiData) {
    const productCount = apiData.datas.productDetails.map(elm => elm.productsDetails.length).reduce((a, b) => a + b);
    const maxResults = Math.min(productCount, 150);
    while (document.querySelectorAll('div.productItem').length < maxResults) {
      const prevCount = document.querySelectorAll('div.productItem').length;
      const lastProduct = document.querySelector('[data-facil-iti="search--past-sales-table"]');
      lastProduct.scrollIntoView({
        behavior: 'smooth',
      });
      await context.waitForFunction((prevCount) => {
        return !(prevCount < document.querySelectorAll('div.productItem').length);
      }, prevCount);
    }
  }
  await context.click('#react-tabs-0');
  const apiData = await context.evaluate(getAPIData);
  await context.evaluate(scrollProducts, apiData);
  return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'ventePrivee',
    transform,
    domain: 'veepee.es',
    zipcode: '',
  },
  implementation,
};
