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
      try {
        const productListSelector = document.evaluate('//div[contains(@class,"offerList--tileview")]/*[not(.//div[contains(@class,"offerList-item-shopName")])]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < productListSelector.snapshotLength; i++) {
          // @ts-ignore
          const dataObj = JSON.parse(productListSelector.snapshotItem(i).getAttribute('data-gtm-payload'));
          if (dataObj) {
            if (dataObj.productId) {
              addDataToDocument('pd_id', dataObj.productId, productListSelector.snapshotItem(i));
              addDataToDocument('pd_url', `https://www.idealo.de/preisvergleich/OffersOfProduct/${dataObj.productId}`, productListSelector.snapshotItem(i));
            } else {
              dataObj.clusterId && addDataToDocument('pd_id', dataObj.clusterId, productListSelector.snapshotItem(i));
              dataObj.clusterId && addDataToDocument('pd_url', `https://www.idealo.de/preisvergleich/Typ/${dataObj.clusterId}`, productListSelector.snapshotItem(i));
            }
            dataObj.productPrice && addDataToDocument('pd_price', dataObj.productPrice, productListSelector.snapshotItem(i));
          }
        }
      } catch (error) {
        console.log('Failed to add element in the dom');
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
