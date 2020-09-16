const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'fust',
    transform,
    domain: 'fust.ch',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { transform ,zipcode } = parameters;
    const { productDetails} = dependencies;
  //   console.log(zipcode+' is a dependency');
  // //   // const inputSelector = 'input[name="zipcodeorcity"]';
  // //   // await context.evaluate((inputSelector) => {
  // //   //   document.querySelector(inputSelector).value = '5000';
  // //   // }, inputSelector);
  // //   let searchBtn = 'button[id="searchsubmit_ondemand"]';
  // //   searchBtn = await context.evaluate((searchBtn) => {
  // //     if (document.querySelector(searchBtn)) { return searchBtn; }
  // //   }, searchBtn);
  // //   let branchEnquiry='a[title="Filialanfrage"]';
  // //   if (searchBtn) {
  // //     await context.click(branchEnquiry);
  // //     await context.waitForSelector('div[class="filialen hidden"]');
  // //   }
    return await context.extract(productDetails, { transform });
  },
};
