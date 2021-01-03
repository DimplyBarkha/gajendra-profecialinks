const { transform } = require("../transform");
async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
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
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };

  await new Promise((resolve, _) => setTimeout(resolve, 6000));
  await applyScroll(context);
  await new Promise((resolve, _) => setTimeout(resolve, 6000));
  const mainUrl = await context.evaluate(async function () {
    return document.URL;
  });

  const results = await context.evaluate(async function () {
    const result = [];
    const product = document.querySelectorAll(
      "div.t-product-list__container div.t-product-list__product"
    );
    // select query selector and loop and add div
    for (let i = 0; i < product.length; i++) {
      const productUrl = document.querySelectorAll(
        "div.t-product-list__container div.t-product-list__product a.c-product-tile__link--desktop"
      );
      result.push({
        url: productUrl && productUrl[i] && productUrl[i].href,
        code: "",
        searchUrl: document.URL,
      });
    }
    return result;
  });

  for (let i = 0; i < results.length; i++) {
    console.log(results[i].url);
    if (results[i].code === "") {
      try {
        await context.goto(results[i].url, {
          timeout: 10000000,
          waitUntil: "load",
          checkBlocked: true,
          js_enabled: true,
          css_enabled: false,
          random_move_mouse: true,
        });
        const productCode = await context.evaluate(async function () {
          const productCode = (
            (window.utag_data && window.utag_data.product_sku) ||
            ""
          ).split("|");
          return productCode && productCode.length
            ? productCode[productCode.length - 1]
            : "";
        });
        results[i].code = productCode;
      } catch (err) {}
    }
  }

  try {
    await context.goto(mainUrl, {
      timeout: 1000000,
      waitUntil: "load",
      checkBlocked: true,
    });
  } catch (error) {
    console.log("Error: ", error);
  }

  if (results && results.length) {
    await context.evaluate(async function (results) {
      const productsList = document.querySelectorAll(
        "div.t-product-list__container div.t-product-list__product"
      );
      results.forEach((res, index) => {
        const skuDiv = document.createElement("div");
        skuDiv.style.display = "none";
        skuDiv.className = "custom-attr-product-sku";
        skuDiv.textContent = res.code;
        const urlDiv = document.createElement("div");
        urlDiv.style.display = "none";
        urlDiv.className = "custom-attr-product-url";
        urlDiv.textContent = res.url;
        const searchUrl = document.createElement("div");
        searchUrl.style.display = "none";
        searchUrl.className = "custom-attr-product-search-url";
        searchUrl.textContent = res.searchUrl;
        productsList[index].appendChild(skuDiv);
        productsList[index].appendChild(urlDiv);
        productsList[index].appendChild(searchUrl);
      });
    }, results);
  }
  await applyScroll(context);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: "product/search/extract",
  parameterValues: {
    country: "UK",
    store: "debenhams",
    transform,
    domain: "debenhams.com",
    zipcode: "",
  },
  implementation,
};
