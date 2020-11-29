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
    await context.waitForSelector('div.t-breadcrumb div.t-breadcrumb__wrap');
    await context.evaluate(async function () {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement("div");
        newDiv.className = id;
        newDiv.innerHTML = content;
        newDiv.style.display = "none";
        document.body.appendChild(newDiv);
      }
        const breadcrumbs = document.querySelectorAll("div.t-breadcrumb div.t-breadcrumb__wrap");
        console.log("breadcrumb", breadcrumbs);
        // const categoryEl = document.createElement("ul");
        let span = "";
        breadcrumbs.forEach(x => {
          span += `<span>${x.innerText}</span>`;
        });
        addHiddenDiv("custom-attr-product-breadcrumb", span);
        // categoryEl.id = "custom-attr-product-breadcrumb";
        // categoryEl.style.display = "none";
        // document.body.appendChild(categoryEl);
    });
    var variantLength = await context.evaluate(async () => {
      const variants = [];
      document.querySelectorAll("div.dbh-product-color-selector div.pw-swatch__item button").forEach(x => {
        if (!x.closest("a")) {
          variants.push(x);
        }
      });
      return variants.length || 1;
    });
    // variantLength = 0;
    if (variantLength > 0) {
      // await preparePageForCommonElement(0, variantLength);
      
      for (let j = 0; j < variantLength; j++) {
        if (variantLength > 1) {
          await context.evaluate(async (j) => {
              const variants = [];
              document.querySelectorAll("div.dbh-product-color-selector div.pw-swatch__item button").forEach(x => {
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
            const hiddenDivs = document.querySelectorAll("*[id^=custom-attr]");
            hiddenDivs.forEach(x => {
              x.parentElement.removeChild(x);
            });

            const brandText = document.querySelector("div.t-product-details__main-wrapper div.t-product-details__content h1 span.dbh-brand-name");
            if (brandText) {
              addHiddenDiv("custom-attr-product-brand-text", brandText.textContent.split("-")[0].trim());
            }
            
            // const breadcrumbs = document.querySelectorAll("div.t-breadcrumb div.t-breadcrumb__wrap");
            // const categoryEl = document.createElement("ul");
            // breadcrumbs.forEach(x => {
            //   const liEl = document.createElement("li");
            //   liEl.textContent = x.innerText;
            //   categoryEl.appendChild(liEl);
            // });
            // categoryEl.id = "custom-attr-product-breadcrumb";
            // categoryEl.style.display = "none";
            // document.body.appendChild(categoryEl);

            const addToBagButton = document.evaluate("boolean(//button[contains(@class, 'dbh-add-to-bag')]/@disabled)", document, null, XPathResult.ANY_TYPE);
            if (addToBagButton) {
              const isDisabled = addToBagButton.booleanValue;
              addHiddenDiv("custom-attr-product-availability", isDisabled ? "Out of Stock" : "In Stock");
            }

            const productDescriptionEl = document.querySelectorAll("div.description-text-container div.product-item-number ~ div");
            if (productDescriptionEl) {
              let str = "";
              productDescriptionEl.forEach(x => {
                str = str.concat(x.innerText);
              });
              str && addHiddenDiv("custom-attr-product-description", str);
            }

            const editorNotesEl = document.querySelector("div[id='editors_notes'] div.item-subheading ~ p");
            const editorsNotes = editorNotesEl ? editorNotesEl.innerText : null;

            const descriptionList = document.querySelectorAll("div.description-text-container ul li");
            const descriptionLiItems = [''];
            const additionalBulletInfoEl = document.createElement("ul");
            descriptionList.forEach(x => {
              const liEl = document.createElement("li");
              liEl.textContent = x.innerText;
              additionalBulletInfoEl.appendChild(liEl);
              descriptionLiItems.push(x.innerText);
            });
            additionalBulletInfoEl.style.display = "none";
            additionalBulletInfoEl.id = "custom-attr-product-additional-bullet-info";
            document.body.appendChild(additionalBulletInfoEl);

            const volume = descriptionLiItems.find(x => x.startsWith("Volume:"));
            const productWeight = descriptionLiItems.find(x => x.startsWith("Weight"));
            const productWarning = descriptionLiItems.find(x => x.startsWith("Warning:"));
            const howToUse = descriptionLiItems.find(x => x.startsWith("How to use:"));
            const materials = descriptionLiItems.find(x => x.startsWith("Material:") || /.*Material|material:.*/.test(x.toLowerCase()));
            const guarantee = descriptionLiItems.find(x => x.startsWith("Guarantee:"));
            const warranty = descriptionLiItems.find(x => x.includes("warranty"));
            if (volume) {
              const size = volume.replace("Volume:", "").trim();
              addHiddenDiv("custom-attr-product-size", size);
            }
            if (productWeight) {
              const weight = productWeight.replace(/.*[Weight|weight|weigh|Weigh].*:(.*)/, "$1").trim();
              addHiddenDiv("custom-attr-product-weight", weight);
            }
            if (productWarning) {
              const warning = productWarning.replace("Warning:", "").trim();
              addHiddenDiv("custom-attr-product-warning", warning);
            }
            if (materials) {
              const material = materials.replace(/.*[Material|material]:(.*)/, "$1").trim();
              addHiddenDiv("custom-attr-product-material", material);
            }
            addHiddenDiv("custom-attr-product-directions", editorsNotes || howToUse);
            addHiddenDiv("custom-attr-product-warranty", warranty);

            addHiddenDiv("custom-attr-product-image-zoom-feature", "Yes");

            const productVariationsField = document.querySelectorAll("div.dbh-product-color-selector div.pw-swatch__item button");
            const productVariationsFieldEl = document.createElement("ul");
            const productVariants = [];
            if (j == 0) {
              for (let variantIt = 0; variantIt < productVariationsField.length; variantIt++) {
                const x = productVariationsField[variantIt];
                const liEl = document.createElement("li");
                const el = x.querySelector("div.pw-swatch__chip-inner div");
                if (el) {
                  const elKey = Object.keys(el).find(x => x.startsWith("__reactEventHandlers"));
                  el[elKey].onMouseEnter();
                  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
                  const color = document.querySelector("div#color-scroller span.c-popover__tooltip span");
                  liEl.textContent = color.innerText;
                  el[elKey].onMouseLeave();
                  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
                  productVariants.push(liEl.textContent);
                  productVariationsFieldEl.appendChild(liEl);
                }
              }
              productVariationsFieldEl.style.display = "none";
              productVariationsFieldEl.id = "single-custom-attr-product-variants-field";
              document.body.appendChild(productVariationsFieldEl);
              const first_variant = productVariants[0];
  
              addHiddenDiv("single-custom-attr-product-variant-count", productVariants.length);
  
              addHiddenDiv("single-custom-attr-product-first_variant", first_variant);
            }

            const products = (window.getTagProduct_Child_Sku() || "").split("|");
            if (products.length) {
              addHiddenDiv("custom-attr-product-sku-number", products[j] || "");
            }

            const selectedVariant = productVariationsField[j];
            if (selectedVariant) {
              const selected = selectedVariant.querySelector("div.pw-swatch__chip-inner div");
              if (selected) {
                const elKey = Object.keys(selected).find(x => x.startsWith("__reactEventHandlers"));
                if (elKey) {
                  selected[elKey].onMouseEnter();
                  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
                  const color = document.querySelector("div#color-scroller span.c-popover__tooltip span") || {};
                  addHiddenDiv("custom-attr-product-variant-color", color.innerText);
                  selected[elKey].onMouseLeave();
                  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
                }
              }
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
