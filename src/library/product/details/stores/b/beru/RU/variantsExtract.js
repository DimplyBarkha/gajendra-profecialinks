
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
    // let variantDiv2 = document.querySelectorAll('div.b_3cmFHJbptv picture.b_3ogURkuHm0 img');
    let variantFil;
    if(variantDiv) {
       variantFil = variantDiv.querySelectorAll('input.b_1GpZjoo2l5');
    }
    console.log(variantFil , 'variantFil');
    let variantUrl
    if(variantFil) {
      variantFil.forEach(element => {
        // element.click();
        // console.log(window.location.href , 'window.location.href');
        // variantUrl = window.location.href
        const variantLink = document.createElement('div');
        variantLink.setAttribute('class', 'variantUrl');
        variantLink.setAttribute('href', element.value);
        document.body.appendChild(variantLink);
      });
    } else {
      console.log(window.location.href , 'window.location.href');
      variantUrl = window.location.href
      console.log(variantUrl, 'variantUrl');
      let variantIDArray ;
      let variantIDArray2 ;
      let variantID ;
      variantIDArray = variantUrl.split('/');
      variantIDArray2 = variantIDArray[variantIDArray.length - 1]
      console.log(variantIDArray2.split('?'), 'variantID1');
      variantID = variantIDArray2.split('?')[0]
      const variantLink = document.createElement('div');
      variantLink.setAttribute('class', 'variantUrl');
      variantLink.setAttribute('href', variantID);
      document.body.appendChild(variantLink);
    }
   
    // if(variantDiv2) {
    //   if(window.location.href === 'https://pokupki.market.yandex.ru/product/vedro-tork-b3-5-l-belyi/100622392626?show-uid=15923921742300649218706014') {
    //     variantDiv2.forEach(element=> {
    //       variantUrl = window.location.href
    //       element.click()
    //       variantUrl = window.location.href

    //       const variantLink = document.createElement('div');
    //       variantLink.setAttribute('class', 'variantUrl');
    //       variantLink.setAttribute('href', variantUrl);
    //       document.body.appendChild(variantLink);
    //     });  
    //   } else {
    //     variantDiv2.forEach(element=> {
    //       variantUrl = window.location.href
    //       element.click()
    //       const variantLink = document.createElement('div');
    //       variantLink.setAttribute('class', 'variantUrl');
    //       variantLink.setAttribute('href', variantUrl);
    //       document.body.appendChild(variantLink);
    //     });  
    //   }
    
    // } else {
    //   console.log(window.location.href , 'window.location.href');
    //   variantUrl = document.querySelector('meta[property="og:url"]').content
    //   let variantID1 ;
    //   let variantID = ''
    //   variantID1 = variantUrl.split('/');
    //   variantID = variantID1[variantID1.length - 1]
    //   console.log(variantID , 'ss');
    //   const variantLink = document.createElement('div');
    //   variantLink.setAttribute('class', 'variantUrl');
    //   variantLink.setAttribute('href', variantID);
    //   document.body.appendChild(variantLink);
    // }
    
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