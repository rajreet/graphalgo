from flask import *

app= Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/dfs")
def dfs():
    return render_template("dfs.html")

@app.route("/bfs")
def bfs():
    return render_template("bfs.html")

@app.route("/djikstra")
def djikstra():
    return render_template("djikstra.html")

@app.route("/tsort")
def tsort():
    return render_template("tsort.html")

if __name__ == "__main__":
    app.run()