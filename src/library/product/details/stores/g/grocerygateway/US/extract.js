async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const checkExsistance = async (selector) => {
    return await context.evaluate(async (selector) => {
      return Boolean(document.querySelector(selector))
    }, selector)
  }
  const closeButtonSelector = 'button[aria-label="Close"]';
  const isPresent = await checkExsistance(closeButtonSelector);
  if (isPresent) {
    await context.click(closeButtonSelector);
    console.log('close button clicked successfully');
  }
  await context.evaluate(() => {
    const sellerScript = document.querySelector('script[type="application/ld+json"]');
    const jsonData = sellerScript && sellerScript.innerText;
    const sellerData = jsonData && JSON.parse(jsonData);
    const seller = sellerData.legalName;
    const productUrl = window.location.href;
    const appendElement = document.querySelector('div[class="about-sku-section"]');
    const scriptData3 = [...document.querySelectorAll('script[type="application/ld+json"]')] && [...document.querySelectorAll('script[type="application/ld+json"]')][1];
    const json = JSON.parse(scriptData3 && scriptData3.innerText);
    const priceCurrency = json && json['@graph'][0] && json['@graph'][0].offers && json['@graph'][0].offers.priceCurrency;
    const availabilityStatus = json && json['@graph'][0] && json['@graph'][0].offers && json['@graph'][0].offers.availability;
    const normalImage = json && json['@graph'][0] && json['@graph'][0].image[0];
    appendElement.setAttribute('producturl', productUrl);
    appendElement.setAttribute('pricecurrency', priceCurrency);
    appendElement.setAttribute('availability', availabilityStatus);
    appendElement.setAttribute('normalimage', normalImage);
    appendElement.setAttribute('seller', seller);
  })
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'grocerygateway',
    transform: null,
    domain: 'grocerygateway.com',
    zipcode: '',
  },
  implementation,
};
