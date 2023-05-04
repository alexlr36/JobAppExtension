document.getElementById('myHeading').style.color = 'red'

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
    document.addEventListener("click", (e) => {

        if (e.target.tagName !== "BUTTON") {
            // Ignore when click is not on a button within <div id="popup-content">.
            console.log("in the click event listener. Attempting to filter and parse users");
            return;
        } else {
            console.log("In the non-button clicker button button tagName is: " + e.target.tagName);
        }
    });
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