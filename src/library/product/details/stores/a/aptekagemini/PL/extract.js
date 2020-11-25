async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(() => {
    //written implementation for getting the brand
    const script = document.querySelectorAll('script[type="application/ld+json"]');
    const ourScript = [...script].find((element) => element.innerText.includes('brand'));
    const jsonData = JSON.parse(ourScript && ourScript.innerText);
    const brand = jsonData && jsonData.brand && jsonData.brand.name;
    const seller = jsonData && jsonData.offers && jsonData.offers.seller && jsonData.offers.seller.name;
    const sku = jsonData && jsonData.sku;
    const gtin = jsonData && jsonData.gtin;
    const manufacturer = jsonData && jsonData.manufacturer && jsonData.manufacturer.name;
    //written implementation for getting the rpc
    const rpcData = document.querySelector('gtm-data-layer-push-product-async[class*="custom-element"]') && document.querySelector('gtm-data-layer-push-product-async[class*="custom-element"]').getAttribute('data');
    const jsonData2 = rpcData && JSON.parse(rpcData);
    const rpc = jsonData2 && jsonData2.ecommerce && jsonData2.ecommerce.detail && jsonData2.ecommerce.detail.products[0] && jsonData2.ecommerce.detail.products[0].dimension22;
    const appendElement = document.createElement('div');
    appendElement.className = 'productinfos';
    appendElement.setAttribute('brand', brand);
    appendElement.setAttribute('seller', seller);
    appendElement.setAttribute('sku', sku);
    appendElement.setAttribute('gtin', gtin);
    appendElement.setAttribute('manufacturrer', manufacturer);
    appendElement.setAttribute('rpc', rpc)
    document.body.append(appendElement);
  })
  return await context.extract(productDetails, { transform });
}
const { cleanUp } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'aptekagemini',
    transform: cleanUp,
    domain: 'aptekagemini.pl',
    zipcode: '',
  },
  implementation,
};
