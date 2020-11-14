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
      // .replace(/"\s{1,}/g, '"')
      // .replace(/\s{1,}"/g, '"')
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
      if (row.alternateImages) {
        row.alternateImages.splice(0, 1);
        if (row.alternateImages.length === 0) {
          delete row.alternateImages;
        }
      }
      if (row.descriptionBullets) {
        var bulletArr = [];
        row.descriptionBullets.forEach(item => {
          bulletArr.push(item.text.replace(/^\s*-\s*/, ''));
        });
        row.descriptionBullets = [{ text: '|| ' + bulletArr.join(' || ') }];
      }
      if (row.specifications) {
        var arrSpecs = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n\s+\n/, ' : ');
          arrSpecs.push(item.text);
        });
        row.specifications = [{ text: arrSpecs.join(' || ') }];
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(',', '');
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace(',', '');
        });
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(item => {
          if (item.text.indexOf('http') < 0) {
            item.text = 'https:' + item.text;
          }
        });
      }
      if (row.manufacturerDescription) {
        var arrDesc = [];
        row.manufacturerDescription.forEach(item => {
          arrDesc.push(item.text);
        });
        if (arrDesc.length) {
          row.manufacturerDescription = [{ text: arrDesc.join(' ') }];
        }
      }
      if (row.variantCount) {
        row.variantCount = [{ text: row.variantCount.length }];
      }
      if (row.variants) {
        var scriptJSON = JSON.parse(row.variants[0].text);
        if (scriptJSON.productVariants) {
          var objectsInVariants = Object.keys(scriptJSON.productVariants).length;
          var varientIds = [];
          for (var i = 0; i < objectsInVariants; i++) {
            var keyName = Object.keys(scriptJSON.productVariants)[i];
            var variants = scriptJSON.productVariants[keyName].variants;
            variants.forEach(function (item, index) {
              varientIds.push(item.fupid);
            });
          }
        }
        if (varientIds.length) {
          row.variants = [{ text: varientIds.join(' | ') }];
        }
        else {
          delete row.variants;
        }
      }
      if (row.additionalDescBulletInfo) {
        var arrBullets = [];
        row.additionalDescBulletInfo.forEach(item => {
          arrBullets.push(item.text);
        });
        row.additionalDescBulletInfo = [{ text: '|| ' + arrBullets.join(' || ') }];
        row.descriptionBullets = [{ text: arrBullets.length }];
      }
      if (row.promotion) {
        var arrPromotion = [];
        row.promotion.forEach(item => {
          arrPromotion.push(item.text);
        });
        row.promotion = [{ text: arrPromotion.join(' ') }];
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = (item.text * 5) / 10;
        });
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
