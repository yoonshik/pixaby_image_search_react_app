import React, {useState, useEffect, useRef} from 'react';
import { fetchImageSearchAsync } from './search_query.js'
import './gallery.css';
import CloseIcon from '@mui/icons-material/Close';

function App() {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [page, setPage] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  
  const handleSearchRequest = (e) => {
    e.preventDefault();
    setPage(1);
    fetchImageSearchAsync([], searchPhrase, page)
      .then(data => handleSearchResponse(data))
      .then(reason => console.log(reason != null ? reason.message : "No reason"));
  }

  const disallowConcurrency = (fn) => {
    let inprogressPromise = Promise.resolve();
    let lsp = null;
    let pg = 1;

    return async (l, p) => {
      await inprogressPromise
      if (lsp != l || pg != p) {
        inprogressPromise = inprogressPromise.then(() => fn(l, p))        
      }
      lsp = l;
      pg = p;
      
      return inprogressPromise
    }
  }

  const handlePaginationRequest = (cd, s, p) => {
    console.log("syncAsyncPagination(" + s + ", " + page + ")"); 
    syncAsyncPagination(cd, s, p + 1);
  }

  const handlePaginationRequestAsync = async(cd, s, p) => {
    if (s == null) {
      return;
    }
    fetchImageSearchAsync(cd, s, p)
      .then(data => handlePaginationResponse(data))
      .then(reason => console.log(reason != null ? reason.message : "No reason"));
    // console.log("PAGINATE page=" + page + ", time=" + Date.now());
  }

  const syncAsyncPagination = disallowConcurrency(handlePaginationRequestAsync);

  const handleSearchResponse = (data) => {
    setSearchResults(data);
  }

  const handlePaginationResponse = (newData) => {
    setPage(page+1);
    setSearchResults(newData);
  }

  return (
    <>
      <SearchBar handleSearchRequest={handleSearchRequest} setSearchPhrase={setSearchPhrase}/>
      <Gallery searchPhrase={searchPhrase} page={page} searchResults={searchResults} handlePaginationRequest={handlePaginationRequest}/>
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
        type="text"
        placeholder="Search image" />
      <button type="submit" style={{marginLeft:1, width:"fill"}} onClick={(e) => handleSearchRequest}>Submit</button>
    </form>
  );
}

function Gallery(props) {
  const [imageDetails, setImageDetails] = useState(null);
  const galleryRef = useRef(null);

  this.state={
    data:props.searchResults,
    searchPhrase: props.searchPhrase,
    page: props.page,
  }

  console.log("GALLERY", this.state.data, this.state.searchPhrase, this.state.page);

  const showImageDetails = (searchResult) => {
    setImageDetails(searchResult);
  }

  const handleKeydown = (e) => {
    if (e.key == "Escape"){
      setImageDetails(null);
    }
  };
  const handleScroll = () => {
      const position = window.pageYOffset;
      if (galleryRef.current.clientHeight - position < 1000) {
        props.handlePaginationRequest(this.state.data, this.state.searchPhrase, this.state.page);
        console.log("handleScroll", this.state.data, this.state.searchPhrase, this.state.page);
      }
      // console.log(position + "/" + galleryRef.current.clientHeight);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown, false);
    return () => window.removeEventListener('keydown', handleKeydown, false);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll, false);
  }, []);

  return(
    <div ref={galleryRef}>
      <div className={imageDetails ? "theater open" : "theater"}>
        <img src={imageDetails ? imageDetails["src"] : ""}/>
        <CloseIcon onClick={() => setImageDetails(null)}/>
        <div className="owner">
          <img src={imageDetails && imageDetails["userImageURL"]? imageDetails["userImageURL"] : ""} style={{visibility: (imageDetails && imageDetails["userImageURL"]) ? 'visible' : 'hidden' }} />
          <p>{imageDetails ? imageDetails["user_name"] : ""}</p>
          <p>{imageDetails && imageDetails["tags"] ? ": \"" + imageDetails["tags"] + "\"" : ""}</p>
        </div>
      </div>
      <div className="gallery">
        {this.state.data.map((item, index)=>{
          return(
            <div className="pics" key={index} onClick={()=> showImageDetails(item)}>
              <img src={item["src"]} style={{width: '100%'}}/>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App;
