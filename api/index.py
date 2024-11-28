from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)

# Run pip install -r requirements.txt 

db_config = {
    'host': 'bm9tdg40dssnnlouyokd-mysql.services.clever-cloud.com',
    'user': 'u6x7wgtppwajpn9i',
    'password': 'iMP6tWwa9eyS6uVF7yFb',
    'database': 'bm9tdg40dssnnlouyokd'
}

def get_db_connection():
    connection = pymysql.connect(**db_config)
    return connection

@app.route('/', methods=['GET'])
def api_greet():
    return jsonify({"msg": "Hello from the API"})

@app.route('/api/heroes', methods=['POST'])
def create_user():
    new_user = request.json
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO heroes (nombre, habilidad, compania, genero, descripcion, imagen) VALUES (%s, %s, %s, %s, %s, %s)", (new_user['nombre'], new_user['habilidad'], new_user['compania'], new_user['genero'], new_user['descripcion'], new_user['imagen']))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"msg": "New user created", "user": new_user}), 201

@app.route('/api/heroes')
def get_all():
    connection = get_db_connection()
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    cursor.execute("SELECT * FROM heroes")
    heroes = cursor.fetchall()
    cursor.close()
    connection.close()

    return jsonify(heroes)

@app.route('/api/heroes/<int:id>', methods=['GET'])
def get_hero(id):
    connection = get_db_connection()
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    cursor.execute("SELECT * FROM heroes WHERE id = %s", (id,))
    hero = cursor.fetchone()
    cursor.close()
    connection.close()
    
    if hero:
        return jsonify(hero), 200
    else:
        return jsonify({"msg": "Héroe no encontrado"}), 404


@app.route('/api/heroes/<int:id>', methods=['PUT'])
def update_hero(id):
    updated_data = request.json
    connection = get_db_connection()
    cursor = connection.cursor()

    sql = """
    UPDATE heroes 
    SET nombre = %s, habilidad = %s, compania = %s, genero = %s, descripcion = %s
    WHERE id = %s
    """
    cursor.execute(sql, (updated_data['nombre'], updated_data['habilidad'], updated_data['compania'], updated_data['genero'], updated_data['descripcion'], id))
    connection.commit()
    cursor.close()
    connection.close()

    return jsonify({"msg": "Héroe actualizado exitosamente"}), 200



@app.route('/api/heroes/<int:id>', methods=['DELETE'])
def eliminar_heroe(id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM heroes WHERE id = %s", (id,))
    connection.commit()
    cursor.close()
    return jsonify({'message': 'Héroe eliminado exitosamente'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
