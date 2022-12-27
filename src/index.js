import './css/styles.css';
import { makeCountryMarkup, makeCountriesMarkup } from './js/makeMarkup';
import { getCountry } from './js/fetchCountries';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';


const DEBOUNCE_DELAY = 300;
const refs = {
    inputRef: document.querySelector('#search-box'),
    listRef: document.querySelector('.country-list'),
    infoRef: document.querySelector('.country-info'),
}

refs.inputRef.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY))

function onSearch(e) {
    const value = e.target.value.trim();
    if (!value) {
        removeContent()
        return;
    }
    getCountry(value).then(country => {
        if (country.length === 1) {
            const markup = makeCountryMarkup(country);
            removeContent();
            refs.infoRef.innerHTML = markup;
        } else if (country.length >= 2 && country.length <= 10) {
            const markup = makeCountriesMarkup(country);
            refs.listRef.innerHTML = markup
        } else {
            removeContent();
            Notify.info(
                'Too many matches found. Please enter a more specific name.'
            );
        }
    }).catch(error => {
        Notify.failure('Oops, there is no country with that name');
    });
    

}
function removeContent() {
    refs.infoRef.innerHTML = '';
    refs.listRef.innerHTML = '';
}