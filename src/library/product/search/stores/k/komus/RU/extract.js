const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'komus',
    transform: cleanUp,
    domain: 'komus.ru',
    zipcode: '',
  }, implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="b-productList__item__picture"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
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
      let rankOrganic;
      let url = window.location.href;
      let checkPageNumber = url.split('&')[1];
      try {
        if (checkPageNumber.startsWith('page=')) {
          rankOrganic = checkPageNumber.replace('page=', '');
        }
      }
      catch (err) {
      }
      var dup = Number(rankOrganic);
      dup = dup - 1;
      if (!rankOrganic) {
        rankOrganic = 1;
      } else {
        rankOrganic = (dup * 30) + 1;
      }
      const urlProduct = document.querySelectorAll('div[class="b-productList__item__picture"]');
      for (let i = 0; i < urlProduct.length; i++) {
        addHiddenDiv('rankOrganic', rankOrganic++, i);
      }
      const sliceURL1 = (data) => {
        for (let index = 0; index < data.length; index++) {
          if (data[index].includes(" ")) {
            var temp = data[index].replace(" ", "");
          } else {
            temp = data[index].replace("", "");
          }
          addHiddenDiv('altImage1', temp, index);
        }
      };
      var backgroundURL1 = getAllXpath('//div[@class="b-productList__price"]//a//span[1]/text()', 'nodeValue');
      sliceURL1(backgroundURL1);
    });
    return await context.extract(productDetails, { transform });
  },
};
