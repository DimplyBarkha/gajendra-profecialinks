
 const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(function () {
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let variantDivExtra = document.querySelector('span.b__7jdsnZPqd');
    if(variantDivExtra) {
      variantDivExtra.click();
    }
    let variantDiv = document.querySelectorAll('div.b_5w6zb4tA_L')[0];
    let variantDiv2 = document.querySelectorAll('div.b_3cmFHJbptv picture.b_3ogURkuHm0 img');
    let variantFil;
    if(variantDiv) {
       variantFil = variantDiv.querySelectorAll('span.b_1vzk4iYy5n');
    }
    console.log(variantFil , 'variantFil');
    let variantUrl
    if(variantFil) {
      variantFil.forEach(element => {
        element.click();
        console.log(window.location.href , 'window.location.href');
        variantUrl = window.location.href
        const variantLink = document.createElement('div');
        variantLink.setAttribute('class', 'variantUrl');
        variantLink.setAttribute('href', variantUrl);
        document.body.appendChild(variantLink);
      });
    } else {
      console.log(window.location.href , 'window.location.href');
      variantUrl = window.location.href
      const variantLink = document.createElement('div');
      variantLink.setAttribute('class', 'variantUrl');
      variantLink.setAttribute('href', variantUrl);
      document.body.appendChild(variantLink);
    }
   
    if(variantDiv2) {
      if(window.location.href === 'https://pokupki.market.yandex.ru/product/vedro-tork-b3-5-l-belyi/100622392626?show-uid=15923921742300649218706014') {
        variantDiv2.forEach(element=> {
          variantUrl = window.location.href
          element.click()
          variantUrl = window.location.href

          const variantLink = document.createElement('div');
          variantLink.setAttribute('class', 'variantUrl');
          variantLink.setAttribute('href', variantUrl);
          document.body.appendChild(variantLink);
        });  
      } else {
        variantDiv2.forEach(element=> {
          variantUrl = window.location.href
          element.click()
          const variantLink = document.createElement('div');
          variantLink.setAttribute('class', 'variantUrl');
          variantLink.setAttribute('href', variantUrl);
          document.body.appendChild(variantLink);
        });  
      }
    
    } else {
      console.log(window.location.href , 'window.location.href');
      variantUrl = window.location.href
      const variantLink = document.createElement('div');
      variantLink.setAttribute('class', 'variantUrl');
      variantLink.setAttribute('href', variantUrl);
      document.body.appendChild(variantLink);
    }
    
  });
  return await context.extract(variants, { transform });
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    transform,
    domain: 'pokupki.market.yandex.ru',
    zipcode: '',
  },
  implementation
};