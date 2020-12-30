async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  // prepare categories and subcategories structure
  const allCategories = await context.evaluate(() => {
    const structure = [];
    const topCategories = document.querySelectorAll('li[aoly-child="sub-menu"] ul li.main-navigation__second-level-nav-item,ul.main-navigation__first-level-left li[data-hasdropdown="True"]');
    console.log('top Categories', topCategories);
    if (topCategories && topCategories.length > 0) {
      for (let i = 0; i < topCategories.length; i++) {
        structure.push({
        // @ts-ignore
          name1: topCategories[i].querySelector('a.main-navigation__second-level-nav-item-link') ? 'Appliances' : '',
          // @ts-ignore
          name: topCategories[i].querySelector('a.main-navigation__second-level-nav-item-link') ? topCategories[i].querySelector('a.main-navigation__second-level-nav-item-link').innerText.trim() : topCategories[i].querySelector('li[data-hasdropdown="True"] > a') && topCategories[i].querySelector('li[data-hasdropdown="True"] > a').innerText.trim(),
          subcategories: [],
        });
        const midCategories = topCategories[i].querySelectorAll('li[aoly-child="sub-menu"] ul li.main-navigation__third-level-nav-item,ul.main-navigation__first-level-left li[data-hasdropdown="True"] ul li.main-navigation__third-level-nav-item');
        console.log('mid categories', midCategories);
        if (midCategories && midCategories.length > 0) {
          for (let j = 0; j < midCategories.length; j++) {
            structure[i].subcategories.push({
              // @ts-ignore
              name: midCategories[j].querySelector('a.main-navigation__third-level-nav-item-link') && midCategories[j].querySelector('a.main-navigation__third-level-nav-item-link').innerText.trim(),
              subcategories: [],
              url: midCategories[j].querySelector('a.main-navigation__third-level-nav-item-link') && midCategories[j].querySelector('a.main-navigation__third-level-nav-item-link').getAttribute('href'),
            });
            const lowCategories = midCategories[j].querySelectorAll('li.main-navigation__fourth-level-nav-item');
            console.log('low categories', lowCategories);
            for (let k = 0; k < lowCategories.length; k++) {
              // @ts-ignore
              structure[i].subcategories[j].subcategories.push({
                // @ts-ignore
                name: lowCategories[k].querySelector('a').innerText.trim(),
                url: lowCategories[k].querySelector('a').getAttribute('href'),
              });
            }
          }
        }
      }
    }
    console.log('structure of data', structure);
    return structure;
  });
  console.log('structure of data', allCategories);
  // insert categories over subcategories
  const data = await context.extract(productMenu);
  if (data && data[0] && allCategories.length > 0) {
    for (let i = 0; i < allCategories.length; i++) {
      for (let j = 0; j < allCategories[i].subcategories.length; j++) {
        if (allCategories[i].subcategories[j].subcategories.length === 0) {
          for (let x = 0; x < data[0].group.length; x++) {
            if (data[0].group[x].categoryUrl[0].text === allCategories[i].subcategories[j].url) {
              data[0].group[x].category.unshift(
                { text: allCategories[i].name },
              );
              if (allCategories[i].name1 !== '') {
                data[0].group[x].category.unshift(
                  { text: allCategories[i].name1 },
                );
              }
              data[0].group[x].categoryUrl[0].text = allCategories[i].subcategories[j].url;
            }
          }
        } else {
          for (let k = 0; k < allCategories[i].subcategories[j].subcategories.length; k++) {
            for (let x = 0; x < data[0].group.length; x++) {
              if (data[0].group[x].categoryUrl[0].text === allCategories[i].subcategories[j].subcategories[k].url) {
                data[0].group[x].category.unshift(
                  { text: allCategories[i].name },
                  { text: allCategories[i].subcategories[j].name },
                );
                if (allCategories[i].name1 !== '') {
                  data[0].group[x].category.unshift(
                    { text: allCategories[i].name1 },
                  );
                }
                data[0].group[x].categoryUrl[0].text = allCategories[i].subcategories[j].subcategories[k].url;
              }
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
    country: 'UK',
    domain: 'ao.com',
    store: 'ao',
    zipcode: '',
  },
  implementation,
};
