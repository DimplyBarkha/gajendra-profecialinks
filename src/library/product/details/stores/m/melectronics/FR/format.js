/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
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
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };
  for (const { group } of data) {
    for (const row of group) {
      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.replace('fm-sm', 'fm-lg2').replace('fm-md', 'fm-lg2').replace(/\/fm-lg\//g, 'fm-lg2').replace('fm-xl', 'fm-lg2');
        });
      }
      if (row.additionalDescBulletInfo && row.additionalDescBulletInfo[0] && row.additionalDescBulletInfo[0].text.length > 1) {
        row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.startsWith(' || ') ? row.additionalDescBulletInfo[0].text : ' || ' + row.additionalDescBulletInfo[0].text;
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace('fm-thumbnail', 'fm-lg2');
        });
      }
      if (row.description) {
        var arrDesc = [];
        row.description.forEach(item => {
          arrDesc.push(item.text);
        });
        row.description = [{ text: arrDesc.join(' ') }];
      }
      if (row.specifications) {
        var arrSpecs = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n+/, ' : ');
          arrSpecs.push(item.text);
        });
        row.specifications = [{ text: arrSpecs.join(' || ') }];
      }
      if (row.nameExtended) {
        if (row.brandText) {
          var nameExtendedText = row.nameExtended[0].text.includes(row.brandText[0].text) ? row.nameExtended[0].text.replace(row.brandText[0].text, row.brandText[0].text + ' -') : row.brandText[0].text + ' - ' + row.nameExtended[0].text;
          row.nameExtended = [{ text: nameExtendedText }];
        }
      }
      if (row.sku) {
        if (row.sku.length > 1) {
          row.sku.shift();
        }
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
  return cleanUp(data);
};

module.exports = { transform };
