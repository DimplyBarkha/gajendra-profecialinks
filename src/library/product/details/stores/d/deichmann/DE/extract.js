const { transform } = require("../format");

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'deichmann',
    transform,
    domain: 'deichmann.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(async () =>{
      document.querySelector(".open-size-selector").click();
      await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      document.querySelector(".size-selection").querySelector(".active-element").querySelector("span").click();
    })

    await context.extract(productDetails, { transform });
  },
};
