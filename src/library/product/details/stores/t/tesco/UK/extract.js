
const { transform } = require('./format');
// module.exports = {
//   implements: 'product/details/extract',
//   parameterValues: {
//     country: 'UK',
//     store: 'tesco',
//     transform :  transform,
//     domain: 'tesco.com',
//   },
// };

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'tesco',
    domain: 'tesco.com',
    transform

  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {


    var enTitle = document.querySelectorAll('table.product__info-table >  tbody > tr:nth-child(1) td')[0].textContent;
    var en = document.querySelectorAll('table.product__info-table >  tbody > tr:nth-child(1) td')[2].textContent;
    if(en !== undefined){
    var joinEnergy = enTitle.concat(":") + en;
    }else{
      console.log("undefined");
    }
    document.body.setAttribute('Energy',joinEnergy);
  });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};

