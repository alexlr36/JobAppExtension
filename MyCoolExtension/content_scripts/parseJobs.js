// browser.runtime.onMessage();
(function() {

  const timer = ms => new Promise(res => setTimeout(res, ms));
  const debugLvl = 1;
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

  async function getJobInfo(){
      const jobs = [];
      if(debugLvl > 0)
      console.log("in parseJobs.js");
      // Select the job listings container
      const jobListContainer = document.querySelector('.jobs-search-results-list');
      
      // Select all the job listings
      const jobListings = jobListContainer.querySelectorAll('li');
      if(debugLvl > 1)
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
          if(debugLvl > 0){
            console.log(`job: ${job}`);
            console.log(`sending message to the background script`);
          }
          browser.runtime.sendMessage({"currJob": job, "eol": "false"});
        }, 1000); // Wait for 1 second for the description to load
      });
      // setTimeout(() => {
      //   console.log("first print in timeout");
      //   setTimeout(() => {
      //     console.log("second inner print in timeout");
      //   }, 3000);
      // }, 3000);
      // console.log(`outside of the job listings for loop`);
      // browser.runtime.sendMessage({"currJob": null, "eol": "true"});
      // renderForm(jobs);
      return jobs;
  }

  async function getJobs(){
    await getJobInfo(); //.then(browser.runtime.sendMessage({"currJob": null, "eol": "true"}));
    if(debugLvl > 0)
      console.log(`getJobsFunction is complete, attempting to send 'true' to bg.js `);
    
    var timeot = 2 * 1000
    setTimeout(() => {
      if(debugLvl > 0) console.log(`in the eol send message timeout `);
      browser.runtime.sendMessage({"currJob": null, "eol": "true"});
      // browser.tabs.create({url: "https://developer.mozilla.org/en-US/Add-ons/WebExtensions"});
    }, timeot);
      
  }
  // // Create a function to handle form submission
  // function handleSubmit(event) {
  //     event.preventDefault();
  
  //     // Remove checked objects from the savedObjects array
  //     for (let i = savedObjects.length - 1; i >= 0; i--) {
  //       if (savedObjects[i].checked) {
  //           savedObjects.splice(i, 1);
  //       }
  //     }
  
  //     // Reload the current tab to reflect the changes
  //     browser.tabs.reload();
  // }

//   // Create a function to render the form
//   function renderForm(jobs) {
//       // Create a new tab
//       browser.tabs.create({ url: 'about:blank' }, tab => {
//       // Create a new form element
//       const form = document.createElement('form');
//       form.addEventListener('submit', handleSubmit);
  
//       // Add a checkbox for each saved object
//       savedObjects.forEach(object => {
//           const checkbox = document.createElement('input');
//           checkbox.type = 'checkbox';
//           checkbox.checked = object.checked;
  
//           const label = document.createElement('label');
//           label.textContent = object.name;
  
//           const wrapper = document.createElement('div');
//           wrapper.appendChild(checkbox);
//           wrapper.appendChild(label);
//           form.appendChild(wrapper);
  
//           // Update the checked property of the saved object when the checkbox is changed
//           checkbox.addEventListener('change', () => {
//           object.checked = checkbox.checked;
//           });
//       });

//     // Add a submit button
//     const submitButton = document.createElement('button');
//     submitButton.type = 'submit';
//     submitButton.textContent = 'Remove Checked Items';
//     form.appendChild(submitButton);

//     // Inject the form into the new tab
//     browser.tabs.executeScript(tab.id, {
//       code: `document.body.appendChild(${JSON.stringify(form.outerHTML)})`
//     });
//   });
// }

  try {
      // Save jobs in an arrayList(for now)
      if(debugLvl > 0)
      // var jobs = getJobInfo();
      getJobs();
  } catch(e){
      console.log("Error:", e);
  }
  return 1;
})();