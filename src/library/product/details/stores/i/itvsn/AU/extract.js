
const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'itvsn',
    transform,
    domain: 'itvsn.com.au',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    let bigImageSel = 'div[class="tvsn-productmedia-viewer"] img';
    try{
      await context.waitForSelector(bigImageSel)
      await context.evaluate(async (bigImageSel)=>{
        let thumbnail = '';
        //@ts-ignore
        console.log('need to check for bigImageSel', bigImageSel);
        thumbnail = document.querySelector(bigImageSel).getAttribute('src');
        let imageAlt = document.querySelector(bigImageSel).getAttribute('alt');
        console.log('imageAlt', imageAlt);
        document.querySelector('body').setAttribute('thumbnail', thumbnail);
        document.querySelector('body').setAttribute('imagealt', imageAlt);
      }, bigImageSel);
    }catch(err){
      console.log('No thumbnail present', err.message)
    }
    try{
      await context. waitForSelector('div[class*="playvideo"]');
      await context.evaluate(()=>{
        //@ts-ignore
        document.querySelector('div[class*="playvideo"]').click();
      })
      await context. waitForSelector('video source', { timeout: 30000 });
    }catch(err){
      console.log('No video available', err.message);
    }
    return await context.extract(productDetails, { transform });
  }
};
