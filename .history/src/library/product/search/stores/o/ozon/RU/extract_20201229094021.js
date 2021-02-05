const { transform } = require('./shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'ozon',
    transform,
    domain: 'ozon.ru',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.setJavaScriptEnabled(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.evaluate(async() => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      // Thumbnails from JSON
      // Get data from JSON
      const dataStateDivs =  document.querySelectorAll('div[data-state]');
      let thumbObj = {};
      dataStateDivs.forEach(dataStateDiv => {
        if(dataStateDiv.id.includes('tate-searchResultsV2')){
          thumbObj = JSON.parse(dataStateDiv.getAttribute('data-state'));
        }
      });
      // Add urls from obj to array
      let thumbsArr = [];
      let brandsArr = [];
      if(thumbObj.items) {
        // Loop for each elem
        thumbObj.items.forEach((elem, i)=> {
              // Take thumb url
              const thumbUrl = elem.images[0];
              const brand = elem.cellTrackingInfo.brand ? elem.cellTrackingInfo.brand : '';
              brandsArr.push(brand);
              thumbsArr.push(thumbUrl);
          });
      };
      console.log(brandsArr);
      // Add fror each element arrtibute with url
      const cardsItems = document.querySelectorAll('.ao4>div, .b6o3>div');
      if(cardsItems){
        cardsItems.forEach((item, index) => {
          const itemImg = item.querySelector('img');
          let itemImgSrcAttr;
          if(itemImg) {
            itemImgSrcAttr =  itemImg.getAttribute('src');
          }
          const itemImgSrc = thumbsArr[index] || itemImgSrcAttr; 
          item.setAttribute('oz-thumbnail', itemImgSrc);
          const brandName = brandsArr[index] || '';
          item.setAttribute('oz-brand', brandName);
        });
      }

      // _url + _input
      const pageUrl = window.location.href;
      const pageInput = document.querySelector('.b6r6.b5y1 strong').textContent;
      if(cardsItems){
        cardsItems.forEach(item => {
          item.setAttribute('oz-input', pageInput);
          item.setAttribute('oz-url', pageUrl);
        });
      }
      addElementToDocument('pageUrl', pageUrl);
    })
    await context.waitForXPath('//div[contains(@id, "state-searchResults")]');
    await new Promise((resolve, reject) => setTimeout(resolve, 50000));
    return await context.extract(productDetails, {transform});
  },
};


