const { transform } = require("../variantTransform");

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }
      // await context.evaluate(async function() {
      const variants = [
        {
          url: location.href,
          id: location.href.replace(/.*uid=(\d+).*/, "$1")
        }
      ];
      const element = document.evaluate(
        "//div[contains(@class, 'js-variations-container')]//a",
        document,
        null,
        XPathResult.ANY_TYPE
      );
      let it = element.iterateNext();
      while (it) {
        const hrefValue = it.href;
        if (hrefValue) {
          variants.push({
            url: hrefValue,
            id: hrefValue.replace(/.*uid=(\d+).*/, "$1"),
          });
        }
        it = element.iterateNext();
      }

      const variantsElement = document.createElement("ul");
      for (const item of variants) {
        const variant = document.createElement("li");
        variant.textContent = item.url;
        variant.setAttribute("data-variant-id", item.id);
        variantsElement.appendChild(variant);
      }
      variantsElement.id = "custom-attr-product-variants-urls";
      variantsElement.style.display = "none";
      document.body.appendChild(variantsElement);
    // });
  }, createUrl);
  return await context.extract(variants);
}

// async function implementation (
//   inputs,
//   parameters,
//   context,
//   { productDetails: data }
// ) {
//   const { transform } = parameters;

  // try {
  //   await context.evaluate(async function() {
  //     const variants = [
  //       {
  //         url: location.href,
  //         id: location.href.replace(/.*uid=(\d+).*/, "$1")
  //       }
  //     ];
  //     const element = document.evaluate(
  //       "//div[contains(@class, 'js-variations-container')]//a",
  //       document,
  //       null,
  //       XPathResult.ANY_TYPE
  //     );
  //     let it = element.iterateNext();
  //     while (it) {
  //       const hrefValue = it.href;
  //       if (hrefValue) {
  //         variants.push({
  //           url: hrefValue,
  //           id: hrefValue.replace(/.*uid=(\d+).*/, "$1"),
  //         });
  //       }
  //       it = element.iterateNext();
  //     }

  //     const variantsElement = document.createElement("ul");
  //     for (const item of variants) {
  //       const variant = document.createElement("li");
  //       variant.textContent = item.url;
  //       variant.setAttribute("variant-id", item.id);
  //       variantsElement.appendChild(variant);
  //     }
  //     variantsElement.id = "custom-attr-product-variants-urls";
  //     variantsElement.style.display = "none";
  //     document.body.appendChild(variantsElement);
  //   });
  // } catch (err) {
  //   console.log("Error: ", err);
  // }

//   return await context.extract(data, { transform });
// }

module.exports = {
  implements: "product/details/variants/variantsExtract",
  parameterValues: {
    country: "US",
    store: "build",
    transform,
    domain: "build.com",
    zipcode: "",
  },
  implementation
};
