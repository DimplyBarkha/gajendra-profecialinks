/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  let columnArray = ['additionalDescBulletInfo']
  for (const { group } of data) {
    for (const row of group) {
        if (row.manufacturerDescription) {

          let text = ''
          row.manufacturerDescription .forEach(item=>{
            text += `${item.text.replace(/\n \n/g, ' ')}  `;
          });
          row.manufacturerDescription  = [
            {
              text: text.slice(0, -4)
            },
          ];
        }  
        if (row.additionalDescBulletInfo) {
          let text = ''
          row.additionalDescBulletInfo .forEach(item=>{
            text += `${item.text.replace(/\n \n/g, ' ')}  `;
          });
          row.additionalDescBulletInfo  = [
            {
              text: text.slice(0, -4)
            },
          ];
        }  
        if (row.productOtherInformation) {
          let text = ''
          row.productOtherInformation .forEach(item=>{
            text += `${item.text.replace(/\n \n/g, ' ')}  `;
          });
          row.productOtherInformation  = [
            {
              text: text.slice(0, -4)
            },
          ];
        }
    }
  }
  console.log('RETURNING DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
  return data;
};
module.exports = { transform };