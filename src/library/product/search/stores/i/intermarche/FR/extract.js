module.exports = {
  implements: "product/search/extract",
  parameterValues: {
    country: "FR",
    store: "intermarche",
    transform: null,
    domain: "intermarche.com",
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
          ".productTileV2Styled__TileWrapper-sc-19ad4vz-0"
        )[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      const product = document.getElementsByClassName(
        "productTileV2Styled__TileWrapper-sc-19ad4vz-0"
      );
      function delay(delayInms) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(2);
          }, delayInms);
        });
      }

      async function sample() {
        console.log("a");
        console.log("waiting...");
        let delayres = await delay(6000);
        console.log("b");
      }
      sample();
      for (let i = 0; i < product.length; i++) {
        const url =
          product[i].parentNode.baseURI +
          "/product/" +
          product[i].parentNode.dataset.id;
        addHiddenDiv("ii_produrl", url, i);
        addHiddenDiv("ii_rankOrganic", i + 1, i);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
