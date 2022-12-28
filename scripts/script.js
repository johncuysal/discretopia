window.addEventListener('DOMContentLoaded', () => {
    // Get a reference to the search field and search results
    const searchField = document.getElementById('search-field');
    const searchResults = document.getElementById('search-results');

    // Listen for changes in the search field input
    searchField.addEventListener('input', () => {
        // Extract the currently entered search term
        const searchTerm = searchField.value.toLowerCase();

        // Check if the search term is empty
        if (searchTerm.trim() === '') {
            // Clear the search results if the search term is empty, and return
            searchResults.innerHTML = '';
            return;
        }

        // Make an HTTP request to retrieve root/journal/index.html's contents.
        fetch('/journal/index.html')
            .then(response => response.text())
            .then(html => {
                // Parse the HTML into a DOM tree
                console.log("got here")
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Search for elements whose inner html includes the search term
                const matchingElements = Array.from(doc.querySelectorAll('.journal-link'))
                    .filter(element => element.innerHTML.toLowerCase().includes(searchTerm));

                // Clear the search results container
                searchResults.innerHTML = '';

                // Display the matching elements in the search results container
                matchingElements.forEach(element => {
                    let searchResult = document.createElement('a')
                    searchResult.innerHTML = element.innerHTML;
                    searchResult.classList.add('search-result')
                    searchResult.setAttribute('href', '../' + element.getAttribute('href'));
                    searchResults.appendChild(searchResult);
                });

                searchResults.style.display = 'flex';
            });
    });

    // Add an event listener to the search field that listens for the "blur" event
    searchField.addEventListener('blur', () => {
        // When the search field loses focus, set the display style of the search results element to "none"
        searchResults.style.display = 'none';
    });

    // Add an event listener to the search field that listens for the "focus" event
    searchField.addEventListener('focus', () => {
        // When the search field gains focus, set the display style of the search results element to "flex"
        searchResults.style.display = 'flex';
    });

    searchResults.addEventListener('mousedown', event => {
        // Prevent the default action of the event (which would cause the search field to lose focus)
        event.preventDefault();
    });
});