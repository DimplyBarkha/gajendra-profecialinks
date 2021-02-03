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
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      const element = document.querySelector('div[id="collection"]');
      element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    });
    await context.evaluateInFrame('iframe', () => {
      function addHiddenDiv1(id, content, index) {
        const newDiv = document.createElement("div");
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = "none";
        const originalDiv = document.querySelectorAll('div[id="productPrice"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      var mainImage = document.querySelector('meta[property="og:image"]');
      let mainImageURL = mainImage.getAttribute("content");
      let totalImages = document.querySelectorAll('span[class="pane thumbnailPane"] span').length;
      totalImages = totalImages - 1;
      function replaceChar(origString, nextletter, index) {
        let firstPart = origString.substr(0, index);
        let lastPart = origString.substr(index + 1);
        let newString = firstPart + nextletter + lastPart;
        return newString;
      }
      function nextChar(letter) {
        return String.fromCharCode(letter.charCodeAt(0) + 1);
      }
      let nextletter = 'b';
      for (let i = 0; i < totalImages; i++) {
        console.log('sai')
        console.log(replaceChar(mainImageURL, nextletter, mainImageURL.indexOf(".jpg") - 1))
        nextletter = nextChar(nextletter);
      }
    });
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
        const originalDiv = document.querySelectorAll('div[id="productPrice"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      var price = getAllXpath("//p[@class='price']/text()", "nodeValue");
      if (price != null) {
        for (var i = 0; i < price.length; i++) {
          var price1 = price[i].replace(".", ",");
          addHiddenDiv1("price", price1, i);
        }
      }
      var hprice = getAllXpath("//p[@itemprop='highPrice']/text()", "nodeValue");
      if (hprice != null) {
        for (var i = 0; i < hprice.length; i++) {
          var price2 = hprice[i].replace(".", ",");
          price2 = price2.replace("Normal:", "");
          addHiddenDiv1("hprice", price2, i);
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};

// implementation: async (
//   { inputstring },
//   { country, domain },
//   context,
//   { productDetails }
// ) => {
//   await context.evaluate(() => {
//     function addElementToDocument(key, value) {
//       const catElement = document.createElement("div");
//       catElement.id = key;
//       catElement.textContent = value;
//       catElement.style.display = "none";
//       document.body.appendChild(catElement);
//     }
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
//     var getXpath = (xpath, prop) => {
//       var elem = document.evaluate(
//         xpath,
//         document,
//         null,
//         XPathResult.ANY_UNORDERED_NODE_TYPE,
//         null
//       );
//       let result;
//       if (prop && elem && elem.singleNodeValue)
//         result = elem.singleNodeValue[prop];
//       else result = elem ? elem.singleNodeValue : "";
//       return result && result.trim ? result.trim() : result;
//     };
//     var zz = getXpath("//div[@class='pane stitchedView']/img[1]/@src", "nodeValue");
//     if (zz != null) {
//       addElementToDocument("zz", zz);
//     }
//   });
//   await context.extract(productDetails);
// },
