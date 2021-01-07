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
        if (row.ratingCount) {
          row.ratingCount.forEach(item => {
            item.text =  Number(item.text);
          });
        }
        if (row.aggregateRating) {
          row.aggregateRating.forEach(item => {
            item.text =  Number(item.text);
          });
        }
        if (row.reviewCount) {
          row.reviewCount.forEach(item => {
            item.text =  Number(item.text);
          });
        }
        if (row.description) {
            let description_ar = [];
            row.description.forEach(item => {
              description_ar.push(item.text);
            });
            if (description_ar.length) {
              row.description = [{ "text": description_ar.join(" || "), 'xpath': row.description[0].xpath }];
            }
        }
        if (row.variants) {
          let info_ar = [];
          row.variants.forEach(item => {
            info_ar.push(item.text);
          });
          if (info_ar.length) {
            row.variants = [{ "text":  info_ar.join(" | "), 'xpath': row.variants[0].xpath }];
          }
        }
        if (row.variantInformation) {
          let info_ar = [];
          row.variantInformation.forEach(item => {
            info_ar.push(item.text);
          });
          if (info_ar.length) {
            row.variantInformation = [{ "text":  info_ar.join(" | "), 'xpath': row.variantInformation[0].xpath }];
          }
        }
        if (row.listPrice) {
          row.listPrice.forEach(item => {
            item.text = item.text.replace(/\s*/g, '').trim();
            item.text =  'CHF'+item.text;
            item.text =  item.text.replace('.', '.').trim();
          });
        }
        if (row.price) {
          row.price.forEach(item => {
            item.text = item.text.replace(/\s*/g, '').trim();
            item.text =  'CHF'+item.text;
            item.text =  item.text.replace('.', '.').trim();
          });
        }
        if (row.nameExtended) {
          row.nameExtended.forEach(item => {
            item.text = item.text.replace('', '').trim();
          });
        }
        if (row.gtin) {
          row.gtin.forEach(item => {
            item.text = item.text.replace(/\s*/g, '').trim();
            item.text =  item.text.replace('smt-inci-', '').trim();
          });
        }
        if (row.alternateImages) {
          row.alternateImages.forEach(item => {
            item.text =  'https://www.impo.ch'+item.text;
          });
        }
        if (row.specifications) {
          var rowItem = ''
          var rowCounter = 1
          row.specifications.forEach(item => {
            if((rowCounter % 2)){
              rowItem = rowItem +  item.text 
            } else{
              rowItem = rowItem +  item.text + ' || '
            }
            rowCounter = rowCounter + 1
          });
          row.specifications = [{'text':rowItem, 'xpath': row.specifications[0].xpath}]
          //console.log(row.specifications)
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
      }
    }
    return cleanUp(data);
  };
module.exports = { transform };