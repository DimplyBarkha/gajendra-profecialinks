
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'iga',
    transform: null,
    domain: 'iga.net',
    zipcode: '',
  },
  //   implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
  //     await context.evaluate(async () => {
  //       function addElementToDocument(key, value) {
  //         const catElement = document.createElement('div');
  //         catElement.id = key;
  //         catElement.textContent = value;
  //         catElement.style.display = 'none';
  //         document.body.appendChild(catElement);
  //         }
  //         const getAllXpath = (xpath, prop) => {
  //         const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  //         const result = [];
  //         for (let index = 0; index < nodeSet.snapshotLength; index++) {
  //         const element = nodeSet.snapshotItem(index);
  //         if (element) result.push(prop ? element[prop] : element.nodeValue);
  //         }
  //         return result;
  //         };
  //         var getXpath = (xpath, prop) => {
  //         var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
  //         let result;
  //         if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
  //         else result = elem ? elem.singleNodeValue : '';
  //         return result && result.trim ? result.trim() : result;
  //         };
  //         var txt = getXpath('//div[@class="relative js-data-procuct"]/@data-product', 'nodeValue');
  //         if( txt != null){
  //           var rpc = txt.split("'ProductId':'")[1];
  //           if( rpc != undefined ){
  //           rpc = rpc.split("',")[0];
  //           addElementToDocument('rpc', rpc);          }
  //           }
  //           });
  //           await context.extract(productDetails);
  //           },
  //           };

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
      function addHiddenDiv1(id, content, index) {
        const newDiv = document.createElement("div");
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = "none";
        const originalDiv = document.querySelectorAll('h1[class="h3-like product-detail__name js-product-detail__name"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      function addElementToDocument(key, value) {
        const catElement = document.createElement("div");
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = "none";
        document.body.appendChild(catElement);
      }
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      var txt = getXpath('//div[@class="relative js-data-procuct"]/@data-product', 'nodeValue');
      if (txt != null) {
        var rpc = txt.split("'ProductId':'")[1];
        if (rpc != undefined) {
          rpc = rpc.split("',")[0];
          addElementToDocument('rpc', rpc);
        }
      }
      try {
        var listprice = getAllXpath('//del[@class="item-product__price push-half--left"]/span/text()', 'nodeValue');
        if (listprice != null) {
          for (var i = 0; i < listprice.length; i++) {
            var price2 = listprice[i].replace(",", ".");
            addHiddenDiv1("listprice", price2, i);
          }
        }
      }
      catch (error) {
      }
      try {
        var price = getAllXpath('//span[@class="product-detail__price--sale js-product-detail__price--sale"]/span/text() | //div[@class="item-product__price js-item-product__price"]/span/text()', 'nodeValue');
        if (price != null) {
          for (var i = 0; i < price.length; i++) {
            var price1 = price[i].replace(",", ".");
            addHiddenDiv1("price", price1, i);
          }
        }
        const URL = window.location.href;
        try {
          document.getElementById("pd_url").remove();
        } catch (error) { }
        addElementToDocument("pd_url", URL);
      }
      // @ts-ignore
      // @ts-ignore
      catch (error) {
      }
    });
    return await context.extract(productDetails, { transform });
  },
};