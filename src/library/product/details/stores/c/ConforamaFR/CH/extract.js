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
      var brandName = "";
      try {
        let listPrice, price;
        // @ts-ignore
        listPrice = document.querySelectorAll('span[class="old-infos oldPrice"]')[0].innerText;
        var listpriceUpdated = listPrice.replace("€", ".");
        addHiddenDiv('listpriceUpdated', '€ ' + listpriceUpdated, 0);
      } catch (error) {

      }
      try {
        let price;
        // @ts-ignore
        price = document.querySelectorAll('div[class="currentPrice"]')[0].innerText;
        var priceUpdated = price.replace("€", ".");
        addHiddenDiv('priceUpdated', '€ ' + priceUpdated, 0);
      } catch (error) {
      }
      try {
        // @ts-ignore
        let dataScript = document.querySelectorAll('script[type="application/ld+json"]')[2].innerText;
        dataScript = JSON.parse(dataScript);
        addHiddenDiv('availabilty', dataScript.offers.availability, 0);
        brandName = dataScript.brand.name;
      } catch (error) {

      }
      if (brandName.length == 0 || brandName == 'Conforama') {
        // @ts-ignore
        brandName = document.querySelector('div[class="productTitle"]>div>h1>a').innerText;
        brandName = brandName.split(' ')[0];
        addHiddenDiv('brand', brandName, 0);
      }
      else {
        addHiddenDiv('brand', brandName, 0);
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
        addHiddenDiv(id, doubleSeparatorText, 0);
      };
      // XPATH Data Extraction For Additional Description Bullet
      const addDescBulletInfo = getAllXpath("//div[@id='tabs-1']/ul/li/text()", 'nodeValue');
      pipeSeparatorDouble('addDescBulletInfo', addDescBulletInfo);
    });
    return await context.extract(productDetails, { transform });
  },
};
