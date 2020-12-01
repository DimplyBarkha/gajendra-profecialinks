const { transform } = require('../shared')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    transform,
    domain: 'pokupki.market.yandex.ru',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }  
      let btnClick = document.querySelector('div.b_8lynrUTtGG')
      if (btnClick) {
        btnClick.click();
      } 
      let bulletList = '';    
      let test =document.querySelectorAll('ul.b_1XvS5yuH7G li')
      test.forEach((element, index, array) => {
        if (index === (array.length -1)) {
          bulletList += element.innerText 
      } else {
        bulletList += element.innerText + '|'
      }
      });
      console.log(document.querySelectorAll('div.b_1xQdt6zCoE'));
      let desc = document.querySelectorAll('div.b_1xQdt6zCoE')
      desc.forEach(element => {
        bulletList += element.innerText
      });

      console.log(bulletList, 'bulletList');
      addHiddenDiv('bulletList', bulletList);

      let imgClick = document.querySelector('div.b_2ke8Y2fll7')
      if (imgClick) {
        imgClick.click();
      } 
      // let secondaryImagesList = [];    

      // console.log(document.querySelectorAll('div.b_Pqh2DLBHPJ ul.b_3TWMCC_HPk li'));
      // let secondaryImages = document.querySelectorAll('div.b_Pqh2DLBHPJ ul.b_3TWMCC_HPk li img')
      //     let text = '';
      //     secondaryImages.forEach(item => {
      //       text += item.src
      //     });
      //     secondaryImagesList = [
      //       {
      //         text: text,
      //       },
      //     ];
      // console.log(secondaryImagesList , 'secondaryImagesList');
      // addHiddenDiv('secondaryImagesList', secondaryImagesList);
     
      // setTimeout(
      //   function(){ 
      //     document.querySelector('span.b_1-owM5mIx6').click()
      //   }, 
      //   5000);
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
