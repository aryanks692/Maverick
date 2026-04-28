# Omni-Triage 🚑

## 🔥 Problem

Emergency situations often suffer from delayed response due to lack of rapid and structured triage from bystanders to operators.

## 💡 Solution

Omni-Triage is a system that captures emergency input (voice/text), extracts key signals, classifies severity, and lays the foundation for intelligent resource decision-making in emergency scenarios.

## ⚙️ Current Progress (Checkpoint 1)

* Backend server setup (Node.js + Express)
* Keyword-based signal extraction
* Severity scoring system
* Basic API for reporting emergency cases

## 🧪 Sample

POST /report

Input:
{
"text": "he is not breathing"
}

Output:
{
"severity": "CRITICAL",
"signals": ["not_breathing"]
}

## 🚀 Next Steps

* Intelligent resource allocation based on severity
* Real-time tracking and updates
* Adaptive decision logic for dynamic scenarios

## 👥 Team

* Backend
* Frontend
* Database
* Dashboard
