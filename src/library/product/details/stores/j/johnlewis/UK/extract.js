const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'johnlewis',
    transform: cleanUp,
    domain: 'johnlewis.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      var Description = getAllXpath("//div[@class='product-detail__description-inner']/p[position()>1]/text()", 'nodeValue');
      if (Description != null) {
        var ppp = Description.join(" || ")
        addElementToDocument('desc', ppp);
      }

      var image = getAllXpath("//ul[@class='thumbnail-wrapper']/li[@class='thumbnail-slide']/img/@src", 'nodeValue');
      if (image != null) {
        for (var i=0; i < image.length; i++){
          image[i] = "https:" + image[i]
        }
        var qqq = image.join(" | ")
        addElementToDocument('img', qqq);
      }

      var specification = getAllXpath("//dl[@class='product-specifications-list']/dt/text()", 'nodeValue');
      var aaa = []
      if (specification != null) {
        for (var i = 0; i < specification.length; i++) {
          if (specification[i].length != 150) {
            aaa.push(specification[i]);
          }
        }
        var bbb = getAllXpath("//dl[@class='product-specifications-list']/dd/text()", 'nodeValue');
        var final = ""
        for (var i = 0; i < aaa.length; i++) {
          final = final + aaa[i] + ":" + bbb[i];
          if (aaa[i + 1] != undefined) {
            final = final + " || "
          }
        }
        addElementToDocument('spec', final);
      }



      var xyz = getXpath("//div[@class='star-ratings']/div[@class='stars-empty']/@style", 'nodeValue');
      if (xyz != null) {
        var abc = xyz.split(": ")[1]
        var width = abc.slice(0, -2);
        width = (width * 5) / 100;
        addElementToDocument('star', width);
      }

      var rrr = getXpath("//p[@class='u-centred']/text() | //h2[@class='email-me-stock__header']/text()", 'nodeValue');
      if (rrr!=null){
        if (rrr.includes("in stock")){
        rrr="In Stock"
    }else{
        rrr="Out of Stock"

      }
      addElementToDocument('stock', rrr);
    }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};