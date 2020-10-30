
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
            if (row.description) {
                row.description.forEach(item => {
                    if (item.text.includes('ingredienti')) {
                        row.description[0].text = clean(item.text.split('ingredienti')[0]);
                    }
                    else if (item.text.includes('Ingredienti')) {
                        row.description[0].text = clean(item.text.split('Ingredienti')[0]);
                    } else {
                        row.description[0].text = clean(item.text.split('INGREDIENTI')[0]);
                    }
                });

                // let result = [];
                // for (var i=0; i < row.description.length; i++) {
                //     if (row.description[i].text.startsWith("Ingredienti")) {
                //         break;
                //     }
                //     result.push(row.description[i]);
                // }
                // row.description = result;
            }          
        }
    }
    return data;
  };
  
  module.exports = { transform };