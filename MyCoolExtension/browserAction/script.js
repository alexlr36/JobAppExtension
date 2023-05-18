document.getElementById('myHeading').style.color = 'red'

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
var counter = 0;
var arr_values = ["no values"];
var responseWeights = 0;
// const timer = ms => new Promise(res => setTimeout(res, ms));
const trace = 1 // used for debugging logs
// Current names for the classes connected to jobs in linkedin.
// making these vars since linkedin will probably change them eventually.
var job_image_src_class = "evi-image";
var classnames = {
    job_title_class: "job-card-list__title", 
    job_company_class: "job-card-container__primary-description",
    job_location_class: "job-card-container__metadata-item"
    //job_image_src_class: "evi-image"
};
const savedObjects = [
    { name: 'Object 1', checked: false },
    { name: 'Object 2', checked: false },
    { name: 'Object 3', checked: false },
];

// function listenForClicks() {
    document.addEventListener("click", (e) => {
        try {
            if (e.target.tagName != "BUTTON") {
                // Ignore when click is not on a button within <div id="popup-content">.
                console.log("in the click event listener. Attempting to filter and parse users");
                console.log("name is:" + e.target.tagName + ", value" + e.target.value);
            } else {
                if(e.target.value == 'yes'){
                    console.log("attempting to exacute script");
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
    // document.querySelector("#content").classList.add("hidden");
    // document.querySelector("#error-content").classList.remove("hidden");
    // document.querySelector("#error-content").textContent += "Error is:"+error.message;
    console.error(`Failed to execute content script: ${error.message}`);
}
// Create a function to handle form submission
function handleSubmit(event) {
    event.preventDefault();

    // Remove checked objects from the savedObjects array
    for (let i = savedObjects.length - 1; i >= 0; i--) {
        if (savedObjects[i].checked) {
            savedObjects.splice(i, 1);
        }
    }

    // Reload the current tab to reflect the changes
    browser.tabs.reload();
}

// Create a function to render the form
function renderForm(jobs) {
        // Create a new tab
        browser.tabs.create({ url: 'about:blank' }, tab => {
        // Create a new form element
        const form = document.createElement('form');
        form.addEventListener('submit', handleSubmit);

        // Add a checkbox for each saved object
        savedObjects.forEach(object => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = object.checked;

            const label = document.createElement('label');
            label.textContent = object.name;

            const wrapper = document.createElement('div');
            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
            form.appendChild(wrapper);

            // Update the checked property of the saved object when the checkbox is changed
            checkbox.addEventListener('change', () => {
            object.checked = checkbox.checked;
            });
        });

        // Add a submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Remove Checked Items';
        form.appendChild(submitButton);

        // Inject the form into the new tab
        browser.tabs.executeScript(tab.id, {
        code: `document.body.appendChild(${JSON.stringify(form.outerHTML)})`
        });
    });
}

    // try {
    //     // Save jobs in an arrayList(for now)
    //     var jobs = getJobInfo();
    // } catch(e){
    //     console.log("Error:", e);
    // }
    // return 1;
// browser.runtime.OnMessage.addListener(simplePrint);

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