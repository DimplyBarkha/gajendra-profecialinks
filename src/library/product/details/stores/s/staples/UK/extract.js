
// @ts-ignore
const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'staples',
    transform: cleanUp,
    domain: 'staples.co.uk',
    zipcode: '',
  },
  // @ts-ignore
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      addElementToDocument('added_url', window.location.href);

      const price = getXpath('//div[@class="formRow"]//span[@id="SkuPriceUpdate"]//text()', 'nodeValue');
      const pricecurrency = getXpath('//div[@class="formRow"]//span[@content="GBP"]//text()', 'nodeValue');
      const weightNet = getXpath('//table[@class="table specficsWrapper"]//tbody//tr//td//span[contains(text(),"Weight")]//following-sibling::text()', 'nodeValue');
      // console.log('weightNet: ', weightNet);
      if (weightNet !== null) {
        const finalWeightNet = weightNet.replace(':', '');
        // console.log('Final', finalWeightNet);
        addElementToDocument('added_weightNet', finalWeightNet);
      }
      const color = getXpath('//table[@class="table specficsWrapper"]//tbody//tr//td//span[contains(text(),"Colour")]//following-sibling::text()', 'nodeValue');
      // console.log('weightNet: ', weightNet);
      if (color !== null) {
        const finalColor = color.replace(':', '');
        // console.log('Final', finalWeightNet);
        addElementToDocument('added_color', finalColor);
      }
      const mpcpath = getXpath('//*[@id="PageInner"]/script[2]/text()', 'nodeValue');
      if (mpcpath) {
        const jsonObj = JSON.parse(mpcpath);
        var mpc = jsonObj.model;
        var mpc2 = mpc.split(':');
        addElementToDocument('mpc_added', mpc2[1]);
      }
      addElementToDocument('added_onlinepricecurrency', pricecurrency + price);
      if (document.querySelector('input[class="accept-all-cookies"]')) {
        // @ts-ignore
        document.querySelector('input[class="accept-all-cookies"]').click();
        // eslint-disable-next-line promise/param-names
        await new Promise(r => setTimeout(r, 1000));
      }
    });
    // await context.extract(productDetails);
    return await context.extract(productDetails, { transform: transformParam });
  },
};
