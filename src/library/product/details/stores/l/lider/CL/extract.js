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
    try {
      const finalURL = await context.evaluate(async () => {
        const url = document.querySelector('div[id*="productBox"] div div a').getAttribute('href');
        return url;
      });
      if (finalURL.length > 1) {
        await context.goto("https://www.lider.cl" + finalURL, { timeout: 30000, waitUntil: 'load', checkBlocked: false });
      }
    } catch (error) {

    }
    await context.evaluate(async () => {
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

      var mainImage = document.querySelector('meta[property="og:image"]');
      let mainImageURL = mainImage.getAttribute("content");
      console.log(mainImageURL);
      let FinalImageNumber = mainImageURL.match(/(\d+)/g)[0];
      let fetchURL = 'https://wlmstatic.lider.cl/contentassets/galleries/' + FinalImageNumber + '.xml';
      console.log(fetchURL);
      let finalArrImg = [];
      await fetch(fetchURL).then(res => res.text()).then(res => {
        const p = new DOMParser();
        const xmlDOM = p.parseFromString(res, "text/xml");
        Array.from(xmlDOM.querySelectorAll('item > image')).forEach(i => finalArrImg.push(i.textContent));
      });
      console.log(FinalImageNumber);
      console.log(finalArrImg);
      for (let i = 1; i < finalArrImg.length; i++) {
        addHiddenDiv1('alternateImg', mainImageURL.replace(/file:.+jpg/g, finalArrImg[i]), 0)
      }
    });
    return await context.extract(productDetails, { transform });
  },
};

