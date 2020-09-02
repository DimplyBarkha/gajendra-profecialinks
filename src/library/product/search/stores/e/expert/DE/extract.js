const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'expert',
    transform,
    domain: 'expert.de',
    zipcode: '',
  },
};

// const { transform } = require('./transform');

// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { productDetails } = dependencies;
//   // await context.waitForSelector('.widget-Popup--container-outer---view-popup', { timeout: 20000 }); 
//   // await new Promise((resolve, reject) => setTimeout(resolve, 6000));
//   await context.evaluate(async function () {
//     if (document.querySelector('.widget-Popup--container-outer---view-popup')) {
//       document.querySelector('.widget-Popup--container-outer---view-popup').click();
//     }
//     if (document.querySelector('i.widget-Popup--close')) {
//       document.querySelector('i.widget-Popup--close').click();
//     }


//     // await context.evaluate(() => {
//     //   function addHiddenDiv (id, content, index) {
//     //     const newDiv = document.createElement('div');
//     //     newDiv.id = id;
//     //     newDiv.textContent = content;
//     //     newDiv.style.display = 'none';
//     //     const originalDiv = document.querySelectorAll('a.widget-Hyperlink--button > div.widget-Grid--subContent')[index];
//     //     originalDiv.parentNode.insertBefore(newDiv, originalDiv);
//     //   }
//     //   const product = document.querySelectorAll('a.widget-Hyperlink--button > div.widget-Grid--subContent');
//     //   let rank = ((window.location.href).indexOf('pageNumber=')) ? Number((window.location.href).replace(/.*pageNumber=(.*)/, '$1')) : 0;
//     //   if (!rank) {
//     //     rank = 1;
//     //   } else {
//     //     rank = (rank - 1) * 42 + 1;
//     //   }
//     //   for (let i = 0; i < product.length; i++) {
//     //     const productUrl = (product[i].querySelector("a[class*='productBlock_link_price']")) ? product[i].querySelector("a[class*='productBlock_link_price']").getAttribute('href') : '';
//     //     const id = (product[i].querySelector("div[data-component*='productBlock']")) ? product[i].querySelector("div[data-component*='productBlock']").getAttribute('rel') : '';
//     //     // @ts-ignore
//     //     const name = (product[i].querySelector('h3.productBlock_productName')) ? product[i].querySelector('h3.productBlock_productName').innerText : '';
//     //     if (productUrl) {
//     //       addHiddenDiv('ii_productUrl', 'https://www.lookfantastic.com' + productUrl, i);
//     //     }
//     //     if (id) {
//     //       addHiddenDiv('ii_id', id, i);
//     //     }
//     //     if (name) {
//     //       addHiddenDiv('ii_name', name, i);
//     //     }
//     //     addHiddenDiv('ii_rankOrganic', rank++, i);
//     //   }
//     // });

//     // function addElementToDocument (doc, key, value) {
//     //   const catElement = document.createElement('div');
//     //   catElement.id = key;
//     //   catElement.textContent = value;
//     //   catElement.style.display = 'none';
//     //   doc.appendChild(catElement);
//     // }
//     // const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
//     // const arr = document.querySelectorAll('div.category-products > ul > li:not([class="no-hover"])');
//     // for (let i = 0; i < arr.length; i++) {
//     //   addElementToDocument(arr[i], 'pd_rank', lastProductPosition + i);
//     // }
//     // localStorage.setItem('prodCount', `${lastProductPosition + arr.length}`);
//   });
//   // await context.waitForSelector('div.referenced.list div[class^="widget-ArticleList--article"] div[class~="widget-Container--subContent"] div.widget-Root--subContent');
//   return await context.extract(productDetails);
// }
// module.exports = {
//   implements: 'product/search/extract',
//   parameterValues: {
//     country: 'DE',
//     store: 'expert',
//     transform: transform,
//     domain: 'expert.de',
//     zipcode: '',
//   },
//   implementation,
// };
