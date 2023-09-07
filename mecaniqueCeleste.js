//*******************************************
//**            Martin Couture             **
//**  Calcul du lever et coucher du soleil **
//**  Calcul du rang du jour dans l'année  **
//**            Septembre 2023             **
//*******************************************

//Donne le jour de l'année
export const jourAnnee = (jour, mois, an) => {
    const N1 = Math.floor((mois * 275) / 9);
    const N2 = Math.floor((mois + 9) / 12);
    const K = 1 + Math.floor((an - 4 * Math.floor(an / 4) + 2) / 3);
    return N1 - N2 * K + jour - 30;
}

export const elevationSolaireMaximumDuJour = (lat, jour, mois, an) =>{
    return 90-(lat - declinaison(jour, mois, an));
}

function calcValeurM(jour, mois, an) {
    return (357 + 0.9856 * jourAnnee(jour, mois, an)) % 360
}

function calcValeurC(jour, mois, an) {
    return 1.914 * Math.sin(Math.PI / 180 * calcValeurM(jour, mois, an)) + 0.02 * Math.sin(Math.PI / 180 * 2 * calcValeurM(jour, mois, an))
}

function calcValeurL(jour, mois, an) {
    return 280 + calcValeurC(jour, mois, an) + 0.9856 * jourAnnee(jour, mois, an) % 360
}

function calcValeurR(jour, mois, an) {
    return -2.466 * Math.sin(Math.PI / 180 * 2 * calcValeurL(jour, mois, an)) + 0.053 * Math.sin(Math.PI / 180 * 4 * calcValeurL(jour, mois, an))
}

function declinaison(jour, mois, an) {
    return Math.asin(0.3978 * Math.sin(Math.PI / 180 * calcValeurL(jour, mois, an))) * 180 / Math.PI
}

function angleHoraire(latitude, jour, mois, an) {
    return Math.acos((-0.01454 - Math.sin(Math.PI / 180 * declinaison(jour, mois, an)) * Math.sin(Math.PI / 180 * latitude)) / (Math.cos(Math.PI / 180 * declinaison(jour, mois, an)) * Math.cos(Math.PI / 180 * latitude))) * 180 / Math.PI
}

function angleHoraireHeure(latitude, jour, mois, an) {
    return angleHoraire(latitude, jour, mois, an) / 15
}

function equationTempsMinuteDEC(jour, mois, an) {
    return (calcValeurC(jour, mois, an) + calcValeurR(jour, mois, an)) * 4
}

//Retourne le lever du soleil en mode décimal
export const lever = (latitude, longitude, decalageHoraire, jour, mois, an) => {
    longitude = longitude * -1;
    let hLever = (Math.floor(12 - angleHoraireHeure(latitude, jour, mois, an) + equationTempsMinuteDEC(jour, mois, an) / 60 + longitude * 4 / 60 + decalageHoraire) + Math.round((((12 - angleHoraireHeure(latitude, jour, mois, an)) + equationTempsMinuteDEC(jour, mois, an) / 60 + longitude * 4 / 60 + decalageHoraire) - Math.floor((12 - angleHoraireHeure(latitude, jour, mois, an)) + equationTempsMinuteDEC(jour, mois, an) / 60 + longitude * 4 / 60 + decalageHoraire)) * 60, 0) / 60) / 24; 
    if (isNaN(hLever)) { hLever = 0; } 
    return hLever;
}

//Retourne l'heure du jour par rapport à une variable décimale de la journée
export const conversionDecJourHeure = (HeureDEC) => {
    const Heure = Math.floor(HeureDEC * 24)
    const Minutes = Math.round(((HeureDEC * 24) - Heure) * 60)
    return Heure + "h" + deuxchiffres(Minutes)
}

//Calcule la durée du jour par rapport au lever et coucher du soleil
export const dureeJour = (latitude, longitude, decalageHoraire, jour, mois, an) => {
    longitude = longitude * -1;
    const DJ_DEC = coucher(latitude, longitude, decalageHoraire, jour, mois, an) - lever(latitude, longitude, decalageHoraire, jour, mois, an); 
    if (DJ_DEC > 0) {
        return conversionDecJourHeure(DJ_DEC)
    } else { return 0 }
}

//Retourne l'heure du coucher du soleil en mode décimal
export const coucher = (latitude, longitude, decalageHoraire, jour, mois, an) => {
    longitude = longitude * -1;
    let hCoucher = (Math.floor(12 + angleHoraireHeure(latitude, jour, mois, an) + equationTempsMinuteDEC(jour, mois, an) / 60 + longitude * 4 / 60 + decalageHoraire) + Math.round(((12 + angleHoraireHeure(latitude, jour, mois, an) + equationTempsMinuteDEC(jour, mois, an) / 60 + longitude * 4 / 60 + decalageHoraire) - Math.floor(12 + angleHoraireHeure(latitude, jour, mois, an) + equationTempsMinuteDEC(jour, mois, an) / 60 + longitude * 4 / 60 + decalageHoraire)) * 60, 0) / 60) / 24; 
    if (isNaN(hCoucher)) { hCoucher = 0; } 
    return hCoucher;
}

// Donne les minutes en bas de zéro sur 2 chiffres
function deuxchiffres(nombre) {
    let retour;
    if (nombre < 10) { retour = "0" + nombre }
    else { retour = nombre }

    return retour
}











