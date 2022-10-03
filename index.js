
// Tableau Poles
const departments = ["RH Recrutement", "RH Placement", "Webdev", "SEO", "B2B/Bdev", "Web Designer", "Illustrateur"]

// Jours de la semaine avec couler pour tableau(colorHead), couleur pour les cases(color), couleur pour les cases de stage en cours(colorCol)
const week =[
    {innerHtml:"D", colorHead: "",      color: "grey",  colorCol: "grey"  },
    {innerHtml:"L", colorHead: "green", color: "",      colorCol: "yellow"},
    {innerHtml:"M", colorHead: "",      color: "",      colorCol: "yellow"},
    {innerHtml:"M", colorHead: "",      color: "",      colorCol: "yellow"},
    {innerHtml:"J", colorHead: "",      color: "",      colorCol: "yellow"},
    {innerHtml:"V", colorHead: "red",   color: "",      colorCol: "yellow"},
    {innerHtml:"S", colorHead: "",      color: "grey",  colorCol: "grey"  },
    ]

// Tableau de mois
const months=["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"]

// statut de stage
const tabStatut = [
    {code:"13",color: "green",  text: "Terminé"},
    {code:"16",color: "green",  text: "En cours"},
    {code:"17",color: "green",  text: "Convention validée, en attente de débuter son stage"},
    {code:"14",color: "orange", text: ""},
    {code:"15",color: "orange", text: ""}
]

// VARIABLES
let year = ""
let poleSelected = ""
// Variable de premier jour de la semaine pour mois
let startDay;
// Variable nombre de jours par mois
let daysNbr;
// Tableau de données de stagiares
let tabData = [];
// FONCTIONS
// CREATION HEADER DE TABLEAU SUR PERIOD DEMANDE
// Element pour injecter les mois
function monthRow(){
    let monthRow = createMyElement('tr')
    let schedule = createMyElement('th',"Horaires: 8:30-12:00 / 13:00-16:30")
    schedule.setAttribute('colspan', '3')
    monthRow.appendChild(schedule)
    for(let i = 0; i < 12; i++){
        // Calculer le nombre de jours de mois
        daysNbr = getDaysNbr(i) 
        // Afficher le mois
        let month = createMyElement('th', months[i])
        month.setAttribute("colspan", daysNbr)
        monthRow.appendChild(month)
    }
    return monthRow
}
// Element pour injecter les jours de la semaine
function dayRow(){
    let dayRow = createMyElement('tr')
    let maxCell = createMyElement('th', "10 max")
    let cell1 = createMyElement('th')
    let cell2 = createMyElement('th')
    dayRow.appendChild(maxCell)
    dayRow.appendChild(cell1)
    dayRow.appendChild(cell2)
   
    for(let i = 0; i < 12; i++) {
        // Reperer premier jour de la semaine de mois
        startDay = getStartDay(i)
        // Calculer le nombre de jours de mois
        daysNbr = getDaysNbr(i)
        // Afficher les jours de la semaine  / pour header: true
        showDaysHeader(startDay, daysNbr, dayRow)
    }
    return dayRow
}
// Element pour injecter les dates
function dateRow(){
    let dateRow = createMyElement('tr')
    let postCell = createMyElement('th', "Poste")
    let nameCell = createMyElement('th', "Nom")
    let statusCell = createMyElement('th', "Statut")
    dateRow.appendChild(postCell)
    dateRow.appendChild(nameCell)
    dateRow.appendChild(statusCell)
    for(let i = 0; i < 12; i++){
        // Calculer le nombre de jours de mois
        daysNbr = getDaysNbr(i)
        // Afficher les dates du mois
        showDates(daysNbr, dateRow)
    }
    return dateRow
}

// CREATION DE DONNEES DE LA PAGE DE POLE
function showTimelinePole(e) { 
    if(!year) 
    {alert( "Choisissez l'année!")} else 
    {
        // Recuperer le pole selectionné
        poleSelected = e.currentTarget.innerHTML
        // Reperer ligne-parente pour injecter le tableau de pole
        let page = document.querySelector('#timeline')
        // Ajouter button pour retour au tableau de poles
        let button = createMyElement('button', 'Retour')
        button.setAttribute('id', "back")
        // Creer h1 pour afficher le pole
        let title = createMyElement('h1', (poleSelected + " " + year))
        // Gréer le tableau de donnees du Pole
        let departementTable = document.createElement('table')
        // Ajouter le header de tableau 
        departementTable.appendChild(monthRow())
        departementTable.appendChild(dayRow())
        departementTable.appendChild(dateRow())
        // Ajouter les données de stagiares
        getData().then(() => {
        generateData(tabData, departementTable)
        //Injecter le nom du Pôle, button de retour sur la page principal et le tableau de données du Pôle sur la page 
        page.innerHTML= ""
        page.appendChild(button)
        page.appendChild(title)
        page.appendChild(departementTable)
        // Selectionner column status et ajouter d'ecouteur pour modifier le statut de stagiare 
        let statusCol = document.querySelectorAll('.statusCol')
        statusCol.forEach((elem) => {
            elem.addEventListener('click', setStatus)
        })
        // ajouter l'ecouteur au buttonde retour      
        let back = document.querySelector('#back')
        back.addEventListener('click', (() => window.location.reload()))
        })
    }   
}

