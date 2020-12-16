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
          item.text = 'https://www.officemag.ru' + item.text;
          item.text = item.text.replace('_x.', '_xl.');
        });
      }
      if (row.alternateImages) {
        row.alternateImages.splice(0, 1);
        row.alternateImages.forEach(item => {
          item.text = 'https://www.officemag.ru' + item.text;
          item.text = item.text.replace('_s.', '_xl.');
        });
      }
      if (row.shippingInfo) {
        var arrShip = [];
        row.shippingInfo.forEach(item => {
          arrShip.push(item.text);
        });
        row.shippingInfo = [{ text: arrShip.join(' ') }];
      }

      if (row.specifications) {
        var arrSpecs = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/-/, ' : ');
          arrSpecs.push(item.text);
        });
        row.specifications = [{ text: arrSpecs.join(' || ') }];
      }
      if (row.brandLink) {
        row.brandLink.forEach(item => {
          item.text = 'https://www.officemag.ru' + item.text;
        });
      }
      if (row.manufacturer) {
        row.manufacturer.forEach(item => {
          item.text = item.text.replace('Производитель —', '');
          item.text = item.text.trim();
        });
      }
      if (row.packSize) {
        row.packSize.forEach(item => {
          item.text = item.text.replace('Размер в упаковке —', '');
          item.text = item.text.trim();
        });
      }
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
      // if (row.additionalDescBulletInfo) {
      //   var arrBullets = [];
      //   row.price.forEach(item => {
      //     arrBullets.push(item.text);
      //   });
      //   row.additionalDescBulletInfo = [{ text: '||' + arrBullets.join('||') }];
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