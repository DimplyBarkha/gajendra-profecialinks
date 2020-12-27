async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(() => {
    const scriptData = document.querySelector('script[type="application/ld+json"]') && document.querySelector('script[type="application/ld+json"]').innerText;
    const jsonData = scriptData && JSON.parse(scriptData);
    const variantUrls = jsonData && jsonData.offers && jsonData.offers.offers && jsonData.offers.offers.map(element => element && element.url);
    const variantId = [];
    variantUrls.forEach((element) => {
      variantId.push(element.replace(/(.+)(id=)(\d+)/g, '$3'));
    });
    variantUrls.forEach((element, index) => {
      const variantDataElement = document.createElement('div');
      variantDataElement.className = 'variantid';
      variantDataElement.setAttribute('variantid', variantId[index]);
      document.body.append(variantDataElement);
    });
  });
  return await context.extract(productDetails, { transform });
}
const { cleanUp } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'shopmylocal',
    transform: cleanUp,
    domain: 'shopmylocal.com.au',
    zipcode: '',
  },
  implementation,
};
