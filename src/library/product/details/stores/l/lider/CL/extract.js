const { transform } = require("../../../../shared");
module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "CL",
    store: "lider",
    transform: transform,
    domain: "lider.cl",
    zipcode: "",
  },
  implementation: async (
    { inputstring },
    { country, domain },
    context,
    { productDetails }
  ) => {
    await context.evaluate(() => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement("div");
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = "none";
        document.body.appendChild(catElement);
      }
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
      var zz = getXpath("//div[@class='pane stitchedView']/img[1]/@src", "nodeValue");
      if (zz != null) {
        addElementToDocument("zz", zz);
      }
    });
    await context.extract(productDetails);
  },
};
