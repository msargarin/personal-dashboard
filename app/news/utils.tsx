// Set category data in localstore
export function setCategoriesInLocalStore(categories:string[]) {
  localStorage.setItem('categories', JSON.stringify(categories))
}

// Reducer for all category actions
export function selectedCategoriesReducer(selectedCategories:string[], action:any) {
  // Add category
  if (action.type == 'added') {
    let categories = [
      ...selectedCategories,
      action.category
    ];

    // Set localstorage
    setCategoriesInLocalStore(categories);

    return categories;

  // Remove category
  } else if (action.type == 'removed') {
    let categories = selectedCategories.filter((c:string) => c !== action.category);

    // Set localstorage
    setCategoriesInLocalStore(categories);

    return categories;

  // Initialize category
  } else if (action.type == 'initialized') {
    return action.categories;

  // Handle unknown actions here
  } else {
    console.error(`Unknown action: ${action.type}`);

    return selectedCategories
  }
}
