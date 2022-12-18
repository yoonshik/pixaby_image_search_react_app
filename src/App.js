import React, {useState} from 'react';
import { fetchImageSearchAsync } from './search_query.js'
import './gallery.css';

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
      <Gallery searchResults={searchResults}/>
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

function Gallery(props) {
  const [imageDetails, setImageDetails] = useState(null);

  const showImageDetails = (searchResult) => {
    setImageDetails(searchResult);
  }

  return(
    <>
      <div className={imageDetails ? "theater open" : "theater"}>
        <img src={imageDetails ? imageDetails["src"] : ""}/>
      </div>
      <div className="gallery">
        {props.searchResults.map((item, index)=>{
          return(
            <div className="pics" key={index} onClick={()=> showImageDetails(item)}>
              <img src={item["src"]} style={{width: '100%'}}/>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default App;
