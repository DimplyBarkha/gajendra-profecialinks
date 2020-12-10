const { transform } = require("../../../../shared");
module.exports = {
  implements: "product/search/extract",
  parameterValues: {
    country: "DK",
    store: "matas",
    transform: transform,
    domain: "matas.dk",
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
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement("div");
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = "none";
        const originalDiv = document.querySelectorAll('div[class="productlist__products"]>div>div>div>div[class="product-item__price-container"]>div>span>span')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // Method to Retrieve Xpath content of a Single Node
      var vari = getAllXpath("//div[@class='productlist__products']//div[@class='review-stars__container review-stars__container--border']/@data-js-border-offset","nodeValue");
      if (vari != null) {
        for (var i = 0; i < vari.length; i++) {
          var agg = (vari[i].slice(0, -1) * 5) / 100;
          addHiddenDiv("agg", agg, i);
        }
      }
      const name = document.querySelectorAll('div[class="row flex flex-wrap grid-overwrite--product-items"]>div');
      // @ts-ignore
      let price;
      for (let i = 0; i < name.length; i++) {
        // @ts-ignore
        price = document.querySelectorAll('div[class="productlist__products"]>div>div>div>div[class="product-item__price-container"]>div>span>span')[i].innerText;
        var priceUpdated = price.replace(",", ".");
        addHiddenDiv("price", priceUpdated, i);
      }
    //   const URL = window.location.href;
    // try {
    //   document.getElementById('pd_url').remove();
    // } catch (error) {
    // }
    // addElementToDocument('pd_url', URL);
    });
    return await context.extract(productDetails, { transform });
  },
};
