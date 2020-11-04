/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
    const clean = text => text.toString().replace(/\r\n|\r|\n/gm, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[^\x00-\x7F]/g, '');
  
    for (const { group } of data) {
      for (const row of group) {
       if(row.category){
        row.category.shift();
       }
       if(row.alternateImages){
        row.alternateImages.shift();
        const countStr = row.alternateImages.length.toString;
        row.secondaryImageTotal = [{ text: countStr, xpath: row.ingredientsList[0].xpath }];
       }
       if (row.ingredientsList) {
        const ingredientsListArr = row.ingredientsList.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace('Ingredients ', '') : '|';
        });
        row.ingredientsList = [{ text: ingredientsListArr.join('|'), xpath: row.ingredientsList[0].xpath }];
      }
      }
    }
    data.forEach(obj =>
      obj.group.forEach(row =>
        Object.keys(row).forEach(header =>
          row[header].forEach(el => {
            el.text = clean(el.text);
          }),
        ),
      ),
    );
    return data;
  };
  
  module.exports = { transform };
  