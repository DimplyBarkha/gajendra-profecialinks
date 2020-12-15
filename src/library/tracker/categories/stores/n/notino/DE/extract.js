async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  // create output data reference
  var data = await context.extract(productMenu);
  // create categories and subcategories structures
  const allCategories = await context.evaluate(() => {
    let structure = [];
    let topCategories = document.querySelectorAll('ul[class*="menu-level-1"]>li[class*="hasSub active"]');
    for (let i = 0; i < topCategories.length; i++){ 
      structure.push({
        'name': topCategories[i].innerText,
        'subcategories': []
      });
      let middleCategories = topCategories[i].querySelectorAll('div[class*="mobile-menu-block"]')
      let middleCategoriesNames = topCategories[i].querySelectorAll('div[class*="mobile-menu-block"]>a')
      for (let j = 0; j < middleCategories.length; j++) {
        structure[i].subcategories.push({
          'name': middleCategoriesNames[j].innerHTML,
          'url': middleCategoriesNames[j].getAttribute('href'),
          'subcategories': []
        })
        let lowCategories = middleCategories[j].querySelectorAll('ul[class="menu-level-3 reset"]>li>a')
        for (let k = 0; k < lowCategories.length; k++) {
          structure[i].subcategories[j].subcategories.push({
            'name': lowCategories[k].innerHTML,
            'url': lowCategories[k].getAttribute('href')
          })
        }
      }
    }
    return structure;
  });
  // match categories and subcategories to urls
  for (let a = 0; a < data[0].group.length; a++){
    let categoryUrl = data[0].group[a].categoryUrl[0].text;
    console.log('22222222', categoryUrl)
    for (let i = 0; i < allCategories.length; i++){
      for (let j = 0; j < allCategories[i].subcategories.length; j++){
        if (allCategories[i].subcategories[j].url == categoryUrl){
          data[0].group[a].category = [
            {'text': allCategories[i].name},
            {'text': allCategories[i].subcategories[j].name}
          ]
        }
        for (let k = 0; k < allCategories[i].subcategories[j].subcategories.length; k++){
          if (allCategories[i].subcategories[j].subcategories[k].url == categoryUrl){
            data[0].group[a].category = [
              {'text': allCategories[i].name},
              {'text': allCategories[i].subcategories[j].name},
              {'text': allCategories[i].subcategories[j].subcategories[k].name}
            ]
          }
        }
      }
    }
  }
  return data;
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'DE',
    domain: 'notino.de',
    store: 'notino',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
