
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
			if (row.Image360Present) {				
				let newText = 'No';
				row.Image360Present.forEach(item => {                    			
					if (item.text.trim() > 0) {
						newText = 'YES';
					}
				});
				row.Image360Present = [{ text: newText }];
			}

			if (row.technicalInformationPdfPresent) {				
				let newText = 'No';
				row.technicalInformationPdfPresent.forEach(item => {   					               			
					if (item.text.trim() > '0') {
						newText = 'YES';
					}
				});
				row.technicalInformationPdfPresent = [{ text: newText }];
			}

			if (row.energyEfficiency) {
				let text = '';
				row.energyEfficiency.forEach(item => {
				  text = row.energyEfficiency.map(elm => elm.text).join(' ').replace(/Energieeffizienzklasse/g, '');
				});
				row.energyEfficiency = [{ text }];
			  }

			  if (row.weightNet) {
				row.weightNet = [{ text: row.weightNet[0].text.trim() }];
			  }


			  if (row.mpc1) {
				if (row.mpc1[0].text.indexOf('-') >= 1) {					
						row.mpc = [{ text: row.mpc1[0].text.trim() }];
					}								
			  }
			
			 
			  let newText1 = '';
			  if (row.additionalDescBulletInfo) {
				let newText = '';
				let itemp=1;				
				row.additionalDescBulletInfo.forEach(item => {	
				if(itemp===row.additionalDescBulletInfo.length)
				{
					item.text = item.text;
				}								
				else{
					item.text = item.text + ' || ';
				}	
				newText += `${item.text.replace(/\n|&dash;|\r/g, ' || ')}`;
				itemp = itemp+ 1;
				});				
				newText1 = newText;
				row.additionalDescBulletInfo = [{ text: newText.trim() }];
			  }
			
			  let newText2="";
			  if (row.description1) {
				let newText = '';
				let itemp=1;								
				row.description1.forEach(item => {											
					newText += `${item.text.replace(/\n|&dash;|\r/g, '')}`;
					itemp = itemp + 1;
				});		
				newText2=newText.trim();				
				row.description1 = [{ text: newText.trim() }];
			  }
			  let newText3="";
			  if (row.description2) {
				let newText = '';
				let itemp=1;								
				row.description2.forEach(item => {						
					if(itemp===row.description2.length)
					{
						item.text = item.text;
					}								
					else{
						item.text = item.text + ' || ';
					}	
					newText += `${item.text.replace(/\n|&dash;|\r/g, '')}`;
					itemp = itemp + 1;
				});		
				newText3=newText.trim();				
				row.description2 = [{ text: newText.trim() }];
			  }
			  let newText4="";
			  if (row.description) {
				let newText = '';
				let itemp=1;								
				row.description.forEach(item => {						
					if(itemp===row.description.length)
					{
						item.text = item.text;
					}								
					else{
						item.text = item.text + ' || ';
					}	
					newText += `${item.text.replace(/\n|&dash;|\r/g, '')}`;
					itemp = itemp + 1;
				});		
				newText4 = newText.trim()
				//row.description = [{ text: newText.trim() + newText2.trim() + newText3.trim() + ' '+ newText1.trim() }];
			  }			  
			  row.description = [{text: newText4.trim() + newText2.trim() + newText3.trim() + newText1.trim() }];

			  if (row.specifications) {
				let newText = '';
				let itemp=1;				
				row.specifications.forEach(item => {	
				if(itemp===row.specifications.length)
				{
					item.text = item.text;
				}								
				else{
					item.text = item.text + ' || ';
				}	
				newText += `${item.text.replace(/\n|&dash;|\r/g, ' || ')}`;
				itemp = itemp+ 1;
				});				
				newText1 = newText;
				row.specifications = [{ text: newText.trim() }];
			  }
			  if (row.inTheBoxUrl && row.inTheBoxUrl[0]) {
				row.inTheBoxUrl.forEach(item => {
				  if (item.text.includes(' 200w')) {
					const imgUrl = item.text.split(' 200w, ')[0];
					if (!(item.text.includes('http'))) {
					  item.text = 'https:' + imgUrl;
					}
				  }
				});
			  }
			  if (row.manufacturerImages && row.manufacturerImages[0]) {
				row.manufacturerImages.forEach(item => {
					if (!(item.text.startsWith('http'))) {
						item.text = 'https:' + item.text;
					}
				});
			  }
		}
	}
	

	data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
		el.text = clean(el.text);
	}))));

	return data;


	
};

module.exports = { transform };