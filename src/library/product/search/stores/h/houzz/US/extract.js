module.exports = {
  implements: "product/search/extract",
  parameterValues: {
    country: "US",
    store: "houzz",
    transform: null,
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
      const product = document.querySelectorAll(
        ".hz-product-card__image-container"
      );
      let rank = document.querySelector(".hz-pagination-link--selected")
        .innerText;
      console.log(rank);

      const jsonString = document.querySelectorAll(
        "script[type='application/ld+json']"
      )[1];
      var Manufacture_list = document.getElementsByClassName(
        "hz-product-manufacturer hz-product-card__manufacturer hz-color-link hz-color-link--static hz-color-link--enabled "
      );
      const jsonParsed = JSON.parse(jsonString.innerText);
      const json_list = jsonParsed.itemListElement;

      for (let i = 0; i < product.length; i++) {
        console.log("Loop is working");
        try {
          var new_manuf = Manufacture_list[i].innerText.replace(/by/g, "");
          addHiddenDiv("ii_manufacture", new_manuf, i);
        } catch (err) {
          console.log(err);
        }

        var single_obj = json_list[i];
        var url_web = single_obj.url;

        addHiddenDiv("ii_produrl", url_web, i);
        if (rank == 1) {
          addHiddenDiv("ii_rankOrganic", single_obj.position, i);
        } else {
          var rrank = 36 * (rank - 1);
          addHiddenDiv("ii_rankOrganic", rrank + single_obj.position, i);
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
