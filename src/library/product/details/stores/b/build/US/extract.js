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

    var variantLength = await context.evaluate(async () => {
      return (document.querySelectorAll("div#purchase-box div#finish-swatches ul.finish-list li")) ? document.querySelectorAll("div#purchase-box div#finish-swatches ul.finish-list li").length || 1 : 0;
    });

    if (variantLength > 0) {
      // await preparePageForCommonElement(0, variantLength);
      
      for (let j = 0; j < variantLength; j++) {
        if (variantLength > 1) {
          await context.evaluate(async (j) => {
            return document.querySelectorAll("div#purchase-box div#finish-swatches ul.finish-list li")[j].click();
          }, j); 
        }
        await context.evaluate(async (j) => {
          function addHiddenDiv(id, content) {
            const newDiv = document.createElement("div");
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = "none";
            document.body.appendChild(newDiv);
          }
          // await context.click(`ul.topic li label`);
          console.log('Inside variants');
          try {
            const hiddenDivs = document.querySelectorAll("div[id^=custom-attr]");
            hiddenDivs.forEach(x => {
              x.parentElement.removeChild(x);
            });
            const { dataLayer } = window || {};
            const selectedFinish = j == 0 ? (dataLayer.finishes[j] || dataLayer.selectedFinish) : dataLayer.finishes[j] || {};
            addHiddenDiv(
              "custom-attr-url-field",
              window.location.href
            );
            addHiddenDiv(
              "custom-attr-product-brand-name",
              dataLayer.brand.name
            );
            addHiddenDiv(
              "custom-attr-product-manufacturer-name",
              dataLayer.manufacturer
            );
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
            console.log('availability text', selectedFinish.status);
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
            
          } catch (error) {
            console.log("Error: ", error);
          }
          
        }, j);
        
        // await preparePage(j, variantLength);
        if (j !== variantLength - 1) { await context.extract(data, { transform }, { type: 'APPEND' }); }
      }
    }
    return await context.extract(data, { transform });
  },
};
