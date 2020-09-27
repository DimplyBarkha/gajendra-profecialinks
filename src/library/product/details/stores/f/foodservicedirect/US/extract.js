const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'foodservicedirect',
    transform: cleanUp,
    domain: 'foodservicedirect.com',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.waitForSelector('div.c-expandable-list-block__caption-title');
    await context.evaluate(() => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      function getEleByXpath (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element);
        return element;
      }

      function getAllNodes (STR_XPATH, context) {
        var xresult = document.evaluate(STR_XPATH, context, null, XPathResult.ANY_TYPE, null);
        var xnodes = [];
        var xres;
        while ((xres = xresult.iterateNext())) {
          xnodes.push(xres);
        }
        return xnodes;
      }

      const allergensXpath = '//div[contains(@class, "c-expandable-list-block__container") and contains(.,"Allergens")]//div[contains(@class, "c-expandable-list-block__content")]//ul//li[contains(., "Yes")]//div[contains(@class, "label")]';

      const allergenText = [];
      const allergenNodes = getAllNodes(allergensXpath, document);
      allergenNodes.forEach(node => {
        allergenText.push(node.innerText);
      });
      addHiddenDiv('allergens', allergenText.join(', '));

      const prodSpecTab = getEleByXpath('//div[contains(@class, "p-product-detail__product-features-table")]// div[contains(@class, "c-tab-box__tab-links")][text()="Product Specifications"]');
      prodSpecTab.click();
      addHiddenDiv('imageZoomFeaturePresent', document.querySelector('a.c-product-viewer__action-zoom') !== null ? 'Yes' : 'No');
      const scriptTag = [...document.querySelectorAll("script[type = 'application/ld+json']")].filter((ele) => {
        if (ele.textContent.includes('rating')) {
          return ele;
        }
      });
      if (scriptTag.length > 0) {
        const scriptContent = JSON.parse(scriptTag[0].innerText);
        addHiddenDiv('aggregateRating', scriptContent.aggregateRating && scriptContent.aggregateRating.ratingValue ? scriptContent.aggregateRating.ratingValue : '');
      }
    });
    return await context.extract(productDetails, { transform: transformParam });
  },
};
