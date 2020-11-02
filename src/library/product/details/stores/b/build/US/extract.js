const { transform } = require("../trasform");
module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "US",
    store: "build",
    transform: transform,
    domain: "build.com",
    zipcode: "",
  },
  implementation: async (
    inputs,
    parameters,
    context,
    { productDetails: data }
  ) => {
    const { transform } = parameters;

    await context.evaluate(async function () {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement("div");
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = "none";
        document.body.appendChild(newDiv);
      }
      try {
        const { dataLayer } = window || {};
        const { selectedFinish } = dataLayer || {};
        addHiddenDiv(
          "custom-attr-product-brand-name",
          dataLayer.brand.name
        );
        // addHiddenDiv(
        //   "product-manufacturer-name",
        //   dataLayer.manufacturer
        // );
        addHiddenDiv(
          "custom-attr-product-sku-number",
          selectedFinish.sku
        );
        addHiddenDiv(
          "custom-attr-product-variant-id",
          selectedFinish.uniqueId
        );
        addHiddenDiv(
          "custom-attr-product-mpc",
          selectedFinish.sku
        );
        addHiddenDiv(
          "custom-attr-product-upc",
          selectedFinish.upc
        );
        
        var node = document.evaluate(
          "//div[contains(@class, 'description')]",
          document,
          null,
          XPathResult.ANY_TYPE
        );
        var data = node.iterateNext();
        if (data) {
          const liList = data.getElementsByTagName("li");
          const str = [];
          for (var item of liList) {
            str.push(item.innerText.trim());
          }
          addHiddenDiv("custom-attr-product-description", str.join(' || '));
          addHiddenDiv("custom-attr-product-description-bullet-count", str.length);
        }

        const specsIterator = document.evaluate("//div[@id='product-specs']//div[contains(@class, 'specs')]/..", document, null, XPathResult.ANY_TYPE);
        if (specsIterator) {
          let node = specsIterator.iterateNext();
          const specsArray = [];
          while(node) {
            specsArray.push(node.innerText.replace('\n', ' : '));
            node = specsIterator.iterateNext();
          }
          addHiddenDiv("custom-attr-product-specifications", specsArray.join(' || '));
        }
        addHiddenDiv("custom-attr-image-zoom-feature-present", 'Yes');
        addHiddenDiv("custom-attr-product-availability-text", selectedFinish.status === "stock" ? 'In Stock' : 'Out of Stock');

        const variants = dataLayer.finishes.map(finish => finish.finish);
        // addHiddenDiv("custom-attr-product-variants", variants);

        if (variants) {
          addHiddenDiv("custom-attr-product-variants-count", variants.length);
        }

        const pdfIterator = document.evaluate("//div[@id='manufacturer-resources']//a[contains(@class, 'js-view-pdf')]/@data-href", document, null, XPathResult.ANY_TYPE);
        const pdfNode = pdfIterator.iterateNext();
        if (pdfNode) {
          addHiddenDiv("custom-attr-product-pdfs", "Yes");
        }

        const variantsInfo = selectedFinish.finish;
        addHiddenDiv("custom-attr-product-variants-info", variantsInfo);
        // addHiddenDiv('custom-product-ean', window.product.ean);
        // var weight = '';
        // var node = document.evaluate("(//div[contains(@class,'product-aside--textBlock')]//ul[contains(@class, 'product-aside--list')]//li[contains(translate(string(), 'POIDS', 'poids'), 'poids')]//div//span)[position()=1]", document, null, XPathResult.ANY_TYPE);
        // data = node.iterateNext();
        // if (data) {
        //   weight = data.innerText;
        // } else {
        //   var node = document.evaluate("//td[contains(translate(string(), 'POIDS', 'poids'), 'poids')]/following-sibling::td", document, null, XPathResult.ANY_TYPE);
        //   data = node.iterateNext();
        //   if (data) {
        //     weight = data.innerText;
        //   }
        // }
        // addHiddenDiv('custom-product-info-weight', weight)
      } catch (error) {
        console.log("Error: ", error);
      }
    });
    return await context.extract(data, { transform });
  },
};
