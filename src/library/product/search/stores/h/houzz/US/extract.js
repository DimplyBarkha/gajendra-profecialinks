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
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      if (
        document.querySelector(
          ".btn.btn-none.hz-universal-search-header-tip__dismiss"
        ) != null
      ) {
        document
          .querySelector(
            ".btn.btn-none.hz-universal-search-header-tip__dismiss"
          )
          .click();
      }
      if (
        document.querySelector(
          "body > div.hz-modal.hz-modal--dark > div.hz-trap-focus.hz-modal__container > div > div.hz-modal__body > div > div.hz-international-redirect-modal__btns > div.hz-international-redirect-modal__continue-btn > button"
        ) != null
      ) {
        document
          .querySelector(
            "body > div.hz-modal.hz-modal--dark > div.hz-trap-focus.hz-modal__container > div > div.hz-modal__body > div > div.hz-international-redirect-modal__btns > div.hz-international-redirect-modal__continue-btn > button"
          )
          .click();
      }
      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }
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
      for (let i = 0; i < link.length; i++) {
        console.log("Loop is working");
        const searchURL = window.location.href.split("?")[0]
        addHiddenDiv("ii_searchURL", searchURL, i);
      }
    });
    return await context.extract(productDetails, { transform });
  }
}
