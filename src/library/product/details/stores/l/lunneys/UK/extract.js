const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'lunneys',
    transform: cleanUp,
    domain: 'lunneys.uk',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
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

      // Single Pipe Concatenation
      const pipeSeparatorSingle = (id, data) => {
        var singleSeparatorText = data.join(' | ');
        addElementToDocument(id, singleSeparatorText);
      };

      // Double Pipe Concatenation
      const pipeSeparatorDouble = (id, data) => {
        var doubleSeparatorText = data.join(' || ');
        addElementToDocument(id, doubleSeparatorText);
      };

      // Default value added for variant count field
      var variantCount = 0;
      addElementToDocument('addedVariantCount', variantCount);

      // XPATH Data Extraction For Aggregate Rating
      const aggregateRating = getXpath("//div[contains(@class,'product-reviews-summary')]//div[@class='rating-result']//span[1]/@style", 'nodeValue');
      var ratingValue = aggregateRating ? aggregateRating.replace(/^\D+/g, '') : '';
      addElementToDocument('addedAggregateRating', (ratingValue ? (parseInt(ratingValue) / 20) : ''));

      // XPATH Data Extraction For Additional Description Bullet
      const addDescBulletInfo = getAllXpath("//div[contains(@class,'description')]//div[@class='value']//ul//li//child::p/text() | //div[contains(@class,'description')]//div[@class='value']//p//following-sibling::ul//li/text()[string-length() > 1] | //div[contains(@class,'description')]//div[@class='value']//ul//li//child::span/text()", 'nodeValue');
      pipeSeparatorDouble('addDescBulletInfo', addDescBulletInfo);

      // XPATH Data Extraction For Product Description
      const addProductDescription = getAllXpath("//div[contains(@class,'description')]//div[@class='value']//p/text()[string-length() > 0] | //div[contains(@class,'description')]//div[@class='value']//p//strong/text()[string-length() > 0] | //div[contains(@class,'description')]//div[@class='value']//p//span//strong/text()[string-length() > 0] | //div[contains(@class,'description')]//div[@class='value']//p//span/text() |  //div[contains(@class,'description')]//div[@class='value']//p//following-sibling::ul//li/text()", 'nodeValue');
      if (addProductDescription !== null && addProductDescription.length > 0) {
        pipeSeparatorSingle('addProductDescription', addProductDescription);
      }

      window.setTimeout(function () {
        // XPATH Data Extraction For Product Specification
        var specificationsList = getAllXpath("//div[@class='inpage_selector_specification']//table//tbody//tr//td//div//span//text() | //div[contains(@class,'description')]//ul[@class='aboutTabAdditional']//li/text() | //script[@data-flix-sku='13440']//following-sibling::ul//li[position()<12]/text()", 'nodeValue');
        if (specificationsList !== null && specificationsList.length > 0) {
          pipeSeparatorDouble('addedProductSpecification', specificationsList);
        } else {
          specificationsList = getAllXpath("/div[contains(@class,'product') and contains(@class,'description')]//ul//li/text()", 'nodeValue');
          if (specificationsList !== null && specificationsList.length > 0) {
            pipeSeparatorDouble('addedProductSpecification', specificationsList);
          }
        }

        // XPATH Data Extraction For Product Weight
        const productWeightNode = getXpath("//div[@class='inpage_selector_specification']//table//tbody//tr//td//div//span//text()[contains(.,'Weight')]//..//parent::div//following-sibling::div//span/text() | //div[contains(@class,'product') and contains(@class,'description')]//p/text()[contains(.,'Weight')]", 'nodeValue');
        const productWeight = productWeightNode ? (productWeightNode.includes('Weight') ? productWeightNode.replace('Weight ', '') : productWeightNode) : '';
        addElementToDocument('addedProductWeight', productWeight);

        // XPATH Data Extraction For Enhanced Content
        const enhancedContent = getAllXpath("//div[contains(@class,'inpage_cont_title')]/text() | //div[contains(@class,'inpage_cont_title')]//following-sibling::div[contains(@class,'inpage_p')]/text() | //div[contains(@class,'flix-std-title')]/text() | //div[contains(@class,'flix-std-title')]//following-sibling::div[contains(@class,'flix-std-desc')]/text()", 'nodeValue');
        addElementToDocument('addedEnhancedContent', enhancedContent);
      }, 10000);

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
