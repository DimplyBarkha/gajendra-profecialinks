const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'ConforamaFR',
    transform: transform,
    domain: 'conforama.fr',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="productInfosContent normal clearfix"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      try {
        let listPrice, price;
        // @ts-ignore
        listPrice = document.querySelectorAll('span[class="old-infos oldPrice"]')[0].innerText;
        var listpriceUpdated = listPrice.replace("€", ".");
        addHiddenDiv('listpriceUpdated', '€ ' + listpriceUpdated, 0);
        // @ts-ignore
        price = document.querySelectorAll('div[class="currentPrice"]')[0].innerText;
        var priceUpdated = price.replace("€", ".");
        addHiddenDiv('priceUpdated', '€ ' + priceUpdated, 0);

        // @ts-ignore
        let dataScript = document.querySelectorAll('script[type="application/ld+json"]')[2].innerText;
        dataScript = JSON.parse(dataScript);
        addHiddenDiv('availabilty', dataScript.offers.availability, 0);
        addHiddenDiv('brand', dataScript.brand.name, 0);
      } catch (error) {
      }
      try {
        // @ts-ignore
        let skuScript = document.querySelectorAll('script[type="application/ld+json"]')[2].innerText;
        skuScript = JSON.parse(skuScript);
        addHiddenDiv('sku', skuScript.sku, 0);
      } catch (error) {
      }

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
      // Double Pipe Concatenation
      const pipeSeparatorDouble = (id, data) => {
        var doubleSeparatorText = data.join(' || ');
        addHiddenDiv(id, doubleSeparatorText,0);
      };
      // XPATH Data Extraction For Additional Description Bullet
      const addDescBulletInfo = getAllXpath("//div[@id='tabs-1']/ul/li/text()", 'nodeValue');
      pipeSeparatorDouble('addDescBulletInfo', addDescBulletInfo);
    });
    return await context.extract(productDetails, { transform });
  },
};
