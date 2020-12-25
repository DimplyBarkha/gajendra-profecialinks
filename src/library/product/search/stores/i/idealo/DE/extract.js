const { transform } = require('./transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'idealo',
    transform,
    domain: 'idealo.de',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    try {
      await context.waitForSelector('div[id*=sp_message_container]');
      await context.evaluate(async () => {
        const elem = document.querySelector('div[id*=sp_message_container]');
        if (elem.getAttribute('style').includes('block')) {
          elem && elem.setAttribute('style', '');
        }
      });
    } catch (error) {
      console.log('failed to close iframe popup');
    }
    await context.evaluate(async function () {
      function addDataToDocument (key, value, mainNode) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        mainNode.appendChild(catElement);
      }
      const productListSelector = document.querySelectorAll('div[class*="resultlist"] div[class="offerList-item"]');
      for (let i = 0; i < productListSelector.length; i++) {
        const dataObj = JSON.parse(productListSelector[i].getAttribute('data-gtm-payload'));
        addDataToDocument('pd_id', dataObj.productId, productListSelector[i]);
        dataObj.productPrice && addDataToDocument('pd_price', dataObj.productId, productListSelector[i]);
      }
      const url = window.location.href;
      const newDiv = document.createElement('div');
      newDiv.id = 'added-searchurl';
      newDiv.textContent = url;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    });

    const productsFound = await context.evaluate(() => {
      return !!document.querySelector('div[class="offerList-item-imageWrapper"] img');
    });
    const captchaPresent = await context.evaluate(() => {
      return !!document.querySelector('div[class="captcha"] > form > input');
    });
    console.log('Products are present : ', productsFound);
    console.log('captcha present : ', captchaPresent);
    return await context.extract(productDetails, { transform });
  },
};
