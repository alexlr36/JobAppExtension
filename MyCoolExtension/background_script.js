// Put all the javascript code here, that you want to execute in background.
let jobLst = [];

function simplePrint(message){
    // const job = { title, company, location, description };
    var end_of_list = message.eol;
    if(end_of_list == 'true'){
        show_data_in_new_browser();
    }
    else {
        console.log(`in the simple print background function, message.currJob.title:${message.currJob.title}, message.currJob.company:${message.currJob.company}, message.currJob.location:${message.currJob.location}`);
        jobLst.push(message.currJob);
    }
    
    // console.log(`message.url send is: ${message.url}`);
    // console.log(`message.currJob.title send is: ${message.currJob.title}`);
}

function show_data_in_new_browser(){
    console.log("in the background, show_data_in_new_browser function");
}
browser.runtime.onMessage.addListener(simplePrint);