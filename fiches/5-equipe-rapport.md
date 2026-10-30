import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';
import { surfaceTotale } from './parcelles.js';
import { alertesIrrigation } from './irrigation.js';
import { bilanRecoltes, classerParRevenu } from './recoltes.js';

/**
 * 1. Liste les identifiants de parcelles pour un état donné, séparés par une virgule et un espace.
 * Renvoie 'aucune' si aucun identifiant ne correspond.
 * 
 * @param {Array} alertes - Tableau d'objets d'alertes (provenant d'alertesIrrigation)
 * @param {string} etat - État recherché (ex: 'ARROSER', 'DRAINER', 'INCONNU')
 * @returns {string}
 */
export function listerParEtat(alertes, etat) {
  const ids = alertes
    .filter(alerte => alerte.etat === etat)
    .map(alerte => alerte.id);

  if (ids.length === 0) {
    return 'aucune';
  }

  return ids.join(', ');
}

/**
 * 2. Construit la chaîne de caractères complète du rapport AgriSuivi.
 * 
 * @param {Object} donnees - Objet contenant { parcelles, cultures, releves, recoltes }
 * @param {string} date - Date du rapport (ex: '2026-10-29')
 * @returns {string}
 */
export function construireRapport(donnees, date) {
  const { parcelles, cultures, releves, recoltes } = donnees;

  // Calculs et données intermédiaires
  const nbParcelles = parcelles.length;
  const surfTotale = surfaceTotale(parcelles);
  
  const alertes = alertesIrrigation(parcelles, releves, cultures);
  const aArroser = listerParEtat(alertes, 'ARROSER');
  const aDrainer = listerParEtat(alertes, 'DRAINER');
  const sansReleve = listerParEtat(alertes, 'INCONNU');

  const bilan = bilanRecoltes(recoltes);
  const productionTotale = bilan.productionTotale;
  const revenuEstime = bilan.revenuEstime;

  const classement = classerParRevenu(recoltes, cultures);
  let meilleureParcelleTexte = 'aucune';
  
  if (classement.length > 0) {
    const meilleure = classement[0];
    meilleureParcelleTexte = `${meilleure.id} (${meilleure.responsable}) avec ${meilleure.revenu} FCFA`;
  }

  // Assemblage des lignes du rapport
  const lignes = [
    `=== RAPPORT AGRISUIVI DU ${date} ===`,
    `Parcelles suivies : ${nbParcelles}`,
    `Surface totale : ${surfTotale} ha`,
    '',
    '--- Irrigation ---',
    `À arroser : ${aArroser}`,
    `À drainer : ${aDrainer}`,
    `Sans relevé : ${sansReleve}`,
    '',
    '--- Récoltes ---',
    `Production totale : ${productionTotale} kg`,
    `Revenu estimé : ${revenuEstime} FCFA`,
    `Meilleure parcelle : ${meilleureParcelleTexte}`
  ];

  // Jointure avec des retours à la ligne et ajout d'un dernier saut final
  return lignes.join('\n') + '\n';
}

/**
 * 3. Crée le dossier parent si nécessaire et écrit le fichier texte du rapport.
 * 
 * @param {string} chemin - Chemin du fichier (ex: 'sorties/rapport-2026-10-29.txt')
 * @param {string} texte - Contenu textuel complet du rapport
 */
export async function enregistrerRapport(chemin, texte) {
  const dossier = dirname(chemin);
  await mkdir(dossier, { recursive: true });
  await writeFile(chemin, texte, 'utf8');
}
