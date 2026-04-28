import json
import random
from datetime import datetime, timezone, timedelta

# Center of Bengaluru
BASE_LAT = 12.9716
BASE_LNG = 77.5946

def generate_mock_cases(num_cases=20):
    cases = []
    
    scenarios = [
        {"text": "Massive pileup on the outer ring road", "signals": ["accident", "bleeding"], "score": 8, "severity": "HIGH"},
        {"text": "My grandfather is not breathing", "signals": ["breathing", "unconscious"], "score": 10, "severity": "CRITICAL"},
        {"text": "Small kitchen fire, contained but need help", "signals": ["fire"], "score": 5, "severity": "MEDIUM"},
        {"text": "Fell off scooter, leg is definitely fractured", "signals": ["fracture"], "score": 4, "severity": "MEDIUM"},
        {"text": "Building collapse, people trapped", "signals": ["accident", "unconscious", "bleeding"], "score": 10, "severity": "CRITICAL"},
        {"text": "Minor fender bender, traffic blocked", "signals": [], "score": 1, "severity": "LOW"}
    ]

    for i in range(num_cases):
        scenario = random.choice(scenarios)
        
        # Spread the pins wider across all of Bengaluru
        lat = round(BASE_LAT + random.uniform(-0.15, 0.15), 6)
        lng = round(BASE_LNG + random.uniform(-0.15, 0.15), 6)
        
        # Create timestamps from the last 30 minutes
        past_time = datetime.now(timezone.utc) - timedelta(minutes=random.randint(1, 30))
        
        case = {
            "case_id": f"case_{random.randint(1000, 9999)}",
            "timestamp": past_time.isoformat(),
            "input": {
                "input_mode": random.choice(["voice", "button"]),
                "raw_text": scenario["text"],
                "selected_signals": [] if scenario["signals"] else ["accident"]
            },
            "processed": {
                "signals": scenario["signals"],
                "score": scenario["score"],
                "severity": scenario["severity"],
                "reason": f"Detected critical keywords"
            },
            "location": {
                "lat": lat,
                "lng": lng
            },
            "status": random.choice(["pending", "pending", "dispatched"]), # Mostly pending for the demo
            "confidence": round(random.uniform(0.75, 0.99), 2)
        }
        cases.append(case)

    # Write to a JSON file
    with open('mock_cases.json', 'w') as f:
        json.dump(cases, f, indent=2)
    print(f"✅ Successfully generated mock_cases.json with {num_cases} realistic emergencies.")

if __name__ == "__main__":
    generate_mock_cases(25)