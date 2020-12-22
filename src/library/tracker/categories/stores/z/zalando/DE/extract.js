
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'DE',
    domain: 'zalando.de',
    store: 'zalando',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await context.evaluate(async () => {
      const mainFetch = await fetch('https://en.zalando.de/api/navigation').then((resp) => resp.json())
        .then((resp) => resp.topnavi.navigation_node.children)
        .catch((err) => {
          console.log(err);
          throw new Error('Failed to fetch the categories');
        });
      const getAllCategories = (categoryObj) => {
        const getCategories = (node, allArr) => {
          if (typeof node === 'object' && node !== null) {
            for (let x = 0; x < Object.keys(node).length; x++) {
              const obj = Object.values(node)[x];
              if (
                (Object.keys(obj).includes('name')) && Object.keys(obj).includes('url_key')
              ) {
                allArr.push({ name: obj.name, url: obj.url_key });
              }
              // go deeper into array
              getCategories(obj, allArr);
            }
          }
        };
        const allArr = [];
        getCategories(categoryObj, allArr);
        return allArr;
      };
      const categoriesArr = getAllCategories(mainFetch);
      const filteredArr = categoriesArr.filter(item => item.name !== '');
      const filteredArr2 = filteredArr.filter(item => item.name !== '--');
      const filteredArr3 = filteredArr2.filter(item => item.url !== '');

      const regex = /^\//;
      filteredArr3.forEach(element => {
        if (element.url.match(regex)) {
          element.url = `https://en.zalando.de${element.url}`;
        }
      });

      const addedCatList = document.createElement('ul');
      addedCatList.id = 'added_categories_list';
      addedCatList.style.display = 'none';
      document.body.appendChild(addedCatList);

      filteredArr3.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('category', item.name);
        listItem.setAttribute('categoryUrl', item.url);
        addedCatList.appendChild(listItem);
      });
    });
    await context.extract(productMenu);
  },
};
