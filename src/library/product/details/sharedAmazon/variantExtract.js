module.exports.implementation = async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { variants } = dependencies;
  // const { variants, Helpers: { Helpers }, AmazonHelp: { AmazonHelp } } = dependencies;

  // const helpers = new Helpers(context);
  // const amazonHelp = new AmazonHelp(context, helpers);

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
          let vasin = element.getAttribute('data-dp-url');
          if (vasin && vasin.includes('/dp/') && vasin.includes('/ref=')) {
            const vasinArr = vasin.split('/dp/');
            vasin = vasinArr.length === 2 ? vasinArr[1].split('/ref=')[0] : '';
            if (vasin !== '') {
              variantList.push(vasin);
            }
          } else {
            vasin = element.getAttribute('data-defaultasin');
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
    let splits = url && url.split('dp/product/')[1] ? url.split('dp/product/')[1].split('/?') : [];
    if (splits.length < 1) {
      splits = url && url.split('dp/')[1] ? url.split('dp/')[1].split('/') : [];
    }
    // if (splits[0]){
    //   addHiddenDiv('ii_variant', splits[0]);
    // }

    const allVariants = [...new Set(getVariants())];
    if (splits[0] && !allVariants.includes(splits[0].slice(0, 10))) {
      allVariants.push(splits[0].slice(0, 10));
    }

    allVariants.forEach(variant => {
      addHiddenDiv('ii_variant', variant);
    });
  });
  return await context.extract(variants);
};
