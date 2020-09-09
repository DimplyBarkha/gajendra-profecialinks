const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'mercadolibre',
    transform,
    domain: 'mercadolibre.com.mx',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    // window.scrollTo(0,9999);
    try {
      await new Promise((resolve) => setTimeout(resolve, 6000));
    }catch(error){
      console.log(error)
    }
    async function infiniteScroll () {
      let prevScroll = document.documentElement.scrollTop;
      while (true) {
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
    }
    await infiniteScroll();

  try {
    await new Promise((resolve) => setTimeout(resolve, 6000));
  } catch (error) {
    console.log('error: ', error); 
  }
//-----------------------------------------------------------
  function addHiddenDiv (id, content, index) {
    const newDiv = document.createElement('div');
    newDiv.id = id;
    newDiv.textContent = content;
    newDiv.style.display = 'none';
    const originalDiv = document.querySelectorAll('ol li[class="ui-search-layout__item"] div[class="ui-search-result__wrapper"]')[index];
    originalDiv.parentNode.insertBefore(newDiv, originalDiv);
  }
    let ratingList = document.querySelectorAll('ol li[class="ui-search-layout__item"]');
      let itemArr = [];
      for (let index = 0; index < ratingList.length; index++) {
        let ratingParentDiv = ratingList[index].querySelector('span[class="ui-search-reviews__ratings"]');
        console.log('ratingParentDiv: ', ratingParentDiv);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        let starList = ratingParentDiv ? ratingParentDiv.querySelectorAll('svg') : [];
        let fullStarCount = 0;
        let halfStarCount = 0;
        starList.forEach(element => {
          let classList = element.classList;
          console.log('classList: ', classList);
          // @ts-ignore
          classList.forEach(element => { 
            if(element === "ui-search-icon--star-full"){
              fullStarCount = fullStarCount+1;
            }else if(element === "ui-search-icon--star-half"){
              halfStarCount = halfStarCount+0.5;
            }
          }); 
        });
        console.log("fullStarCount", fullStarCount);
        console.log("Halfstarcount", halfStarCount);
        console.log("RatingCount", (Number(fullStarCount)+Number(halfStarCount)))
        let aggregateRating = Number(fullStarCount)+Number(halfStarCount);
        let aggregateRating2 = aggregateRating;
        if(aggregateRating2 == 0){
          addHiddenDiv('mc_aggregateRating2', '', index);
        }else{
          addHiddenDiv('mc_aggregateRating2', aggregateRating2, index);
        }
        
      }
//---------------------------------------------------------------
  })

  return await context.extract(productDetails, { transform });
}
