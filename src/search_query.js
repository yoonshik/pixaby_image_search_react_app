export async function fetchImageSearchAsync(search_phrase) {
  const BASE_URL = "https://pixabay.com/api/?";

  const API_KEY = "32047512-e706c583a56a5814fbccd84fd";

  const params = {};

  const query_str = search_phrase.replace(" ", "+");

  params["key"] = API_KEY;

  params["q"] = query_str;

  params["image_type"] = "photo";

  params["per_page"] = 20;

  let url_params = "";

  for (const [k, v] of Object.entries(params)) {
    url_params += k + "=" + v + "&";
  }

  url_params  = url_params.substring(0, url_params.length - 1);
  const url = BASE_URL + url_params;

  let response = await fetch(url);
  let data = await response.json();
  return data ? data.hits : [];
}

//fetchImageSearchAsync("yellow flowers")
//  .then(data => console.log(data))
//  .then(reason => console.log(reason != null ? reason.message : "No reason"));
