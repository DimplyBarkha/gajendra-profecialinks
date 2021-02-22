const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'meijer',
    transform: cleanUp,
    domain: 'meijer.com',
    zipcode: '',
  },
  implementation: async ( inputs, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.waitForSelector('.product-item a');
    await context.clickAndWaitForNavigation('.product-item a', {}, {});
    const { timeout = 60000, waitUntil = 'load', checkBlocked = true } = {};
    await context.setJavaScriptEnabled(true);
    await context.setCssEnabled(true);
    // const mainUrl = 'https://www.k-ruoka.fi/';
    await context.goto(inputs.url, { timeout, waitUntil, checkBlocked });
    const { zipcode } = inputs;
    let locationStreetAddress = '';
    let disabledContinueButton = false;
    await context.setJavaScriptEnabled(true);
    await context.setCssEnabled(true);

    async function hasDisabledContinuedButton () {
      const hasIt = await context.evaluate(async function () {
        return document.querySelector('button[data-automation-id="locationFlyout-continueBtn"]').hasAttribute('disabled');
      });
      return hasIt;
    }

    async function changeLocation (zipcode) {
      await context.evaluate(async function () {
        if (document.querySelector('#kconsent')) {
          document.querySelector('#kconsent').remove();
        }
      });
      await context.waitForSelector('span.js-change-store-link');
      await context.evaluate(async function () {
        const button = document.querySelector('span.js-change-store-link');
        if (button) {
          button.click();
        }
      });
      await context.waitForSelector('a.StoreFlyout__changeStore');
      await context.evaluate(async function () {
        const button = document.querySelector('a.StoreFlyout__changeStore');
        if (button) {
          button.click();
        }
      });
      await context.waitForSelector('input#store-flyout-address');
      await context.setInputValue('input#store-flyout-address', zipcode);
      await context.click('.StoreFlyout__store .StoreFlyout__myStore');
      // await context.setInputValue('input[type="search"][value]', zipcode);
    }

    const changedLocationStreetAddress = await context.evaluate(function () {
      return document.querySelector('div[data-automation-id="changeStoreFulfillmentBannerBtn"] span[class^="AddressPanel__addressLine"]') ? document.querySelector('div[data-automation-id="changeStoreFulfillmentBannerBtn"] span[class^="AddressPanel__addressLine"]').textContent : '';
    });

    // TODO: need to set this as input
    if (!(changedLocationStreetAddress === '4208 Pleasant Crossing Blvd') && disabledContinueButton === false) {
      await changeLocation(zipcode);
      if (locationStreetAddress !== changedLocationStreetAddress) {
        await changeLocation(zipcode);
      }
      if (locationStreetAddress !== changedLocationStreetAddress) {
        console.log(locationStreetAddress);
        console.log(changedLocationStreetAddress);
        throw new Error('Fail to change zipcode');
      }
    }

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
      try {
        const size = getXpath("//div[@class='lsection mobile-product-name h6']//text()", 'nodeValue');
        var nameArr = size.split(',');
        addElementToDocument('size', nameArr[nameArr.length - 1])
        const price = getXpath("//div[@class='display-price']//span[@itemprop='price']/text() | (//div[@class='display-price sale-price']/text())[1]", 'nodeValue');
        if (price.includes('$')) {
          addElementToDocument('price', price);
        }
        else {
          addElementToDocument('price', '$' + price);
        }
      } catch (error) {

      }
      try {
        var stock = "In Stock"
        const availability = getXpath('//div[@class="rsection stock-container"]//img/@alt//text()', 'nodeValue');
        if (availability == "Success") {
          addElementToDocument('stock', stock);
          console.log(stock)
        }
        // else {
        //   stock = "Out Of Stock"
        //   console.log(stock)
        //   addElementToDocument('availability', stock);
        // }
      } catch (error) {

      }

    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
