

const transform = (data) => {
  for (const { group} of data) {
      for (const row of group) {        
          if (row.additionalDescBulletInfo) {
            let add_bul = ''
              row.additionalDescBulletInfo.forEach(item => {                
                  item.text  = item.text.replace(/(\s*\n\s\n\s*)/g, ' | ').trim();
                  add_bul = item.text
              });
              let bullet_count = add_bul.split('|');
              row.descriptionBullets = [{'text':bullet_count.length,'xpath':row.additionalDescBulletInfo[0].xpath}];
          }          
          if (row.specifications) {
            let info = [];          
            row.specifications.forEach(item => {
              info.push(item.text);            
            });          
            row.specifications = [{'text':info.join(' || '),'xpath':row.specifications[0].xpath}];          
          }
          if (row.description) {
            row.description.forEach(item => {
                item.text  = item.text.replace(/(\s*\n\s\n\s*)/g, ' || ').trim();
            });
          }

   

      }
    }
    return data;
};

module.exports = { transform }