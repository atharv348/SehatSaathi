from database import engine, Base, Prediction
from sqlalchemy import inspect, text

def update_schema():
    inspector = inspect(engine)
    columns = [col['name'] for col in inspector.get_columns('predictions')]
    
    if 'ai_advice' not in columns:
        print("Adding 'ai_advice' column to 'predictions' table...")
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE predictions ADD COLUMN ai_advice TEXT"))
            conn.commit()
        print("Column added successfully.")
    else:
        print("Column 'ai_advice' already exists.")

if __name__ == "__main__":
    update_schema()
