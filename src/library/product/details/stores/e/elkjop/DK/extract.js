
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'elkjop',
    transform: null,
    domain: 'elgiganten.dk',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const accCookie = document.querySelector('button.coi-banner__accept');
      if (accCookie) {
        accCookie.click();
      }
    });
    await context.waitForSelector('a#tab-specs-trigger', { timeout: 10000 });
    await context.click('a#tab-specs-trigger');
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const weight = document.evaluate("//td[contains(text(), 'Vægt')]", document, null, XPathResult.STRING_TYPE, null).stringValue;
      if (weight) {
        const formattedWeight = weight.replace(/\n|Vægt|\(|\)\s/g, '');
        addElementToDocument('weight', formattedWeight);
      }
      const detTab = document.querySelector('a#tab-more-info-trigger');
      if (detTab) {
        detTab.click();
      }
    });
    const ratingDiv = 'div.bv_numReviews_text';
    // await context.waitForSelector(ratingDiv, { timeout: 5000 });
    await context.extract(productDetails);
  },
};