const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'bueroshop24',
    transform: cleanUp,
    domain: 'bueroshop24.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    var searchPage;
    async function currentPageCheck () {
      return await context.evaluate(function () {
        searchPage = document.querySelector('div.plist div.plist_element') !== null;
        return searchPage;
      });
    };
    const productUrl = await context.evaluate(async function () {
      const getUrlXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const url = getUrlXpath("//div[@class='plist']//div[contains(@class,'plist_element')]//div[@class='plist_content']//div[@class='article-content']//div[@class='plist_details']//a[@itemprop='name']/@href", 'nodeValue');
      return url;
    });
    console.log(productUrl);
    const page = await currentPageCheck();
    if (page) {
      await context.goto(productUrl);
    }

    const doesPopupExist = await context.evaluate(function () {
      return Boolean(document.querySelector('button[id="uc-btn-accept-banner"]'));
    });

    if (doesPopupExist) {
      await context.click('button[id="uc-btn-accept-banner"]');
    }

    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      // Method to Retrieve Xpath content of a Single Node
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      // Method to Retrieve Xpath content of a Multiple Nodes
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      const availabilityStatusUrl = getXpath("//div[contains(@class,'pview-element')]//div[@class='price-container']//link[@itemprop='availability']/@href", 'nodeValue');
      if (availabilityStatusUrl !== null) {
        var availabilityStatusValue = 'Out of Stock';
        if (availabilityStatusUrl.indexOf('InStock')) {
          availabilityStatusValue = 'In stock';
        }
        addElementToDocument('addedAvailabilityText', availabilityStatusValue);
      }

      const additionalDescription = getAllXpath("//table[@class='keyfacts']//tbody//tr//td/text()[normalize-space(.)]", 'nodeValue');
      if (additionalDescription != null) {
        var additionalDescriptionContent = additionalDescription.join('');
        addElementToDocument('addedAdditionalDescription', additionalDescriptionContent);
      }

      const additionalDescriptionBullets = getAllXpath("//div[contains(@class,'description')]//ul//li/text() | //div[contains(@class,'description')]//ul//li//span[@class='tooltip_word']/text()", 'nodeValue');
      if (additionalDescriptionBullets != null) {
        var additionalDescriptionBulletContent = additionalDescriptionBullets.join(' || ');
        addElementToDocument('addedAdditionalDescriptionBulletContent', additionalDescriptionBulletContent);
      }

      const specification = getAllXpath("//div[contains(@class,'datasheet')]//table//tbody//tr//td/text()[normalize-space(.)] | //div[contains(@class,'datasheet')]//table//tbody//tr//td//span[@class='tooltip_word']/text()[normalize-space(.)]", 'nodeValue');
      if (specification != null) {
        var specificationContent = specification.join(' ');
        addElementToDocument('addedSpecification', specificationContent);
      }

      const variantsList = getAllXpath("//div[contains(@class,'family-area')]//a[@itemprop='isSimilarTo']/@data-id", 'nodeValue');
      if (variantsList != null) {
        var variantItems = [];
        variantsList.forEach(function (item, index) {
          variantItems.push(item.replace(/^[a-zA-Z\\_]+/g, ''));
        });
        var variantsListContent = variantItems.join(' | ');
        addElementToDocument('addedVariants', variantsListContent);
      }

      const promotionText = getXpath("//div[contains(@class,'pview-element')]//form[@class='pview-grid']//div[@class='price-container']//div[@class='price']//strong/@data-price-saving", 'nodeValue');
      if (promotionText != null) {
        addElementToDocument('addedPromotion', ('Sie sparen ' + promotionText));
      }

      const alternateImgs = getAllXpath("//div[contains(@class,'pview-additional-pictures')]//ul//li[position() >1 ]//a[@data-type='image']//img/@src", 'nodeValue');
      if (alternateImgs != null) {
        var imgList = [];
        alternateImgs.forEach(function (element, index) {
          imgList.push(element.replace('/xs/', '/l/'));
        });
      }
      addElementToDocument('addedAlternateImage', imgList.join(','));

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      };
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
