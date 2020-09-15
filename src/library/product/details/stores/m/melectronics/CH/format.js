const transform = (data) => {
    for (const { group} of data) {
        for (const row of group) {
            
            if (row.availabilityText) {
                row.availabilityText.forEach(item => {
                    item.text  = 'In Stock';
                });
            }

            if (row.alternateImages) {
              let info = [];          
              row.alternateImages.forEach(item => {
                info.push(item.text);            
              });
              if(info.length){          
                row.alternateImages = [];
                info.forEach(item => {
                    row.alternateImages.push({"text": item});
                });
              }
            }

            if (row.image) {
              row.image.forEach(item => {
                  item.text  = item.text.replace(/(\/fm-sm\/)/g, '/fm-xl/').trim();
              });
          }

            if (row.category) {
                let info = [];          
                row.category.forEach(item => {
                  info.push(item.text);            
                });                
                if(info.length){
                  row.category = [];
                  info.forEach(item => {
                      row.category.push({"text": item});
                  });
                }
              }
            
            if (row.description) {
                row.description.forEach(item => {
                  item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
                });
            }

            if (row.additionalDescBulletInfo) {
              row.additionalDescBulletInfo.forEach(item => {
                item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
              });
            }

            if (row.descriptionBullets) {
              row.descriptionBullets = [{'text':row.descriptionBullets.length, 'xpath':row.descriptionBullets[0].xpath}];              
            }

            if (row.specifications) {
                let info = [];          
                row.specifications.forEach(item => {
                    info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());            
                });          
                row.specifications = [{'text':info.join(' || '),'xpath':row.specifications[0].xpath}];          
            }

            if (row.category) {
              row.category.forEach(item => {
                  item.text  = item.text.replace(/(\s*\n\s*)/g, ' > ').trim();
              });
            }

            if (row.ratingCount) {
              row.ratingCount.forEach(item => {
                var matches = /(\d+)/isg.exec(item.text);                
                if (matches){
                  item.text = matches[1]
                }
                else{
                  item.text  = '';
                }
              });
            }

            if (row.listPrice) {
              row.listPrice.forEach(item => {
                  item.text  = item.text.replace(/(\s*statt\s*)/g, '').trim();
              });
            }            
        }
    }
      return data;
  };
  module.exports = { transform } 