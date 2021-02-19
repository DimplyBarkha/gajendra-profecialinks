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
        if (row.promotion) {
          row.promotion.forEach(item => {
              item.text =item.text.slice(2,-1);
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
        if (row.category) {
            let info = [];
            row.category.forEach(item => {
              info.push(item.text.trim());
            });
            if (info.length) {
              row.category = [];
              info.forEach(item => {
                row.category.push({ "text": item});
              });
            }
        }
        if (row.variants) {
            let variantsInfo = [];
            row.variants.forEach(item => {                    
                variantsInfo.push(item.text.trim());
            });
            row.variants = [{'text':variantsInfo.join(' | '),'xpath':row.variants[0].xpath}];
        }
        if (row.availabilityText) {                    
            row.availabilityText.forEach(item => {
              item.text = "In Stock";
            });          
        }
        if (row.nameExtended) {
          let info = [];
          row.nameExtended.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
          });
          row.nameExtended = [{'text':info.join(' | '),'xpath':row.nameExtended[0].xpath}];
        }
        if (row.videos) {
          row.videos.forEach(item => {
              item.text = "https:".concat(item.text);
          });
        }
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };