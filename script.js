const apiForm = document.getElementById("query-form");

const resultBox = document.getElementById("api-result-box");

apiForm.addEventListener("submit", submitApiQuery)

async function submitApiQuery(event) {
    resultBox.replaceChildren()
    event.preventDefault();

    console.log("SUBMIT", event)

    const formData = new FormData(apiForm);
    const formObject = Object.fromEntries(formData.entries());

    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${formObject.name.toLocaleLowerCase()}`, {
        method: 'GET',
        // body: JSON.stringify(formObject)
    });

    let result = await response.json();

    // for (let i = 0; i < 10; i++) {
    for (let i in result) {
        
        
        let id = result[i].show.id; 
        let name = result[i].show.name;
        let summary = result[i].show.summary;     //FALLBACK
        let premiere = result[i].show.premiered;     //FALLBACK
        let update = result[i].show.updated;
        let genreList = result[i].show.genres;      //FALLBACK
        let url = result[i].show.url;               
        let rating = result[i].show.rating.average;  //FALLBACK

        let genres = "";
        
        for (genre in genreList) {
            genres += `${genreList[genre]}, `
        }

        update = new Date(update);

        const parser = new DOMParser();
        const doc = parser.parseFromString(summary, 'text/html');
        summary = doc.body.textContent || "";

        const castFetch = await fetch(`https://api.tvmaze.com/shows/${id}/cast`)
        
        let cast = await castFetch.json();
        
        
        let object = document.createElement("div");
        object.className = "show";
        let listOB = document.createElement("ul");
        let heading = document.createElement("h1");
        let desc = document.createElement("p");
        let prem = document.createElement("p");
        let genreOB = document.createElement("p");
        let link = document.createElement("a");
        let score = document.createElement("p");




        desc.textContent = summary;
        prem.textContent = `Premiere: ${premiere}   Last Updated: ${update.toLocaleString()}`;
        heading.textContent = name;
        genreOB.textContent = genres;
        link.href = url;
        link.textContent = "TVMaze";
        score.textContent = `Rating: ${rating}`;
        
        
        console.log(result[i].show.name, result[i].show.id, cast);
        
        for (actor in cast) {

            let item = document.createElement("li");
            item.className = "cast-item";
            item.textContent = cast[actor].person.name
            listOB.appendChild(item)
            if (actor == 4) {
                break
            }
        }

        object.appendChild(heading);
        object.appendChild(prem);
        object.appendChild(genreOB);
        object.appendChild(score)
        object.appendChild(desc);
        object.appendChild(listOB);
        object.appendChild(link);
        resultBox.appendChild(object);
    }

    console.log(result)
    // const formObject = Object.fromEntries(formData.entries());
}