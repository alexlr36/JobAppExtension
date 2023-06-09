// document.getElementById('myHeading').style.color = 'red'

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
var counter = 0;
var arr_values = ["no values"];
var responseWeights = 0;
const debugLvl = 1;
let jobLst = [];
// const timer = ms => new Promise(res => setTimeout(res, ms));
// Current names for the classes connected to jobs in linkedin.
// making these vars since linkedin will probably change them eventually.
var job_image_src_class = "evi-image";
var classnames = {
    job_title_class: "job-card-list__title", 
    job_company_class: "job-card-container__primary-description",
    job_location_class: "job-card-container__metadata-item"
    //job_image_src_class: "evi-image"
};

// function listener when 'yes' is clicked on
document.addEventListener("click", (e) => {
    try {
        if (e.target.tagName != "BUTTON") {
            // Ignore when click is not on a button within <div id="popup-content">.
            if (debugLvl > 0){
                console.log("in the click event listener. Attempting to filter and parse users");
                console.log("name is:" + e.target.tagName + ", value" + e.target.value);
            }
        } else {
            if(e.target.value == 'yes'){
                if (debugLvl > 1) console.log("attempting to execute script");
                document.querySelector("#myHeading").remove();
                document.querySelector("#loading").classList.remove("hidden");
                browser.tabs.executeScript({file: "../content_scripts/parseJobs.js"}).catch(reportExecuteScriptError);
            }
            else if (e.target.value.includes("showDesc")){
                let jobID = e.target.value.split(":")[1];
                handleShowDesc(jobID);
            }
            if (debugLvl > 0) console.log("In the non-button clicker button button tagName is: " + e.target.tagName + ", value:" + e.target.value, ", counter:" + counter);
        }
    } catch (e){
        console.log("Error in event listener:", e);
    }
});

async function askForJobFromTabs(tabs) {
    for (const tab of tabs) {
      browser.tabs
        .sendMessage(tab.id, {reload: true})
        .then((response) => {
          if(response.jobs != undefined){
            console.log(response.jobs);
            jobLst = response.jobs;
            createFormFunc();
          }
        })
        .catch(reportExecuteScriptError);
    }
}

async function loadJobs(){    
    browser.tabs
    .query({
    currentWindow: true,
    active: true,
    }).then(askForJobFromTabs).catch(reportExecuteScriptError);
}

async function createFormFunc(){
    // Create a new form element
    const form = document.createElement('form');
    form.className = "container";
    form.addEventListener('reset', handleJobRemoval);
    form.addEventListener('submit', handleSubmit);
    // Add a checkbox for each saved object
    var i = 0;
    jobLst.forEach(object => {
        // object = { title, company, location, description };
        const checkboxItem = document.createElement('div');
        
        const checkbox = document.createElement('input');
        checkbox.className = "col-3";
        checkbox.type = 'checkbox';
        // checkbox.checked = object.checked;
        if (debugLvl > 1) console.log(`in the foreach loop function`);
        
        const labelTitle = document.createElement('label');
        const labelCompany = document.createElement('label');
        const labelLocation = document.createElement('label');
        const labelDescription = document.createElement('label');
        labelDescription.id = "desc";

        labelTitle.className = "col-3 text-white bg-secondary";
        labelCompany.className = "col-3 text-white bg-dark";
        labelLocation.className = "col-3 text-white bg-secondary";
        labelDescription.className = "bg-light hidden";

        var titleParsed = object.title.replace( /[\r\n]+/gm, "" );
        labelTitle.textContent = titleParsed;
        labelCompany.textContent = object.company.replace( /[\r\n]+/gm, "" );
        labelLocation.textContent = object.location.replace( /[\r\n]+/gm, "" );
        labelDescription.textContent = object.description.replace( /[\r\n]+/gm, "" );

        const wrapper = document.createElement("div");
        wrapper.id = i;
        wrapper.className = "border border-dark m-3 p-3";
        const headerWrapper = document.createElement('div');
        const descWrapper = document.createElement('div');
        // descWrapper.className = "row";
        descWrapper.className = "col-12"
        headerWrapper.className = "row";
        checkboxItem.appendChild(checkbox);
        headerWrapper.appendChild(checkbox);
        headerWrapper.appendChild(labelTitle);
        headerWrapper.appendChild(labelCompany);
        headerWrapper.appendChild(labelLocation);
        descWrapper.appendChild(labelDescription);

        // Add a show button
        const showButton = document.createElement('button');
        showButton.type = 'button';
        showButton.className = "col-3";
        showButton.value = `showDesc:${i}`;
        showButton.textContent = 'show description';
        headerWrapper.appendChild(showButton);
        //wrapper.appendChild(showButton);
        wrapper.appendChild(headerWrapper);
        wrapper.appendChild(descWrapper);
        //event listener
        wrapper.addEventListener('button', handleShowDesc(i));
        form.appendChild(wrapper);
        // Update the checked property of the saved object when the checkbox is changed
        checkbox.addEventListener('change', () => {
            object.checked = checkbox.checked;
        });

        i++;
    });

    if (debugLvl > 0) console.log(`submitButton part`);
    // Add a submit and remove elements button button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Apply to selected jobs';
    const resetButton = document.createElement('button');
    resetButton.type = 'reset';
    resetButton.textContent = 'Remove selected jobs';
    
    form.appendChild(submitButton);
    form.appendChild(resetButton);

    // Inject the form into the new tab
    // var outerHTMLform = JSON.stringify(form.outerHTML);
    var newBody = document.createElement("body");
    newBody.id = "newBody";
    newBody.appendChild(form);
    document.body = newBody;
    //document.querySelector("body") = newBody;
    if (debugLvl > 0) console.log(`attempting to execute script and append to doc, form: ${JSON.stringify(form.outerHTML)}`);
    //return document.body;
}
/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
    console.error(`Failed to execute browser Action script: ${error.message}`);
}

