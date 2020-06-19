const { implementation } = require('../../../../execute');

async function localImplementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('\n\n DOING SOMETHING.. \n\n');
  const primeZipCode = parameters.store.match(/\d{5}/g)[0];

  context.primeZipCode = () => primeZipCode;

  return await implementation(inputs, parameters, context, dependencies);
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimeNow75204',
    domain: 'primenow.amazon.com',
    url: 'https://primenow.amazon.com/search?k={searchTerms}&p_95=&merchantId=&ref_=pn_sr_nav_sr_ALL',
    loadedSelector: 'li.product_grid__item__1eRlB',
    noResultsXPath: 'div.index__shopAmazon__12-0r',
  },
  implementation: localImplementation
};
