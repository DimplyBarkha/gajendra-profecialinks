module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "DK",
    store: "power",
    transform: null,
    domain: "power.dk",
    zipcode: "",
  },

  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.waitForSelector("#product-information-tabs > div:nth-child(1) > div > i");
    await context.waitForSelector("#product-intro pwr-product-stock-label");
    await context.click("#product-information-tabs > div:nth-child(1) > div > i");
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement("div");
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = "none";
        document.body.appendChild(catElement);
      }

      function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }

      const eangtin = getElementByXpath('//*[@id="product-information-tabs"]//*[contains(text(),"EAN")]/../../../..')
        ? getElementByXpath('//*[@id="product-information-tabs"]//*[contains(text(),"EAN")]/../../../..').textContent
        : "";
      if (eangtin) addElementToDocument("eangtin", eangtin);

      let stock = getElementByXpath('//*[@id="product-intro"]//pwr-product-stock-label[2]/span/@class')
        ? getElementByXpath('//*[@id="product-intro"]//pwr-product-stock-label[2]/span/@class').textContent
        : "";

      if (stock) {
        if (stock.includes("stock-available")) {
          stock = "In Stock";
        } else {
          stock = "Out of Stock";
        }
        addElementToDocument("stock", stock);
      } else {
        stock = "Out of Stock";
        addElementToDocument("stock", stock);
      }

      const color = getElementByXpath('//*[@id="product-tab-general"]/div/pwr-product-specifications/div[2]/div[2]/div[2]/span')
        ? getElementByXpath('//*[@id="product-tab-general"]/div/pwr-product-specifications/div[2]/div[2]/div[2]/span').textContent
        : "";
      if (color) addElementToDocument("color", color);

      const weightNet = getElementByXpath('//*[@id="product-tab-general"]/div/pwr-product-specifications/div[8]/div[6]/div[2]/span')
        ? getElementByXpath('//*[@id="product-tab-general"]/div/pwr-product-specifications/div[8]/div[6]/div[2]/span').textContent
        : "";
      if (weightNet) addElementToDocument("weightNet", weightNet);

      const specifications = getElementByXpath('//*[@id="product-tab-general"]/div/pwr-product-specifications/div[8]/div[5]/div[2]/span')
        ? getElementByXpath('//*[@id="product-tab-general"]/div/pwr-product-specifications/div[8]/div[5]/div[2]/span').textContent
        : "";
      if (specifications) addElementToDocument("specifications", specifications);

      const mpc = getElementByXpath('//*[@id="product-tab-general"]/div/pwr-product-specifications/div[1]/div[2]/div[2]/span')
        ? getElementByXpath('//*[@id="product-tab-general"]/div/pwr-product-specifications/div[1]/div[2]/div[2]/span').textContent
        : "";
      if (mpc) addElementToDocument("mpc", mpc);

      const iframeVideoListContainer = document.querySelector("#videoly-container iframe") ? document.querySelector("#videoly-container iframe") : "";
      let text = "";
      if (iframeVideoListContainer) {
        let listOfVideos = document
          .evaluate('//ul[contains(@class, "b-video-list")]', iframeVideoListContainer.contentDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
          .singleNodeValue.querySelectorAll("li");

        listOfVideos.forEach((videoContainer, index, arr) => {
          let element = videoContainer.querySelector("div");
          if (index == arr.length - 1) {
            text += "https://www.youtube.com/watch?v=" + element.getAttribute("data-videoid");
          } else {
            text += "https://www.youtube.com/watch?v=" + element.getAttribute("data-videoid") + ", ";
          }
        });
      }
      if (text) addElementToDocument("urlsForVideos", text);
    });

    await context.extract(productDetails);
  },
};

//   implementation: async ({
//     inputString,
//   }, {
//     country,
//     domain,
//   }, context, {
//     productDetails,
//   }) => {
//     await context.waitForSelector('#product-information-tabs > div:nth-child(1) > div > i"]');
//     await context.click('#product-information-tabs > div:nth-child(1) > div > i');
//     await context.evaluate(async function () {

//       function addElementToDocument(key, value) {
//         const catElement = document.createElement('div');
//         catElement.id = key;
//         catElement.textContent = value;
//         catElement.style.display = 'none';
//         document.body.appendChild(catElement);
//       }
//       const gtin = document.querySelector('#product-tab-general > div > pwr-product-specifications > div:nth-child(2) > div:nth-child(3) > div.col-sm-4.col-xs-4 > span > font > font')
//         // @ts-ignore
//         ?
//         document.querySelector('#product-tab-general > div > pwr-product-specifications > div:nth-child(2) > div:nth-child(3) > div.col-sm-4.col-xs-4 > span > font > font').innerText : '';
//       if (gtin) {
//         addElementToDocument('gtin', gtin);
//       }
//     });
//     await context.extract(productDetails);
//   },
// };
