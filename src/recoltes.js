// MEMBRE 3 — Récoltes : calculer la production, le rendement et le revenu.
// Fiche : fiches/3-recoltes.md · Vérifier : npm run test:recoltes

// Renvoie le total des kilos récoltés sur une parcelle. Aucune récolte : 0.
export function totalRecolte(recoltes, idParcelle) {
<<<<<<< HEAD
=======

>>>>>>> 786679ece76947fbd434483799924b81a049e5f0
  return recoltes
    .filter((recolte) => recolte.parcelle === idParcelle)
    .reduce((total, recolte) => total + recolte.kg, 0);
}

// Renvoie le rendement en kg par hectare, arrondi à l'entier le plus proche.
// Une surface nulle ou négative est une erreur : on lance une RangeError.
export function rendement(kg, surface) {
  if (surface <= 0) {
<<<<<<< HEAD
    throw new RangeError('La surface doit être supérieure à 0');
  }

  return Math.round(kg / surface);
=======
    throw new RangeError("La surface doit être supérieure à 0");
  } else{
 
    return Math.round(kg / surface);
  }

>>>>>>> 786679ece76947fbd434483799924b81a049e5f0
}

// Renvoie le revenu estimé en FCFA.
export function revenu(kg, prixKg) {
  return kg * prixKg;
}

// Renvoie une ligne de bilan par parcelle, dans le même ordre que parcelles.
// Chaque ligne : { id, producteur, culture, kg, rendement, revenu }
export function bilanRecoltes(parcelles, recoltes, cultures) {
  return parcelles.map((parcelle) => {
<<<<<<< HEAD
    const culture = cultures.find((element) => element.code === parcelle.culture);
    const kg = totalRecolte(recoltes, parcelle.id);
    const rendementParParcelle = rendement(kg, parcelle.surface);
    const montant = revenu(kg, culture.prixKg);
=======
    const kg = totalRecolte(recoltes, parcelle.id);
    const culture = cultures.find(
      (element) => element.code === parcelle.culture,
    );
>>>>>>> 786679ece76947fbd434483799924b81a049e5f0

    return {
      id: parcelle.id,
      producteur: parcelle.producteur,
      culture: parcelle.culture,
      kg,
<<<<<<< HEAD
      rendement: rendementParParcelle,
      revenu: montant,
=======
      rendement: rendement(kg, parcelle.surface),
      revenu: revenu(kg, culture.prixKg),
>>>>>>> 786679ece76947fbd434483799924b81a049e5f0
    };
  });
}

// Renvoie une COPIE du bilan, triée du plus grand revenu au plus petit.
// Le tableau reçu ne doit pas changer d'ordre.
export function classerParRevenu(bilan) {
  return [...bilan].sort((a, b) => b.revenu - a.revenu);
}
