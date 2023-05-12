(function() {

    function getJobInfo(){
        jobs = [];
        // Dig into jobs section
        var unordered_list = document.getElementsByClassName("scaffold-layout__list-container")[0];
        console.log("unordered_list:", unordered_list);
        var list_items = unordered_list.getElementsByClassName("jobs-search-results__list-item");

        for(var i = 0; i < list_items.length; i++){
            var job_values = {};
            k = 0;
            for(const j in classnames){
                console.log("classnames[j]:", classnames[j]);
                var job_item = list_items[i].getElementsByClassName(classnames[j])[0].textContent;
                job_item.trim();
                job_item = job_item.replace(/^\s+|\s+$/gm,'');
                job_values[k] = job_item;
                k++;
                console.log("job_item:", job_item);
            };
            // var title = list_items[i].getElementsByClassName(classnames.job_title_class)[0].textContent;
            // var company = list_items[i].getElementsByClassName(classnames.job_company_class)[0].textContent;
            // var location = list_items[i].getElementsByClassName(classnames.job_location_class)[0].textContent;
            var description = " "; // description empty for now. Will need to go in an parse data eventually.
            var logo = list_items[i].getElementsByClassName(job_image_src_class)[0].src;
            logo = logo.replace(/^\s+|\s+$/gm,'');
            job_values[k] = description;
            job_values[k+1] = logo;
            // appened to jobs list
            jobs[i] = job_values
            console.log("i:", i, ", jobs:", jobs);
        }
        return jobs;
    }
    // Current names for the classes connected to jobs in linkedin.
    // making these vars since linkedin will probably change them eventually.
    var job_image_src_class = "evi-image";
    var classnames = {
        job_title_class: "job-card-list__title", 
        job_company_class: "job-card-container__primary-description",
        job_location_class: "job-card-container__metadata-item"
        //job_image_src_class: "evi-image"
    };
    try {
        // Save jobs in an arrayList(for now)
        var jobs = getJobInfo();
    } catch(e){
        console.log("Error:", e);
    }
    return 1;
})();