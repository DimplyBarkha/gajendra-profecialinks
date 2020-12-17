const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'melectronics',
    transform,
    domain: 'melectronics.ch',
    zipcode: '',
  }, implementation: async ({ inputString }, { country, domain, transform: transformParam}, context, { productDetails }) => {
    try {
      await context.waitForSelector(".detail-showcase--additional-img-box img[alt='Video']");
    } catch(er) {
      console.log("No video selector");
    }
    await context.evaluate(async function() {
      if(document.querySelector(".detail-showcase--additional-img-box img[alt='Video']")) {
        //@ts-ignore
        document.querySelector(".detail-showcase--additional-img-box img[alt='Video']").click();
        await new Promise((resolve, reject) => setTimeout(resolve, 4000));
      }
    })
    //fixing for gtin
    try{
      await context.evaluate(()=>{
        //@ts-ignore
        const dataFromScript = document.evaluate('//script[@type="application/ld+json"][contains(.,"gtin")]', document,null, 7, null).snapshotItem(0).innerText;
        const jsonData = JSON.parse(dataFromScript);
        const gtin = jsonData.gtin13;
        document.querySelector('body').setAttribute('gtin', gtin);
      })
    }catch(e){
      console.log('gtin not present');
    }
  await context.extract(productDetails, { transform: transformParam });
  }
};
