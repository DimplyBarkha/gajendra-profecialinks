const { transform } = require("../../../../shared");

module.exports = {
  implements: "product/search/extract",
  parameterValues: {
    country: "US",
    store: "StaplesAdvantage",
    transform,
    domain: "staplesadvantage.com",
    zipcode: "",
  },
  implementation: async (
    { inputString },
    { country, domain, transform },
    context,
    { productDetails }
  ) => {
    // const applyScroll = async function (context) {
    //   await context.evaluate(async function () {
    //     let scrollTop = 0;
    //     while (scrollTop !== 5000) {
    //       await stall(1000);
    //       scrollTop += 500;
    //       window.scroll(0, scrollTop);
    //       if (scrollTop === 5000) {
    //         await stall(1000);
    //         break;
    //       }
    //     }
    //     function stall(ms) {
    //       return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //           resolve();
    //         }, ms);
    //       });
    //     }
    //   });
    // };
    // await applyScroll(context);
    // await context.evaluate(() => {
    //   function addElementToDocument(elem, id, value) {
    //     const newDiv = document.createElement("div");
    //     newDiv.id = id;
    //     newDiv.textContent = value;
    //     newDiv.style.display = "none";
    //     elem.appendChild(newDiv);
    //   }
    //   const arr = document.querySelectorAll(
    //     'div[data-tracker="productgrid-main"] div.product-grid-item'
    //   );
    //   for (let i = 0; i < arr.length; i++) {
    //     const ratings = document.querySelectorAll(
    //       "div.SvgFilledWrapper-sc-1fg2071-2  desc#svg-desc"
    //     )[i]
    //       ? document.querySelectorAll(
    //           "div.SvgFilledWrapper-sc-1fg2071-2  desc#svg-desc"
    //         )[i].textContent
    //       : "";
    //     const ratingCount = ratings.length
    //       ? ratings.replace(/^[^\d]+(\d+,?\.?\d*).+$/g, "$1")
    //       : "";
    //     addElementToDocument(arr[i], "ratingCount", ratingCount);
    //     const aggRating = ratings.length
    //       ? ratings.replace(/^[^\d]+\d+,?\.?\d*[^\d]+(\d+,?\.?\d*)$/g, "$1")
    //       : "";
    //     addElementToDocument(arr[i], "aggRating", aggRating);
    //   }
    // });
    return await context.extract(productDetails, { transform });
  },
};
