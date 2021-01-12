const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'citilink',
    transform,
    domain: 'citilink.ru',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails: data }) => {

    const url = await context.evaluate(async function () {
      return window.location.href;
    });
    await context.goto(url + '/properties', { waitUntil: 'networkidle0' });
    await context.waitForNavigation();
    await context.evaluate(async function () {
      const specs = document.evaluate("//div[@class = 'Specifications__row']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      let specifications = '';
      for (let i = 0; i < specs.snapshotLength; i++) {
        specifications += specs.snapshotItem(i).children[0].innerText + ' : ' + specs.snapshotItem(i).children[1].innerText + ' | ';
      }
      sessionStorage.setItem('Specifications', specifications.replace('\"' , '').slice(0 , -2));
    });
    await context.goto(url, { waitUntil: 'networkidle0' });
    await context.waitForNavigation();
    await context.evaluate(async function () {
      const addHiddenDiv = (id, content) => {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      };
      addHiddenDiv('import_availability_text', window.dataLayer[0].productAvailability);
      addHiddenDiv('import_product_weight', window.dataLayer[0].additions.properties.Вес);
      addHiddenDiv('import_product_warranty', window.dataLayer[0].additions.properties.Гарантия);
      addHiddenDiv('import_product_specs', window.sessionStorage.Specifications);
      addHiddenDiv('import_list_price', parseInt(window.dataLayer[0].productClubPrice));
    });
    await context.evaluate(async () => {

    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    let desList;
    let desc = document.querySelectorAll('div.AboutTab__description-text');
    let des1 = document.querySelectorAll('div.specification_view.product_view h2')
    if(desc) {
      desc.forEach((element) => {
        element.childNodes.forEach((ele) => {
          desList+=ele.textContent
        });

      });
      addHiddenDiv('desList', desList);

    } else 
    {
      let desList2;

      if(des1) {
        des1.forEach((element) => {
          console.log(element.innerText , 'd');
          if(element.innerText.includes('Описание')) {
            desList2 = element.nextSibling.textContent
          }
        });
        let add_ext = document.querySelector('span.pseudo.expandable_control.for_product-card-info-error__container')
        if(add_ext) {
          desList2 = add_ext.textContent
  
        }
        addHiddenDiv('desList2', desList2);
  
      } 
    }
    
    // let categoryList = [];
    // let cate = document.querySelectorAll('div.Breadcrumbs')
    // if(cate) {
    //   cate.forEach((element) => {
    //     categoryList.push(element.innerText);

    //   });
    //   console.log(categoryList , 'categoryList');
    //   addHiddenDiv('categoryList', categoryList);

    // } 
    let specificationList;
    let specList= document.querySelectorAll('table.product_features tr:not(.header_row)')
    if(specList) {
      specList.forEach(element => {
        element.childNodes.forEach(element => {
          specificationList += element.childNodes[0].childNodes[0].innerText + ' : ' + element.childNodes[1].innerText.replace('"','') + ' | '
        });
      });
    }
    addHiddenDiv('specificationList_alt', specificationList);

    let name = document.querySelector('h1.Heading.Heading_level_1.ProductHeader__title')
    let proName;
    if(name) {
      proName= name.innerText
      console.log(proName , 'ssss');
    } 
    addHiddenDiv('name', proName);
    
  });
  await context.evaluate(async function (context) {
    const seeAllSelector = document.querySelector('li[data-tabname="accessories"] > a');
    if (seeAllSelector) {
    seeAllSelector.click();
    }
    });
    await context.waitForSelector('section[class="GroupGrid js--GroupGrid GroupGrid_has-column-gap GroupGrid_has-row-gap"]',{timeout:6000});
    return await context.extract(data, { transform });
  },
  
};
