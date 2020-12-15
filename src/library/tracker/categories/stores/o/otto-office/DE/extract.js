module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'DE',
    domain: 'otto-office.com',
    store: 'otto-office',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await context.evaluate(async () => {
      const frmtoken = document
        .querySelector('form#header-zur-kasse-form > input[name="frmtoken"]')
        .getAttribute('value');

      const fetchedCategoriesObj = await fetch('https://www.otto-office.com/de/app/navigation/navaz/getmainmenu', {
        headers: {
          accept: '*/*',
          'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
          'cache-control': 'no-cache',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          pragma: 'no-cache',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-requested-with': 'XMLHttpRequest',
        },
        referrer: 'https://www.otto-office.com/de/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `frmtoken=${frmtoken}`,
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
      })
        .then((resp) => resp.json())
        .then((resp) => resp.aNavigation)
        .catch((err) => {
          console.log(err);
          throw new Error('Failed to fetch the categories object.');
        });

      /**
       * A function taking a fetched categories object as an input and returning
       * an array of objects containing categories names and their URL's.
       * @param {Array} categoriesObj previously fetched categories object.
       */
      const getCategoriesArray = (categoriesObj) => {
        /**
         * A recursive function extracting categories names and their URL's and
         * pushing them as objects to the 'resultArr'.
         * @param {Object} node At first iteration this is our fetched 'categoriesObj'.
         * Then, at each recursive call it goes deeper and another child of the
         * provided 'node' is taken as the function input.
         * @param {Array} resultArr an empty array to store the function output
         */
        const getCategories = (node, resultArr) => {
          if (typeof node === 'object' && node !== null) {
            for (let i = 0; i < Object.keys(node).length; i++) {
              const obj = Object.values(node)[i];
              // Checking if the current 'obj' object has these keys present.
              // If so we create an object out of them and push them to the 'resultArr'.
              if (
                (Object.keys(obj).includes('sText') || Object.keys(obj).includes('sName')) &&
                Object.keys(obj).includes('sUrl')
              ) {
                resultArr.push({ name: obj.sText || obj.sName, url: obj.sUrl });
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

      const categoriesArr = getCategoriesArray(fetchedCategoriesObj);

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
    });

    await context.extract(productMenu);
  },
};
