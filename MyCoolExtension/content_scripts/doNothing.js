(function() {
    console.log("printing in the doNothing.js")
    var unordered_list = document.getElementsByClassName("scaffold-layout__list-container")[0];
    console.log("unordered_list:", unordered_list)
    var list_items = unordered_list.getElementsByClassName("jobs-search-results__list-item");
    for(var i = 0; i < list_items.length; i++){
        var title = list_items[i].getElementsByClassName("job-card-list__title")[0].textContent;
        title = title.replace(/^\s+|\s+$/gm,'');
        console.log("i:", i, ", list_items[i].title:", title);
    }
    return 1;
})();