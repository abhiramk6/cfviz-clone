const inputForm = document.getElementById('form');
inputForm.addEventListener('submit',handleSubmit);

let username = '';

const api_url = 'https://codeforces.com/api/';

let verdict = {}
let language = {}
let rating = {}


let tried = new Set(); // done
let solved = new Set(); // done
let attempts = {}; // done
let xf = 0; // done
let max_attempted_problem = ""; // done
let problem_solved_count = {}; // done
let max_ac = {}; // done
let one_submission = 0; 
let max_ac_problem_name = ""; // done
let total_attempt = 0; // done
let max_attempts = 0; //done


async function handleSubmit(e){

    try{
    e.preventDefault();

    const inputBox = document.getElementById('input-box');
    username = inputBox.value;


    let response = await fetch(`${api_url}user.status?handle=${username}`);

    response = await response.json();


    console.log(response);

    
    for(let i = 0;i<response.result.length;i++){
        const submission = response.result[i] ;

        if (verdict[submission.verdict]=== undefined){
        verdict[submission.verdict] = 1;
        }
        else{
            verdict[submission.verdict] +=  1;   
        }


        if (language[submission.programmingLanguage]=== undefined){
            language[submission.programmingLanguage] = 1;
            }
        else{
            language[submission.programmingLanguage] +=  1;   
        }


        if (submission.problem.rating && rating[submission.problem.rating]=== undefined){
            rating[submission.problem.rating] = 1;
            }
        else{
            rating[submission.problem.rating] +=  1; 
             
        }


        let contestid = submission.contestId;
        let level = submission.problem.index;
        let name = submission.problem.name;

        let uniqueid = `${contestid}${level}`;


        // adding to tried

        tried.add(uniqueid);


        // adding to solved
        
        if (submission.verdict === 'OK'){
            solved.add(uniqueid);
        }

        //counting submissions for problem

        if (attempts[uniqueid] === undefined){
            attempts[uniqueid] = 1;
        }
        else{
            attempts[uniqueid] += 1;
        }

        if (attempts[max_attempted_problem] === undefined || attempts[uniqueid] >= attempts[max_attempted_problem]){
            max_attempted_problem = uniqueid;
            max_attempts = attempts[max_attempted_problem];

        }

        //total count 

        total_attempt += 1;

        //problem solved count
        if (problem_solved_count[uniqueid] === undefined){
            problem_solved_count[uniqueid];
        }
        problem_solved_count[uniqueid]+= 1;


        // track accepted

        
        if (submission.verdict ==="OK"){
            if (max_ac[uniqueid] === undefined){
            max_ac[uniqueid] = 1;

        }
        else{

            max_ac[uniqueid] += 1;
        }

        if (max_ac[max_ac_problem_name] === undefined || max_ac[uniqueid] >= max_ac[max_ac_problem_name]){
            max_ac_problem_name = uniqueid;
            max_attempts = max_ac[max_ac_problem_name];

        }
    
    }


    }

    for (let i of solved){
        if (attempts[i] === 1){
            one_submission += 1;
        }
    }


    // console.log(rating);
    // console.log(verdict);
    // console.log(language);
    drawVerdictChart();
    drawLanguageChart();
    drawRatingChart();
    drawContestStatsTabel();


}
catch(e){
    console.log(e);
}



}

