const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'lacomer',
    transform: transform,
    domain: 'lacomer.com.mx',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
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
      const currentProducts = getXpath("//a[@class='ng-scope btn btn-default btn-page active']/span/text()", 'nodeValue');
      const totalProducts = getXpath("//div[@class='paginator-container']/a[last()]/span/text()", 'nodeValue');
      console.log("akshay");
      console.log(currentProducts)
      if (currentProducts == totalProducts) {
        console.log("akshay");
        console.log(currentProducts)
        addElementToDocument('noResults', 'noResults')
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
