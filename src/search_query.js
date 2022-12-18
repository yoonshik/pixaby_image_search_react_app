export async function fetchImageSearchAsync(current_data, search_phrase, page) {
  const BASE_URL = "https://pixabay.com/api/?";

  const API_KEY = "32047512-e706c583a56a5814fbccd84fd";

  const params = {};

  const query_str = search_phrase.replace(" ", "+");

  params["key"] = API_KEY;

  params["q"] = query_str;

  params["image_type"] = "photo";

  if (page) {
    params["page"] = page
  }

  params["per_page"] = 20;
  
  let url_params = "";

  for (const [k, v] of Object.entries(params)) {
    url_params += k + "=" + v + "&";
  }

  url_params  = url_params.substring(0, url_params.length - 1);
  const url = BASE_URL + url_params;

  let response = await fetch(url);
  let data = await response.json();
  let new_data = parseImageSearchResults(data);
  // console.log("search_query.js", current_data, new_data);
  return current_data.concat(new_data);
}

function parseImageSearchResults(data) {
  let result = [];
  for (let i = 0; i < data.hits.length; i++) {
    let hit = data.hits[i];
    let image = {};
    image["src"] = hit["largeImageURL"];
    image["width"] = hit["imageWidth"];
    image["height"] = hit["imageHeight"];
    image["tags"] = hit["tags"];
    image["user_name"] = hit["user"];
    image["userImageURL"] = hit["userImageURL"];
    result.push(image);
  }
  return result;
}
