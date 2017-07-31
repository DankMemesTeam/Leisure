/* globals $, google */

let autocomplete;

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('location')),
        { types: ['geocode'] });

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    const place = autocomplete.getPlace();

    const address = place.formatted_address;
    const long = place.geometry.location.lng();
    const lat = place.geometry.location.lat();

    console.log(address);
    console.log(long);
    console.log(lat);

    $('#event-addr').val(address);
    $('#event-long').val(long);
    $('#event-lat').val(lat);
}
