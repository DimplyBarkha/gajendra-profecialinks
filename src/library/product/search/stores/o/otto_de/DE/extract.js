const { addAlias } = require('module-alias');
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'otto_de',
    transform: transform,
    domain: 'otto.de',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(1000);
        scrollTop += 2000;
        window.scroll(0, scrollTop);
        if (scrollTop === 30000) {
         await stall(2000);
          break;
        }
      }
       function stall(ms) {
        return new Promise((resolve, reject) => {
           setTimeout(() => {
            resolve();
           }, ms);
         });
       }
      var tempData, valueVariant, valueRating;
      const rawData = document.querySelectorAll('script[type="application/ld+json"]');
      for (let i = 0; i < rawData.length; i++) {
        try {
          // @ts-ignore
          tempData = rawData[i].innerText;
          tempData = JSON.parse(tempData);
          valueRating = tempData.aggregateRating[0].ratingValue;
          valueVariant = tempData.additionalProperty[0].value;
          const newDiv = document.createElement('div');
          newDiv.id = 'rating';
          newDiv.textContent = valueRating;
          newDiv.style.display = 'none';
          const originalDiv = document.querySelectorAll("article[data-variationid=\"" + valueVariant + "\"]")[0];
          // @ts-ignore
          originalDiv.parentNode.insertBefore(newDiv, originalDiv);

        } catch (error) {
          continue;
        }
      }
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('#san_resultSection > article')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
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

      // var aa = document.querySelectorAll("script[type='application/ld+json']");
      // if (aa != null) {
      //   for (var i = 0; i < aa.length; i++) {
      //     // @ts-ignore
      //     var rawjson = JSON.parse(aa[i].innerText)
      //     //var newname = rawjson.name
      //     addHiddenDiv('newname', rawjson.name, i)
      //     addHiddenDiv('price', rawjson.offers[0].price, i)
      //     //addHiddenDiv('newname', rawjson.name, i)
      //     //addHiddenDiv('newname', rawjson.name, i)
      //   }
      // }

      price 
      var price = getAllXpath("//span[@class='value']/text()", 'nodeValue');
      if (price != null) {
        for (var i = 0; i < price.length; i++) {
          price[i] = price[i].replace(",", ".")
          addHiddenDiv('price', price[i], i);
        }
      }
      var prodid = getAllXpath("//article[@class='product']/@data-facetted-variation-ids", 'nodeValue');
      if (prodid != null) {
        for (var i = 0; i < prodid.length; i++) {
          prodid[i] = prodid[i].split(",")[0]
          addHiddenDiv('prodid', prodid[i], i);
        }
      }

    });
    return await context.extract(productDetails, { transform });
  },
};