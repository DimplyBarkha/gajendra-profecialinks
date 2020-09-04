const { cleanUp } = require("../../../../shared");

module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "AT",
    store: "kastner-oehler",
    transform: cleanUp,
    domain: "kastner-oehler.at",
    zipcode: "",
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement("div");
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = "none";
        document.body.appendChild(catElement);
      }
      const descBullets = document.querySelector("div.en_tab__container ul.en_tab__items li div span[itemprop='description']")
        ? document.querySelector("div.en_tab__container ul.en_tab__items li div span[itemprop='description']").innerText
        : "";
      if (descBullets) {
        addElementToDocument("desc_bullets", descBullets.replace(/•/g, "||"));
      }

      const reservBtn = document.querySelector(".en_button.en_trigger.en_js_open_quickview_with_lazy_load.trigger_conversion_locationSearchGoal")
        ? document.querySelector(".en_button.en_trigger.en_js_open_quickview_with_lazy_load.trigger_conversion_locationSearchGoal")
        : "";
      if (reservBtn) {
        reservBtn.click();
      }
    });

    await context.extract(productDetails);
  },
};
