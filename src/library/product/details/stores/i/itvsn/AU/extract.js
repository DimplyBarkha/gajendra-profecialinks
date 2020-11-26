
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
    try{
      
      await context.waitForSelector('div[class="tvsn-productmedia-viewer"] img')
      await context.evaluate(()=>{
        let thumbnail = '';
        //@ts-ignore
        thumbnail = document.querySelector('div[class="tvsn-productmedia-viewer"] img').getAttribute('src');
        document.querySelector('body').setAttribute('thumbnail', thumbnail);
      })
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
