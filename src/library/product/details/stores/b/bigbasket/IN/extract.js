const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'bigbasket',
    transform,
    domain: 'bigbasket.com',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      const finalArray = [];
      let first = '';
      const data = window.__PRELOADED_STATE__;

      function getElementsByXPath(xpath, parent) {
        const results = [];
        const query = document.evaluate(xpath, parent || document,
          null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0, length = query.snapshotLength; i < length; ++i) {
          const node = query.snapshotItem(i) && query.snapshotItem(i).textContent && query.snapshotItem(i).textContent.trim();
          results.push(node);
        }
        return results.filter(e => e);
      }
      const dataArr = getElementsByXPath('//*[contains(@id,"about")]/div[2]/div//div/text() | //*[@id="about_3"]/div[2]/div/div//p');
      const country = dataArr.find(element => element.includes('Country'));
      const manufacture = dataArr.find(element => element.includes('Marketed by') || element.includes('Address :') || element.includes('Manufactured') || element.includes('Manufacturer'));
      const gtin = dataArr.find(element => element.includes('EAN'));
      const size = data && data.product && data.product.variants && data.product.variants[0].w || '';

      if (data && data.product && data.product.variants.length > 1) {
        first = data && data.product && data.product.variants[0].id;
      }

      const variants = data && data.product && data.product.variants.map(e => e.id).slice(1);
      const directionData = document.evaluate('//span[contains(text(),"HOW TO USE")]/parent::div/following-sibling::div[1] | //span[contains(text(),"How to Use")]/parent::div/following-sibling::div[1]', document, null, XPathResult.ANY_TYPE, null).iterateNext() && document.evaluate('//span[contains(text(),"HOW TO USE")]/parent::div/following-sibling::div[1] | //span[contains(text(),"How to Use")]/parent::div/following-sibling::div[1]', document, null, XPathResult.ANY_TYPE, null).iterateNext().innerText.trim() || '';
      let direction = '';
      if (directionData && directionData.includes('Storage')) {
        direction = directionData.split('Storage')[0];
      } else {
        direction = directionData;
      }

      const obj = { country, manufacture, gtin, size, variants, first, direction };

      finalArray.push(obj);

      if (finalArray) {
        for (const key in finalArray[0]) {
          document.querySelector('h1').setAttribute(key, finalArray[0][key]);
        }
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
