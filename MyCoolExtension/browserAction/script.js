document.getElementById('myHeading').style.color = 'red'

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
var counter = 0;
var arr_values = ["no values"];
var responseWeights = 0;
function listenForClicks() {
    document.addEventListener("click", (e) => {

        if (e.target.tagName !== "BUTTON") {
            // Ignore when click is not on a button within <div id="popup-content">.
            console.log("in the click event listener. Attempting to filter and parse users");
            console.log("name is:" + e.target.tagName + ", value" + e.target.value);
            return;
        } else {
            if(e.target.value == 'yes'){
                findItems();
            }
            console.log("In the non-button clicker button button tagName is: " + e.target.tagName + ", value:" + e.target.value, ", counter:" + counter);
        }
    });
}
/**
 * Finds items in the list. Then parses them accordingly.
 */
function findItems(){
    var unordered_list = document.getElementsByClassName("scaffold-layout__list-container")[0];
    // var list_items = document.getElementsByClassName("jobs-search-results__list-item");
    // for(var i = 0; i < list_items.length; i++){
    //     console.log("i:", i, ", list_items[i]:", list_items[i]);
    // }
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
    document.querySelector("#content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    // document.querySelector("#error-content").textContent += "Error is:"+error.message;
    console.error(`Failed to execute beastify content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "/content_scripts/doNothing.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);