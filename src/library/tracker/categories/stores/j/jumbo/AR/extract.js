async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  // prepare categories and subcategories structure
  const allCategories = await context.evaluate(() => {
    let structure = [];
    let topCategories = document.querySelectorAll('div[id="department-wrapper"]>div[data-submenu]');
    for (let i = 0; i < topCategories.length; i++) {
      structure.push({
        'name': topCategories[i].querySelector('a>span[class="text"]').innerText.trim(),
        'subcategories': []
      })
      let midCategories = document.querySelectorAll(`div[id="category-wrapper"]>div[id=${topCategories[i].getAttribute('data-submenu')}]>div>div[class="item-wrapper"]>div`);
      for (let j = 0; j < midCategories.length; j++) {
        structure[i].subcategories.push({
          'name': midCategories[j].querySelector('a>span').innerText.trim(),
          'subcategories': [],
          'url': midCategories[j].querySelector('a').getAttribute('href')
        })
        let lowCategories = midCategories[j].querySelectorAll('div[class="item-wrapper"]>div');
        for (let k = 0; k < lowCategories.length; k++) {
          structure[i].subcategories[j].subcategories.push({
            'name': lowCategories[k].querySelector('a>span').innerText.trim(),
            'url': lowCategories[k].querySelector('a').getAttribute('href')
          })
        }
      }
    }
    return structure;
  });
  // insert categories over subcategories
  let data = await context.extract(productMenu);
  for (let i = 0; i < allCategories.length; i++){
    for (let j = 0; j < allCategories[i].subcategories.length; j++){
      if (allCategories[i].subcategories[j].subcategories.length == 0) {
        for (let x = 0; x < data[0].group.length; x++) {
          if(data[0].group[x].categoryUrl[0].text == allCategories[i].subcategories[j].url) {
            data[0].group[x].category.unshift(
              {'text':allCategories[i].name,}
            )
            data[0].group[x].categoryUrl[0].text = 'https://www.jumbo.com.ar' + allCategories[i].subcategories[j].url;
          }
        }
      }
      else {
        for (let k = 0; k < allCategories[i].subcategories[j].subcategories.length; k++){
          for (let x = 0; x < data[0].group.length; x++) {
            if(data[0].group[x].categoryUrl[0].text == allCategories[i].subcategories[j].subcategories[k].url) {
              data[0].group[x].category.unshift(
                {'text':allCategories[i].name,},
                {'text': allCategories[i].subcategories[j].name}
              )
              data[0].group[x].categoryUrl[0].text = 'https://www.jumbo.com.ar' + allCategories[i].subcategories[j].subcategories[k].url;
            }
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
    country: 'AR',
    domain: 'jumbo.com.ar',
    store: 'jumbo',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};