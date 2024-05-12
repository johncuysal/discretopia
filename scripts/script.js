window.addEventListener("DOMContentLoaded", () => {
    // Counting journal entries
    const journalBlocks = document.querySelectorAll(".journal-block");
    const journalStatisticTotalEntries = document.querySelector("#journal-statistic-total-entries");
    let numEntries = 0;
    journalBlocks.forEach(journalBlock => {
        const links = journalBlock.querySelectorAll(".journal-block-link");
        const filteredLinks = Array.from(links).filter(link => !link.classList.contains("search-keyword"));
        const linkCount = filteredLinks.length;
        const associatedH2 = journalBlock.querySelector(".journal-block-title-statistic");
        associatedH2.textContent = `${linkCount} entries`;
        numEntries += linkCount;
    });
    if (journalStatisticTotalEntries) {
        journalStatisticTotalEntries.textContent = `${numEntries} entries`;
    }

    // Populate the list of contents
    const listOfContents = document.querySelector("#list-of-contents");
    if (listOfContents) {
        const h2Elements = document.querySelectorAll("h2");
        for (const h2 of h2Elements) {
            h2.setAttribute("id", h2.innerHTML.toLowerCase().replace(/ /g, "-").replace("&amp;", "and").replace("'", ""));
            if (listOfContents) {
                const a = document.createElement("a");
                a.setAttribute("href", "#" + h2.id);
                a.classList.add("list-of-contents-link");
                a.innerHTML = h2.innerHTML;
                listOfContents.appendChild(a);
            }
        }
    }

    // Setting current entry to bold in entry navbox, giving links to previous and next buttons
    const entryNavboxContainer = document.querySelector("#entry-navbox-container");
    if (entryNavboxContainer) {
        const entryNavLinks = entryNavboxContainer.querySelectorAll("a");
        const entryTitle = document.querySelector("h1");
        for (let i = 0; i < entryNavLinks.length; i++) {
            const currentEntryNavLink = entryNavLinks[i];
            if (currentEntryNavLink.textContent === entryTitle.textContent) {
                currentEntryNavLink.classList.add("current-entry-navlink");
                currentEntryNavLink.removeAttribute("href");
                const previousEntryNavLink = i > 0 ? entryNavLinks[i - 1] : entryNavLinks[entryNavLinks.length - 1];
                const nextEntryNavLink = i < entryNavLinks.length - 1 ? entryNavLinks[i + 1] : entryNavLinks[0];
                if (previousEntryNavLink) {
                    const previousButtons = document.querySelectorAll(".preventry-button");
                    previousButtons.forEach(previousButton => {
                        previousButton.setAttribute("href", previousEntryNavLink.getAttribute("href"));
                        const previousButtonDescription = previousButton.querySelector(".entry-button-description");
                        previousButtonDescription.textContent = previousEntryNavLink.textContent;
                    });
                }
                if (nextEntryNavLink) {
                    const nextButtons = document.querySelectorAll(".nextentry-button");
                    nextButtons.forEach(nextButton => {
                        nextButton.setAttribute("href", nextEntryNavLink.getAttribute("href"));
                        const nextButtonDescription = nextButton.querySelector(".entry-button-description");
                        nextButtonDescription.textContent = nextEntryNavLink.textContent;
                    });
                }
                break;
            }
        }
    }

    // Colorize truth tables
    const tdElements = document.querySelectorAll("td");
    tdElements.forEach(td => {
        if (td.innerHTML === "1") {
            td.style.backgroundColor = "#9fe0a5";
        } else if (td.innerHTML === "0") {
            td.style.backgroundColor = "#e0a59f";
        }
    });

    /**
     * Toggle mobile menu dropdown visibility
     */
    const mobileMenuButton = document.getElementById("mobile-menu");
    const mobileMenuDropdown = document.getElementById("mobile-menu-dropdown");
    let isInMobileMode;
    isInMobileMode = window.innerWidth < 1080;
    mobileMenuDropdown.classList.add("hidden");
    mobileMenuButton.addEventListener("click", () => {
        mobileMenuDropdown.classList.toggle("hidden");
        if (mobileMenuButton.style.backgroundColor !== "var(--hyperlink-transparent-color)") {
            mobileMenuButton.style.backgroundColor = "var(--hyperlink-transparent-color)";
        } else {
            mobileMenuButton.style.backgroundColor = "var(--body-background-color)";
        }
    });
    window.addEventListener("resize", () => {
        if (isInMobileMode && window.innerWidth > 1080) { // Exiting mobile mode
            if (!mobileMenuDropdown.classList.contains("hidden")) {
                mobileMenuDropdown.classList.add("hidden");
                mobileMenuButton.style.backgroundColor = "var(--body-background-color)";
            }
            isInMobileMode = false;
        } else if (!isInMobileMode && window.innerWidth <= 1080) { // Entering mobile mode
            isInMobileMode = true;
        }
    });
    mobileMenuButton.addEventListener("blur", () => {
        if (!mobileMenuDropdown.classList.contains("hidden")) {
            mobileMenuDropdown.classList.add("hidden");
            mobileMenuButton.style.backgroundColor = "var(--body-background-color)";
        }
    });
    // When the mobile menu dropdown get clicked, prevent it from losing focus (overrides default behavior)
    mobileMenuDropdown.addEventListener("mousedown", event => {
        event.preventDefault();
    });

    /**
     * Searching functionality
     */
    const searchField = document.getElementById("search-field");
    const searchResults = document.getElementById("search-results");
    searchField.addEventListener("input", () => {
        const searchTerm = searchField.value.toLowerCase();
        if (searchTerm.trim() === "") {
            searchResults.innerHTML = ""; // Clear the search results and return if whitespace was entered
            return;
        }
        // HTTP request to retrieve the contents of /journal/index.html
        fetch("/journal/index.html").then(response => response.text()).then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            // Search for elements whose inner html includes the search term
            const matchingElements = Array.from(doc.querySelectorAll(".journal-block-link"))
                .filter(element => element.innerHTML.toLowerCase().includes(searchTerm));
            // Clear the search results container
            searchResults.innerHTML = "";
            // Display the matching elements in the search results container
            let numResultsAdded = 0;
            matchingElements.forEach(element => {
                if (numResultsAdded < 10) {
                    let searchResult = document.createElement("a")
                    searchResult.innerHTML = element.innerHTML;
                    searchResult.classList.add("search-result")
                    searchResult.setAttribute("href", element.getAttribute("href"));
                    searchResults.appendChild(searchResult);
                    numResultsAdded++;
                }
            });
            searchResults.style.display = "flex";
        });
    });
    // When the enter key is pressed in the search field, redirect to the first search result
    searchField.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            const firstSearchResult = searchResults.querySelector(".search-result");
            if (firstSearchResult) {
                window.location.href = firstSearchResult.getAttribute("href");
            }
        }
    });
    // Also, redirect to the first search result if the go button is clicked
    const goButton = document.getElementById("go-button");
    goButton.addEventListener("click", () => {
        const firstSearchResult = searchResults.querySelector(".search-result");
        if (firstSearchResult) {
            window.location.href = firstSearchResult.getAttribute("href");
        }
    });
    // When the search field loses focus, hide the search results
    searchField.addEventListener("blur", () => {
        searchResults.style.display = "none";
    });
    // When the search field gains focus, show the search results
    searchField.addEventListener("focus", () => {
        searchResults.style.display = "flex";
    });
    // When the search results get clicked, prevent the search field from losing focus (overrides default behavior)
    searchResults.addEventListener("mousedown", event => {
        event.preventDefault();
    });
});