/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  for (const { group } of data) {
    for (const row of group) {
      if (row.image) {
        const imageArr = row.image.map((item) => {
          return item.text.replace('fm-sm', 'fm-lg2').replace('fm-md', 'fm-lg2').replace(/\/fm-lg\//g, 'fm-lg2').replace('fm-xl', 'fm-lg2');
        });
        row.image = [{ text: imageArr.join(''), xpath: row.image[0].xpath }];
      }
      if (row.additionalDescBulletInfo && row.additionalDescBulletInfo[0] && row.additionalDescBulletInfo[0].text.length > 1) {
        // row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.startsWith(' || ') ? row.additionalDescBulletInfo[0].text : ' || ' + row.additionalDescBulletInfo[0].text;
        const additionalDescBulletInfoArr = row.additionalDescBulletInfo.map((item) => {
          return item.text;
        });
        const uniqueDesc = new Set(additionalDescBulletInfoArr);
        const descBulletsArray = [];
        uniqueDesc.forEach((item) => {
          descBulletsArray.push(item)
        })
        row.additionalDescBulletInfo = [{ text: '|| ' + descBulletsArray.join(' || '), xpath: row.additionalDescBulletInfo[0].xpath }];
        row.descriptionBullets = [{ text: descBulletsArray.length, xpath: row.additionalDescBulletInfo[0].xpath }];
      }
      if (row.alternateImages) {
        const alternateImagesArr = row.alternateImages.map((item) => {
          return item.text.replace('fm-thumbnail', 'fm-lg2');
        });
        row.alternateImages = [{ text: alternateImagesArr.join(' || '), xpath: row.alternateImages[0].xpath }];
      }
      if (row.description) {
        var text = '';
        row.description.map((item) => {
          text += item.text + ' ';
        });

        if (row.additionalDescBulletInfo) {
          row.additionalDescBulletInfo.map((item) => {
            text += typeof (item.text) === 'string' && item.text.trim() !== '' ? ' || ' + item.text : '';
          });
        }
        row.description = [{ text: text, xpath: row.description[0].xpath }];
      }
      if (row.specifications) {
        const specificationsArr = row.specifications.map((item) => {
          return item.text.replace(/\n+/, ' : ');
        });
        row.specifications = [{ text: specificationsArr.join(' | '), xpath: row.specifications[0].xpath }];
      }
      if (row.nameExtended) {
        var nameExtendedText = row.nameExtended[0].text.includes(row.brandText[0].text) ? row.nameExtended[0].text.replace(row.brandText[0].text, row.brandText[0].text + ' -') : row.brandText[0].text + ' - ' + row.nameExtended[0].text;
        row.nameExtended = [{ text: nameExtendedText, xpath: row.nameExtended[0].xpath }];
      }
      if (row.sku) {
        if (row.sku.length > 1) {
          row.sku.shift();
        }
      }
      if (row.category) {
        const categoryList = [];
        const categoryArray = row.category.map((item) => item.text)
        const uniqueCategoryList = new Set(categoryArray);
        uniqueCategoryList.forEach((item) => { categoryList.push({ text: item }) });
        console.log('listItems =>', categoryList);
        row.category = categoryList;
      }


      // if (row.price) {
      //   row.price.forEach(item => {
      //     item.text = item.text.replace(',', '');
      //   });
      // }
      // if (row.listPrice) {
      //   row.listPrice.forEach(item => {
      //     item.text = item.text.replace(',', '');
      //   });
      // }
      // if (row.variantCount) {
      //   row.variantCount = [{ text: row.variantCount.length }];
      // }
      // if (row.variants) {
      //   var scriptJSON = JSON.parse(row.variants[0].text);
      //   if (scriptJSON.productVariants) {
      //     var objectsInVariants = Object.keys(scriptJSON.productVariants).length;
      //     var varientIds = [];
      //     for (var i = 0; i < objectsInVariants; i++) {
      //       var keyName = Object.keys(scriptJSON.productVariants)[i];
      //       var variants = scriptJSON.productVariants[keyName].variants;
      //       variants.forEach(function (item, index) {
      //         varientIds.push(item.fupid);
      //       });
      //     }
      //   }
      //   row.variants = [{ text: varientIds.join(' | ') }];
      // }
      // if (row.aggregateRating) {
      //   row.aggregateRating.forEach(item => {
      //     item.text = (item.text * 5) / 10;
      //   });
      // }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
