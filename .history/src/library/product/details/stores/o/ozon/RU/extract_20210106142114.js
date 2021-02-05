const { transform } = require('./shared');


module.exports = {
  implements: 'product/details/extract',
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
    await new Promise((resolve, reject) => setTimeout(resolve, 7000));
    await context.waitForXPath('//script[@type="application/ld+json"]');
    await context.evaluate(async () => {
      let scrollTop = 0;
      while (scrollTop <= 20000) {
        await stall(100);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(1000);
          break;
        }
      }
      function stall (ms) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      function addElementToDocument (key, value) {
        const createdElem =  document.querySelector(`#${key}`);
        if(!createdElem) {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          catElement.style.display = 'none';
          document.body.appendChild(catElement);
        }
      }

      // image
      const imageUrl = document.querySelector('.ao5.o7');
      addElementToDocument('oz-image', imageUrl.getAttribute('src'));

      // _url
      const pageUrl = window.location.href;
      addElementToDocument('pageUrl', pageUrl);

      // availabilityText
      const noAvaiabilityDiv = document.querySelector('.b1e8');
      if(noAvaiabilityDiv) {
        addElementToDocument('availabilityText', 'Out of stock');
        // if we product out of stock change price for requre xpath
        const outPriceElem = document.querySelector('.c8q7.c8q9');  
        outPriceElem.className = 'c8r';
      } else {
        addElementToDocument('availabilityText', 'In stock');
      }

      
      const ingridientsElem = document.querySelectorAll('.b5j4, .db4');
      ingridientsElem.forEach(item => {
        const itemContent = item.textContent;

        // ingredientsList
        if(itemContent.includes('Состав') || itemContent.includes('Ингредиенты')){
          const itemValue = item.nextElementSibling.textContent;
          addElementToDocument('ingredientsList', itemValue);
        }
        // quantity
        if(itemContent.includes('Единиц в одном товаре') || itemContent.includes('Количество в упаковке')){
          const itemValue = item.nextElementSibling.textContent;
          addElementToDocument('quantity', itemValue);
        } 
        // size
        if(itemContent.includes('Объем') || itemContent.includes('Количество в упаковке')){
          const itemValue = item.nextElementSibling.textContent;
          addElementToDocument('quantity-size', itemValue);
        } 
        // weightNet
        if(itemContent.includes('Вес товара')){
          const itemValue = item.nextElementSibling.textContent;
          addElementToDocument('weightNet', itemValue);
        }
        // weightGross
        if(itemContent.includes('Вес в упаковке') ){
          const itemValue = item.nextElementSibling.textContent;
          addElementToDocument('weightGross', itemValue);
        }
        //directions
        if(itemContent.includes('Предназначено для') || itemContent.includes('Назначение')){
          const itemValue = item.nextElementSibling.textContent;
          addElementToDocument('directions', itemValue);
        }
        // caloriesPerServing
        if(itemContent.includes('Энергетическая ценность')){
          const itemValue = item.nextElementSibling.textContent;
          addElementToDocument('caloriesPerServing', itemValue);
        }


        function findNutrition(itemNode, name, elemValId, elemTextId){
        const itemTitle = itemNode.textContent;
          if(itemTitle.includes(name)){
            const itemValue = itemNode.nextElementSibling.textContent;
            addElementToDocument(elemValId, itemValue);
  
            const itemText = itemNode.textContent.match(/ .\//);
            if(itemText && itemText[0]){
              let itemTextValue = itemText[0];
              itemTextValue = itemTextValue.replace(/\//, '');
              addElementToDocument(elemTextId, itemTextValue);
            }
          }
        };

        // totalFatPerServing
        findNutrition(item, 'Жиры', 'totalFatPerServing', 'totalFatPerServingUom');
        // totalCarbPerServing
        findNutrition(item, 'Углеводы', 'totalCarbPerServing', 'totalCarbPerServingUom');
        // proteinPerServing
        findNutrition(item, 'Белки', 'proteinPerServing', 'proteinPerServingUom');
        // proteinPerServing
        findNutrition(item, 'Белок', 'proteinPerServing', 'proteinPerServingUom');
        
        //calciumPerServing
        if(itemContent.includes('Состав:')){
          let itemValue = item.nextElementSibling.textContent;
          if(itemValue.match(/Ca2\+ - \S{0,};/)){
            itemValue = itemValue.match(/Ca2\+ - \S{0,};/)[0];
            itemValue = itemValue.match(/\d{0,},\d{0,1}/)[0];
            addElementToDocument('calciumPerServing', itemValue);
          }
        }

        // shippingDimensions
        if(itemContent.includes('Размер упаковки') ){
          const itemValue = item.nextElementSibling.textContent;
          addElementToDocument('shippingDimensions', itemValue);
        }

        // warranty
        if(itemContent.includes('Гарантия') ){
          const itemValue = item.nextElementSibling.textContent;
          addElementToDocument('warranty', itemValue);
        }

        // countryOfOrigin
        if(itemContent.includes('Страна-изготовитель') ){
          const itemValue = item.nextElementSibling.textContent;
          addElementToDocument('countryOfOrigin', itemValue);
        } else {
          addElementToDocument('countryOfOrigin', 'Россия');
        }

        // storage
        if(itemContent.includes('Условия хранения') ){
          const itemValue = item.nextElementSibling.textContent;
          addElementToDocument('storage', itemValue);
        }

        // brandText
        if(itemContent.includes('Бренд') ){
          const itemValue = item.nextElementSibling.textContent;
          addElementToDocument('brandText', itemValue);
        }

        // sku
        if(itemContent.includes('Артикул') ){
          const itemValue = item.nextElementSibling.textContent;
          addElementToDocument('skuId', itemValue);
        }
      });

      const textWarnItems = document.querySelectorAll('.b0v2 h3');
      textWarnItems.forEach(item => {
        const itemContent = item.textContent;
        // warnings
        if(itemContent.includes('Предупреждение')){
          const itemValue = item.nextElementSibling.textContent;
          addElementToDocument('warnings', itemValue);
        }
        // storage
        if(itemContent.includes('Условия хранения')){
          const itemValue = item.nextElementSibling.textContent;
          addElementToDocument('storage', itemValue);
        }

        // ingredientsList
        if(itemContent.includes('Состав')){
          const itemValue = item.nextElementSibling.textContent;
          addElementToDocument('ingredientsList', itemValue);
        }
      })

      const dataStateDivs = document.querySelectorAll('div[data-state]');
      dataStateDivs.forEach(dataStateDiv => {
        //videos
        if(dataStateDiv.id.includes('state-webGallery')){
          const dataMediaObj = JSON.parse(dataStateDiv.getAttribute('data-state'));
          if(dataMediaObj.videos){
            const dataVideoID = dataMediaObj.videos[0].youtubeId;
            addElementToDocument('videos', `https://www.youtube.com/embed/${dataVideoID}`);
          }
          dataMediaObj.images.forEach((addImg, i) => {
            if (i !== 0){
              addElementToDocument(`oz-add-img-${i}`, addImg.src);
            } 
          });
        }
      });

      const jsonDiv = document.querySelector('[type="application/ld+json"]');
      if(jsonDiv){
        const jsonData = JSON.parse(jsonDiv.textContent);
        addElementToDocument('skuId', jsonData.sku);
        addElementToDocument('brandText', jsonData.brand);
        console.log(jsonData);
        if(jsonData.image){
            addElementToDocument('oz-image-json', jsonData.image);
        }
      }
    })
    return await context.extract(productDetails, {transform});
  },
};


