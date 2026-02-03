
try:
    from qiskit_aer import AerSimulator
    sim = AerSimulator()
    print("AerSimulator works")
except Exception as e:
    print(f"Error: {e}")
