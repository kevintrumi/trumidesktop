// hospitals.js

// Function to send query to the Community Benefit Insight API
// Adapted code from https://simonplend.com/how-to-use-fetch-to-post-form-data-as-json-to-your-api/
async function postFormData({ url, formData }) {
	const plainFormData = Object.fromEntries(formData.entries());
    console.log(plainFormData);

	// Use fetch to send the form data to the API
	const response = await fetch(url + new URLSearchParams(plainFormData));

	if (!response.ok) {
		const errorMessage = await response.text();
		throw new Error(errorMessage);
	}

	// Return search result API data
	return response.json();
}

// Function to clear contents of passed elementID. 
function clearContent(elementID) {
	document.getElementById(elementID).innerHTML = "";
}


// Function to print search results to Hospital page. Adapted from 
// https://howtocreateapps.com/fetch-and-display-json-html-javascript/
function printResults(results) {
	// Clear contents of results page in the Hospitals page to allow the printing the results of new 
	// search queries
	clearContent("results");
	var mainContainer = document.getElementById("results");
	var tr = document.createElement("tr");

	if (results.length > 0) {
		tr.innerHTML = '<td style=\"border: 2px solid black;\"><b>Hospital Name</b></td>\
		<td style=\"border: 2px solid black;\"><b>Pediatric</b></td>\
		<td style=\"border: 2px solid black;\"><b>Religious</b></td>\
		<td style=\"border: 2px solid black;\"><b>Urban</b></td>\
		<td style=\"border: 2px solid black;\"><b>Bed Count</b></td>\
		<td style=\"border: 2px solid black;\"><b>Zip Code</b></td>\
		<td style=\"border: 2px solid black;\"><b>Street Address</b></td>';
		mainContainer.appendChild(tr);
	} else {
		tr.innerHTML = '<td style=\"text-align: center;\">No hospitals matched the specified criteria</td>';
		mainContainer.appendChild(tr);
	}

	// For loop to print each of the hospitals returned in the JSON response from the API
	for (var i = 0; i < results.length; i++) {
	  var tr = document.createElement("tr");
	  tr.innerHTML = '<td style=\"border: 2px solid black;\">' + results[i].name + '</td>\
	  <td style=\"border: 2px solid black;\">' + results[i].children_hospital_f + '</td>\
	  <td style=\"border: 2px solid black;\">' + results[i].chrch_affl_f + '</td>\
	  <td style=\"border: 2px solid black;\">' + results[i].urban_location_f + '</td>\
	  <td style=\"border: 2px solid black;\">' + results[i].hospital_bed_count + '</td>\
	  <td style=\"border: 2px solid black;\">' + results[i].zip_code + '</td>\
	  <td style=\"border: 2px solid black;\">' + results[i].street_address + '</td>';
	  tr.setAttribute('border', '2');
	  mainContainer.appendChild(tr);
	}


}


// Function to handle submit event. Adapted code from 
// https://simonplend.com/how-to-use-fetch-to-post-form-data-as-json-to-your-api/
async function handleFormSubmit(event) {

	event.preventDefault();

	const form = event.currentTarget;

	const url = form.action;
	
	clearContent("results");
	var mainContainer = document.getElementById("results");
	
	var tr = document.createElement("tr");

	tr.innerHTML = '<td style=\"text-align: center\">Results may take a few moments to load.</td>';
	mainContainer.appendChild(tr);
	
	try {

		const formData = new FormData(form);

		const responseData = await postFormData({ url, formData });

		// Filter response data for pediatric status
		if (formData.get('pedStatus') == 'Y'){
			var resultPed = responseData.filter(obj=> obj.children_hospital_f == "Y");
		} else {
			var resultPed = responseData.filter(obj=> obj.children_hospital_f == "N");
		}
		console.log({ resultPed });

		// Filter response data for religious status
		if (formData.get('relStatus') == 'Y'){
			var resultRel = resultPed.filter(obj=> obj.chrch_affl_f == "Y");
		} else {
			var resultRel = resultPed.filter(obj=> obj.chrch_affl_f == "N");
		}	
		console.log({ resultRel });
		
		// Filter response data for urban location status
		if (formData.get('urbStatus') == 'Y'){
			var resultUrb = resultRel.filter(obj=> obj.urban_location_f == "Y");
		} else {
			var resultUrb = resultRel.filter(obj=> obj.urban_location_f == "N");
		}	
		console.log({ resultUrb });

		// Filter response data by bed count
		if (formData.get('bedCount') == 'lessThanHundred'){
			var result = resultUrb.filter(obj=> obj.hospital_bed_size == "<100 beds");
		} else if (formData.get('bedCount') == 'hundredToTwoNinetyNine'){
			var result = resultUrb.filter(obj=> obj.hospital_bed_size == "100-299 beds");
		} else if (formData.get('bedCount') == 'threeHundredOrMore'){
			var result = resultUrb.filter(obj=> obj.hospital_bed_size == ">299 beds");
		} else {
			var result = resultUrb.filter(obj=> obj.hospital_bed_size == '0')
		}
		console.log({ result });

	} catch (error) {
		console.error(error);
	}
	printResults(result);
	document.getElementById("results").style.border = "2px solid #000000";

	
}
const stateForm = document.getElementById("state-form");
stateForm.addEventListener("submit", handleFormSubmit);