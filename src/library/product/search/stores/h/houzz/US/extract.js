const { transform } = require("../../../../shared");
module.exports = {
  implements: "product/search/extract",
  parameterValues: {
    country: "US",
    store: "houzz",
    transform: transform,
    domain: "houzz.com",
    zipcode: "",
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement("div");
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = "none";
        const originalDiv = document.querySelectorAll(
          ".hz-product-card__image-container"
        )[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      var link = document.getElementsByClassName("hz-product-card__link")
      if (link != null){
        for (let i = 0; i < link.length; i++) {
          console.log("Loop is working");
          const searchURL = window.location.href.split("?")[0]
          addHiddenDiv("ii_searchURL", searchURL, i);
        }
      }

    });
    return await context.extract(productDetails, { transform });
  }
}
