@app.route("/track/<email_id>")
def track(email_id):
    ip_real = request.headers.get('X-Forwarded-For', request.remote_addr)
    registro = {
        "email_id": email_id,
        "timestamp": datetime.datetime.now().isoformat(),
        "ip": ip_real
    }
    registros.append(registro)
    print(f"👁️  Mail abierto: {registro}")

    pixel = bytes([
        71,73,70,56,57,97,1,0,1,0,128,0,0,
        0,0,0,255,255,255,33,249,4,0,0,0,0,
        0,44,0,0,0,0,1,0,1,0,0,2,2,68,1,0,59
    ])
    return send_file(io.BytesIO(pixel), mimetype="image/gif")