import sys
from os.path import dirname, abspath
sys.path.append(dirname(abspath(__file__)))

from app.models.database import SessionLocal, engine, Base
from app.models.entities import User, UserRole, Driver, DemandZone, Trip, AIRecommendation
from app.core.security import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # Seed Users
        driver_user = db.query(User).filter(User.email == "alex.morgan@rideai.nyc").first()
        if not driver_user:
            driver_user = User(
                id="user-driver-001",
                name="Alex Morgan",
                email="alex.morgan@rideai.nyc",
                password_hash=get_password_hash("driver123"),
                role=UserRole.DRIVER,
                is_active=True
            )
            db.add(driver_user)
            print("Seeded User: Driver (alex.morgan@rideai.nyc)")
        else:
            driver_user.password_hash = get_password_hash("driver123")
            driver_user.role = UserRole.DRIVER

        admin_user = db.query(User).filter(User.email == "admin@rideai.nyc").first()
        if not admin_user:
            admin_user = User(
                id="user-admin-001",
                name="Ride AI Administrator",
                email="admin@rideai.nyc",
                password_hash=get_password_hash("admin123"),
                role=UserRole.ADMIN,
                is_active=True
            )
            db.add(admin_user)
            print("Seeded User: Admin (admin@rideai.nyc)")
        else:
            admin_user.password_hash = get_password_hash("admin123")
            admin_user.role = UserRole.ADMIN

        # Check if driver already exists
        existing_driver = db.query(Driver).filter(Driver.id == "driver-001").first()
        if not existing_driver:
            driver = Driver(
                id="driver-001",
                name="Alex Morgan",
                email="alex.morgan@rideai.nyc",
                rating=4.92,
                total_trips=1284,
                total_earnings=7480.00,
                acceptance_rate=97.0,
                cancellation_rate=2.0
            )
            db.add(driver)
            print("Seeded driver: Alex Morgan")
        else:
            existing_driver.name = "Alex Morgan"
            existing_driver.email = "alex.morgan@rideai.nyc"
            existing_driver.rating = 4.92
            existing_driver.total_trips = 1284
            existing_driver.total_earnings = 7480.00
            existing_driver.acceptance_rate = 97.0
            existing_driver.cancellation_rate = 2.0

        # Seed NYC Demand Zones
        zones_data = [
            ("Midtown Manhattan", 40.7549, -73.9840, 94.5, "up", 1.65),
            ("JFK Airport (JFK)", 40.6413, -73.7781, 88.0, "up", 1.8),
            ("Financial District", 40.7075, -74.0089, 82.0, "up", 1.4),
            ("Grand Central Terminal", 40.7527, -73.9772, 85.0, "up", 1.5),
            ("Williamsburg", 40.7081, -73.9571, 72.0, "flat", 1.2),
            ("Lower Manhattan", 40.7128, -74.0060, 68.0, "up", 1.1),
            ("Upper East Side", 40.7736, -73.9566, 64.0, "flat", 1.1),
            ("LaGuardia Airport (LGA)", 40.7769, -73.8740, 58.0, "down", 1.0)
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
