async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    try {
      const isCookieSelector = document.querySelector('div.ot-sdk-container div#onetrust-close-btn-container button.onetrust-close-btn-handler');
      if (isCookieSelector) {
        isCookieSelector.click();
      }
    } catch (err) {
      console.log('No cookie selector loaded' + err);
    }
    // const skuArray = []
    // const gtinArray = []
    // const availabilityArray = []
    // const currencyArray = []
    // const priceArray = []
    // const reviewArray = []
    // const ratingArray = []

    // const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    // scripts.forEach((element) => {
    //   let jsonData = JSON.parse(element && element.innerText);
    //   skuArray.push(jsonData && jsonData.sku)
    //   gtinArray.push(jsonData && jsonData.gtin13)
    //   availabilityArray.push(jsonData && jsonData.offers && jsonData.offers.availability)
    //   currencyArray.push(jsonData && jsonData.offers && jsonData.offers.priceCurrency)
    //   priceArray.push(jsonData && jsonData.offers && jsonData.offers.price)
    //   reviewArray.push(jsonData && jsonData.aggregateRating && jsonData.aggregateRating.reviewCount)
    //   ratingArray.push(jsonData && jsonData.aggregateRating && jsonData.aggregateRating.ratingValue)
    // })
    // const actualAvailabilityArray = [];
    // availabilityArray.forEach((element) => {
    //   if (element.includes('InStock')) {
    //     actualAvailabilityArray.push('In Stock');
    //   } else {
    //     actualAvailabilityArray.push('Out Of stock');
    //   }
    // })
    // try {
    // await context.waitForSelector('div[class="react-viewer-canvas"]>img', { timeout: 50000 });
  // console.log(`selector loaded successfully`)
  // } catch (e) {
  //   console.log(`selector did not load at all`);
  // }
  });

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'petsmart',
    transform: null,
    domain: 'petsmart.com',
    zipcode: '',
  },
  implementation,
};
