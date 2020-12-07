module.exports = {
  implements: "product/search/extract",
  parameterValues: {
    country: "US",
    store: "instacart_costco",
    transform: null,
    domain: "instacart.com",
    zipcode: "",
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 40000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 40000) {
          await stall(7000);
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
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement("div");
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = "none";
        const originalDiv = document.querySelectorAll(".item-card-contents")[
          index
        ];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }

      const product = document.querySelectorAll(".item-card div a");

      for (let i = 0; i < product.length; i++) {
        const url = product[i].href;
        const product_code = url.split("item_");
        if (product_code[1].includes("?eligible_id")) {
          var prod_co = product_code[1].split("?eligible_id");
          addHiddenDiv("ii_procode", prod_co[0], i);
        } else {
          addHiddenDiv("ii_procode", product_code[1], i);
        }

        addHiddenDiv("ii_produrl", url, i);
        addHiddenDiv("ii_procode", product_code[1], i);
        addHiddenDiv("ii_rankOrganic", i + 1, i);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
