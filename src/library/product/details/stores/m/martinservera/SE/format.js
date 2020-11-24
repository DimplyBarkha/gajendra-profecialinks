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
      if (row.image1) {
        row.image = [{ text: row.image1[0].text }];
        delete row.image1;
      }
      else if (row.image2) {
        row.image = [{ text: row.image2[0].text }];
        delete row.image2;
      }
      if (row.imageAlt1) {
        row.imageAlt = [{ text: row.imageAlt1[0].text }];
        delete row.imageAlt1;
      }
      else if (row.imageAlt2) {
        row.imageAlt = [{ text: row.imageAlt2[0].text }];
        delete row.imageAlt2;
      }
      // if (row.descriptionBullets) {
      //   var bulletArr = [];
      //   row.descriptionBullets.forEach(item => {
      //     bulletArr.push(item.text.replace(/^\s*-\s*/, ''));
      //   });
      //   row.descriptionBullets = [{ text: '|| ' + bulletArr.join(' || ') }];
      // }
      if (row.specifications) {
        var arrSpecs = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\s*:\s*/, ' : ');
          arrSpecs.push(item.text);
        });
        row.specifications = [{ text: arrSpecs.join(' || ') }];
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