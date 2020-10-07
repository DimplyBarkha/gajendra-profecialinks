/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {

    for (const { group } of data) {
      for (const row of group) {
  
        try { 
         
          if (row.Image360Present) {
            row.Image360Present = [{ text: row.Image360Present[0].text == 'true' ? 'YES' : 'NO' }];
          }   
          
          // if (row.manufacturerImages) {
          //   row.manufacturerImages = [{ text: "https://www.shavershop.com.au"+row.manufacturerImages[0].text  }];
          // } 

          if (row.warranty) {
            var text = row.warranty[0].text.toString().split('/');
            var textContent = text[text.length-1];
            textContent = textContent.replace('.jpg','').replace('_',' ');
            textContent = textContent.replace('.png','').replace('_',' ');
            row.warranty = [{ text: textContent }];
          } 
          if (row.description) {
            let text = '';
            row.description.forEach(item => {              
                text += item.text+"||"             
            });
            text =text.substring(0,text.length-2);
            row.description = [
              {
                text: text,
              },
            ];
          }

          if (row.directions) {
            let text = '';
            row.directions.forEach(item => {              
                text += item.text+"|"             
            });
            text =text.substring(0,text.length-1);
            row.directions = [
              {
                text: text,
              },
            ];
          }

          if (row.videos) {
            let text = '';
            row.videos.forEach(item => {              
                text += item.text+"|"             
            });
            text =text.substring(0,text.length-1);
            row.videos = [
              {
                text: text,
              },
            ];
          }

          if (row.manufacturerDescription) {
            let text = '';
            row.manufacturerDescription.forEach(item => {              
                text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();             
            });
            
            row.manufacturerDescription = [
              {
                text: text,
              },
            ];
          }
          
        } catch (exception) { console.log('Error in transform', exception); }
       }
    }
    return data;
  };
  
  module.exports = { transform };