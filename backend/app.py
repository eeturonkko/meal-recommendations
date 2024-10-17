import sqlite3
from datetime import datetime, timedelta
from flask import Flask, request, jsonify

app = Flask(__name__)
DATABASE = "foods.db"

""" DB INITIALIZATION AND HELPER FUNCTIONS """

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
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS meals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            meal_name TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

"""FOOD API ROUTES """

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
  
@app.route("/last_five_foods", methods=["GET"])
def last_five_foods():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM foods ORDER BY eaten_date DESC LIMIT 5")
    foods = cursor.fetchall()
    conn.close()

    last_five_foods = [dict(food) for food in foods]
  

    return jsonify({"last_five_foods": last_five_foods}), 200

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
    food_id = data.get("id")
    
    if not food_id:
        return jsonify({"error": "Missing id"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM foods WHERE id=?", (food_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Food entry deleted successfully"}), 200
  
"""MEAL API ROUTES """
  
@app.route("/all_meals", methods=["GET"])
def get_all_meals():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM meals")
    meals = cursor.fetchall()
    conn.close()

    all_meals = [dict(meal) for meal in meals]

    return jsonify({"all_meals": all_meals}), 200
  
@app.route("/add_meal", methods=["POST"])
def add_meal():
    data = request.get_json()
    meal_name = data.get("meal_name")

    if not meal_name:
        return jsonify({"error": "Missing meal_name"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO meals (meal_name) VALUES (?)",
                   (meal_name,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Meal added successfully"}), 201
  
@app.route("/delete_meal_by_id", methods=["DELETE"])
def delete_meal_by_id():
    data = request.get_json()
    meal_id = data.get("id")
    
    if not meal_id:
        return jsonify({"error": "Missing id"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM meals WHERE id=?", (meal_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Meal deleted successfully"}), 200
  
if __name__ == "__main__":
    app.run(debug=True)
