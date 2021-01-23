
const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'zooroyal',
    transform,
    domain: 'zooroyal.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    const clickAcceptBannerBtn = async function (context) {
      try{
        await context.click('button#uc-btn-accept-banner');
      }catch(e){
        
      }
    };
    await clickAcceptBannerBtn(context);
    return await context.extract(productDetails, { transform });
  },
};
