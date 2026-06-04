import React from "react";

export default function State({valeurActuelle, onTextChange, onClickButton}) {
    return (
        <div>
            <label htmlFor="monInput">Ajouter une nouvelle tache</label>
            <div>
                <input
                    className="monInput" 
                    type="text"
                    value={valeurActuelle || ""}
                    onChange={(e) => onTextChange(e.target.value)}
                    placeholder="nouvelle tache"
                />

                <button className="ajouter" onClick={onClickButton}>Ajouter</button>
            </div>
        </div>
    );
}