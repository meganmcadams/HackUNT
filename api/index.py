from flask import Flask, render_template, request, jsonify, session
from _utils.Node import Node
from _utils.search import get_coords
import json

# Initialize Flask app
app = Flask(__name__)
app.config["SECRET_KEY"] = "verysecret"

# PAGES
def page(template, kargs = {}): # used to not have to include all of the default parameters
    return render_template(template, **kargs)

@app.route('/')
def page_index():
    return page('home.html', {"show_schedule": True})

@app.route('/route', methods=["GET"])
def route():
    start_room = request.args.get("start_room")
    end_room = request.args.get("end_room")
    bathroom = request.args.get("bathroom",False)
    try:
        if session['elevator'] == True:
            paths = get_coords(start_room, end_room, elevators=True, bathroom=bathroom)
        else:
            paths = get_coords(start_room, end_room, elevators=False, bathroom=bathroom)
    except KeyError:
        paths = get_coords(start_room, end_room, elevators=False, bathroom=bathroom)

    print("PATHS:",len(paths))
    print(paths)

    print("RESULT:",paths["1"] == paths["2"])
    return jsonify({"paths": paths})

@app.route('/update_classes', methods=["POST"])
def update_classes():
    classes = json.loads(request.get_data().decode('utf-8'))
    session['classes'] = classes # store in session
    return {"message": "good"}

@app.route('/update_elevator', methods=["POST"])
def update_elevator():
    elevator = str(request.get_data())
    session['elevator'] = "true" in elevator
    return {"message": "good"}

@app.route('/load_classes', methods=["GET"])
def load_classes():
    print("Loaded", session.get('classes', []))
    return jsonify({"classes": session.get('classes', [])})

@app.route('/load_elevator', methods=["GET"])
def load_elevator():
    print("Loaded elevator:",session.get('elevator', False))
    return jsonify({"elevator": session.get('elevator', False)})

@app.route('/classes/')
def page_classes():
    return page('classes.html')

@app.route('/professors/')
def page_profs():
    return page('prof.html')

# TESTING
#'''
if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 2020))
    app.run(debug=True, threaded=False, host='0.0.0.0', port=port)
#'''
