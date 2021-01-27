const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'fnac',
    transform,
    domain: 'fnac.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 5000) {
          await stall(1000);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 5000) {
            await stall(1000);
            break;
          }
        }
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    try{
      await context.waitForSelector('div[class*="flix-std-table"] img');
    }
    catch(e){
      console.log("Couldn't find selector");
    }
    /**
     * Note: Comment API as it is getting blocked and might effect block rate.
    async function getUPDP() {
      const strateType = ['CustomersAlsoBought', 'ComplementaryProducts', 'DoNotMiss', 'InkCartridge', 'NavigationHistory'];
      const productId = document.querySelector('.f-productPage').getAttribute('data-prid');
      const API = strateType.map(type => `https://www.fnac.com/Nav/API/Article/GetStrate?prid=${productId}&catalogRef=1&strateType=${type}`);
      const promises = API.map(api => fetch(api));
      const responses = await Promise.all(promises);
      const validResponse = responses.filter(response => response.headers.get('content-length') > 0);
      const data = await Promise.all(validResponse.map(r => r.json()));
      const UPDP = data.map(elm => elm.ArticleThumbnailList).flat().map(elm => elm.Title.TitleFull);
      document.body.setAttribute('updp', UPDP.join('|'));
    }
    try {
      await context.evaluate(getUPDP);
    } catch (error) {
      console.log('Error getting UPDP. Error: ', error);
    }*/
    return await context.extract(productDetails, { transform });
  },
};
