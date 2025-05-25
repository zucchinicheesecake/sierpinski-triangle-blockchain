# Sierpinski Triangle Blockchain White Paper

## 1. Introduction

The Sierpinski Triangle Blockchain is a novel blockchain architecture inspired by fractal geometry, specifically the Sierpinski triangle. This approach leverages a triangular ledger data structure and fractal subdivision to create a scalable, self-similar blockchain system. The goal is to explore new ways of organizing blockchain data and consensus mechanisms using geometric and fractal principles.

## 2. Architecture

### Triangular Ledger Data Structure

The core data structure is a triangular matrix ledger composed of interconnected triangle cells. Each cell represents a transaction and contains:

- A transaction hash
- References to parent triangles (previous transactions)
- Pointers to child triangles (subsequent transactions)
- Geometric coordinates defining the triangle vertices

The ledger begins with a genesis triangle and grows by subdividing existing triangles into smaller sub-triangles, following the Sierpinski subdivision rules. This fractal subdivision allows the ledger to expand in a self-similar manner, maintaining geometric and topological consistency.

### Triangle Cells and Fractal Subdivision

Each new row in the ledger is formed by subdividing triangles from the previous row. The subdivision process calculates new geometric coordinates for the smaller triangles and establishes parent-child relationships between triangles across rows. This structure supports efficient referencing and validation of transactions.

## 3. Mining Algorithm

### Fractal Splitting Proof-of-Work

Mining in the Sierpinski Triangle Blockchain is based on a fractal splitting proof-of-work algorithm. The miner selects a base triangle and recursively subdivides it into three sub-triangles. For each nonce, the miner hashes the geometric properties of each sub-triangle combined with the nonce, then combines these hashes into a final hash.

A valid proof-of-work requires the final hash to have a specified number of leading zeros (difficulty). The miner iterates through nonces until a valid hash is found or a maximum nonce limit is reached.

### Mining Process

- Select the base triangle coordinates from the ledger.
- Generate three sub-triangles by subdivision.
- For each nonce, hash the sub-triangles' coordinates and combine the hashes.
- Check if the combined hash meets the difficulty target.
- Upon success, return the valid hash, nonce, and sub-triangles.

## 4. Consensus Protocol

### Fractal Consensus Mechanism

The consensus protocol uses a triangle-based voting system where nodes cast votes on the validity of triangles identified by their coordinates. The protocol features:

- Majority voting to validate triangles.
- Self-similar validation requiring all sub-triangles of a triangle to be validated.
- Byzantine fault tolerance through geometric redundancy, accepting triangles with more than two-thirds positive votes.

Validated triangles are tracked to ensure consistency and prevent double-spending or invalid transactions.

## 5. Validation

### Transaction and Triangle Validation

Validation ensures the integrity and consistency of transactions and triangle cells by checking:

- Transaction hash format and integrity.
- Existence and correctness of parent references.
- Validity of geometric coordinates (structure and data types).

This rigorous validation process maintains the security and correctness of the blockchain ledger.

## 6. Node Operation

### BlockchainNode Class Overview

The BlockchainNode class represents a network node that integrates the ledger, miner, consensus, and validator components. Key functionalities include:

- Running a mining loop in a separate thread to continuously mine new blocks.
- Receiving and adding new transactions to the ledger.
- Casting votes for new triangles in the consensus protocol.
- Validating the entire ledger to ensure transaction integrity.

### Mining Loop and Transaction Handling

The node mines on the last triangle in the ledger, adds new rows with mined transactions, and participates in consensus voting. It also supports receiving external transactions and validating the ledger state.

## 7. Conclusion

The Sierpinski Triangle Blockchain presents an innovative approach to blockchain design by leveraging fractal geometry and self-similar structures. This architecture offers potential benefits in scalability, fault tolerance, and data organization. Future work may explore optimization of mining algorithms, enhanced consensus mechanisms, and practical deployment scenarios.

---

*This white paper provides a comprehensive overview of the Sierpinski Triangle Blockchain project based on the current implementation and design.*
