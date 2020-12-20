module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "DE",
    store: "durstexpress",
    transform: null,
    domain: "durstexpress.de",
    zipcode: "",
  },
  // implementation: async (inputs, parameters, context, dependencies) => {
  //   const { transform } = parameters;
  //   const { productDetails } = dependencies;
  //   await context.evaluate(() => {
  //     const getAllXpath = (xpath, prop) => {
  //       const nodeSet = document.evaluate(
  //         xpath,
  //         document,
  //         null,
  //         XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
  //         null
  //       );
  //       const result = [];
  //       for (let index = 0; index < nodeSet.snapshotLength; index++) {
  //         const element = nodeSet.snapshotItem(index);
  //         if (element) result.push(prop ? element[prop] : element.nodeValue);
  //       }
  //       return result;
  //     };

  //     function addElementToDocument(key, value) {
  //       const catElement = document.createElement("div");
  //       catElement.id = key;
  //       catElement.textContent = value;
  //       catElement.style.display = "none";
  //       document.body.appendChild(catElement);
  //     }
  //     // Method to replace , with . for price
  //     var price = getAllXpath(
  //       '(//div[@class="product-info-price"]//span[@class="price"])[1]',
  //       "nodeValue"
  //     );
  //     if (price[0] != null) {
  //       var price1 = price[0].replace(",", ".");
  //       addElementToDocument("price", price1);
  //     }
  //   });

  //   return await context.extract(productDetails, { transform });
  // },
};
