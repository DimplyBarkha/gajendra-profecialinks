async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;

  await context.evaluate(function () {

    function getVariants () {
      const variantList = [];
      const variantCards = document.querySelectorAll('li[data-defaultasin]');
      const variantDropdown = document.querySelectorAll('[id*="variation"] option');
      const variantBooks = document.querySelectorAll('[id*="Swatches"]>ul>li a[id][href*="dp"]');

      if (variantBooks) {
        for (let i = 0; i < variantBooks.length; i++) {
          const element = variantBooks[i];
          if (element == null) {
            continue;
          }
          const vasinRaw = element.getAttribute('href');
          if (vasinRaw !== '') {
            const regex = /\/dp\/([A-Za-z0-9]{10,})/s;
            const vasin = vasinRaw.match(regex) ? vasinRaw.match(regex)[1] : '';
            if (vasin !== '') {
              variantList.push(vasin);
            }
          }
        }
      }
      if (variantDropdown) {
        for (let i = 0; i < variantDropdown.length; i++) {
          const element = variantDropdown[i];
          if (element == null) {
            continue;
          }
          const vasinRaw = element.getAttribute('value');
          if (vasinRaw !== '') {
            const regex = /[0-9]{1,},([0-9a-zA-Z]{10,})/s;
            const vasin = vasinRaw.match(regex) ? vasinRaw.match(regex)[1] : '';
            if (vasin !== '') {
              variantList.push(vasin);
            }
          }
        }
      }
      if (variantCards) {
        for (let i = 0; i < variantCards.length; i++) {
          const element = variantCards[i];
          if (element == null) {
            continue;
          }
          const vasin = element.getAttribute('data-defaultasin');
          if (vasin !== '') {
            variantList.push(vasin);
          }
        }
      }
      return variantList;
    }

    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }
    const url = window.location.href;
    console.log('URL1233')
    console.log(window.location.href)
    const splits = url ? url.split('dp/product/')[1].split('/?') : [];
    const mainId = (splits.length > 1) ? splits[splits.length - 2] : '';
    addHiddenDiv('ii_variant', mainId);

    const allVariants = [...new Set(getVariants())];
    for (let i = 0; i < allVariants.length; i++) {
      const id = allVariants[i];
      addHiddenDiv('ii_variant', id);
    }
 
    // const node = document.querySelector("script[id='item']");
    // if (node && node.textContent) {
    //   const jsonObj = node.textContent.startsWith('{"item":') ? JSON.parse(node.textContent) : null;
    //   if (jsonObj && jsonObj.item && jsonObj.item.product && jsonObj.item.product.buyBox) {
    //     const elements = jsonObj.item.product.buyBox.products;
    //     if (elements && elements.length > 0) {
    //       console.log(elements.length);
    //       for (let i = 0; i < elements.length; i++) {
    //         const id = elements[i].usItemId;
    //         if (id) {
    //           addHiddenDiv('ii_variant', id);
    //         }
    //       }
    //     }
    //   }
    // }
  }, createUrl);
  return await context.extract(variants);
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh',
    transform: null,
    domain: 'amazon.com',
    zipcode: '90210',
  },
  implementation,
};

/*
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }
    let url = window.location.href;
    const splits = url ? url.split('?')[0].split('/') : [];
    url = (splits.length > 1) ? splits[splits.length - 2] : '';
    addHiddenDiv('ii_variant', url);
    const node = document.querySelector("script[id='item']");
    if (node && node.textContent) {
      const jsonObj = node.textContent.startsWith('{"item":') ? JSON.parse(node.textContent) : null;
      if (jsonObj && jsonObj.item && jsonObj.item.product && jsonObj.item.product.buyBox) {
        const elements = jsonObj.item.product.buyBox.products;
        if (elements && elements.length > 0) {
          console.log(elements.length);
          for (let i = 0; i < elements.length; i++) {
            const id = elements[i].usItemId;
            if (id) {
              addHiddenDiv('ii_variant', id);
            }
          }
        }
      }
    }
  }, createUrl);
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    transform: null,
    domain: 'walmart.com',
    zipcode: '',
  },
  implementation,
};


*/