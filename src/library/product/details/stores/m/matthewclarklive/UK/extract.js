const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'matthewclarklive',
    transform: transform,
    domain: 'matthewclarklive.com',
    zipcode: '',
  }, implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {

      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      var name = getXpath('//div[@class="ProductTitleBar_TitleIconContainer"]/div[@class="ProductTitleBar_Title"]/text()', 'nodeValue');
      if (name != null) {


        var arr = name.split(",")
        var final = ""
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].includes("ml")) {
            if (arr[i].includes("x")) {
              final = arr[i].split("x")[0];
            } else {
              final = arr[i]
            }
          }else if (arr[i].includes("lt")) {
            if (arr[i].includes("x")) {
              final = arr[i].split("x")[0];
            } else {
              final = arr[i]
            }
          }else if (arr[i].includes("cl")) {
            if (arr[i].includes("x")) {
              final = arr[i].split("x")[0];
            } else {
              final = arr[i]
            }
          }
        }
        addElementToDocument('quantity', final);
      }


      var name1 = getXpath('//div[@class="ProductTitleBar_TitleIconContainer"]/div[@class="ProductTitleBar_Title"]/text()', 'nodeValue');
      if (name1 != null) {


        var arr1 = name1.split(",")
        var final1 = ""
        for (var i = 0; i < arr1.length; i++) {
          if (arr1[i].includes("ml")) {
            if (arr1[i].includes("x")) {
              final1 = arr1[i].split("x")[1];
            } 
          }else if (arr1[i].includes("lt")) {
            if (arr1[i].includes("x")) {
              final1 = arr1[i].split("x")[1];
            } 
          }else if (arr1[i].includes("cl")) {
            if (arr1[i].includes("x")) {
              final1 = arr1[i].split("x")[1];
            } 
          }
        }
        addElementToDocument('quantity1', final1);
      }

    });

    return await context.extract(productDetails, { transform });
  },
};