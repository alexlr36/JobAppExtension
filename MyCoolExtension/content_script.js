// Put all the javascript code here, that you want to execute after page load.
// console.log("yoo");
//   async function getJobInfo(){
//       const jobs = [];
//       console.log("yo");
//       // Select the job listings container
//       const jobListContainer = document.querySelector('.jobs-search-results-list');
      
//       // Select all the job listings
//       const jobListings = jobListContainer.querySelectorAll('li');
      
//       // Loop through each job listing
//       jobListings.forEach(jobListing => {
//         // Extract the job title
//         const titleElement = jobListing.querySelector('.job-card-list__title');
//         const title = titleElement ? titleElement.textContent.trim() : '';
//         if(title == "") {
//           return;
//           }
//         // Extract the company name
//         const companyElement = jobListing.querySelector('.job-card-container__primary-description');
//         const company = companyElement ? companyElement.textContent.trim() : '';
      
//         // Extract the job location
//         const locationElement = jobListing.querySelector('.job-card-container__metadata-item');
//         const location = locationElement ? locationElement.textContent.trim() : '';
      
//         // Wait for the description to load
//         setTimeout(() => {
//           // Simulate a click event on the job listing to load the description
//           jobListing.click();
//           // Extract the job description
//           const descriptionElement = document.querySelector('.jobs-description-content__text');
//           const description = descriptionElement ? descriptionElement.textContent.trim() : '';
      
//           // Create a job object and add it to the jobs array
//           const job = {
//             title,
//             company,
//             location,
//             description
//           };
//           jobs.push(job);
      
//           // Log the jobs array to the console
//           console.log(job);
//         }, 5000); // Wait for 2 seconds for the description to load
//       });

//       browser.runtime.sendMessage({"allJobs": jobs});
//       // browser.runtime.onMessage.addListener(handleMessage);
//       // renderForm(jobs);
//       return jobs;
//   }

// try {
//     // Save jobs in an arrayList(for now)
//     console.log("yooo");
//     var jobs = getJobInfo();
// } catch(e){
//     console.log("Error:", e);
// }
var jobList  = [];

function clickOnJobApp(jobID){
    // Select the job listings container
    const jobListContainer = document.querySelector('.jobs-search-results-list');
    // Select all the job listings
    // Every job has 4 'li' items on linkedin
    const jobListings = jobListContainer.querySelectorAll('li');
    // click on job from list
    jobListings[jobID].click();

}

// This will probably be empty for awhile. Let other auto application
// apps do this for now.
function applyForJob(){

}

browser.runtime.onMessage.addListener((request) => {
    console.log("Message from the background script:", request.jobs, ", request.jobsID:", request.jobID, ", request.reload:", request.reload, ", jobList:", jobList);
    // add jobs to list for later
    if(jobList == undefined) jobList = request.jobs;
    if(request.jobs != undefined) jobList = request.jobs;
    console.log("jobList:", jobList);
    if(request.reload == true && jobList != undefined && jobList.length > 0){
        console.log("in the reload function");
        return Promise.resolve({ jobs: jobList });
    }
    clickOnJobApp(request.jobID * 4);
    applyForJob();
    console.log("sending promise.");
    return Promise.resolve({ response: "Hi from content script", jobs: []});
  });