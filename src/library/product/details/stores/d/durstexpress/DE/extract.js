module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "DE",
    store: "durstexpress",
    transform: null,
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

      function addElementToDocument(key, value) {
        const catElement = document.createElement("div");
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = "none";
        document.body.appendChild(catElement);
      }
      function addElementToDocument1(key, value) {
        const catElement = document.createElement("div");
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = "none";
        document.body.appendChild(catElement);
      }
      // Method to join two values using space
      var manuf = getAllXpath("//u[contains(text(),'Inverkehrbringer')]/following::text()[position() < 3]", 'nodeValue');
      if (manuf != null) {
        var manufectur = manuf.join(" ");
        addElementToDocument('manufectur', manufectur);
        }
      var cal = getAllXpath("//u[contains(text(),'Nährwertangaben pro 100 ml')]/following::text()[position() < 3]", 'nodeValue');
      if (cal != null) {
        var arr = [];
        for (var i=0; i<cal.length;i++){
          arr.push(cal[i].split(":")[1])
        }
        var calory = arr.join(" ");
        addElementToDocument1('calory', calory);
        }                
    });
    return await context.extract(productDetails, { transform });
  },
};
