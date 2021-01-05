const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'promofarma',
    transform: cleanUp,
    domain: 'promofarma.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      try {
        // @ts-ignore
        document.querySelector('button[id="onetrust-accept-btn-handler"]').click()
        await new Promise(r => setTimeout(r, 10000));
      } catch (error) {

      }
      try {
        // @ts-ignore
        document.querySelector('div[class="text-center"]>button').click()
        await new Promise(r => setTimeout(r, 10000));
      } catch (error) {
      }
      try {
        // @ts-ignore
        document.querySelector('div[class="abtasty-modal__close abtasty-modal__close--inside"]').click()
        await new Promise(r => setTimeout(r, 10000));
      } catch (error) {
      }
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // Method to Retrieve Xpath content of a Single Node
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      var URL2 = getXpath('(//a[@class="MagicZoom"]/text())', 'nodeValue');
      if (URL2 != null) {
        URL2 = "Yes"
      } else {
        URL2 = "No"

        addElementToDocument('zoom', URL2);
      }
      try {
        // @ts-ignore
        var man1 = document.querySelector('p[data-qa-ta="couponInfo"]').innerText
        // @ts-ignore
        var man2 = document.querySelector('div[id="content-description"]').innerText

        var man = man1 + '||' + man2

        addElementToDocument('manu', man);

      } catch (error) {

      }
      try {
        var video = getXpath("(//div[@id='description']/div[@id='wrapper-description']/div//@data-content)", 'nodeValue');
        var video = video.split('src="')[1]
        var video = video.split(" ")[0]
        var video = video.slice(0, -1)
        addElementToDocument('video', video);
      } catch (error) {
        
      }
    });
    await context.extract(productDetails);
  },
};

