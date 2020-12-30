const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NO',
    store: 'kolonial',
    transform: transform,
    domain: 'kolonial.no',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    // await context.waitForFunction(function () {
    //   return Boolean(document.querySelector('//div[@class="product-list-item "]//img/@src', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    // }, { timeout: 90000 });
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll(' div.name-main.wrap-two-lines')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
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
      //var price = getAllXpath('//div[@class="product-list-item "]//p[@class="price label label-price"]//text()', 'nodeValue');
      var length = document.querySelectorAll(" p.price.label.label-price").length
      for (let i = 0; i < length; i++) {
        var price=document.querySelectorAll(" p.price.label.label-price")[i].innerText
        // @ts-ignore
        var price1 = price.replace(",", ".")
        addHiddenDiv('price', price1, i);
      }
      const URL = window.location.href;
      try {
        document.getElementById('pd_url').remove();
      } catch (error) {
      }
      addElementToDocument('pd_url', URL);
    });
    return await context.extract(productDetails, { transform });
  },
};
