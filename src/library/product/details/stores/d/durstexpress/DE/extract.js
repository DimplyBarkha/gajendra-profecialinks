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

      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.ANY_UNORDERED_NODE_TYPE,
          null
        );
        let result;
        if (prop && elem && elem.singleNodeValue)
          result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : "";
        return result && result.trim ? result.trim() : result;
      };
      // Method to join two values using space
      var manuf = getAllXpath(
        "//u[contains(text(),'Inverkehrbringer')]/following::text()[position() < 3]",
        "nodeValue"
      );
      if (manuf != null) {
        var manufectur = manuf.join(" ");
        addElementToDocument("manufectur", manufectur);
      }
      var cal = getAllXpath("//u[contains(text(),'Nährwertangaben pro 100 ml')]/following::text()[position() < 3]","nodeValue");
      if (cal != null) {
        var arr = [];
        for (var i = 0; i < cal.length; i++) {
          arr.push(cal[i].split(":")[1]);
        }
        var calory = arr.join(" ");
        addElementToDocument("calory", calory);
      }
      //1 totalFatPerServing removing :
      var txt = getXpath("//u[contains(text(),'Nährwertangaben pro 100 ml')]/following::text()[3]","nodeValue");
      if (txt != null) {
        txt = txt.split(":")[1];
        addElementToDocument("txt", txt);
      }
      //2 saturatedFatPerServing removing :
      var txt1 = getXpath("//u[contains(text(),'Nährwertangaben pro 100 ml')]/following::text()[4]","nodeValue");
      if (txt1 != null) {
        txt1 = txt1.split(":")[1];
        addElementToDocument("txt1", txt1);
      }
      //3 totalCarbPerServing removing :
      var txt2 = getXpath("//u[contains(text(),'Nährwertangaben pro 100 ml')]/following::text()[5]","nodeValue");
      if (txt2 != null) {
        txt2 = txt2.split(":")[1];
        addElementToDocument("txt2", txt2);
      }
      //4 totalSugarsPerServing removing :
      var txt3 = getXpath("//u[contains(text(),'Nährwertangaben pro 100 ml')]/following::text()[6]","nodeValue");
      if (txt3 != null) {
        txt3 = txt3.split(":")[1];
        addElementToDocument("txt3", txt3);
      }
      //5 proteinPerServing removing :
      var txt4 = getXpath("//u[contains(text(),'Nährwertangaben pro 100 ml')]/following::text()[7]","nodeValue");
      if (txt4 != null) {
        txt4 = txt4.split(":")[1];
        addElementToDocument("txt4", txt4);
      }
      //6 saltPerServing removing :
      var txt5 = getXpath("//u[contains(text(),'Nährwertangaben pro 100 ml')]/following::text()[8]","nodeValue");
      if (txt5 != null) {
        txt5 = txt5.split(":")[1];
        addElementToDocument("txt5", txt5);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
