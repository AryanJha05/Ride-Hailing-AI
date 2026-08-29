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
        # Seed Users
        driver_user = db.query(User).filter(User.email == "aryan.jha@rideai.nyc").first()
        if not driver_user:
            driver_user = User(
                id="user-driver-001",
                name="Aryan Jha",
                email="aryan.jha@rideai.nyc",
                password_hash=get_password_hash("driver123"),
                role=UserRole.DRIVER,
                is_active=True
            )
            db.add(driver_user)
            print("Seeded User: Driver (aryan.jha@rideai.nyc)")
        else:
            driver_user.name = "Aryan Jha"
            driver_user.email = "aryan.jha@rideai.nyc"
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
                user_id=driver_user.id,
                driver_id="NYC-DRV-001",
                name="Aryan Jha",
                email="aryan.jha@rideai.nyc",
                phone="+1 (555) 234-5678",
                license_number="NYC-TLC-99821",
                vehicle_make="Toyota",
                vehicle_model="Camry Hybrid",
                vehicle_plate="NYC-TLC-7782",
                status="Active",
                rating=4.94,
                total_trips=1284,
                total_earnings=7480.00,
                acceptance_rate=97.0,
                cancellation_rate=2.0
            )
            db.add(driver)
            print("Seeded driver: Aryan Jha")
        else:
            existing_driver.user_id = driver_user.id
            existing_driver.driver_id = "NYC-DRV-001"
            existing_driver.name = "Aryan Jha"
            existing_driver.email = "aryan.jha@rideai.nyc"
            existing_driver.phone = "+1 (555) 234-5678"
            existing_driver.license_number = "NYC-TLC-99821"
            existing_driver.vehicle_make = "Toyota"
            existing_driver.vehicle_model = "Camry Hybrid"
            existing_driver.vehicle_plate = "NYC-TLC-7782"
            existing_driver.status = "Active"
            existing_driver.rating = 4.94
            existing_driver.total_trips = 1284
            existing_driver.total_earnings = 7480.00
            existing_driver.acceptance_rate = 97.0
            existing_driver.cancellation_rate = 2.0

        # Additional NYC Drivers for rich demo UI
        extra_drivers_data = [
            ("driver-002", "Suraj Panigrahi", "suraj.p@rideai.nyc", "+1 (555) 345-6789", "NYC-TLC-88192", "Active", 4.88, 942, 5820.00),
            ("driver-003", "Ananya Singh", "ananya.s@rideai.nyc", "+1 (555) 456-7890", "NYC-TLC-77210", "Offline", 4.96, 1420, 9150.00),
            ("driver-004", "Raghav Singh", "raghav.s@rideai.nyc", "+1 (555) 567-8901", "NYC-TLC-66103", "Active", 4.82, 610, 3940.00),
        ]

        for d_id, name, email, phone, lic, st, rat, trips, earn in extra_drivers_data:
            drv = db.query(Driver).filter(Driver.id == d_id).first()
            if not drv:
                # Create corresponding User account
                u = db.query(User).filter(User.email == email).first()
                if not u:
                    u = User(
                        name=name,
                        email=email,
                        password_hash=get_password_hash("driver123"),
                        role=UserRole.DRIVER,
                        is_active=(st != "Inactive")
                    )
                    db.add(u)
                    db.flush()
                
                new_drv = Driver(
                    id=d_id,
                    user_id=u.id,
                    driver_id=f"NYC-DRV-00{d_id[-1]}",
                    name=name,
                    email=email,
                    phone=phone,
                    license_number=lic,
                    status=st,
                    rating=rat,
                    total_trips=trips,
                    total_earnings=earn
                )
                db.add(new_drv)
                print(f"Seeded driver: {name}")

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
