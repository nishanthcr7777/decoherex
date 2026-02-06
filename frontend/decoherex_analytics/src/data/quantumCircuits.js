/**
 * Quantum Circuit Templates Library
 * Expanded collection of 20+ quantum algorithms and circuits
 */

export const quantumCircuits = [
  // ===== BASIC QUANTUM CIRCUITS =====
  {
    id: 'bell-state',
    name: 'Bell State Preparation',
    category: 'Entanglement',
    difficulty: 'Beginner',
    qubits: 2,
    description: 'Creates a maximally entangled Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2',
    code: `from qiskit import QuantumCircuit

# Create Bell State
qc = QuantumCircuit(2, 2)
qc.h(0)  # Hadamard on qubit 0
qc.cx(0, 1)  # CNOT with control=0, target=1
qc.measure([0, 1], [0, 1])`,
    expectedResults: 'Equal probability of measuring |00⟩ and |11⟩',
    applications: ['Quantum teleportation', 'Superdense coding', 'Quantum cryptography']
  },

  {
    id: 'ghz-state',
    name: 'GHZ State (3-qubit)',
    category: 'Entanglement',
    difficulty: 'Beginner',
    qubits: 3,
    description: 'Creates a 3-qubit GHZ state |GHZ⟩ = (|000⟩ + |111⟩)/√2',
    code: `from qiskit import QuantumCircuit

# Create GHZ State
qc = QuantumCircuit(3, 3)
qc.h(0)
qc.cx(0, 1)
qc.cx(0, 2)
qc.measure([0, 1, 2], [0, 1, 2])`,
    expectedResults: 'Equal probability of |000⟩ and |111⟩',
    applications: ['Quantum error correction', 'Multipartite entanglement studies']
  },

  {
    id: 'qrng',
    name: 'Quantum Random Number Generator',
    category: 'Random Number Generation',
    difficulty: 'Beginner',
    qubits: 4,
    description: 'Generates truly random numbers using quantum superposition',
    code: `from qiskit import QuantumCircuit

# Quantum Random Number Generator
qc = QuantumCircuit(4, 4)
# Apply Hadamard to all qubits for superposition
for i in range(4):
    qc.h(i)
qc.measure([0, 1, 2, 3], [0, 1, 2, 3])`,
    expectedResults: 'Uniform distribution across all 16 possible outcomes',
    applications: ['Cryptography', 'Monte Carlo simulations', 'Gaming']
  },

  // ===== QUANTUM ALGORITHMS =====
  {
    id: 'deutsch-jozsa',
    name: 'Deutsch-Jozsa Algorithm',
    category: 'Quantum Algorithms',
    difficulty: 'Intermediate',
    qubits: 3,
    description: 'Determines if a function is constant or balanced in one query',
    code: `from qiskit import QuantumCircuit

# Deutsch-Jozsa Algorithm
qc = QuantumCircuit(3, 2)
# Initialize
qc.x(2)  # Flip ancilla qubit
qc.h([0, 1, 2])  # Hadamard on all qubits

# Oracle (balanced function example)
qc.cx(0, 2)
qc.cx(1, 2)

# Final Hadamards
qc.h([0, 1])
qc.measure([0, 1], [0, 1])`,
    expectedResults: 'Non-zero result indicates balanced function',
    applications: ['Function classification', 'Quantum speedup demonstration']
  },

  {
    id: 'bernstein-vazirani',
    name: 'Bernstein-Vazirani Algorithm',
    category: 'Quantum Algorithms',
    difficulty: 'Intermediate',
    qubits: 4,
    description: 'Finds hidden binary string in one query',
    code: `from qiskit import QuantumCircuit

# Bernstein-Vazirani (hidden string = 101)
qc = QuantumCircuit(4, 3)
qc.x(3)
qc.h([0, 1, 2, 3])

# Oracle for hidden string 101
qc.cx(0, 3)
qc.cx(2, 3)

qc.h([0, 1, 2])
qc.measure([0, 1, 2], [0, 1, 2])`,
    expectedResults: 'Measurement reveals hidden string directly',
    applications: ['Pattern recognition', 'Database queries']
  },

  {
    id: 'grover-search',
    name: "Grover's Search Algorithm",
    category: 'Quantum Algorithms',
    difficulty: 'Advanced',
    qubits: 3,
    description: 'Searches unsorted database with quadratic speedup',
    code: `from qiskit import QuantumCircuit
import numpy as np

# Grover's Algorithm (search for |111⟩)
qc = QuantumCircuit(3, 3)

# Initialize superposition
qc.h([0, 1, 2])

# Grover iteration
# Oracle (mark |111⟩)
qc.ccx(0, 1, 2)
qc.z(2)
qc.ccx(0, 1, 2)

# Diffusion operator
qc.h([0, 1, 2])
qc.x([0, 1, 2])
qc.ccx(0, 1, 2)
qc.z(2)
qc.ccx(0, 1, 2)
qc.x([0, 1, 2])
qc.h([0, 1, 2])

qc.measure([0, 1, 2], [0, 1, 2])`,
    expectedResults: 'High probability of measuring |111⟩',
    applications: ['Database search', 'Optimization problems']
  },

  // ===== QUANTUM COMMUNICATION =====
  {
    id: 'quantum-teleportation',
    name: 'Quantum Teleportation',
    category: 'Quantum Communication',
    difficulty: 'Advanced',
    qubits: 3,
    description: 'Teleports quantum state from Alice to Bob',
    code: `from qiskit import QuantumCircuit

# Quantum Teleportation
qc = QuantumCircuit(3, 3)

# Prepare state to teleport (|+⟩)
qc.h(0)

# Create Bell pair between Alice and Bob
qc.h(1)
qc.cx(1, 2)

# Alice's operations
qc.cx(0, 1)
qc.h(0)
qc.measure([0, 1], [0, 1])

# Bob's corrections (controlled on measurements)
qc.cx(1, 2)
qc.cz(0, 2)
qc.measure(2, 2)`,
    expectedResults: 'State successfully teleported to qubit 2',
    applications: ['Quantum networks', 'Distributed quantum computing']
  },

  {
    id: 'superdense-coding',
    name: 'Superdense Coding',
    category: 'Quantum Communication',
    difficulty: 'Intermediate',
    qubits: 2,
    description: 'Sends 2 classical bits using 1 qubit',
    code: `from qiskit import QuantumCircuit

# Superdense Coding (send "11")
qc = QuantumCircuit(2, 2)

# Create Bell pair
qc.h(0)
qc.cx(0, 1)

# Encode message "11"
qc.z(0)
qc.x(0)

# Decode
qc.cx(0, 1)
qc.h(0)
qc.measure([0, 1], [0, 1])`,
    expectedResults: 'Measurement reveals encoded message',
    applications: ['Quantum communication', 'Information theory']
  },

  // ===== QUANTUM TRANSFORMS =====
  {
    id: 'qft-3qubit',
    name: 'Quantum Fourier Transform (3-qubit)',
    category: 'Quantum Transforms',
    difficulty: 'Advanced',
    qubits: 3,
    description: 'Quantum version of discrete Fourier transform',
    code: `from qiskit import QuantumCircuit
import numpy as np

# 3-qubit QFT
qc = QuantumCircuit(3, 3)

# QFT circuit
qc.h(2)
qc.cp(np.pi/2, 1, 2)
qc.cp(np.pi/4, 0, 2)
qc.h(1)
qc.cp(np.pi/2, 0, 1)
qc.h(0)

# Swap qubits
qc.swap(0, 2)

qc.measure([0, 1, 2], [0, 1, 2])`,
    expectedResults: 'Fourier-transformed quantum state',
    applications: ["Shor's algorithm", 'Phase estimation', 'Quantum signal processing']
  },

  {
    id: 'inverse-qft',
    name: 'Inverse QFT (3-qubit)',
    category: 'Quantum Transforms',
    difficulty: 'Advanced',
    qubits: 3,
    description: 'Inverse of Quantum Fourier Transform',
    code: `from qiskit import QuantumCircuit
import numpy as np

# Inverse QFT
qc = QuantumCircuit(3, 3)

# Swap first
qc.swap(0, 2)

# Inverse QFT gates
qc.h(0)
qc.cp(-np.pi/2, 0, 1)
qc.h(1)
qc.cp(-np.pi/4, 0, 2)
qc.cp(-np.pi/2, 1, 2)
qc.h(2)

qc.measure([0, 1, 2], [0, 1, 2])`,
    expectedResults: 'Original state recovered',
    applications: ['Phase estimation', 'Quantum algorithms']
  },

  // ===== VARIATIONAL ALGORITHMS =====
  {
    id: 'vqe-h2',
    name: 'VQE for H₂ Molecule',
    category: 'Variational Algorithms',
    difficulty: 'Expert',
    qubits: 2,
    description: 'Finds ground state energy of hydrogen molecule',
    code: `from qiskit import QuantumCircuit
import numpy as np

# VQE ansatz for H2
qc = QuantumCircuit(2, 2)

# Parameterized circuit
theta = np.pi/4  # Variational parameter
qc.ry(theta, 0)
qc.ry(theta, 1)
qc.cx(0, 1)

qc.measure([0, 1], [0, 1])`,
    expectedResults: 'Energy expectation value',
    applications: ['Quantum chemistry', 'Material science', 'Drug discovery']
  },

  {
    id: 'qaoa-maxcut',
    name: 'QAOA for MaxCut',
    category: 'Variational Algorithms',
    difficulty: 'Expert',
    qubits: 3,
    description: 'Solves MaxCut optimization problem',
    code: `from qiskit import QuantumCircuit
import numpy as np

# QAOA for 3-node MaxCut
qc = QuantumCircuit(3, 3)

# Initialize superposition
qc.h([0, 1, 2])

# Problem Hamiltonian (gamma = pi/4)
gamma = np.pi/4
qc.rzz(2*gamma, 0, 1)
qc.rzz(2*gamma, 1, 2)

# Mixer Hamiltonian (beta = pi/4)
beta = np.pi/4
qc.rx(2*beta, 0)
qc.rx(2*beta, 1)
qc.rx(2*beta, 2)

qc.measure([0, 1, 2], [0, 1, 2])`,
    expectedResults: 'Approximate MaxCut solution',
    applications: ['Optimization', 'Graph problems', 'Logistics']
  },

  // ===== QUANTUM ERROR CORRECTION =====
  {
    id: 'bit-flip-code',
    name: '3-Qubit Bit Flip Code',
    category: 'Error Correction',
    difficulty: 'Advanced',
    qubits: 3,
    description: 'Protects against single bit-flip errors',
    code: `from qiskit import QuantumCircuit

# Bit flip error correction
qc = QuantumCircuit(3, 3)

# Encode logical |0⟩
qc.cx(0, 1)
qc.cx(0, 2)

# Simulate error on qubit 1
qc.x(1)

# Error detection
qc.cx(0, 1)
qc.cx(0, 2)
qc.ccx(1, 2, 0)

qc.measure([0, 1, 2], [0, 1, 2])`,
    expectedResults: 'Error detected and corrected',
    applications: ['Fault-tolerant quantum computing', 'Quantum memory']
  },

  // ===== QUANTUM TESTS =====
  {
    id: 'hadamard-test',
    name: 'Hadamard Test',
    category: 'Quantum Tests',
    difficulty: 'Intermediate',
    qubits: 2,
    description: 'Estimates expectation value of unitary operator',
    code: `from qiskit import QuantumCircuit

# Hadamard Test
qc = QuantumCircuit(2, 1)

# Prepare ancilla
qc.h(0)

# Controlled-U (using CZ as example)
qc.cz(0, 1)

# Final Hadamard and measure
qc.h(0)
qc.measure(0, 0)`,
    expectedResults: 'Probability encodes expectation value',
    applications: ['Quantum algorithms', 'Operator estimation']
  },

  {
    id: 'swap-test',
    name: 'SWAP Test',
    category: 'Quantum Tests',
    difficulty: 'Intermediate',
    qubits: 3,
    description: 'Compares similarity of two quantum states',
    code: `from qiskit import QuantumCircuit

# SWAP Test
qc = QuantumCircuit(3, 1)

# Prepare states to compare
qc.h(1)  # |+⟩
qc.h(2)  # |+⟩

# SWAP test circuit
qc.h(0)
qc.cswap(0, 1, 2)
qc.h(0)
qc.measure(0, 0)`,
    expectedResults: 'Probability indicates state overlap',
    applications: ['State comparison', 'Machine learning']
  },

  // ===== ADVANCED CIRCUITS =====
  {
    id: 'phase-estimation',
    name: 'Quantum Phase Estimation',
    category: 'Advanced Algorithms',
    difficulty: 'Expert',
    qubits: 4,
    description: 'Estimates eigenvalue phase of unitary operator',
    code: `from qiskit import QuantumCircuit
import numpy as np

# Phase Estimation
qc = QuantumCircuit(4, 3)

# Initialize eigenstate
qc.x(3)

# Hadamards on counting qubits
qc.h([0, 1, 2])

# Controlled-U operations
for i in range(3):
    for _ in range(2**i):
        qc.cp(np.pi/4, i, 3)

# Inverse QFT on counting qubits
qc.swap(0, 2)
qc.h(0)
qc.cp(-np.pi/2, 0, 1)
qc.h(1)
qc.cp(-np.pi/4, 0, 2)
qc.cp(-np.pi/2, 1, 2)
qc.h(2)

qc.measure([0, 1, 2], [0, 1, 2])`,
    expectedResults: 'Binary representation of phase',
    applications: ["Shor's algorithm", 'Quantum chemistry']
  },

  {
    id: 'amplitude-amplification',
    name: 'Amplitude Amplification',
    category: 'Advanced Algorithms',
    difficulty: 'Advanced',
    qubits: 2,
    description: 'Amplifies amplitude of target state',
    code: `from qiskit import QuantumCircuit

# Amplitude Amplification
qc = QuantumCircuit(2, 2)

# Initialize
qc.h([0, 1])

# Oracle (mark |11⟩)
qc.cz(0, 1)

# Diffusion
qc.h([0, 1])
qc.x([0, 1])
qc.cz(0, 1)
qc.x([0, 1])
qc.h([0, 1])

qc.measure([0, 1], [0, 1])`,
    expectedResults: 'Amplified probability of target state',
    applications: ['Search algorithms', 'Optimization']
  },

  {
    id: 'quantum-walk',
    name: 'Quantum Walk (Line)',
    category: 'Quantum Walks',
    difficulty: 'Advanced',
    qubits: 3,
    description: 'Quantum random walk on a line',
    code: `from qiskit import QuantumCircuit

# Quantum Walk
qc = QuantumCircuit(3, 3)

# Initialize coin qubit
qc.h(0)

# Walk steps
for _ in range(2):
    # Coin flip
    qc.h(0)
    # Conditional shift
    qc.cx(0, 1)
    qc.x(0)
    qc.cx(0, 2)
    qc.x(0)

qc.measure([0, 1, 2], [0, 1, 2])`,
    expectedResults: 'Quantum interference pattern',
    applications: ['Graph algorithms', 'Quantum simulation']
  },

  // ===== SPECIAL STATES =====
  {
    id: 'w-state',
    name: 'W State (3-qubit)',
    category: 'Entanglement',
    difficulty: 'Intermediate',
    qubits: 3,
    description: 'Creates W state |W⟩ = (|100⟩ + |010⟩ + |001⟩)/√3',
    code: `from qiskit import QuantumCircuit
import numpy as np

# W State preparation
qc = QuantumCircuit(3, 3)

# Prepare W state
qc.ry(2*np.arccos(np.sqrt(2/3)), 0)
qc.ch(0, 1)
qc.x(0)
qc.ch(0, 2)
qc.x(0)

qc.measure([0, 1, 2], [0, 1, 2])`,
    expectedResults: 'Equal superposition of single-excitation states',
    applications: ['Quantum networks', 'Multipartite entanglement']
  },

  {
    id: 'cat-state',
    name: 'Cat State (4-qubit)',
    category: 'Entanglement',
    difficulty: 'Intermediate',
    qubits: 4,
    description: 'Creates cat state (|0000⟩ + |1111⟩)/√2',
    code: `from qiskit import QuantumCircuit

# Cat State
qc = QuantumCircuit(4, 4)

qc.h(0)
qc.cx(0, 1)
qc.cx(0, 2)
qc.cx(0, 3)

qc.measure([0, 1, 2, 3], [0, 1, 2, 3])`,
    expectedResults: 'Superposition of all-0 and all-1',
    applications: ['Quantum metrology', 'Quantum sensing']
  }
];

// Helper function to get circuits by category
export const getCircuitsByCategory = (category) => {
  return quantumCircuits.filter(circuit => circuit.category === category);
};

// Helper function to get circuits by difficulty
export const getCircuitsByDifficulty = (difficulty) => {
  return quantumCircuits.filter(circuit => circuit.difficulty === difficulty);
};

// Get all categories
export const getCategories = () => {
  return [...new Set(quantumCircuits.map(c => c.category))];
};

// Get all difficulty levels
export const getDifficultyLevels = () => {
  return ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
};
