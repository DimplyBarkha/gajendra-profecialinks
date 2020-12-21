// @ts-nocheck
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const clean = text => text ? text.toString()
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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ') : text;
  for (const { group } of data) {
    for (const row of group) {
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(ele => {
          text += ele.text + ' || ';
        });
        row.additionalDescBulletInfo = [{ text: text.slice(0, -3).trim() }];
      }
      if (row.description && row.description[0]) {
        let text = '';
        row.description.forEach(ele => {
          text += ele.text + ' | ';
        });
        row.description = [{ text: text.slice(0, -2).trim() }];
        row.description[0].text = row.description[0].text.replace(/\n \n \n \n/g, ' || ').replace(/\n \n/g, ' : ') + ' | ';
        if(row.additionalDescBulletInfo && row.additionalDescBulletInfo[0]){
          row.description[0].text = row.description[0].text + row.additionalDescBulletInfo[0].text;
        }
      }
      if (row.productOtherInformation) {
        let text = '';
        row.productOtherInformation.forEach(ele => {
          text += ele.text + ' || ';
        });
        row.productOtherInformation = [{ text: text.slice(0, -3).trim() }];
      }
      if (row.shippingInfo) {
        let text = '';
        row.shippingInfo.forEach(ele => {
          text += ele.text + ' ';
        });
        row.shippingInfo = [{ text: text.trim() }];
      }
      if (row.nameExtended && row.brandText && row.brandText[0] && row.nameExtended[0]) {
        row.nameExtended[0].text = row.brandText[0].text + ' - ' + row.nameExtended[0].text;
      }
      if (row.specifications && row.specifications[0]) {
        if (row.specifications[0].text.length && row.specifications[0].text.includes('Especificaciones:')) {
          var test = '';
          var demo = row.specifications[0].text;
          var regExString = new RegExp('(?:' + 'Especificaciones:' + ')(.[\\s\\S]*)(?:' + ' \n \n \n ' + ')');
          test = regExString.exec(demo);
          test = test && test[1].trim();
          row.specifications[0].text = test;
        }
      }
      if (!row.materials) {
        if (row.description && row.description[0] && row.description[0].text.includes('Material:')) {
          var test1 = '';
          var demo1 = row.description[0].text;
          var regExString1 = new RegExp('(?:' + 'Material:' + ')(.[\\s\\S]*)(?:' + 'Color:' + ')');
          test1 = regExString1.exec(demo1);
          test1 = test1 && test1[1].trim();
          row.materials = [{ text: test1 }];
        }
      }    
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
