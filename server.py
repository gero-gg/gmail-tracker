from flask import Flask, request, send_file
import io
import datetime

app = Flask(__name__)

registros = []  # por ahora guardamos en memoria, después lo mejoramos

@app.route("/track/<email_id>")
def track(email_id):
    registro = {
        "email_id": email_id,
        "timestamp": datetime.datetime.now().isoformat(),
        "ip": request.remote_addr
    }
    registros.append(registro)
    print(f"👁️  Mail abierto: {registro}")

    # Devuelve una imagen 1x1 transparente
    pixel = bytes([
        71,73,70,56,57,97,1,0,1,0,128,0,0,
        0,0,0,255,255,255,33,249,4,0,0,0,0,
        0,44,0,0,0,0,1,0,1,0,0,2,2,68,1,0,59
    ])
    return send_file(io.BytesIO(pixel), mimetype="image/gif")

@app.route("/registros")
def ver_registros():
    return {"registros": registros}

if __name__ == "__main__":
    app.run(port=5000, debug=True)