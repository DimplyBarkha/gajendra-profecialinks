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
    // console.log('ratingList: ', ratingList);
      let itemArr = [];
      for (let index = 0; index < ratingList.length; index++) {
        let fullStarCount = 0;
        let halfStarCount = 0;
        // let ratingParentDiv = ratingList[index];
        // console.log('ratingParentDiv: ', ratingParentDiv);
        let ratingParentDiv = ratingList[index].querySelector('span[class="ui-search-reviews__ratings"]');
        console.log('ratingParentDiv: ', ratingParentDiv);
        // let starList = ratingParentDiv.querySelectorAll('svg');
        // starList.forEach(element => {
        //   let classList = element.classList;
        //   console.log('classList: ', classList);

        // });
      }
//---------------------------------------------------------------
  })

  return await context.extract(productDetails, { transform });
}
