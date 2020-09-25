const { cleanUp } = require("../../../../shared");
module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "BE",
    store: "krefel",
    transform: cleanUp,
    domain: "krefel.be",
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
      const accCookie = document.querySelector("section.cookie-alert div.button-section a");
      if (accCookie) accCookie.click();
      await new Promise((resolve, reject) => setTimeout(resolve, 6000));

      const scriptWithInfo = document.evaluate("//script[contains(text(), 'availability')]", document, null, XPathResult.STRING_TYPE, null);
      const regexAvailability = /"availability":\s"([A-z]+)"/g;
      const regexRating = /"ratingValue":\s"([\d,]+)"/g;
      const foundAvailability = regexAvailability.exec(scriptWithInfo.stringValue);
      const foundRatingValue = regexRating.exec(scriptWithInfo.stringValue);
      if (foundAvailability && foundAvailability[1] === "InStock") {
        addElementToDocument("availability", "In Stock");
      } else addElementToDocument("availability", "Out of Stock");
      if (foundRatingValue) {
        addElementToDocument("ratingValue", foundRatingValue[1]);
      }
      const pdfExists = document.evaluate('//div[@class="description-wrap"]//a[contains(text(), "PDF")]/@href', document, null, XPathResult.STRING_TYPE, null);
      if (pdfExists && pdfExists.stringValue) addElementToDocument("pdfExists", "Yes");
      const specifications = document.querySelectorAll("div.block-header, div.specs-overview li");
      const specArr = [];
      if (specifications.length) {
        specifications.forEach((e) => {
          specArr.push(e.innerText.replace(/\n/g, " "));
        });
      }
      addElementToDocument("specifications", specArr.join(" || "));
      const description = document.querySelectorAll("section.description div p");
      const descArr = [];
      if (description.length) {
        description.forEach((e) => {
          descArr.push(e.innerText);
        });
      }
      addElementToDocument("description", descArr.join(" || "));
      const warrantyXpath = document.evaluate('//div[@class="description-wrap"]//*[contains(text(),"garantie")]', document, null, XPathResult.STRING_TYPE, null);
      const warranty = warrantyXpath ? warrantyXpath.stringValue : "";
      if (warranty) addElementToDocument("warranty", warranty);

      const promotionText = document.querySelector("div.product-info .promotion-wrap > span") ? document.querySelector("div.product-info .promotion-wrap > span").innerText : "";
      if (promotionText) addElementToDocument("promotionText", promotionText);

      let videosText = document.querySelector("div.autheos-videothumbnail img") ? document.querySelector("div.autheos-videothumbnail img").getAttribute("src") : "";
      if (videosText) {
        const index = videosText.indexOf("thumb");
        if (videosText.includes("generic")) {
          videosText = videosText.slice(0, index - 1);
        } else {
          videosText = videosText.slice(0, index);
          videosText += "high.mp4";
        }
        addElementToDocument("videosText", videosText);
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    return await context.extract(productDetails);
  },
};
