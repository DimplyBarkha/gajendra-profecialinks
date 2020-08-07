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
    };

    const pageVariants = getVariants();
    let url = window.location.href;
    const splits = url ? url.split('?')[0].split('/') : [];
    url = (splits.length > 1) ? splits[splits.length - 1] : '';
    console.log('sadasd', url);
    // addHiddenDiv('ii_variant', url);
    console.log('dsadsa----->', pageVariants);
    pageVariants && pageVariants.length && pageVariants.forEach(item => {
      addHiddenDiv('ii_variant', item);
    });
  }, createUrl);
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimePantry',
    transform: null,
    domain: 'amazon.com',
    zipcode: '10001',
  },
  implementation,
};
