/**
 * 1. Interroge un capteur et renvoie une promesse.
 * Résout avec { parcelle, humidite } si en ligne, rejette avec une Error sinon.
 * 
 * @param {Object} capteur - Objet capteur ({ id, parcelle, delai, enLigne, humidite })
 * @returns {Promise<Object>}
 */
export function interrogerCapteur(capteur) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (capteur.enLigne) {
        resolve({
          parcelle: capteur.parcelle,
          humidite: capteur.humidite
        });
      } else {
        reject(new Error(`Capteur ${capteur.id} hors ligne`));
      }
    }, capteur.delai);
  });
}

/**
 * 2. Interroge un capteur sans jamais rejeter la promesse.
 * Renvoie { parcelle, humidite } en cas de succès, ou { parcelle, erreur } en cas d'échec.
 * 
 * @param {Object} capteur 
 * @returns {Promise<Object>}
 */
export async function interrogerSansPlanter(capteur) {
  try {
    const resultat = await interrogerCapteur(capteur);
    return resultat;
  } catch (err) {
    return {
      parcelle: capteur.parcelle,
      erreur: err.message
    };
  }
}

/**
 * 3a. Interroge les capteurs un par un (séquentiellement) à l'aide d'une boucle for...of.
 * 
 * @param {Array} capteurs - Tableau de capteurs
 * @returns {Promise<Array>} - Tableau des résultats dans l'ordre
 */
export async function releverUnParUn(capteurs) {
  const resultats = [];
  for (const capteur of capteurs) {
    const res = await interrogerSansPlanter(capteur);
    resultats.push(res);
  }
  return resultats;
}

/**
 * 3b. Interroge tous les capteurs en même temps (en parallèle) avec Promise.all.
 * 
 * @param {Array} capteurs - Tableau de capteurs
 * @returns {Promise<Array>} - Tableau des résultats dans l'ordre
 */
export async function releverEnParallele(capteurs) {
  const promesses = capteurs.map(capteur => interrogerSansPlanter(capteur));
  return await Promise.all(promesses);
}
