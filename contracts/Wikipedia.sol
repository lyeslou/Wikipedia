pragma solidity ^0.5.0;

contract Wikipedia {
  struct Article {
    string content;
  }


  uint public index;
  uint[] public ids;
  mapping (uint => Article) public articlesById;

  constructor() public {
    index = 1;
    ids.push(index);
    Article memory newArticle = Article("This is your first article in your contract");
    articlesById[index] = newArticle;
  }

  function articleContent(uint ind) public view returns (string memory) {
    return articlesById[ind].content;
  }

  function getAllIds() public view returns (uint[] memory) {
    return ids;
  }


  function addArticle(string memory val) public returns (uint){
    
    index = index + 1;
    Article memory newArticle = Article(val);
    articlesById[index] = newArticle;
    ids.push(index);
   
    return index;
  }

  

  function updateArticle(uint id, string memory con) public returns (uint){
    
    bool res = false;
    for(uint i = 0; i< ids.length; i++){
      if (id == ids[i]){
        res = true;
      }
    }

    if (res == false){
      return 0;
    }
   
    Article memory newArticle = Article(con);
    articlesById[id] = newArticle;
    
    return id;

  }


  function getIndex() public view returns (uint ) {
    return index;
  }


}
