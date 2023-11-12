function close_alert(id) {
    let element = document.getElementById(id);
    element.style.display = "none";
}
function open_alert(id) {
    let element = document.getElementById(id);
    element.style.display = "";
}

function schedule() {
    for (let i = 0; i < classes.length - 1; i++) {
        route(classes[i]['location'], classes[i + 1]['location']);
        console.log("Routed for",classes[i]);
    }
}

var classes = Array();
var loaded = false;

window.addEventListener("load", () => {
    if (!loaded) {
    fetch(`/load_classes`)
        .then(response => response.json())
        .then(data => {
            console.log("Got", data.classes);
            if (data.classes != null) {
                classes = data.classes;
                console.log("Set",classes);
                let div = document.getElementById('form_content');
                let add_button = document.getElementById('add_button');
                for (let i = 0; i < classes.length; i++) {
                    div.insertBefore(create_class(i, classes[i]['name'], classes[i]['location'], push = false), add_button);
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            return;
        });
    }
    
    loaded = true;
});

function add_class(element) {
    if (classes.length == 0) {
        var num = 0;
    } else {
        var num = classes.length;
    }
    let div = element.parentElement;
    div.insertBefore(create_class(num), element);
    update_classes();
}

function delete_class(element) {
    var num = element.parentElement.previousElementSibling.children[0].name;
    num = Number(num.replace('location', '').replace('class', ''));
    element.parentElement.parentElement.parentElement.remove();
    classes = classes.splice(num, 1); // remove from classes array
    mass_update_numbers();
    update_classes();
}

function mass_update_numbers() {
    let div = document.getElementById('form_content');
    let length = div.children.length - 1; // exclude the add button
    for (let i = 0; i < length; i++) { // for each child
        div.children[i].children[0].innerHTML = "Class " + String(i);
        div.children[i].children[1].children[0].children[0].setAttribute('name', 'child' + String(i) + 'name');
        div.children[i].children[1].children[1].children[0].setAttribute('name', 'child' + String(i) + 'location');
    }
}

function create_class(num, name = "", location = "", push = true) {
    if (push) {
        classes.push({"name": name, "location": location});
    }
    let newElement = document.getElementById('example').cloneNode(true);
    newElement.id = "";
    newElement.children[0].innerHTML = "Class " + String(num);
    newElement.children[1].children[0].children[0].setAttribute('name', 'class' + String(num) + "name");
    newElement.children[1].children[0].children[0].value = name;
    newElement.children[1].children[0].children[0].setAttribute('onblur', 'update_input(this);');
    newElement.children[1].children[1].children[0].setAttribute('name', 'class' + String(num) + "location");
    newElement.children[1].children[1].children[0].value = location;
    newElement.children[1].children[1].children[0].setAttribute('onblur', 'update_input(this);');
    return newElement;
}

function update_classes() {
    fetch(`/update_classes`, {method: "POST", body:JSON.stringify(classes)})
        .then(response => response)
        .catch(error => {
            console.error('Error:', error);
            return;
        });
}

function update_input(input) {
    let id = input.getAttribute('name');
    if (id.includes("name")) {
        var num = Number(id.replace('class', '').replace('name', ''));
        classes[num]['name'] = input.value;
    } else {
        var num = Number(id.replace('class', '').replace('location', ''));
        classes[num]['location'] = input.value;
    }
    console.log(input.value);
    console.log(classes);
    update_classes();
}