const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'lomax',
    transform: transform,
    domain: 'lomax.dk',
    zipcode: '',
  },
  implementation: async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll("a[class='product-link'] h5")[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      function addElementToDocument(key, value) {
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
      const URL = window.location.href;
      addElementToDocument('pd_url', URL);
      const aggr = getAllXpath('//div[@class="product-info border-bottom py-3 "]/@data-gtm-rating', 'nodeValue');
      for (let i = 0; i < aggr.length; i++) {
        // @ts-ignore
        let str = aggr[i];
        var a = str.replace('.', ',')
        addHiddenDiv('aggr', a, i)
      }
      var price = getAllXpath('//div[@class="col-lg-9 result-list-container px-2 pl-sm-0 pr-md-3"]/div/div/@data-gtm-price', 'nodeValue');
      for (let i = 0; i < price.length; i++) {
        price[i] = price[i].slice(0, -1);
        price[i] = price[i].replace('.', ',');
        addHiddenDiv("price", price[i], i);
      }
      //const aggr = getAllXpath('//div[@class="product-info border-bottom py-3 col-xxl-3 col-md-4 col-6 border-right"]/@data-gtm-rating', 'nodeValue');
      //try {
      // if (aggr != null) {
      // let str = aggr
      //     var a = str.replace('.', ',')
      //     addElementToDocument('aggr', a)
      //   }
      // }
      // catch (error) {
      // }
    });
    return await context.extract(productDetails, { transform });
  },
};
