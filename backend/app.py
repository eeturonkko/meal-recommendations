import sqlite3
from datetime import datetime, timedelta
from flask import Flask, request, jsonify

app = Flask(__name__)
DATABASE = "foods.db"

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS foods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            food_name TEXT NOT NULL,
            eaten_date DATE NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

@app.route("/add_food", methods=["POST"])
def add_food():
    data = request.get_json()
    food_name = data.get("food_name")
    eaten_date = data.get("eaten_date")

    if not food_name or not eaten_date:
        return jsonify({"error": "Missing food_name or eaten_date"}), 400

    try:
        datetime.strptime(eaten_date, "%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "Incorrect date format, should be YYYY-MM-DD"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO foods (food_name, eaten_date) VALUES (?, ?)",
                   (food_name, eaten_date))
    conn.commit()
    conn.close()
    return jsonify({"message": "Food entry added successfully"}), 201

@app.route("/recommend_foods", methods=["GET"])
def recommend_foods():
    conn = get_db_connection()
    cursor = conn.cursor()

    fourteen_days_ago = datetime.now().date() - timedelta(days=14)

    cursor.execute("""
        SELECT food_name, MAX(eaten_date) as last_eaten_date
        FROM foods
        GROUP BY food_name
        HAVING last_eaten_date <= ?
    """, (fourteen_days_ago,))

    foods = cursor.fetchall()
    conn.close()

    recommendations = [dict(food) for food in foods]

    return jsonify({"recommendations": recommendations}), 200
  
@app.route("/all_foods", methods=["GET"])
def all_foods():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM foods")
    foods = cursor.fetchall()
    conn.close()

    all_foods = [dict(food) for food in foods]

    return jsonify({"all_foods": all_foods}), 200

@app.route("/delete_all_foods", methods=["DELETE"])
def delete_all_foods():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM foods")
    conn.commit()
    conn.close()

    return jsonify({"message": "All food entries deleted successfully"}), 200
  
@app.route("/delete_food_by_id", methods=["DELETE"])
def delete_food_by_id():
    data = request.get_json()
    print("Received data for deletion:", data)  # Log the data to check what is received

    food_id = data.get("id")
    
    if not food_id:
        return jsonify({"error": "Missing id"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM foods WHERE id=?", (food_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Food entry deleted successfully"}), 200

  
if __name__ == "__main__":
    app.run(debug=True)
