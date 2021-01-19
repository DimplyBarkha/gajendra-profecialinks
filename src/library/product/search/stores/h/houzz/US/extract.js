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
      var jsonString = document.querySelectorAll(
        "[type='application/ld+json']"
      )[1];
      var jsonParsed = JSON.parse(jsonString.innerText);
      var json_list = jsonParsed.itemListElement;

      function addHiddenDiv(id, content, index) {
        var newDiv = document.createElement("div");
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = "none";
        var originalDiv = document.querySelectorAll(
          ".hz-product-card__image-container"
        )[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      var link = document.getElementsByClassName("hz-product-card__link")
      if (link != null){
        for (let i = 0; i < link.length; i++) {
          console.log("Loop is working");
          var single_obj = json_list[i];
          var url_web = single_obj.url;
          var searchURL = window.location.href.split("?")[0]
          addHiddenDiv("ii_searchURL", searchURL, i);
          addHiddenDiv("ii_produrl", url_web, i);
        }
      }

    });
    return await context.extract(productDetails, { transform });
  }
}


