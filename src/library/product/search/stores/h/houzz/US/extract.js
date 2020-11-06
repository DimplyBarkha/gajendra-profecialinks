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
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement("div");
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = "none";
        const originalDiv = document.querySelectorAll(
          ".hz-product-card__product-image-info.hz-track-me"
        )[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      const product = document.querySelectorAll(
        ".hz-product-card__product-image-info.hz-track-me"
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
      var urllink = document.querySelectorAll(".hz-product-card__link");

      for (let i = 0; i < product.length; i++) {
        console.log("Loop is working");
        var new_manuf = Manufacture_list[i].innerText.replace(/by/g, "");
        addHiddenDiv("ii_manufacture", new_manuf, i);
        var single_obj = json_list[i];
        var url_web = single_obj.url;
        var urllink_update = urllink[i].getAttribute("href");
        var final_url = urllink_update.replace(/products/g, "photos");
        if ((final_url = url_web)) {
          if (rank == 1) {
            addHiddenDiv("ii_rankOrganic", single_obj.position, i);
          } else {
            var rrank = 36 * (rank - 1);
            addHiddenDiv("ii_rankOrganic", rrank + single_obj.position, i);
          }
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
