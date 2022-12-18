import React, {useState} from 'react';
import { fetchImageSearchAsync } from './search_query.js'

function App() {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  
  const handleSearchRequest = (e) => {
    e.preventDefault();
    fetchImageSearchAsync(searchPhrase)
      .then(data => handleSearchResponse(data))
      .then(reason => console.log(reason != null ? reason.message : "No reason"));
  }

  const handleSearchResponse = (e) => {
    setSearchResults(e);
  }

  return (
    <>
      <SearchBar handleSearchRequest={handleSearchRequest} setSearchPhrase={setSearchPhrase}/>
    </>
  );
}

function SearchBar(props) {

  const handleSearchRequest = props.handleSearchRequest

  return (
    <form onSubmit={handleSearchRequest} style={{display:"flex", margin:12}}>
      <input
        style={{flex: 1}}
        onChange = {(e) => {
          props.setSearchPhrase(e.target.value);
        }}
        // value = {searchPhrase}
        type="text"
        placeholder="Search image" />
      <button type="submit" style={{marginLeft:1, width:"fill"}} onClick={(e) => handleSearchRequest}>Submit</button>
    </form>
  );
}

export default App;
