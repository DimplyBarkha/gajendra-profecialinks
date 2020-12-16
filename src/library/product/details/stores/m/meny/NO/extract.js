const { cleanUp } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NO',
    store: 'meny',
    transform: cleanUp,
    zipcode: ' ',
    domain: 'meny.no',
  },
  implementation: async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    // if (inputs.zipcode || inputs.storeId) {
    //   await context.evaluate((inputs) => {
    //     // const newDiv = document.createElement('div');
    //     // newDiv.setAttribute('class','waquas');
    //     // newDiv.textContent = inputs.zipcode;
    //     document.body.setAttribute('itsdrive', inputs.zipcode);
    //     document.body.setAttribute('itsretailer', inputs.storeId);
    //   }, inputs);
    // }
    const { transform } = parameters;
    const { productDetails } = dependencies;
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
    await context.waitForSelector('div[class*="topmenu__secondary"]>div[class*="topmenu__order"]>span[class*="topmenu__order"]>.ws-handover-picker>div>button>span');
    await context.click('div[class*="topmenu__secondary"]>div[class*="topmenu__order"]>span[class*="topmenu__order"]>.ws-handover-picker>div>button>span');
    await context.waitForSelector('fieldset>div>div:nth-child(2)>[class*="ws-radio-item"]>span:nth-child(2)');
    await context.click('fieldset>div>div:nth-child(2)>[class*="ws-radio-item"]>span:nth-child(2)');
    return await context.extract(productDetails, { transform });
  },
};
