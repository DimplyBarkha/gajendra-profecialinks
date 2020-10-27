const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NO',
    store: 'meny',
    transform: cleanUp,
    zipcode: ' ',
    domain: 'meny.no',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async () => {
      // const { transform } = parameters;
      const informationDiv = document.createElement('div');
      informationDiv.className = 'information';
      const manufacturerInfo = document.querySelector('ul[class*="manufacturer-info"] > li:first-child > strong');
      if (manufacturerInfo) {
        informationDiv.setAttribute('manufacturer', manufacturerInfo.innerText)
      }
      const info = document.querySelectorAll('ul[class*="manufacturer"] > li > strong');
      if (info.length) {
        [...info].forEach((elem) => {
          if (elem.innerText == 'Merke:') {
            const actualDiv = elem.parentElement;
            const brand = actualDiv.innerText.replace(/(.+)(:)(.+)/g, '$3');
            informationDiv.setAttribute('brand', brand.trim())
          }
          if (elem.innerText == 'Opprinnelsesland:') {
            const actualDiv = elem.parentElement;
            const countryOfOrigin = actualDiv.innerText.replace(/(.+)(:)(.+)/g, '$3');
            informationDiv.setAttribute('countryoforigin', countryOfOrigin.trim())
          }
          if (elem.innerText == 'EAN:') {
            const actualDiv = elem.parentElement;
            const ean = actualDiv.innerText.replace(/(.+)(:)(.+)/g, '$3');
            informationDiv.setAttribute('ean', ean.trim())
          }
        })
      }
      document.body.append(informationDiv);

      const informationButtons = document.querySelectorAll('div[class*="product-details"] > button > span');
      if (informationButtons.length) {
        const nutritionButton = [...informationButtons].find(elem => elem.innerText == 'Næringsinnhold');
        if (nutritionButton) {
          nutritionButton.click();
          await new Promise(res => setTimeout(res, 10000))
        }
      }
    })
    return await context.extract(productDetails);
  },
};
