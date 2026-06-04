import { useState, useEffect } from 'react'
import State from './components/state.jsx'
import './App.css'

function App() {
  const [saisie, setSaisie] = useState("");
  const [affiche, setAffiche] = useState([]);

  const chargertache = () => {
    fetch('https://backen-api-yxf6.onrender.com/api/taches')
    .then((res) => res.json())
    .then((data) => {
      setAffiche(data);
    })
    .catch((err) => console.error("Erreur lors du chargement des tâches :", err));
  }

  useEffect(() => {
    chargertache();
  }, []);

  const validation = () => {
    if (saisie.trim() === "") return;

    fetch('https://backen-api-yxf6.onrender.com/api/taches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texte: saisie})
    })
    .then((res) => res.json())
    .then((nouvelleTache) => {
      setAffiche([...affiche, nouvelleTache]);
      setSaisie("");
    })
    .catch((err) => console.error("Erreur lors de l'ajout :", err));
  };

  const check = (id) => {
    fetch(`https://backen-api-yxf6.onrender.com/api/taches/${id}/check`, {
      method: 'PUT'
    })
    .then(() => {
      const tableauModifie = affiche.map((tache) => {
        if (tache.id === id) {
          return { ...tache, termine : !tache.termine };
        }
        return tache;
      });
      setAffiche(tableauModifie);
    })
    .catch((err) => console.error("Erreur lors de la mise a jour du statut :", err)); 
  };

  const supprimer = (id) => {
      fetch(`https://backen-api-yxf6.onrender.com/api/taches/${id}`, {
        method: 'DELETE'
      })
        .then(() => {
          // Filtre le tableau en retirant la tâche qui correspond à cet id
          const tableauClean = affiche.filter((tache) => tache.id !== id);
          setAffiche(tableauClean);
        })
        .catch((err) => console.error("Erreur lors de la suppression :", err));
    }

  const modifier = (id, texteActuel) => {
    const nouveauTexte = prompt("Modifier votre tache :", texteActuel);

    if (nouveauTexte !== null && nouveauTexte.trim() !== "") {
      fetch(`https://backen-api-yxf6.onrender.com/api/taches/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texte: nouveauTexte })
      })
      .then(() => {
        const tableauModifier = affiche.map((tache) => {
        if (tache.id === id) {
          return { ...tache, texte: nouveauTexte };
        }
        return tache;
      });
      setAffiche(tableauModifier);
      })
      .catch((err) => console.error("Erreur lors de la modification", err));
    }
  };

  return (
    <div className='body'>
      <h1>Mon Application</h1>

      <State
        valeurActuelle = {saisie}
        onTextChange = {setSaisie}
        onClickButton = {validation}
      />

      <div>
        <h3>vos taches :</h3>
        
        {affiche.length === 0 ? (
          <p>En attente d'une nouvelle tache...</p>
        ) : (
          <ul>
            {affiche.map((tache) => (
              <div className='tache' key={tache.id}>
                <li 
                  onClick={() => check(tache.id)}
                  className={`item-tache ${tache.termine ? 'barre' : ''}`}
                  style = {{ cursor: 'pointer'}}
                >
                  {tache.texte}
                </li>
                <button 
                  type="button" 
                  className='bouton' 
                  id='modifier'
                  onClick={() => modifier(tache.id, tache.texte)}
                >
                  modifier
                </button>
                <button 
                  type="button" 
                  className='bouton' 
                  id='effacer'
                  onClick={() => supprimer(tache.id)}
                >
                  Effacer
                </button>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
