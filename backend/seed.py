import sys
from os.path import dirname, abspath
sys.path.append(dirname(abspath(__file__)))

from app.models.database import SessionLocal, engine, Base
from app.models.entities import Driver, DemandZone, Trip, AIRecommendation

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # Check if driver already exists
        existing_driver = db.query(Driver).filter(Driver.email == "e.operations@rideai.internal").first()
        if not existing_driver:
            driver = Driver(
                id="driver-001",
                name="E. Operations",
                email="e.operations@rideai.internal",
                rating=4.96,
                total_trips=1284,
                total_earnings=14250.00,
                acceptance_rate=98.0,
                cancellation_rate=1.2
            )
            db.add(driver)
            print("Seeded driver: E. Operations")

        # Seed Demand Zones
        zones_data = [
            ("Financial District", 40.7075, -74.0089, 94.5, "up", 1.4),
            ("Airports (JFK / LGA)", 40.6413, -73.7781, 88.0, "up", 1.65),
            ("Midtown Core", 40.7549, -73.9840, 72.0, "flat", 1.2),
            ("Williamsburg", 40.7081, -73.9571, 64.0, "up", 1.1),
            ("SoHo / Tribeca", 40.7233, -74.0030, 58.0, "down", 1.0)
        ]
        
        for name, lat, lng, score, trend, surge in zones_data:
            existing_zone = db.query(DemandZone).filter(DemandZone.zone_name == name).first()
            if not existing_zone:
                z = DemandZone(
                    zone_name=name,
                    lat=lat,
                    lng=lng,
                    demand_score=score,
                    trend=trend,
                    surge_multiplier=surge
                )
                db.add(z)
                print(f"Seeded demand zone: {name}")

        db.commit()
        print("Database seeding completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Seeding failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
