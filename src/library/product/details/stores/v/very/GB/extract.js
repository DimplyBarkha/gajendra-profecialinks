module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "GB",
    store: "very",
    transform: null,
    domain: "very.co.uk",
    zipcode: "",
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDom(text, id) {
        const newDiv = document.createElement("div");
        newDiv.setAttribute("id", id);
        newDiv.innerText = text;
        document.body.appendChild(newDiv);
      }

      const metaKeywords = document.querySelector("meta[name='keywords']").getAttribute("content") ? document.querySelector("meta[name='keywords']").getAttribute("content") : "";
      addElementToDom(metaKeywords, "metaKeywords");

      const category = document.querySelector("#breadCrumbTrail") ? document.querySelector("#breadCrumbTrail").innerText : "";
      addElementToDom(category, "category");

      let extendedName = document.querySelector("#productName span") ? document.querySelector("#productName span").innerText : "";
      extendedName = extendedName.toLowerCase().includes("dyson") ? extendedName : `Dyson - ${extendedName}`;
      addElementToDom(extendedName, "extendedName");

      const availabilityText = document.querySelector(".stockMessaging") ? document.querySelector(".stockMessaging").innerText : "";
      addElementToDom(availabilityText, "availabilityText");

      let ean = document.querySelector("#productEAN") ? document.querySelector("#productEAN").innerText : "";
      ean = ean.toLowerCase().replace("ean: ", "");
      addElementToDom(ean, "eanCode");

      let mpc = document.querySelector("#productMPN") ? document.querySelector("#productMPN").innerText : "";
      mpc = mpc.toLowerCase().replace("mpn: ", "");
      addElementToDom(mpc, "mpcCode");

      const ratingsCount = document.querySelector(".bv-rating-ratio-count") ? document.querySelector(".bv-rating-ratio-count").innerText.match(/\d*/g)[0] : "";
      addElementToDom(ratingsCount, "ratingsCount");

      const ratingsNumber = document.querySelector(".bv-rating-ratio-number") ? document.querySelector(".bv-rating-ratio-number").innerText.match(/\d*/g)[0] : "";
      addElementToDom(ratingsNumber, "ratingsNumber");

      if (document.querySelectorAll("span[itemprop='description'] ul li")) {
        let dimensions = "";
        document.querySelectorAll("span[itemprop='description'] ul li").forEach((li) => {
          if (li.innerText.toLowerCase().includes("depth") || li.innerText.toLowerCase().includes("height") || li.innerText.toLowerCase().includes("width")) {
            dimensions += li.innerText;
          }
        });

        let specifications = "";
        let count = 0;

        dimensions.match(/\d*/g).forEach((number, index) => {
          if (number !== "") {
            if (count == 2) {
              specifications += number;
            } else {
              specifications += number + " x ";
              count++;
            }
          }
        });

        addElementToDom(specifications, "specifications");
      }
    });
    await context.extract(productDetails);
  },
};
