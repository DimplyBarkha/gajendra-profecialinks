async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  // prepare categories and subcategories structure
  const allCategories = await context.evaluate(() => {
    let structure = [];
    let topCategories = document.querySelectorAll('ul[class^="g-navigation__menu"]>li[class^="g-navigation__item"]');
    for (let i = 0; i < topCategories.length; i++) {
      structure.push({
        'name': topCategories[i].querySelector('a>span').innerText.trim(),
        'subcategories': []
      })
      let midCategories = topCategories[i].querySelectorAll('li[data-sub^="sub-category"]');
      for (let j = 0; j < midCategories.length; j++) {
        structure[i].subcategories.push({
          'name': midCategories[j].querySelector('a').innerText.trim(),
          'subcategories': [],
          'url': midCategories[j].querySelector('a').getAttribute('href')
        })
        let lowCategories = document.querySelectorAll(`ul[id=${midCategories[j].getAttribute('data-sub')}]>li`);
        for (let k = 0; k < lowCategories.length; k++) {
          structure[i].subcategories[j].subcategories.push({
            'name': lowCategories[k].querySelector('a').innerText.trim(),
            'url': lowCategories[k].querySelector('a').getAttribute('href')
          })
        }
      }
    }
    return structure;
  });
  // insert non-brand subcategories and categories
  let data = await context.extract(productMenu);
  for (let i = 0; i < allCategories.length; i++){
    for (let x = 0; x < data[0].group.length; x++){
      if(data[0].group[x].category[0].text == allCategories[i].name){
        allCategories[i].xpath = data[0].group[x].category[0].xpath;
        data[0].group.splice(x, 1);
        break;
      }
    }
    for (let j = 0; j < allCategories[i].subcategories.length; j++){
      if (allCategories[i].subcategories[j].subcategories.length == 0) {
        data[0].group.push({
          'category': [
            {
              'text':allCategories[i].name,
              'xpath':allCategories[i].xpath
            },
            {
              'text': allCategories[i].subcategories[j].name
            }
          ],
          'categoryUrl': [
            {
              'text': allCategories[i].subcategories[j].url
            }
          ]
        })
      }
      else {
        for (let k = 0; k < allCategories[i].subcategories[j].subcategories.length; k++){
          data[0].group.push({
            'category': [
              {
                'text':allCategories[i].name,
                'xpath':allCategories[i].xpath
              },
              {
                'text': allCategories[i].subcategories[j].name
              },
              {
                'text': allCategories[i].subcategories[j].subcategories[k].name
              }
            ],
            'categoryUrl': [
              {
                'text': allCategories[i].subcategories[j].subcategories[k].url
              }
            ]
          })
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
    domain: 'galeria.de',
    store: 'galeriakaufhof',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
