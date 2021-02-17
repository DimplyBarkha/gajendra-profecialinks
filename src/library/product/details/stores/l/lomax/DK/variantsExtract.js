const variants = require("./variants");

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DK',
    store: 'lomax',
    transform: null,
    domain: 'lomax.dk',
    zipcode: '',
  },
  // implementation,
};
// async function implementation(
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { variants } = dependencies;
//   await context.evaluate(async function () {
//     function addHiddenDiv(id, content, index) {
//       const newDiv = document.createElement('div');
//       newDiv.id = id;
//       newDiv.textContent = content;
//       newDiv.style.display = 'none';
//       const originalDiv = document.querySelectorAll('div[class="dropdown-menu p-0 mt-0 border-top-0 show"] a')[index];
//       originalDiv.parentNode.insertBefore(newDiv, originalDiv);
//     }
//     var len = document.querySelectorAll('div[class="dropdown-menu p-0 mt-0 border-top-0 show"] a').length;
//     for (let i = 0; i < len; i++) {
//       var url = document.querySelectorAll('div[class="dropdown-menu p-0 mt-0 border-top-0 show"] a')[i].getAttribute('href')

//       addHiddenDiv("url", [i], url);
//     };
//     for (let i = 0; i < len; i++) {
//       var id = document.querySelectorAll('div[class="dropdown-menu p-0 mt-0 border-top-0 show"] a')[i].getAttribute('href').split("-")
//       addHiddenDiv(id, "id==", id[id.length - 1])
//     };
//    });
//   return await context.extract(variants, { transform });
// }
