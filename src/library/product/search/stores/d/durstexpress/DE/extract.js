const { transform } = require("../../../../shared");
module.exports = {
  implements: "product/search/extract",
  parameterValues: {
    country: "DE",
    store: "durstexpress",
    transform: transform,
    domain: "durstexpress.de",
    zipcode: "",
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement("div");
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = "none";
        const originalDiv = document.querySelectorAll('div[class="price-box price-final_price"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // Method to replace , with .
      var price = getAllXpath('//div[@class="price-box price-final_price"]//span[@class="price"]/text()',"nodeValue");
      if (price != null) {
        for (var i = 0; i < price.length; i++) {
          var price1 = price[i].replace("," , ".");
          addHiddenDiv("price", price1, i);
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};