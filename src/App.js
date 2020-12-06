import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Link, Route } from 'react-router-dom'
import * as Ethereum from './services/Ethereum'
import styles from './App.module.css'
//import MediumEditor from 'medium-editor'
import 'medium-editor/dist/css/medium-editor.css'
import 'medium-editor/dist/css/themes/default.css'




const Home = () => {
  return (
    <div className={styles.links}>
      <Link to="/">Home</Link>
      <Link to="/article/new">Add an article</Link>
      <Link to="/update">update an article</Link>
      <Link to="/search">search an article</Link>
      <Link to="/article/all">All articles</Link>
    </div>
  )
}

//*************************************************************************************** */
const AllArticles = () => {
  const [articles, setArticles] = useState([])
  const contract = useSelector(({ contract }) => contract)

  var art = []
  const handleGet = async (e) => {
    const result = await contract.methods.articleContent(e).call()
    art = [...art, result]
    setArticles(art);
    console.log("result :"+result);
  }

 useEffect(() => {
    if (contract) {      
      contract.methods.getAllIds().call().then( tab => {
        var i = 0
        while (tab[i]){
          console.log(i)
          handleGet (tab[i])          
          i++
        } 
      })
      
    }
  } , [contract, setArticles])
  
  return <div>{articles.map(article => 
    <div>
      <textarea rows="4" cols="50" defaultValue = {article} />   
    </div>  )}
  </div>  

}


/********************************************************************************************** */
const NewArticle = () => {
  //const [editor, setEditor] = useState(null)
  const contract = useSelector(({ contract }) => contract)
  
  const [valueArticle, setNewValue] = useState('')

  const handleSubmit = e => {    
    e.preventDefault(); 
    contract.methods.addArticle(valueArticle).send().then(res =>{
      contract.methods.getIndex().call().then(ind =>{
        window.alert("voici l'identifiant du nouveau article : "+ind)
      })
    })
  }
 
  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.subTitle}>New article</div>
      <div className={styles.mediumWrapper}>
        <textarea  onChange = {e => setNewValue(e.target.value)} />
      </div>
      <input type="submit" value="submit"  />
    </form>
  )
}



/******************************************************************************************************* */
const UpdateArticle = () => {
  
  const contract = useSelector(({ contract }) => contract)
  const [newArticle, setUpdate] = useState('')
  const [idArticle, setID] = useState('')
  
  const handleSubmit = e => { 
    e.preventDefault();
    contract.methods.updateArticle(parseInt(idArticle, 10), newArticle).send()
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.subTitle}>Update article</div>
      <div className={styles.mediumWrapper}>
            Entrer l'identifiant de l'article
            <br/>
        <textarea  className={styles.editable} onChange = {e => setID(e.target.value)} type = "number" required/>
      </div>
            
      <div className={styles.mediumWrapper}>
          Entrer l'article 
          <br/>
        <textarea  className={styles.editable} onChange = {e => setUpdate(e.target.value)} required />
      </div>
  
      <input type="submit" value="submit"  />
    </form>
  )
}



/**************************************************************************************************************************** */
const SearchArticle = () => {
  
  const contract = useSelector(({ contract }) => contract)
  const [article, setArticle] = useState('')
  const [searchID, setSearchID] = useState('')

  const handleSubmit = e => { 
    e.preventDefault()
    contract.methods.articleContent(parseInt(searchID, 10)).call().then(res =>{
     if (res === ""){
       setArticle('')
        window.alert("cet article n'existe pas")
      }
      else{
        setArticle(res)  
      }
    })
  }

return (
  <form onSubmit={handleSubmit}>
    <div className={styles.subTitle}>Search article</div>
    <div className={styles.mediumWrapper}>
            Entrer l'identifiant de l'article
      <input className={styles.editable} onChange = {e => setSearchID(e.target.value)} />
    </div>
      <input type="submit" value="submit"  />
      <br/>
      <textarea value={article}/>
    </form>
    )
  
}

const NotFound = () => {
  return <div>Not found</div>
}


/****************************************************************************************************************************** */
const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(Ethereum.connect)
  }, [dispatch])
  return (
    <div className={styles.app}>
      <div className={styles.title}>Welcome to Decentralized Wikipedia</div>
      <Switch>
        <Route path="/article/new">
          <NewArticle />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/article/all">
          <AllArticles />
        </Route>
        <Route path="/update">
          <UpdateArticle />
        </Route>
        <Route path="/search">
          <SearchArticle />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  )
}

export default App
