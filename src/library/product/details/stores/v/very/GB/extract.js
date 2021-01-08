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
      const name = document.querySelector(".productHeading span") ? document.querySelector(".productHeading span").innerText : "";
      addElementToDom(name, "name");

      const descriptionBulletsCount = document.querySelector(".longDescription span[itemprop='description'] ul li")
        ? document.querySelectorAll(".longDescription span[itemprop='description'] ul li").length
        : "";
      addElementToDom(descriptionBulletsCount, "descriptionBulletsCount");

      const productImage = document.querySelector(".amp-viewer-main-container .amp-anim-container li.amp-selected img")
        ? document.querySelector(".amp-viewer-main-container .amp-anim-container li.amp-selected img").getAttribute("src")
        : "";
      addElementToDom(productImage, "productImage");

      const alteranteImages = document.querySelectorAll(".amp-viewer-main-container .amp-anim-container li img.amp-just-image");
      let secondaryImages = Array.from(alteranteImages).filter((value) => {
        return value.getAttribute("src") != productImage;
      });
      let secondaryImagesText = secondaryImages.map((value) => {
        return value.getAttribute("src");
      });
      addElementToDom(secondaryImagesText, "secondaryImagesText");

      const onlinePrice = document.querySelector(".productNowPrice .priceNow") ? document.querySelector(".productNowPrice .priceNow").innerText : "";
      addElementToDom(onlinePrice, "onlinePrice");

      const description = document.querySelector("span[itemprop='description'") ? document.querySelector("span[itemprop='description'").innerText.replace(/•/, "||") : "";
      addElementToDom(description, "descriptionText");

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

      const ratingsNumber = document.querySelector(".bv-rating-ratio-number") ? document.querySelector(".bv-rating-ratio-number").innerText : "";
      addElementToDom(ratingsNumber, "ratingsNumber");

      const specifications = document.querySelector(".sdAccordion .sdAccordion__item:nth-of-type(2) .sdAccordion__content #productSpecification table")
        ? document.querySelector(".sdAccordion .sdAccordion__item:nth-of-type(2) .sdAccordion__content #productSpecification table").innerText
        : "";
      addElementToDom(specifications, "specifications");
    });
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(5000);
            break;
          }
        }
        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    await context.extract(productDetails);
  },
};
