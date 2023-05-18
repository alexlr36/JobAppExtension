// Put all the javascript code here, that you want to execute in background.
let jobLst = [];

function simplePrint(message) {
    // const job = { title, company, location, description };
    var end_of_list = message.eol;
    if (end_of_list == 'true') {
        if (jobLst.length > 0) {
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

    // console.log(`message.url send is: ${message.url}`);
    // console.log(`message.currJob.title send is: ${message.currJob.title}`);
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
async function createForm() {
    // Create a new form element
    const form = document.createElement('form');
    form.addEventListener('submit', handleSubmit);

    // Add a checkbox for each saved object
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
    });

    console.log(`submitButton part`);
    // Add a submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Remove Checked Items';
    form.appendChild(submitButton);

    // Inject the form into the new tab
    // var outerHTMLform = JSON.stringify(form.outerHTML);
    // var commnad = 'document.body = ' + bdy;
    console.log(`attempting to execute script and append to doc, form: ${JSON.stringify(form.outerHTML)}`);
    return form;
}
// Create a function to render the form
async function renderForm() {
    console.log(`in the renderForm function`);
    var newForm = await createForm();
    console.log(`newForm:${newForm}`);
    // Create a new tab
    browser.tabs.create({ url: 'https://blank.org/' }, tab => {
        console.log(`in the newtab creation`);

        // const fragment = document.createDocumentFragment();
        // const li = fragment
        // .appendChild(document.createElement("section"))
        // .appendChild(document.createElement("ul"))
        // .appendChild(document.createElement("li"));
        // li.textContent = "hello world";
        browser.tabs.executeScript({
            func: () => {
                document.body.appendChild(newForm);
            }
        });

        // for(const job of jobLst){
        //     browser.tabs.executeScript({
        //         code: newForm
        //     });
        // }
        // var makeItGreen = 'document.body.style.border = "5px solid green"';
        // var executing = browser.tabs.executeScript({
        //     code: makeItGreen
        // });
    });
}

// browser.runtime.onMessage.addListener(simplePrint);