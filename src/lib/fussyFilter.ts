export const textFussyFilter = ({ filterValue, value }: { filterValue: string; value: string }) => {
    // Early return if filterValue is empty - show all results
    if (filterValue === '') {
        return true;
    }

    // Handle null or undefined values
    if (value === null || value === undefined) {
        return false;
    }

    // Convert to strings and normalize for comparison
    const searchValue = String(value).trim();
    const searchTerm = String(filterValue).trim();

    // Minimum length requirement - ignore very short search terms (just 1 character)
    if (searchTerm.length < 2) {
        return true; // Show all results when search term is too short
    }

    // Check for exact match first (case insensitive)
    const exactMatch = searchValue.toLowerCase() === searchTerm.toLowerCase();
    if (exactMatch) {
        return true;
    }

    // Check for prefix match (core original functionality)
    const prefixMatch = searchValue.toLowerCase().startsWith(searchTerm.toLowerCase());

    // Check for "contains" match (value contains the search term anywhere)
    const containsMatch = searchValue.toLowerCase().includes(searchTerm.toLowerCase());

    // Priority: exact match > prefix match > contains match
    return prefixMatch || containsMatch;
};