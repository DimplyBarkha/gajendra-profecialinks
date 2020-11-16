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
      function getElementsByXPath (xpath, parent) {
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
      const CountryOfOrigin = dataArr.find(element => element.includes('Country'));
      const MarketedBy = dataArr.find(element => element.includes('Marketed by') || element.includes('Address :') || element.includes('Manufactured') || element.includes('Manufacturer'));
      const gtin = dataArr.find(element => element.includes('EAN'));
      document.body.setAttribute('gtin', gtin);
      document.body.setAttribute('country', CountryOfOrigin);
      document.body.setAttribute('manufacture', MarketedBy);

      const data = window.__PRELOADED_STATE__;

      const variant = data && data.product && data.product.variants && data.product.variants[0].w;
     if(variant) {
      const newlink = document.createElement('div');
      newlink.setAttribute('class', 'variant-information');
      newlink.innerText = variant;
      document.body.appendChild(newlink);
     }
      
      if(data && data.product && data.product.variants.length > 1){
        var firstVariant = data && data.product && data.product.variants[0].id;
        const newlink = document.createElement('div');
        newlink.setAttribute('class', 'first-variant');
        newlink.innerText = firstVariant;
        document.body.appendChild(newlink);
        }

      const variantArr = data && data.product && data.product.variants.map(e => e.id).slice(1);
      variantArr.forEach(element => {
        const newlink = document.createElement('div');
        newlink.setAttribute('class', 'variant');
        newlink.innerText = element;
        document.body.appendChild(newlink);
      });
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
