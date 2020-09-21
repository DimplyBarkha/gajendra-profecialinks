// @ts-nocheck
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
      if (row.additionalDescBulletInfo && row.additionalDescBulletInfo.length > 1) {
        const bulletText = row.additionalDescBulletInfo.reduce((bulletText = '', item) => {
          bulletText += ' || ' + item.text;
          return bulletText;
        }, '');
        row.additionalDescBulletInfo = [{ text: bulletText.trim() }];
      }
      if (row.availabilityText) {
        row.availabilityText = row.availabilityText[0].text.includes('Available Now') ? [{ text: 'In Stock' }] : [{ text: 'Out of Stock' }];
      }
      if (row.nameExtended) {
        row.nameExtended[0].text = row.brandText[0].text + ' - ' + row.nameExtended[0].text;
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace(/productthumb/, 'magnify');
        });
      }
      if (row.image) {
        row.image[0].text = row.image[0].text.replace(/productthumb/, 'magnify');
      }
      if (!row.warranty) {
        if (row.warranty1 && row.warranty1[0].text.includes('Warranty')) {
          const text = row.warranty1[0].text.replace(/\n/g, '').replace(/.*Warranty(.*)/, '$1').replace(/^((?:\S+\s+){3}\S+).*/, '$1').replace(/-/g, '').replace(/:/g, '');
          if (text.includes('guarantee')) {
            row.warranty = [{ text }];
          }
        } else if (row.warranty1 && row.warranty1[0].text.includes('2 year parts and labour guarantee')) {
          const text1 = '2 year parts and labour guarantee.';
          row.warranty = [{ text: text1 }];
        }
      }
      if (!row.specifications) {
        if (row.specifications1 && row.specifications1[0].text.includes('Specifications: ')) {
          var test = '';
          var demo = row.specifications1[0].text;
          var regExString = new RegExp('(?:' + 'Specifications:' + ')(.[\\s\\S]*)(?:' + 'What' + ')', 'g');
          test = regExString.exec(demo);
          test = test[1].replace(/\n-/, '').replace(/\n-/g, ' ').trim();
          row.specifications = [{ text: test }];
        }
      }
      if (!row.weightNet) {
        if (row.specifications1 && row.specifications1[0].text.includes('Specifications: ')) {
          var test1 = '';
          var demo1 = row.specifications1[0].text;
          var regExString1 = new RegExp('(?:' + 'Weight:' + ')(.[\\s\\S]*)(?:' + '-' + ')', 'g');
          test1 = regExString1.exec(demo1);
          test1 = test1[1].split('-');
          test1 = test1[0];
          row.weightNet = [{ text: test1.trim() }];
        }
      }
      if (row.videos) {
        row.videos.forEach(temp => {
          if (temp.text.charAt(0) === '/') {
            temp.text = temp.text.replace(/\/\//, 'https://');
          }
        });
        row.videos.forEach(item => {
          item.text = item.text.replace(/\/productimages/, 'https://www.davidjones.com/productimages');
        });
      }
      if (row.termsAndConditions) {
        row.termsAndConditions = row.termsAndConditions[0].text.includes('Terms and Conditions') ? [{ text: 'Yes' }] : [{ text: 'No' }];
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
