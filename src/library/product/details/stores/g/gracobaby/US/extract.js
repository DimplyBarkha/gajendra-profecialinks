const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'gracobaby',
    transform: cleanUp,
    domain: 'gracobaby.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    const locationUrl = await context.evaluate(async () => {
      return window.location.href;
    });
    console.log(locationUrl);
    const dataURL = await context.evaluate(async function () {
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      let localURL = window.location.href;
      const sku = getAllXpath('//script[@type="application/ld+json" and contains(text(),"sku")]/text()', 'nodeValue');
      const finalSKU = JSON.parse(sku[0]);
      let Finalsku = finalSKU.sku.replace('SAP_', '');
      let Frameurl = "https://content.syndigo.com/page/006eb996-6362-42ff-99b0-389a3502c5cc/{1}.json?u=90B1B9E8-46FB-4520-BCEB-1428D0F74052&prtnid=006eb996-6362-42ff-99b0-389a3502c5cc&siteid=006eb996-6362-42ff-99b0-389a3502c5cc&pageid=1988647&s=1612341006904&v=v1.0.122&visitid=2C26B62D-FCAC-4700-9D1A-9CF983D94051&ref=&r=0.6235173545457959&pageurl={2}"
      let FinalFrameUrl = Frameurl
        .replace('{1}', Finalsku)
        .replace('{2}', localURL);
      return FinalFrameUrl;
    });
    context.goto(dataURL, { timeout: 60000 });
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await context.evaluate(async function () {
      const wholeData = document.querySelector('pre').innerText;
      console.log('sai');
      console.log(wholeData);
      let FinalwholeData = JSON.parse(wholeData);
    });
    
    return await context.extract(productDetails);
  },
};
