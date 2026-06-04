import React from "react";

export default function State({valeurActuelle, onTextChange, onClickButton}) {
    return (
        <div className="tete">
            <label htmlFor="monInput">Ajouter une nouvelle tache</label>
            <div className="divajout">
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