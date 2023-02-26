let REQUEST_BODY = {
  appId: '17ca8d5d',
  appKey: '57c73cc76393418f62324dec27252aac',
  fields: ['item_name', 'nf_calories'],
  offset: 0,
  limit: 50,
  filters: {},
};

// Example POST method implementation:
export async function getFoodData(query) {
  // Default options are marked with *
  REQUEST_BODY.query = query;
  const response = await fetch('https://api.nutritionix.com/v1_1/search', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(REQUEST_BODY), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
