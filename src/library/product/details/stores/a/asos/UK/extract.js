async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    // const variantData = window.asos.pdp.config.product;
    // const variantId = [];
    // const variantColour = [];
    // variantData.variants.forEach((element) => {
    //   variantId.push(element.variantId);
    //   variantColour.push(element.colour);
    // });
    // const appendElements = document.querySelectorAll('select[data-id*="sizeSelect"] > option:not(:first-child)');
    // appendElements.forEach((element, index) => {
    //   element.setAttribute('variantid', variantId[index]);
    //   element.setAttribute('colour', variantColour[index]);
    // })
    const urlElement = document.querySelector('meta[property="og:url"]');
    const url = urlElement && urlElement.getAttribute('content');
    const id = url.match(/\d+/g)[0];
    const apiLink = `https://www.asos.com/api/product/catalogue/v3/stockprice?productIds=${id}&store=ROW&currency=GBP&keyStoreDataversion=j42uv2x-26`
    const response = await fetch(apiLink);
    const responseData = await response.json();
    const rpc = responseData[0].productCode;
    const variantIdarray = [];
    const skuArray = [];
    responseData[0].variants.forEach((element) => {
      variantIdarray.push(element.variantId);
      skuArray.push(element.sku);
    })
    const appendElements = document.querySelectorAll('select[data-id*="sizeSelect"] > option:not(:first-child)');
    appendElements.forEach((element, index) => {
      element.setAttribute('upc', variantIdarray[index]);
      element.setAttribute('sku', skuArray[index]);
      element.setAttribute('rpc', rpc);
    })
    const variantData = window.asos.pdp.config.product;
    const variantColour = [];
    variantData.variants.forEach((element) => {
      variantColour.push(element.colour);
    });
    const appendElement = document.querySelectorAll('select[data-id*="sizeSelect"] > option:not(:first-child)');
    appendElement.forEach((element, index) => {
      element.setAttribute('colour', variantColour[index]);
    })
  })
  return await context.extract(productDetails, { transform });
}
const { cleanUp } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'asos',
    transform: cleanUp,
    domain: 'asos.com',
    zipcode: '',
  },
  implementation,
};
