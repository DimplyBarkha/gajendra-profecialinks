module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "US",
    store: "instacart_costco",
    transform: null,
    domain: "instacart.com",
    zipcode: "",
  },
  implementation: async (
    { url },
    { country, domain },
    context,
    dependencies
  ) => {
    await context.evaluate(() => {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement("div");
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = "none";
        document.body.appendChild(newDiv);
      }
      let scrollTop = 500;
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      while (true) {
        window.scroll(0, scrollTop);
        stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }
      if (window.location.href != null) {
        var url = window.location.href;
        if (url.includes("item_")) {
          const product_code = url.split("item_");
          if (product_code[1].includes("?")) {
            var prod_co = product_code[1].split("?");
            addHiddenDiv("ii_procode", prod_co[0]);
          } else {
            addHiddenDiv("ii_procode", product_code[1]);
          }
        } else {
          const product_code = url.split("products/");
          if (product_code[1].includes("-")) {
            var prod_co = product_code[1].split("-");
            addHiddenDiv("ii_procode", prod_co[0]);
          } else {
            addHiddenDiv("ii_procode", product_code[1]);
          }
        }
      }
      addHiddenDiv("ii_gram", "g");
      addHiddenDiv("ii_mg", "mg");
    });
    await context.extract(dependencies.productDetails);
  },
};
