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
      for (let row of group) {
        if (row.image) {
            row.image.forEach(item => {
                item.text = "https:" + item.text;
            });
        }
        if (row.alternateImages) {
            row.alternateImages.forEach(item => {
                item.text = "https:" + item.text;
            });
        }
        if (row.brandLink) {
            row.brandLink.forEach(item => {
                item.text = "https://www.wildberries.ru" + item.text;
            });
        }
        if (row.specifications) {
            let info = [];
            row.specifications.forEach(item => {
                info.push(item.text.trim());
            });
            row.specifications = [{'text':info.join(' | '),'xpath':row.specifications[0].xpath}];
        }
        if (row.productOtherInformation) {
            let info = [];
            row.productOtherInformation.forEach(item => {
                info.push(item.text.trim());
            });
            row.productOtherInformation = [{'text':info.join(' | '),'xpath':row.productOtherInformation[0].xpath}];
        }
        if (row.additionalDescBulletInfo) {
            let info = [];
            row.additionalDescBulletInfo.forEach(item => {                    
                info.push(item.text.trim());
            });
            row.additionalDescBulletInfo = [{'text':info.join(' | '),'xpath':row.additionalDescBulletInfo[0].xpath}];
        }
        if (row.availabilityText) {                    
            row.availabilityText.forEach(item => {
              item.text = "In Stock";
            });          
        }
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };