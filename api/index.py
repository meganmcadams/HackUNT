from flask import Flask, render_template

# Initialize Flask app
app = Flask(__name__)
app.config["SECRET_KEY"] = "verysecret"

# PAGES
def page(template, kargs = {}): # used to not have to include all of the default parameters
    return render_template(template, **kargs)

@app.route('/')
def page_index():
    return page('home.html')

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
