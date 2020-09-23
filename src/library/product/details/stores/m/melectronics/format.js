const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace(/(\/fm-thumbnail\/)/g, '/fm-xl/').trim();
        });
      }
      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.replace(/(\/fm-sm\/)/g, '/fm-xl/').trim();
        });
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
        row.descriptionBullets = [{ 'text': row.descriptionBullets.length, 'xpath': row.descriptionBullets[0].xpath }];
      }

      if (row.specifications) {
        let info = [];
        row.specifications.forEach(item => {
          info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());
        });
        row.specifications = [{ 'text': info.join(' || '), 'xpath': row.specifications[0].xpath }];
      }

      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          var matches = /(\d+)/isg.exec(item.text);
          if (matches) {
            item.text = matches[1]
          }
          else {
            item.text = '';
          }
        });
      }

      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace(/(\s*statt\s*)/g, '').trim();
          item.text = item.text.replace(/–/g, '').trim();
          item.text = item.text.replace(/\’/g, '').trim();
          item.text = item.text.replace(/\./g, ',').trim();
          item.text = item.text.replace(/\,$/g, '').trim();
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(/–/g, '').trim();
          item.text = item.text.replace(/\’/g, '').trim();
          item.text = item.text.replace(/\./g, ',').trim();
          item.text = item.text.replace(/\,$/g, '').trim();
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {          
          item.text = item.text.replace('.', ',').trim();          
        });
      }      
    }
  }
  return data;
};
module.exports = { transform } 