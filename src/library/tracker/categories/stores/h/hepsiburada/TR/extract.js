async function implementation(inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  // prepare categories and subcategories structure
  const allCategories = await context.evaluate(() => {
    let structure = [];
    let topCategories = document.querySelectorAll('div.categories>div:not([class])');
    for (let i = 1; i < topCategories.length - 1; i++) {
      structure.push({
        'name': topCategories[i].querySelector('a').innerText,
        'subcategories': []
      })
      let midCategories = topCategories[i].querySelectorAll('div.group>div:nth-of-type(1)');
      for (let j = 0; j < midCategories.length; j++) {
        structure[i - 1].subcategories.push({
          'name': midCategories[j].querySelector('a').innerHTML,
          'subcategories': [],
          'url': midCategories[j].querySelector('a').getAttribute('href')
        })
        let lowCategories = midCategories[j].querySelectorAll('div.group>div~div:nth-of-type(n+1)');
        for (let k = 0; k < lowCategories.length; k++) {
          structure[i - 1].subcategories[j].subcategories.push({
            'name': lowCategories[k].querySelector('a').innerHTML,
            'url': lowCategories[k].querySelector('a').getAttribute('href')
          })
        }
      }
    }
    return structure;
  });

  let data = await context.extract(productMenu);
  // insert subcategories and categories
  for (let i = 0; i < allCategories.length; i++) {
    for (let j = 0; j < allCategories[i].subcategories.length; j++) {
      if (allCategories[i].subcategories[j].subcategories.length == 0) {
        data[0].group.push({
          'category': [
            {
              'text': allCategories[i].name
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
        for (let k = 0; k < allCategories[i].subcategories[j].subcategories.length; k++) {
          data[0].group.push({
            'category': [
              {
                'text': allCategories[i].name
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
    country: 'TR',
    domain: 'hepsiburada.com',
    store: 'hepsiburada',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
