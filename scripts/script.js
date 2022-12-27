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
        fetch('')
            .then(response => response.text())
            .then(html => {
                // Parse the HTML into a DOM tree
                console.log("got here")
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Search for elements whose inner html includes the search term
                const matchingElements = Array.from(doc.querySelectorAll('h2'))
                    .filter(element => element.innerHTML.toLowerCase().includes(searchTerm));

                // Clear the search results container
                searchResults.innerHTML = '';

                // Display the matching elements in the search results container
                matchingElements.forEach(element => {
                    let searchResult = document.createElement('a')
                    searchResult.innerHTML = element.innerHTML;
                    searchResult.classList.add('search-result')
                    searchResult.setAttribute('href', element.innerHTML.toLowerCase());
                    searchResults.appendChild(searchResult);
                });
            });
    });
});