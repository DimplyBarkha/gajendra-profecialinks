async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // const checkExsistance = async (selector) => {
  //   return await context.evaluate(async (selector) => {
  //     return Boolean(document.querySelector(selector));
  //   }, selector);
  // };
  // const closeButtonSelector = 'button[aria-label="Close"]';
  // const isPresent = await checkExsistance(closeButtonSelector);
  // if (isPresent) {
  //   await context.click(closeButtonSelector);
  //   console.log('close button clicked successfully');
  // }
  await context.evaluate(() => {
    if (document.querySelector('div.error-container')) {
      throw new Error('Not a product Page');
    }
  });
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
    const description = document.querySelectorAll("div.description");
    
    if(description.length) {
      let descriptionContent = '';
      for (const desc of description) {
        descriptionContent = descriptionContent +' '+ desc.textContent;
      }
      document.body.setAttribute('description', descriptionContent);
      const newDiv = document.createElement('div');
      newDiv.id = 'description';
      newDiv.textContent = descriptionContent;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelector("div.about-this-product");
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
  });
  return await context.extract(productDetails, { transform });
}

const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'grocerygateway',
    transform: cleanUp,
    domain: 'grocerygateway.com',
    zipcode: '',
  },
  implementation,
};
