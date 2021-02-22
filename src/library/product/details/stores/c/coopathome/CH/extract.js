const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log('inputs:: ', inputs);
  let { url, id } = inputs;
  console.log('parameters:: ', parameters);
  let lastResponseData;
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  if (id) {
    const prodUrl = await context.evaluate(() => {
      const urlSel = document.querySelector('div.productTile__wrapper a');
      if (urlSel) {
        return urlSel.href;
      } else {
        return '';
      }
    });
    console.log('prodUrl is::::::::::: ', prodUrl);

    if (prodUrl && prodUrl.length > 0) {
      await context.goto(prodUrl, { timeout: 80000, waitUntil: 'load', checkBlocked: true });
    } else{
      console.log("Url not found, calling  context.reportBlocked()");
      context.reportBlocked(451, "Proxy issue");
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'coopathome',
    transform: transform,
    domain: 'coop.ch',
    zipcode: '',
  },
  implementation,
};
