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

// function listenForClicks() {
document.addEventListener("click", (e) => {
    try {
        if (e.target.tagName != "BUTTON") {
            // Ignore when click is not on a button within <div id="popup-content">.
            console.log("in the click event listener. Attempting to filter and parse users");
            console.log("name is:" + e.target.tagName + ", value" + e.target.value);
        } else {
            if(e.target.value == 'yes'){
                console.log("attempting to execute script");
                browser.tabs.executeScript({file: "../content_scripts/doNothing.js"}).catch(reportExecuteScriptError);
            }
                console.log("In the non-button clicker button button tagName is: " + e.target.tagName + ", value:" + e.target.value, ", counter:" + counter);
        }
    } catch (e){
        console.log("Error in event listener:", e);
    }
});
// }

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
        console.log(`in the simple print background function, message.currJob.title:${message.currJob.title}, message.currJob.company:${message.currJob.company}, message.currJob.location:${message.currJob.location}`);
        let currentJob = message.currJob;
        // instert checkbox value to the current job
        currentJob.checked = true;
        jobLst.push(currentJob);
    }
}

// Create a function to handle form submission
function handleSubmit(event) {
    event.preventDefault();

    // Remove checked objects from the savedObjects array
    for (let i = jobLst.length - 1; i >= 0; i--) {
        if (jobLst[i].checked) {
            jobLst.splice(i, 1);
        }
    }

    // Reload the current tab to reflect the changes
    browser.tabs.reload();
}
async function createForm(){
    // Create a new form element
    const form = document.createElement('form');
    var formLiteral = 'const form = document.createElement("form"); ';
    form.addEventListener('submit', handleSubmit);
    // formLiteral += 'form.addEventListener("submit", handleSubmit); ';
    // Add a checkbox for each saved object
    var i = 0;
    jobLst.forEach(object => {
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = object.checked;
        console.log(`in the foreach loop function`);
        
        const label = document.createElement('label');
        
        label.textContent = object.title;

        const wrapper = document.createElement('div');
        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        form.appendChild(wrapper);

        // Update the checked property of the saved object when the checkbox is changed
        checkbox.addEventListener('change', () => {
            object.checked = checkbox.checked;
        });

        var code = `const checkbox${i} = document.createElement("input");`;
        code += ` checkbox${i}.type = 'checkbox'; checkbox${i}.checked = ${object.checked}; const label${i} = document.createElement('label');`;
        code += ` label${i}.textContent = '${object.title}';`;
        code += ` const wrapper${i} = document.createElement('div'); wrapper${i}.appendChild(checkbox${i}); wrapper${i}.appendChild(label${i}); form.appendChild(wrapper${i});`;
        // code += ` checkbox${i}.addEventListener('change', () => {'${object.checked}' = checkbox${i}.checked});`;
        formLiteral += code;
        i += 1;
    });

    console.log(`submitButton part`);
    // Add a submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Remove Checked Items';
    form.appendChild(submitButton);

    formLiteral += ` const submitButton = document.createElement('button'); submitButton.type = 'submit'; submitButton.textContent = 'Remove Checked Items';`;
    formLiteral += ` form.appendChild(submitButton);`;
    formLiteral += ` const bdy = document.createElement('body'); bdy.appendChild(form); document.body = bdy;`
    // Inject the form into the new tab
    // var outerHTMLform = JSON.stringify(form.outerHTML);
    // var commnad = 'document.body = ' + bdy;
    console.log(`attempting to execute script and append to doc, form: ${JSON.stringify(form.outerHTML)}`);
    return formLiteral;
}
// Create a function to render the form
async function renderForm() {
    console.log(`in the renderForm function`);
    var newForm = await createForm();
    // console.log(`newForm:${newForm}`);
    // Create a new tab
    setTimeout(() => {
        browser.tabs.create({ url: 'https://alexromero.dev/blank' });
    }, 1000);
    setTimeout(() => {
            console.log(`newForm:${newForm}`);
            browser.tabs.executeScript({
                code: newForm
            });
    }, 4000);
    
    // browser.tabs.create({ url: 'https://blank.org/' }, tab => {
    //     console.log(`in the newtab creation`);

    //     // const fragment = document.createDocumentFragment();
    //     // const li = fragment
    //     // .appendChild(document.createElement("section"))
    //     // .appendChild(document.createElement("ul"))
    //     // .appendChild(document.createElement("li"));
    //     // li.textContent = "hello world";
    //     // browser.scripting.executeScript({
    //     //     func: () => {
    //     //         document.body.appendChild(newForm);
    //     //     }
    //     // });

    //     // for(const job of jobLst){
    //     //     browser.tabs.executeScript({
    //     //         code: newForm
    //     //     });
    //     // }
    //     // var makeItGreen = 'document.body.style.border = "5px solid green"';
    //     // var executing = browser.tabs.executeScript({
    //     //     code: makeItGreen
    //     // });
    // });
}

// function simplePrint(request, sender, sendResponse){
//     console.log(`message send is: ${request.content}`);
// }
// document.addEventListener("DOMContentLoaded", listenForClicks);
/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
// browser.tabs.executeScript({file: "/background_script.js"})
// .then(listenForClicks)
// .catch(reportExecuteScriptError);
browser.runtime.onMessage.addListener(handleMessage);