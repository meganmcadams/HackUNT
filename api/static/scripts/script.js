function update_elevator(elevator = false) {
    console.log("Updating to",elevator);
    fetch(`/update_elevator`, {method: "POST", body: elevator})
        .then(response => response)
        .catch(error => {
            console.error('Error:', error);
            return;
        });
}

function route(start_room = null, end_room = null) {
    clearScreen();
    if (start_room == null) {
        var start_room = document.getElementById("start_room").value;
        var end_room = document.getElementById('end_room').value;
    }

    fetch(`/route?start_room=${start_room}&end_room=${end_room}`)
        .then(response => response.json())
        .then(data => {
            if (data.paths == null) {
                console.log("Error: data.path is null");
                return;
            }
            // handle
            console.log(data.paths);
            let paths = data.paths;
            for (let i = 1; i <= 2; i++) {
                index = String(i)
                for (let j = 1; j < paths[index].length; j++) {
                    console.log("Drawing a line");
                    drawLine(index, paths[index][j - 1][0], paths[index][j - 1][1], paths[index][j][0], paths[index][j][1]);
                }

                if (paths[index].length > 0) {
                

                    console.log("Drawing circles");

                    let can = document.getElementById('canvas' + index);
                    let ctx = can.getContext('2d');
        
                    ctx.beginPath();
                    ctx.strokeStyle = "#e63a3a";
                    ctx.lineWidth = 9;
                    console.log(paths[index]);
                    ctx.arc(paths[index][0][0], paths[index][0][1], 4, 0, 2 * Math.PI);
                    ctx.stroke();
        
                    ctx.beginPath();
                    ctx.strokeStyle = "#7eb5e8";
                    ctx.arc(paths[index][paths[i].length-1][0], paths[index][paths[i].length-1][1], 4, 0, 2 * Math.PI);
                    ctx.stroke(); 

                }

            }
        })

        .catch(error => {
            console.error('Error:', error);
            return;
        });
    
}

function close_alert(id) {
    let element = document.getElementById(id);
    element.style.display = "none";
}
function open_alert(id) {
    let element = document.getElementById(id);
    element.style.display = "";
}

function clearScreen() {
    let can1 = document.getElementById('canvas1');
    let ctx1 = can1.getContext('2d');
    ctx1.clearRect (0, 0, can1.width, can1.height);
    let can2 = document.getElementById('canvas2');
    let ctx2 = can2.getContext('2d');
    ctx2.clearRect (0, 0, can2.width, can2.height);
}

function schedule() {
    console.log("Scheduling");
    clearScreen();
    for (let i = 0; i < classes.length - 1; i++) {
        route(classes[i]['location'], classes[i + 1]['location']);
        console.log("Routed for",classes[i]['location'],"to",classes[i + 1]['location']);
    }
}

function drawLine(index, x, y, stopX, stopY) {
    //ctx.clearRect (0, 0, can.width, can.height);

    let can = document.getElementById('canvas' + index);
    console.log("Drawing on",can);
    let ctx = can.getContext('2d');
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(stopX, stopY);
    ctx.closePath();
    ctx.stroke();
}

function toggle_stairs() {
    stairs = false;
    if (document.getElementById('yes_stairs').checked) {
        stairs = true;
    } else {
        stairs = false;
    }
    update_elevator(!stairs);
}

var stairs = true;
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
            }
        })
        .catch(error => {
            console.error('Error:', error);
            return;
        });

        fetch(`/load_elevator`)
        .then(response => response.json())
        .then(data => {
            if (data.elevator != null) {
                var elevator = data.elevator;
                console.log("Set",elevator);
                document.getElementById('yes_stairs').checked = !elevator;
                document.getElementById('no_stairs').checked = elevator;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            return;
        });

        toggle_stairs();
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