// fetch
function getData () {
    // Generation de lignes des donnees de stagiares pour period selectionné
   return fetch('API-HDM')
        .then((response) => response.json())
        .then((data) => {
            tabData = data
        })

}

// Generer les lignes de données de staiares
function generateData(tabData, departementTable){
    {   
        tabData.map((person, ind)=> { 
            // Creation de la ligne de donnees par person
            let row = createMyElement('tr')
            // Si person est dans le Pole selectionne                   
            if(person.pole == (departments.indexOf(poleSelected)+1)){
                // Recuperation  de la date de debut et date de fin de stage pour l'année à afficher
                let personStart = new Date(person.begin)
                let personEnd = new Date(person.end)
                // Si les dates de stage de personnes sont concernées l'année
                if(personStart.getFullYear() == year || personEnd.getFullYear() == year){
                    // Créer les cols de données personnélles de la person
                    row.appendChild(createMyElement('td',`${ind}`))
                    row.appendChild(createMyElement('td',`${person.firstname} ${person.lastname}`))
                    // Créer col avec options pour statut
                
                    row.appendChild(statusCol(person))                   
                    // Generer les cases de jours pour chaque mois
                    for(let i =0; i < 12; i++){
                        // Reperer premier jour de la semaine de mois
                        startDay = getStartDay(i)
                        // Calculer le nombre de jours de mois
                        daysNbr = getDaysNbr(i)  
                        // Generer les cases de jours 
                        // showDays(startDay, daysNbr, row, month, personIntership.personStart, personIntership.personEnd)           
                        showDays(startDay, daysNbr, row, i, personStart, personEnd)           
                    }
                }
                // Ajouter la ligne au tableau des données du Pole
                departementTable.appendChild(row)       
            }    
        }) 
    }
}

// creation  de colonne pour afficher le statut de stagiare
function statusCol(person){
    // Créer col avec options pour statut
    let tdStatus = createMyElement('td')
    let selectStatusElement = createMyElement('select')
    let statusColor = ""
    tabStatut.map((s) => {
        let statusOption = createMyElement('option', s.text)
            if(s.code === person.statut){
                statusOption.setAttribute('selected', true)
                statusColor = s.color
            } 
            statusOption.setAttribute('value', `${s.code}`)
            selectStatusElement.setAttribute('style', `background-color: ${statusColor}`)
            selectStatusElement.classList.add( 'statusCol')
            selectStatusElement.appendChild(statusOption)
    } )
    tdStatus.appendChild(selectStatusElement)
    return tdStatus
}

// Ajoter la couleur de statut de stagiare
function setStatus(e){
    let color = tabStatut.find(elem => elem.code === e.target.value)
    e.target.options[e.target.options.selectedIndex].selected = true
    e.target.setAttribute('style', `background-color: ${color.color}`)
}
// Selecteur de mois
function selectePeriod(e) {
    e.currentTarget.classList.toggle("active")
}

// Affichage de jours de la semaines dans header de tableau
function showDaysHeader(startDay, days, place) {  
    let i = 0
    while(i < days){
        let day;
        let index = ((startDay+i)%7)
        day = createColoredElement('th',  week[index].colorHead, week[index].innerHtml)
        place.appendChild(day);
        i++;
    }
}

// Affichage de dates de mois dans body de tableau
function showDays(startDay, daysNbr, place, indMonth, personStart, personEnd) {  
    let i = 0
    while(i < daysNbr){
        let cell;
        let index = ((startDay+i)%7)
        // Reperer la date correspondente au jour de la semaine à afficher
        let date = new Date(`${year}`,`${indMonth}`,`${i+1}`)
        // Creation case date
        if (personStart.setHours(0,0,0,0) <= date.setHours(0,0,0,0) && date.setHours(0,0,0,0) <= personEnd.setHours(0,0,0,0)) {
            cell = createColoredElement('td',  week[index].colorCol)
        } else { 
            cell = createColoredElement('td',  week[index].color)}     
        place.appendChild(cell);
        i++;
    }
}

// Affichage de dates de mois dans header
function showDates(days, place) {
    let i = 1
    while(i <= days){
        let date = createMyElement('th', i)
        place.appendChild(date);
        i++;
    }
}

// Formatter date pour comparaison
function getDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// Creation d'un element DOM
function createMyElement(tag, text="") {
    let element = document.createElement(tag)
    element.innerHTML = text
    return element
}

// Creation d'un element avec style
function createColoredElement (tag, color, text = ""){
   let element = createMyElement(tag, text)
   element.setAttribute('style', `background-color: ${color}` )
   return element
}

// Recuperer premier jour de la semaine de mois
function getStartDay(index) {
    return new Date( year, index).getDay()
}

// Calculer le nombre de jours de mois
function getDaysNbr(index) {
    return new Date( year, (index + 1), 0).getDate()
}


// CODE

// selecteur d'année 
const h1 = document.querySelector('.titreSection') 
const span = document.createElement('span')
h1.append(span)
span.innerHTML = `<select id="year">
                <option>L'année</option>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                </select>`
let selecteYear = document.querySelector('#year')
selecteYear.addEventListener('change', (event)=> {
    year = event.target.value  
})

// Selecteur d'un pole
let pole = document.querySelectorAll('.titlePole')
pole.forEach((element) => {
    element.innerHTML  && element.addEventListener('click', showTimelinePole)
})