function handleMessage(message){
    // const job = { title, company, location, description };
    var end_of_list = message.eol;
    if(end_of_list == 'true'){
        if(jobLst.length > 0){
            renderForm();
        }
    }
    else {
        if (debugLvl > 0) console.log(`in the simple print background function, message.currJob.title:${message.currJob.title}, message.currJob.company:${message.currJob.company}, message.currJob.location:${message.currJob.location}`);
        let currentJob = message.currJob;
        // instert checkbox value to the current job
        currentJob.checked = false;
        jobLst.push(currentJob);
    }
}

// Create a function to handle form submission
function handleJobRemoval(event) {
    event.preventDefault();

    // Remove checked objects from the savedObjects array
    for (let i = jobLst.length - 1; i >= 0; i--) {
        if (jobLst[i].checked) {
            jobLst.splice(i, 1);
        }
    }
    createFormFunc(jobLst);
    // Reload the current tab to reflect the changes
    //browser.tabs.reload();
}

async function sendMessageToTabs(tabs) {
    for (const tab of tabs) {
      browser.tabs
        .sendMessage(tab.id, { greeting: "Hi from background script" , jobs: jobLst, reload: false, jobID: 1})
        .then((response) => {
          console.log("Message from the content script:");
          console.log(response.response);
        })
        .catch(reportExecuteScriptError);
    }
  }

// Create a function to handle form submission
// for each job in list:
// 1. Go to Job app site
// 2. Apply to Job
// 3. Close Tab and Open new tab
async function handleSubmit(event) {
    event.preventDefault();

    // try to do just 1-2 jobs to start
    // for(let i = 0; i < jobLst.length - 1; i++){

    // }
    // find job and click
    browser.tabs
    .query({
    currentWindow: true,
    active: true,
    }).then(sendMessageToTabs).catch(reportExecuteScriptError);
}

// Create a function to handle form submission
async function handleShowDesc(jobID) {
    // event.preventDefault();
    // Get element
    debugLvl > 0 ? console.log(`jobID is:${jobID}`) : "";
    let job = document.getElementById(jobID);
    var newClassNames = ''
    if(job != null){
        let jobClassNames = job.getElementsByClassName('bg-light hidden')[0];
        if(jobClassNames != null){
            if (jobClassNames != undefined){
                debugLvl > 0 ? console.log(`attempting to change the classnames of jobID: ${jobID}`) : "";
                document.getElementById(jobID).getElementsByClassName('bg-light hidden')[0].className = "bg-light";
            }
        } else {
            debugLvl > 0 ? console.log(`attempting to change the classnames of jobID: ${jobID} back to hidden`) : "";
            document.getElementById(jobID).getElementsByClassName('bg-light')[0].className = "bg-light hidden";
        }
        //document.getElementById(jobID).className = newClassNames;
        // debugLvl > 0 ? console.log(`jobClassNames is:${job.getElementsByClassName('col bg-light hidden')[0].outerHTML}, job:${job.outerHTML}`) : "";
    }
}

// Create a function to render the form
async function renderForm() {
    if (debugLvl > 0) console.log(`iin the renderForm function`);
    setTimeout(async () => {
        createFormFunc();
    }, 500);
    // setTimeout(async () => {
    //     let tabID = await browser.tabs.query({active: true, currentWindow: true});
    //     tabID = tabID[0].id;
    //     if (debugLvl > 0) console.log(`tabID:${tabID}`);
    //     await browser.scripting.executeScript({
    //         target: tabID,
    //         func: createFormFunc(),
    //     }).then(results => {
    //         if(debugLvl > 0) console.log(`call made to createFormFunc, results:${JSON.stringify(results)}`);});
    // }, 500);
}

document.addEventListener("DOMContentLoaded", loadJobs);
/**
 * When the popup loads, inject a addListener,
 * and add a click handler.
 */
browser.runtime.onMessage.addListener(handleMessage);