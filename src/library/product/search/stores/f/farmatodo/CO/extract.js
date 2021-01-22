const {transform}=require('../CO/format')
async function implementation ({ inputString }, { country, domain, transform }, context, { productDetails }){
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  await context.waitForSelector('div.cont-products>div>button');
  await context.click('div.cont-products>div>button');
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  const applyScroll = async function () {
    await context.evaluate(async function () {
      let count = document.querySelectorAll('div.cont-card-ftd>div.card-ftd').length;
      let loadMoreBtn=document.querySelector('div.cont-products>div>button');
      while(loadMoreBtn && count<150){
        console.log('count:',count);
        loadMoreBtn.click();
        await new Promise((resolve, reject) => setTimeout(resolve, 5000));
        let newCount = document.querySelectorAll('div.cont-card-ftd>div.card-ftd').length;
        console.log('newCount:',newCount);
        if(newCount===count){
          break;
        }else{
          count=newCount;
        }
      }
      let currScroll = document.querySelector('div.cont-router-outlet').scrollTop;
      console.log('currScroll:',currScroll);
      /*while (count < 150) {
        const oldCount=count;
        console.log('oldScroll:',oldCount);
        document.querySelector('button#group-view-load-more') && document.querySelector('button#group-view-load-more').scrollIntoView(true);
        console.log('start scrolling');
        console.log('wait for 5 sec');
        await new Promise((resolve, reject) => setTimeout(resolve, 5000));
        currScroll = document.querySelector('div.cont-router-outlet').scrollTop;
        console.log('currScroll after:',currScroll);
        count = document.querySelectorAll('div.cont-card-ftd>div.card-ftd').length;
        console.log('count at end:',count);
        if (oldCount === count) {
          console.log('break');
          break;
        }
      }*/
    });
  };
  await applyScroll();

  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CO',
    store: 'farmatodo',
    transform,
    domain: 'farmatodo.com.co',
    zipcode: '',
  },
  implementation
};