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
      // Add fror each element arrtibute with url
      const mainUrl = window.location.href;
      const searchInput = document.querySelector('.b7i5').getAttribute('value');
      const cardsItems = document.querySelectorAll('.ao4>div, .b6o3>div');
      if(cardsItems){
        cardsItems.forEach((item, index) => {
          const itemImg = item.querySelector('img');
          const itemDescr = item.querySelector('.a2g0');
          let itemImgSrcAttr;
          if(itemImg) {
            itemImgSrcAttr =  itemImg.getAttribute('src');
          }
          const itemImgSrc = thumbsArr[index] || itemImgSrcAttr; 
          const brandName = brandsArr[index] || '';
          if(itemDescr && item.className) {
            itemDescr.setAttribute('oz-brand', brandName);
            itemDescr.setAttribute('oz-thumbnail', itemImgSrc);
            itemDescr.setAttribute('oz-url', mainUrl);
            itemDescr.setAttribute('oz-input', searchInput);
          }
        });
      }

      // Add cusom next link
      const pagination = document.querySelector('.b7t2 div');
      const basicNextBtn = document.querySelector('.b6k6 a.ui-k6');
      try{
        if(pagination.hasChildNodes() && !basicNextBtn){
          const currPage = document.querySelector('.b9g0.b9g2');
          const nextPageHref = currPage.nextElementSibling.getAttribute('href')
          const nextLink = document.createElement('a');
          nextLink.className = 'ui-k6 custom nav';
          nextLink.setAttribute('href', nextPageHref);
          nextLink.textContent = 'Дальше'
          pagination.append(nextLink);
        }
      }catch(e){
        console.log('Error with custom navigation', e);
      }
    });
    // await new Promise((resolve, reject) => setTimeout(resolve, 20000));
    await context.waitForXPath('//div[contains(@id, "state-searchResults")]');
    return await context.extract(productDetails, {transform});
  },
};


