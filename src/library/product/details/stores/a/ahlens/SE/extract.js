const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'ahlens',
    transform: cleanUp,
    domain: 'ahlens.se',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
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
      const splitfunction = (data) => {
        var singleSeparatorText = data[0].split(',');
        for (let i = 0; i < singleSeparatorText.length; i++) {
          var output = singleSeparatorText[i].split(" ");
          addElementToDocument('altImage', 'https://www.ahlens.se/' + output[0]);
        }
      };
      const Images = getAllXpath("//div[@class='slick-track']/li[@class='ah-image-carousel__item slick-slide slick-current slick-active']/img[@class='ah-product-image']/@srcset", 'nodeValue');
      splitfunction(Images);
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
