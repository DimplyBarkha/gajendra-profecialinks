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
        try{
          document.querySelector(".btn.btn-none.hz-universal-search-header-tip__dismiss").click();
        }catch(err){
          console.log(err)
        }
        
      }
      if (
        document.querySelector(
          "body > div.hz-modal.hz-modal--dark > div.hz-trap-focus.hz-modal__container > div > div.hz-modal__body > div > div.hz-international-redirect-modal__btns > div.hz-international-redirect-modal__continue-btn > button"
        ) != null
      ) {
        try{
          document
          .querySelector(
            "body > div.hz-modal.hz-modal--dark > div.hz-trap-focus.hz-modal__container > div > div.hz-modal__body > div > div.hz-international-redirect-modal__btns > div.hz-international-redirect-modal__continue-btn > button"
          )
          .click();
        }catch(err){
          console.log(err)
        }

      }
      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        stall(500);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }

    });
    return await context.extract(productDetails, { transform });
  }
}
