const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'voussert',
    transform,
    domain: 'voussert.fr',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    const clickAcceptBannerBtn = async function (context) {
      try{
        if( document.querySelector('div#ctl00_cphProduits_pnlPromoEtArticle span[id="ctl00_cphProduits_DataPagerHaut"] a[class="pagination-next"][disabled]') ){
          await context.click('a#ctl00_cphProduits_lnkArticle');
        }
        await context.click('a#ctl00_cphProduits_lnkArticle');
      }catch(e){
        
      }
    };
    await clickAcceptBannerBtn(context);
    return await context.extract(productDetails, { transform });
  },
};
