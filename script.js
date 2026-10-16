

const apiForm = document.getElementById("query-form");

const resultBox = document.getElementById("api-result-box");

const input = document.getElementById("name-input");
input.value = "batman";

console.log(resultBox.childNodes.length)

// submitApiQuery(apiForm.submit())

// apiForm.submit()
apiForm.addEventListener("submit", submitApiQuery)

async function submitApiQuery(event) {
    /**
     * Function that us ran on submit of apiForm
     * @param {event} event for query
     * @return {null} No return value
     */
    event.preventDefault();
    resultBox.replaceChildren()

    console.log("SUBMIT", event)

    const formData = new FormData(apiForm);
    const formObject = Object.fromEntries(formData.entries());
    let response;
    let castFetch;
    let cast;
    let result;
    let id;
    try {
        response = await fetch(`https://api.tvmaze.com/search/shows?q=${formObject.name.toLocaleLowerCase()}`, {
            method: 'GET',
            // body: JSON.stringify(formObject)
        });
        console.log(response)
        result = await response.json();
    }
    catch (error) {
        let heading = document.createElement("h1");
        heading.textContent = "ERROR STATUS CODE: " + error;
        resultBox.appendChild(heading);
    }


    if (result.length == 0) {
        let heading = document.createElement("h1");
        heading.textContent = "No Results"
        resultBox.appendChild(heading)
        // return ();
    }

    // for (let i = 0; i < 10; i++) {
    for (let i in result) {
        
        
        let name = result[i].show.name;
        let summary = result[i].show.summary;     //FALLBACK 
        let premiere = result[i].show.premiered;     //FALLBACK 
        let update = result[i].show.updated;
        let genreList = result[i].show.genres;      //FALLBACK 
        let url = result[i].show.url;               
        let rating = result[i].show.rating.average;  //FALLBACK 

        if (summary == null) {
            summary = "No Summary Configured";
        }
        if (rating == null ) {
            rating = "No Rating"
        }
        if (premiere == null) {
            premiere = "Unknown"
        }

        let genres = "";
        
        for (genre in genreList) {
            genres += `${genreList[genre]}, `
        }
        if (genreList.length == 0) {
            genres = "Unknown Genre  "
        }
        // if (genres.endsWith(",")) {
        // }
        genres = genres.substring(0, genres.length - 2);
        
        update = new Date(update);

        const parser = new DOMParser();
        const doc = parser.parseFromString(summary, 'text/html');
        summary = doc.body.textContent || "";
        
        let listOB = document.createElement("ul");
        try {
            id = result[i].show.id; 
            console.log(id)
            castFetch = await fetch(`https://api.tvmaze.com/shows/${id}/cast`)
            cast = await castFetch.json();
            console.log(cast)
        }
        catch (error) {
            listOB.textContent = "ERROR FETCHING CAST: "+  error   
            
        }
        
        
        let object = document.createElement("div");
        object.className = "show";
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

apiForm.requestSubmit()
