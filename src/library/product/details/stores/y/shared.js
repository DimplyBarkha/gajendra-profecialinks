
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.category) {
        let text = '';
        row.category.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':').trim()} | `;
        });
        row.category = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.brandText) {
        row.brandText.forEach(item => {
          if(item.text.toLowerCase().includes('glo')){
            item.text = 'Glo';
          } else if(item.text.toLowerCase().includes('ploom')){
            item.text = 'Ploom';
          }else{
            item.text = '';
          }
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
