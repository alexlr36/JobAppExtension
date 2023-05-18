// browser.runtime.onMessage();
(function() {

  const timer = ms => new Promise(res => setTimeout(res, ms));
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

  function handelResponse(){
    console.log(" ");
  }
  console.log("yoo");
  async function getJobInfo(){
      const jobs = [];
      console.log("in the doNothing.js");
      // Select the job listings container
      const jobListContainer = document.querySelector('.jobs-search-results-list');
      
      // Select all the job listings
      const jobListings = jobListContainer.querySelectorAll('li');
      
      console.log(`getting each job listing, const jobListings: ${jobListings}`);
      // Loop through each job listing
      jobListings.forEach(jobListing => {
        // Extract the job title
        const titleElement = jobListing.querySelector('.job-card-list__title');
        const title = titleElement ? titleElement.textContent.trim() : '';
        if(title == "") {
          return;
        }
        // Extract the company name
        const companyElement = jobListing.querySelector('.job-card-container__primary-description');
        const company = companyElement ? companyElement.textContent.trim() : '';
      
        // Extract the job location
        const locationElement = jobListing.querySelector('.job-card-container__metadata-item');
        const location = locationElement ? locationElement.textContent.trim() : '';
      
        // Wait for the description to load
        setTimeout(() => {
          // Simulate a click event on the job listing to load the description
          jobListing.click();
          // Extract the job description
          const descriptionElement = document.querySelector('.jobs-description-content__text');
          const description = descriptionElement ? descriptionElement.textContent.trim() : '';
      
          // Create a job object and add it to the jobs array
          const job = {
            title,
            company,
            location,
            description
          };
          jobs.push(job);
      
          // Log the jobs array to the console
          console.log(`job: ${job}`);
          console.log(`sending message to the background script`);
          browser.runtime.sendMessage({"currJob": job, "eol": "false"});
        }, 5000); // Wait for 2 seconds for the description to load
      });
      
      console.log(`outside of the job listings for loop`);
      browser.runtime.sendMessage({"currJob": null, "eol": "true"});
      // console.log(`sending message to the background script`);
      // browser.runtime.sendMessage({"allJobs": jobs});
      // browser.runtime.sendMessage({"url": "testing123"});
      // browser.runtime.onMessage.addListener(handleMessage);
      // renderForm(jobs);
      // return jobs;
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

  try {
      // Save jobs in an arrayList(for now)
      console.log("yooo");
      var jobs = getJobInfo();
  } catch(e){
      console.log("Error:", e);
  }
  return 1;
})();