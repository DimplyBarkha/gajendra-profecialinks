const { cleanUp } = require("../../../../shared");
module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "DK",
    store: "matas",
    transform: cleanUp,
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
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.className = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll("h1[class='product-name product-name--large']")[0];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
        // document.body.appendChild(newDiv);
        }
        // @ts-ignore
        let description=document.querySelector('div[class="read-more js-readMore"]').innerText;
        addHiddenDiv("description", description);
        // @ts-ignore
        // const nameExtended=document.querySelector("h1[class*='product-name']").innerText;
        // addHiddenDiv("product_desc", nameExtended);  
      // Method to replace , with . for price
      // var price = getAllXpath('//div[@class="product-page__price"]//span[@class="nowrap"]/text() | (//span[@class="nowrap"])[1]/text()', "nodeValue");
      // if (price[0] != null) {
      //   var price1 = price[0].replace(",", ".");
      //   addHiddenDiv("price", price1);
      // }
      var rating = getAllXpath("//script[@type='application/ld+json' and contains(text(),'aggregateRating')]/text()","nodeValue");
      if (rating.length > 0) {
        let jsonrating = JSON.parse(rating[0])
        addHiddenDiv("aggrating", parseFloat(jsonrating.aggregateRating.ratingValue).toFixed(1).replace(".", ","));
        addHiddenDiv("reviewCount", jsonrating.aggregateRating.reviewCount);
      }
    });
    
    return await context.extract(productDetails, { transform });
  },
};
