module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'SE',
    domain: 'ica.se',
    store: 'ica',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    const jsonText = await context.evaluate(() => {
      return document.body.innerText;
    });
    const json = JSON.parse(jsonText);

    await context.evaluate(async (json) => {
      const getCategoriesArray = (categoriesObj) => {
        const getCategories = (node, resultArr) => {
          if (typeof node === 'object' && node !== null) {
            for (let i = 0; i < Object.keys(node).length; i++) {
              const obj = Object.values(node)[i];
              console.log(obj);
              // Checking if the current 'obj' object has these keys present.
              // If so we create an object out of them and push them to the 'resultArr'.
              if (
                (Object.keys(obj).includes('name')) &&
                Object.keys(obj).includes('seoUrl')
              ) {
                resultArr.push({ name: obj.name, url: `https://handla.ica.se/handla/kategori/${obj.seoUrl}` });
              }
              // We call the function again passing the current 'obj' object to go 'deeper'.
              getCategories(obj, resultArr);
            }
          }
        };
        const resultArr = [];
        getCategories(categoriesObj, resultArr);
        return resultArr;
      };

      const categoriesArr = getCategoriesArray(json);

      const addedCatList = document.createElement('ul');
      addedCatList.id = 'added_categories_list';
      addedCatList.style.display = 'none';
      document.body.appendChild(addedCatList);

      categoriesArr.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('category', item.name);
        listItem.setAttribute('categoryUrl', item.url);
        addedCatList.appendChild(listItem);
      });
    }, json);

    await context.extract(productMenu);
  },
};
