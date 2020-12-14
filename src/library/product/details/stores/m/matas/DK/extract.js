const { transform } = require("../../../../shared");
module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "DK",
    store: "matas",
    transform: null,
    domain: "matas.dk",
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

      function addElementToDocument(key, value) {
        const catElement = document.createElement("div");
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = "none";
        document.body.appendChild(catElement);
      }
      function addElementToDocument1(key, value, index) {
        const catElement = document.createElement("div");
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = "none";
        document.body.appendChild(catElement);
      }
      // Method to replace , with . for price
      var price = getAllXpath('//div[@class="product-page__price"]//span[@class="nowrap"]/text() | (//span[@class="nowrap"])[1]/text()', "nodeValue");
      if (price[0] != null) {
        var price1 = price[0].replace(",", ".");
        addElementToDocument("price", price1);
      }
      var vari = getAllXpath("(//div[@class='icon--rating icon--product-header-rating review-stars']//div[@class='review-stars__container review-stars__container--border']/@data-js-border-offset)[1]","nodeValue");
      if (vari != null) {
        for (var i = 0; i < vari.length; i++) {
          var agg = (vari[i].slice(0, -1) * 5) / 100;
          addElementToDocument1("agg", agg, i);
        }
      }
    });
    
    return await context.extract(productDetails, { transform });
  },
};
