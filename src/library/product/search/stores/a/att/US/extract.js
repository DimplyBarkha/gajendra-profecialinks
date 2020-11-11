const { transform } = require("../shared");

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log("inputs ", inputs);
  console.log("parameters ", parameters);
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  await context.evaluate(async function () {
    function addHiddenDiv(i, productCards, productInfo) {
      const newDivId = document.createElement("div");
      newDivId.id = i;
      newDivId.className = "extra-info-id";
      newDivId.style.display = "none";

      // const newDivUrl = document.createElement("div");
      // newDivUrl.id = i;
      // newDivUrl.className = "extra-info-url";
      // newDivUrl.style.display = "none";

      if (productInfo) {
        let prodId = productInfo.id;
        if(prodId.indexOf("https") === -1){
          if (prodId.indexOf("sku") > -1) {
            newDivId.textContent = prodId;
            if (productCards && productCards.item(i)) {
              productCards.item(i).appendChild(newDivId);
            }
          }
        }
      }
    }

    let results;
    let data;
    let apiUrl;
    let cardsLength = 0;
    try {
      let allSelector = document.querySelector("li.visible-desktop a");
      if (allSelector) {
        try {
          allSelector.click();
        } catch (err) {}
      }
      await new Promise((resolve, reject) => setTimeout(resolve, 20000));

      const productCards = document.querySelectorAll("ul.support-list>li");
      if (productCards) cardsLength = productCards.length;
      if (cardsLength > 150) cardsLength = 150;

      const refURL = window.location.href;
      let winUrl = refURL;
      winUrl = winUrl.replace("&group=true", "");
      winUrl = winUrl.replace("/search", "/query/");
      apiUrl = `${winUrl}&rows=${cardsLength}&start=0&smb=false&authData=%7B%7D&responseSignal=false`;

      await new Promise((resolve, reject) => setTimeout(resolve, 1000));

      if (apiUrl) {
        //fetch from API
        const response = await fetch(apiUrl, {
          headers: {
            accept: "*/*",
            "accept-language": "en-US,en;q=0.9",
            "sec-fetch-dest": "script",
            "sec-fetch-mode": "no-cors",
            "sec-fetch-site": "cross-site",
          },
          referrer: refURL,
          referrerPolicy: "no-referrer-when-downgrade",
          body: null,
          method: "GET",
          mode: "cors",
        });

        if (response && response.status === 400) {
          throw new Error("Error when calling API");
        }

        if (response && response.status === 404) {
          console.log("Product Not Found!!!!");
        }

        if (response && response.status === 200) {
          console.log("Product Found!!!!");
          data = await response.json();
          results = data.result.response.docs;
          addAllHiddenDiv(results);
        }
        function addAllHiddenDiv(productInfo) {
          let i = 0;
          while (i < cardsLength) {
            addHiddenDiv(i, productCards, productInfo[i]);
            i++;
          }
        }
      }
    } catch (err) {}
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: "product/search/extract",
  parameterValues: {
    country: "US",
    store: "att",
    transform: transform,
    domain: "att.com",
    zipcode: "''",
  },
  implementation,
};
