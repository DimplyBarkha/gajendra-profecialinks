async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  // prepare categories and subcategories structure
  const allCategories = await context.evaluate(() => {
    let structure = [];
    let topCategories = document.querySelectorAll('ul[id="nav-mega-menu"]>li[class*="level0 nav-1 parent"]');
    for (let i = 1; i < topCategories.length-1; i++) {
      structure.push({
        'name': topCategories[i].querySelector('a>span').innerText,
        'subcategories': []
      })
      let midCategories = topCategories[i].querySelectorAll('li[class^="level3 nav-4"]');
      for (let j = 0; j < midCategories.length; j++) {
        structure[i-1].subcategories.push({
          'name': midCategories[j].querySelector('a>span').innerHTML,
          'subcategories': [],
          'url': midCategories[j].querySelector('a').getAttribute('href')
        })
        let lowCategories = midCategories[j].querySelectorAll('li[class*="level6 nav-7"]');
        for (let k = 0; k < lowCategories.length; k++) {
          structure[i-1].subcategories[j].subcategories.push({
            'name': lowCategories[k].querySelector('a>span').innerHTML,
            'url': lowCategories[k].querySelector('a').getAttribute('href')
          })
        }
      }
    }
    return structure;
  });
  // insert top category for brands
  let data = await context.extract(productMenu);
  for (let i = 0; i < data[0].group.length; i++) {
    data[0].group[i].category.unshift(
      {'text': 'ALLE MARKEN'}
    )
  }
  // insert non-brand subcategories and categories
  for (let i = 0; i < allCategories.length; i++){
    for (let j = 0; j < allCategories[i].subcategories.length; j++){
      if (allCategories[i].subcategories[j].subcategories.length == 0) {
        data[0].group.push({
          'category': [
            {
              'text':allCategories[i].name
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
                'text':allCategories[i].name
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
    domain: 'hagel-shop.de',
    store: 'hagel-shop',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};