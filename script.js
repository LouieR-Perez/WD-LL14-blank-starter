// Wait for the DOM to load
window.addEventListener("DOMContentLoaded", async () => {
  // Get the select element
  const areaSelect = document.getElementById("area-select");

  try {
    // Fetch the list of areas from the API
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );
    const data = await response.json();
    // Log the response to the console
    console.log(data);

    // Check if areas exist in the response
    if (data.meals && Array.isArray(data.meals)) {
      // For each area, create an option element
      data.meals.forEach((area) => {
        // Create a new option element
        const option = document.createElement("option");
        // Set the text to the area's strArea
        option.textContent = area.strArea;
        // Set the value to the area's strArea as well
        option.value = area.strArea;
        // Append the option to the select
        areaSelect.appendChild(option);
      });
    }
  } catch (error) {
    // Log any errors
    console.error("Error fetching areas:", error);
  }

  // Add event listener for area selection
  areaSelect.addEventListener("change", async (event) => {
    const selectedArea = event.target.value;
    const resultsDiv = document.getElementById("results");
    // Clear previous results
    resultsDiv.innerHTML = "";
    // Only fetch if a valid area is selected
    if (selectedArea) {
      try {
        // Fetch filtered recipes for the selected area
        const recipesResponse = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
            selectedArea
          )}`
        );
        const recipesData = await recipesResponse.json();
        // Log the filtered recipes to the console
        console.log(recipesData);

        // Check if meals exist in the response
        if (recipesData.meals && Array.isArray(recipesData.meals)) {
          recipesData.meals.forEach((meal) => {
            // Create a card div for the meal
            const card = document.createElement("div");
            card.className = "meal";

            // Create an image element for the meal thumbnail
            const img = document.createElement("img");
            img.src = meal.strMealThumb;
            img.alt = meal.strMeal;

            // Create an h3 element for the meal name
            const title = document.createElement("h3");
            title.textContent = meal.strMeal;

            // Append image and title to the card
            card.appendChild(img);
            card.appendChild(title);

            // Append the card to the results div
            resultsDiv.appendChild(card);
          });
        } else {
          // If no meals found, show a message
          resultsDiv.textContent = "No meals found for this area.";
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        resultsDiv.textContent = "Error loading meals.";
      }
    }
  });
});
