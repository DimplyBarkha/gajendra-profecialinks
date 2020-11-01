// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   console.log("inputs:: ", inputs);
//   const {url, id } = inputs;
//   console.log("parameters:: ", parameters);
//   if(id){
//   await new Promise((resolve, reject) => setTimeout(resolve, 10000));
//   await context.waitForXPath('//div[@class="variant-wrapper"]//button');

//   await context.waitForSelector('div.variant-wrapper button');
//   console.log('everything fine !!!');
//   await context.evaluate(() => {
//     const firstItem = document.querySelector('div.variant-wrapper button');
//     firstItem.click();
//   });

//   await new Promise((resolve, reject) => setTimeout(resolve, 10000));

//   await context.evaluate(async function () {
//     function addHiddenDiv (id, content) {
//       const newDiv = document.createElement('div');
//       newDiv.id = id;
//       newDiv.textContent = content;
//       newDiv.style.display = 'none';
//       document.body.appendChild(newDiv);
//     }
//   return await context.extract(productDetails, { transform });
// }



module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'PL',
    store: 'euro',
    transform: null,
    domain: 'euro.com.pl',
    zipcode: '',
  },
 // implementation,
};
