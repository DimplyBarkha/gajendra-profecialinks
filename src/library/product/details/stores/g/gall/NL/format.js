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
        if (row.reviewCount) {
          row.reviewCount.forEach(item => {
            item.text = item.text.replace(/\s*/g, '').trim();
            item.text = item.text.replace("Reviews", '').trim();
            item.text =  Number(item.text);
          });
        }
        if (row.price) {
            row.price.forEach(item => {
              item.text = item.text.replace(/\s*/g, '').trim();
              item.text = ' € ' + item.text;
            });
        }
        if (row.listPrice) {
            row.listPrice.forEach(item => {
              item.text = ' € ' + item.text;
            });
        }
        if (row.brandText) {
            row.brandText.forEach(item => {
                item.text = item.text.slice(1,-1);
            });
        }
        if (row.manufacturer) {
            row.manufacturer.forEach(item => {
                item.text = item.text.slice(1,-1);
            });
        }
        if (row.description) {
            let description_ar = [];
            row.description.forEach(item => {
              item.text = item.text.replace("#", '||').trim();
              item.text = item.text.replace(", ", '||').trim();
              item.text = item.text.replace(". ", '||').trim();
              description_ar.push(item.text);
            });
            if (description_ar.length) {
              row.description = [{ "text": description_ar.join(" || "), 'xpath': row.description[0].xpath }];
            }
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
        if (row.descriptionBullets) {
          row.descriptionBullets = [{'text':row.descriptionBullets.length, 'xpath':row.descriptionBullets[0].xpath}];              
        } 
        if (row.category) {
            if (row.category.length) {
              row.category.splice(0, 1);
              row.category.splice(row.category.length - 1, 1);
            }
            row.category.forEach(item => {
              item.text = item.text.replace('>', '').trim();
            });
        }
      }
    }
    return cleanUp(data);
  };
module.exports = { transform };