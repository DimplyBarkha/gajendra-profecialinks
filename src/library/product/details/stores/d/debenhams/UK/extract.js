const { transform } = require("../transform");

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'debenhams',
    transform,
    domain: 'debenhams.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    { productDetails: data }
  ) => {
    const { transform } = parameters;

    var variantLength = await context.evaluate(async () => {
      const variants = [];
      document.querySelectorAll("div.dbh-product-color-selector div.pw-swatch__item img").forEach(x => {
        if (!x.closest("a")) {
          variants.push(x);
        }
      });
      return variants.length || 1;
    });

    if (variantLength > 0) {
      // await preparePageForCommonElement(0, variantLength);
      
      for (let j = 0; j < variantLength; j++) {
        if (variantLength > 1) {
          await context.evaluate(async (j) => {
              const variants = [];
              document.querySelectorAll("div.dbh-product-color-selector div.pw-swatch__item img").forEach(x => {
                if (!x.closest("a")) {
                  variants.push(x);
                }
              });
            return variants[j].click();
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
            
            const breadcrumbs = document.querySelectorAll("div.t-breadcrumb div.t-breadcrumb__wrap");
            const category = [];
            breadcrumbs.forEach(x => {
              category.push(x.innerText);
            });
            addHiddenDiv("custom-attr-product-breadcrumb", category.join(" > "));

            const addToBagButton = document.evaluate("boolean(//button[contains(@class, 'dbh-add-to-bag')]/@disabled)", document, null, XPathResult.ANY_TYPE);
            if (addToBagButton) {
              const isDisabled = addToBagButton.booleanValue;
              addHiddenDiv("custom-attr-product-availability", isDisabled ? "Out of Stock" : "In Stock");
            }

            const descriptionList = document.querySelectorAll("div.description-text-container ul li");
            const descriptionLiItems = [''];
            descriptionList.forEach(x => descriptionLiItems.push(x.innerText));
            const volume = descriptionLiItems.find(x => x.startsWith("Volume:"));
            if (volume) {
              const size = volume.replace("Volume:", "").trim();
              addHiddenDiv("custom-attr-product-size", size);
            }
            
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
