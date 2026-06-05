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

  const validation = async () => {
    if (saisie.trim() === "") return;

    const tacheOptimiste = {
      id: Date.now(), // ID temporaire
      texte: saisie,
      termine: false
    };

    const ancienAffichage = [...affiche];
    setAffiche([...affiche, tacheOptimiste]);
    setSaisie("");

    try {
      const response = await fetch('https://backen-api-yxf6.onrender.com/api/taches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texte: tacheOptimiste.texte })
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout");
      
      const vraieTache = await response.json();
      // On remplace l'ID temporaire par le vrai ID généré par PostgreSQL
      setAffiche((prev) => prev.map(t => t.id === tacheOptimiste.id ? vraieTache : t));

    } catch (error) {
      console.error(error);
      setAffiche(ancienAffichage);
      alert("Impossible d'ajouter la tâche.");
    }
  };

  const check = async (id) => {
    const ancienAffichage = [...affiche];

    setAffiche(
      affiche.map((tache) =>
        tache.id === id ? { ...tache, termine: !tache.termine } : tache
      )
    );
    try {
      const response = await fetch(`https://backen-api-yxf6.onrender.com/api/taches/${id}/check`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error("Erreur de changement de statut");
    } catch (error) {
      console.error(error);
      setAffiche(ancienAffichage);
      alert("Impossible de modifier la tâche.");
    }
  };

  const supprimer = async (id) => {
    const ancienAffichage = [...affiche];
    setAffiche(affiche.filter((tache) => tache.id !== id));
    
    try {
      const response = await fetch(`https://backen-api-yxf6.onrender.com/api/taches/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");
    } catch (error) {
      console.error(error);
      setAffiche(ancienAffichage);
      alert("Impossible de supprimer la tâche.");
    }
  }

  const modifier = (id, texteActuel, statutActuel) => {
    const nouveauTexte = prompt("Modifier votre tache :", texteActuel);

    if (nouveauTexte !== null && nouveauTexte.trim() !== "") {
      const ancienAffichage = [...affiche];
      setAffiche(affiche.map((tache) => 
        tache.id === id ? { ...tache, texte: nouveauTexte } : tache
      ));

      fetch(`https://backen-api-yxf6.onrender.com/api/taches/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texte: nouveauTexte, termine: statutActuel })
      })
      // .then(() => {
      //   const tableauModifier = affiche.map((tache) => {
      //   if (tache.id === id) {
      //     return { ...tache, texte: nouveauTexte };
      //   }
      //   return tache;
      // });
      // setAffiche(tableauModifier);
      // })
      .catch((err) => {
        console.error("Erreur lors de la modification", err)
        setAffiche(ancienAffichage);
      });
    }
  };

  return (
    <div className='body'>
      <h1>Gestions des tâches </h1>
      <p>Gerer votres tâches facilement et rapidement</p>

      <State
        valeurActuelle = {saisie}
        onTextChange = {setSaisie}
        onClickButton = {validation}
      />

      <div>
        <h3>votres taches :</h3>
        
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
                  onClick={() => modifier(tache.id, tache.texte, tache.termine)}
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
