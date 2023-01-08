window.addEventListener('DOMContentLoaded', () => {
    // Get the table of contents div
    const listOfContents = document.querySelector("#list-of-contents");

    // Get all the h2 elements on the page
    const h2Elements = document.querySelectorAll("h2");

    // Loop through the h2 elements
    for (const h2 of h2Elements) {
        // Set the h2 element's id attribute to the modified inner HTML
        h2.setAttribute("id", h2.innerHTML.toLowerCase().replace(/ /g, "-").replace('&amp;', 'and'));

        if (listOfContents) {
            // Create a new anchor element
            const a = document.createElement("a");
            // Set the href attribute to the h2 element's text content
            a.setAttribute("href", "#" + h2.id);
            a.classList.add('list-of-contents-link')
            // Set the anchor element's text content to the h2 element's text content
            a.innerHTML = h2.innerHTML;

            // Append the anchor element to the table of contents div
            listOfContents.appendChild(a);
        }
    }

    // Deal with td elements for truth tables and give them appropriate background colors.
    const tdElements = document.querySelectorAll('td');

    tdElements.forEach(td => {
        if (td.innerHTML === '1') {
            td.style.backgroundColor = '#9fe0a5';
        } else if (td.innerHTML === '0') {
            td.style.backgroundColor = '#e0a59f';
        }
    });

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
                    searchResult.setAttribute('href', element.getAttribute('href'));
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