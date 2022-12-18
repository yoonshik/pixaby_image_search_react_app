import React from 'react';
import { fetchImageSearchAsync } from './search_query.js'

function App() {
  fetchImageSearchAsync("yellow flowers")
   .then(data => console.log(data))
   .then(reason => console.log(reason != null ? reason.message : "No reason"));
  
  return (
    <></>
  );
}

export default App;
