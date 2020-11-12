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
        if (row.aggregateRating) {
          row.aggregateRating.forEach(item => {
            item.text =  Number(item.text);
          });
        }
        if (row.reviewCount) {
            row.reviewCount.forEach(item => {
              var tmp = item.text.replace('(', '');
              item.text = tmp.replace(')', '');
              item.text=parseInt(item.text);
            });
          }
        if (row.image) {
            row.image.forEach(item => {
              item.text = 'https://www.iciparisxl.nl'+item.text;
            });
        }
        if (row.alternateImages) {
            row.alternateImages.forEach(item => {
              item.text = 'https://www.iciparisxl.nl'+item.text;
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
        if (row.specifications) {
          var specificationArr = [];
          row.specifications.forEach(item => {
            item.text = item.text.replace(/\n\s\n/, ' || ');
            specificationArr.push(item.text);
          });
          if (specificationArr.length) {
            row.specifications = [{ "text": specificationArr.join(" || "), 'xpath': row.specifications[0].xpath }];
          } else {
            delete row.specifications;
          }
        }
        if (row.descriptionBullets) {
          row.descriptionBullets = [{'text':row.descriptionBullets.length, 'xpath':row.descriptionBullets[0].xpath}];              
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