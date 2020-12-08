const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CO',
    store: 'alkosto',
    transform: cleanUp,
    domain: 'alkosto.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    const productUrl = await context.evaluate(async function () {
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const url = getXpath("//div[contains(@class,'category-products')]//ul//li//div[contains(@class,'amlabel-div')]//a/@href", 'nodeValue');
      return url;
    });
    console.log(productUrl);
    await context.goto(productUrl);
    async function loadResources () {
      await context.setAntiFingerprint(false);
      await context.setLoadAllResources(true);
      await context.setBlockAds(false);
    }
    await loadResources();
    try {
      await context.waitForSelector('div[id="std-description"] img', {}, { timeout: 50000 });
    } catch (error) {
      console.log(error);
    }
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const aggregateRatingXpath = getXpath("//script[@class='y-rich-snippet-script']", 'innerText');
      if (aggregateRatingXpath && typeof aggregateRatingXpath === 'string') {
        var aggregateRatingObj = JSON.parse(aggregateRatingXpath);
        // console.log(parseFloat(aggregateRatingObj.aggregateRating.ratingValue));
        addElementToDocument('added_aggregate', aggregateRatingObj.aggregateRating.ratingValue.replace(/\./g, ','));
      }

      const specificationsXpath = "//table[@id='product-attribute-specs-table']//tbody//tr";
      var specificationsStr = getAllXpath(specificationsXpath, 'innerText').join('');
      addElementToDocument('added_specifications', specificationsStr);

      const listPrice = "//div[@class='product-main-info']//span[@class='price-old']";
      var listPricePath = getXpath(listPrice, 'innerText');
      addElementToDocument('added_listPrice', listPricePath.replace(/\./g, ','));
      const price = "//div[@class='product-main-info']//p[@class='special-price']//span[contains(@id,'product-price')]";
      var pricePath = getXpath(price, 'innerText');
      addElementToDocument('added_price', pricePath.replace(/\./g, ','));
      // const secondaryImageTotalXpath = "//div[@class='product-img-box']//div[@class='more-views']//ul//li//a/@href";
      // var secondaryImages = getAllXpath(secondaryImageTotalXpath, 'nodeValue');
      // addElementToDocument('added_secondaryImageTotal', secondaryImages.length);
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