function drawVerdictChart() {
    const verdictDiv = document.getElementById("verdict-chart");
    verdictDiv.classList.remove("d-none");
    verdictDiv.classList.add("card");
    var verTable = [["Verdict", "Count"]];
    var verSliceColors = [];
    // beautiful names for the verdicts + colors
    
    
    for (var ver in verdict) {
    if (ver == "OK") {
    verTable.push(["AC", verdict[ver]]);
    verSliceColors.push({ color: "#FFC3A0" });
    } else if (ver == "WRONG_ANSWER") {
    verTable.push(["WA", verdict[ver]]);
    verSliceColors.push({ color: "#FF677D" });
    } else if (ver == "TIME_LIMIT_EXCEEDED") {
    verTable.push(["TLE", verdict[ver]]);
    verSliceColors.push({ color: "#D4A5A5" });
    } else if (ver == "MEMORY_LIMIT_EXCEEDED") {
    verTable.push(["MLE", verdict[ver]]);
    verSliceColors.push({ color: "#392F5A" });
    } else if (ver == "RUNTIME_ERROR") {
    verTable.push(["RTE", verdict[ver]]);
    verSliceColors.push({ color: "#31A2AC" });
    } else if (ver == "COMPILATION_ERROR") {
    verTable.push(["CPE", verdict[ver]]);
    verSliceColors.push({ color: "#61C0BF" });
    } else if (ver == "SKIPPED") {
    verTable.push(["SKIPPED", verdict[ver]]);
    verSliceColors.push({ color: "#6B4226" });
    } else if (ver == "CLALLENGED") {
    verTable.push(["CLALLENGED", verdict[ver]]);
    verSliceColors.push({ color: "#D9BF77" });
    } else {
    verTable.push([ver, verdict[ver]]);
    verSliceColors.push({});
    }
    }
    verdict = new google.visualization.arrayToDataTable(verTable);
    var verOptions = {
    height: verdictDiv.getBoundingClientRect().width,
    
    
    title: "Verdict of " + username,
    pieSliceText: "label",
    slices: verSliceColors,
    fontName: "Menlo",
    backgroundColor: "white",

    is3D: true,
    };
    
    
    var verChart = new google.visualization.PieChart(verdictDiv);
    verChart.draw(verdict, verOptions);
    }


function drawLanguageChart(){
    const langDiv = document.getElementById("langauge-chart");
    const langData = [['Language','Count']]

    for (let lang in language){

        langData.push([lang, language[lang]]);

    }


    console.log("Lang Data Array",langData);


    language = new google.visualization.arrayToDataTable(langData);

    const languageChartOptions = {
        height: langDiv.getBoundingClientRect().width,
        title: `Languages of ${username}`,
        pieSliceText: 'label',
        fontName: 'Menlo',
        backgroundColor:'white',
        is3D: true,

    };

    const langChart = new google.visualization.PieChart(langDiv);
    langChart.draw(language,languageChartOptions);
}

function drawRatingChart(){
    const ratingDiv = document.getElementById("ratings-chart");
    const ratingData = [['Language','Count']]

    for (let rat in rating){

        ratingData.push([rat, rating[rat]]);

    }


    console.log("Rating Data Array",ratingData);


    rating = new google.visualization.arrayToDataTable(ratingData);

    const ratingChartOptions = {
        height: ratingDiv.getBoundingClientRect().width,
        title: `Languages of ${username}`,
        pieSliceText: 'label',
        fontName: 'monospace',
        backgroundColor:'white',
        is3D: true,

    };

    const ratingChart = new google.visualization.ColumnChart(ratingDiv);
    ratingChart.draw(rating,ratingChartOptions);
}


function drawContestStatsTabel(){


    document.getElementById("username").innerHTML = `${username}`;

    let contesr_stat_div = document.getElementById("contest-stats");
    contesr_stat_div.classList.remove("d-none");

    let contest_stat_tbody = document.getElementById("contest-stat-table-body");

    let solved_ratio = total_attempt/tried.size;



    
    contest_stat_tbody.innerHTML = `
    
    <tr>
        <td>Tried</td>
        <td>${tried.size}</td>
    </tr>

    <tr>
        <td>Solved</td>
        <td>${solved.size}</td>
    </tr>

    <tr>
        <td>Average attempts</td>
        <td>${solved_ratio.toFixed(2)}</td>
    </tr>

    <tr>
        <td>Max attempts</td>
        <td>${max_attempts}(${max_attempted_problem})</td>
    </tr>

    <tr>
        <td>Solved with one submission</td>
        <td>${one_submission}</td>
    </tr>


    <tr>
        <td>Max AC(s)</td>
        <td>${max_ac[max_ac_problem_name]}(${max_ac_problem_name})</td>
    </tr>

    `


}





