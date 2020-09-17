// @ts-nocheck
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  // const clean = text => text.toString()
  //   .replace(/\r\n|\r|\n/g, ' ')
  //   .replace(/&amp;nbsp;/g, ' ')
  //   .replace(/&amp;#160/g, ' ')
  //   .replace(/\u00A0/g, ' ')
  //   .replace(/\s{2,}/g, ' ')
  //   .replace(/"\s{1,}/g, '"')
  //   .replace(/\s{1,}"/g, '"')
  //   .replace(/^ +| +$|( )+/g, ' ')
  //   .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
  //   // eslint-disable-next-line no-control-regex
  //   .replace(/[\x00-\x1F]/g, '');
  const castToInt = (item, def = 0) => Number(item) || Number(item) === 0 ? parseInt(item) : def;
  for (const { group } of data) {
    for (const row of group) {
      if (row.additionalDescBulletInfo) {
        let des = '';
        row.additionalDescBulletInfo.forEach(item => {
          des = item.text.replace(/\n \n/g, ' || ');
        });
        row.additionalDescBulletInfo = [{ text: des }];
      }
      if (row.manufacturerDescription) {
        let des = '';
        row.manufacturerDescription.forEach(item => {
          des += item.text + ' ';
        });
        row.manufacturerDescription = [{ text: des }];
        row.productOtherInformation = [{ text: des }];
      }
      if (row.productOtherInformation) {
        row.productOtherInformation[0].text = row.manufacturerDescription[0].text;
      }
      if (row.specifications) {
        let des = '';
        row.specifications.forEach(item => {
          des += item.text.replace(/\n \n/g, ':') + '  ';
        });
        row.specifications = [{ text: des }];
      }
      if (row.description) {
        row.description[0].text = row.additionalDescBulletInfo[0].text + ' | ' + row.description[0].text.replace(/.*\n \n /, '').replace(/\n \n/g, '||').replace(/\n/g, '') + ' | ' + row.specifications[0].text;
      }
      if (row.imageZoomFeaturePresent) {
        row.imageZoomFeaturePresent = row.imageZoomFeaturePresent[0].text.includes('Roll over image to zoom in') ? [{ text: 'Yes' }] : [{ text: 'No' }];
      }
      if (row.variantCount) {
        row.variantCount = [{ text: row.variantCount.length }];
      }
      if (row.shippingInfo) {
        let des = '';
        row.shippingInfo.forEach(item => {
          des += item.text + ' ';
        });
        row.shippingInfo = [{ text: des }];
      }
      if (row.availabilityText) {
        row.availabilityText = row.availabilityText[0].text.includes('in stock') | row.availabilityText[0].text.includes('In Stock') ? [{ text: 'In Stock' }] : [{ text: 'Out of Stock' }];
      }
      if (row.salesRankCategory) {
        row.salesRankCategory = row.salesRankCategory.map(item => {
          if (item.text.includes('#')) {
            const regex = /\#[0-9,]{1,} in (.+) \(/s;
            const rawCat = item.text.match(regex);
            return { text: rawCat ? rawCat[1] : '' };
          }
          return { text: item.text };
        });
      }
      if (row.salesRank) {
        row.salesRank = row.salesRank.map(item => {
          if (item.text.includes('#')) {
            const regex = /([0-9,]{1,})/s;
            const rawCat = item.text.match(regex);
            return { text: rawCat ? castToInt(rawCat[0].split(/[,.\s]/).join('')) : 0 };
          }
          return { text: 0 };
        });
      }
    }
  }
  // data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
  //   el.text = clean(el.text);
  // }))));
  return data;
};

module.exports = { transform };
