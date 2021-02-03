const { transform } = require("../../../../shared");
module.exports = {
  implements: "product/search/extract",
  parameterValues: {
    country: "DE",
    store: "durstexpress",
    transform: transform,
    domain: "durstexpress.de",
    zipcode: "",
  },
  // implementation: async (
  //   { inputString },
  //   { country, domain, transform: transformParam },
  //   context,
  //   { productDetails }
  // ) => {
  //   await context.evaluate(async function () {
  //     if (document.querySelector("#plz_modal > div > a") != null) {
  //       async () => {
  //         const button = await document.querySelector("#plz_modal > div > a");
  //         // @ts-ignore
  //         button.click();
  //       };
  //     }
  //   });
  //   await context.extract(productDetails, { transform: transformParam });
  // },
};

//   implementation: async (inputs, parameters, context, dependencies) => {
//     const { transform } = parameters;
//     const { productDetails } = dependencies;
//     await context.evaluate(() => {
//       function addElementToDocument(key, value) {
//         const catElement = document.createElement("div");
//         catElement.id = key;
//         catElement.textContent = value;
//         catElement.style.display = "none";
//         document.body.appendChild(catElement);
//       }
//       const URL = window.location.href;
//       addElementToDocument("pd_url", URL);
//     });
//     return await context.extract(productDetails, { transform });
//   },
// };
