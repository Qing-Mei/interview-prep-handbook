# Coding Interview Checklist: Process, Constraints, and Common Pitfalls

For algorithm interviews and study-group mock interviews. Select the checks that matter for the problem instead of asking every question mechanically.

## 1. Before Coding: Understand, Clarify, and Plan

- [ ] **Restate the goal**: identify the input and whether to return values, indices, a count, a path, or modify the input in place. <!-- task:check-001 -->
- [ ] Clarify whether to return one answer or all answers, and whether ordering or deduplication matters. <!-- task:check-002 -->
- [ ] **Clarify key constraints**: input size, value range, sortedness, duplicates, and negative values. <!-- task:check-003 -->
- [ ] Check whether input mutation and extra space are allowed, and whether original indices or order must be preserved. <!-- task:check-004 -->
- [ ] Ask whether a solution is guaranteed and what to return if none exists. <!-- task:check-005 -->
- [ ] Determine whether there is one query or many, and whether the data changes between queries. <!-- task:check-006 -->
- [ ] Clarify relevant details such as interval endpoints, character set, graph direction, and edge weights. <!-- task:check-007 -->
- [ ] **Clarify edge cases**: empty input, a single element, zeros, duplicates, and equality rules. <!-- task:check-008 -->
- [ ] Use a small example with an expected output if it helps resolve ambiguity. <!-- task:check-009 -->
- [ ] **Explain the approach**: when useful, outline a direct solution and its complexity, identify the bottleneck, and explain the optimization. <!-- task:check-010 -->
- [ ] Describe what the data structures do and the main algorithm steps. <!-- task:check-011 -->
- [ ] **Explain correctness**: what is the state or invariant? Why are no answers missed? Why is moving a pointer, pruning, or discarding a candidate safe? <!-- task:check-012 -->
- [ ] Define variables such as `n` and `m`, then give time and auxiliary-space complexity. <!-- task:check-013 -->
- [ ] Briefly check alignment and start implementing if the interviewer has no objections. <!-- task:check-014 -->

### Notes

- You do not need to force two approaches or implement brute force first.
- Do not repeat constraints that are already explicit; ask questions that affect understanding or implementation.
- Ask about critical uncertainties; state reasonable assumptions for minor details.
- Do not just name “sliding window.” Explain what the window represents and when it shrinks.
- Explain why the algorithm works before coding, not just its name.
- Avoid repeatedly asking permission or waiting for a formal “go ahead.”

## 2. How Constraints Affect Algorithm Choice

**Constraints primarily guide algorithm selection. Edge cases help verify implementation and test assumptions.**

| Constraint / condition | Effect on the approach | Watch out for |
| --- | --- | --- |
| Input size | Assess enumeration, brute force, sorting, or linear algorithms | Include total input across test cases and output size |
| Sorted array | Binary search or two pointers may apply | Explain why discarding candidates is safe |
| Unsorted array | Consider hashing or sorting first | Sorting costs time and may destroy original order |
| Preserve original indices | Hashing, or sort `(value, index)` pairs | Sorted indices are not original indices |
| Cannot mutate input | Avoid direct in-place sorting or marking | Copying requires extra space |
| Duplicate values | Frequency maps and deduplication rules may be needed | A set does not represent multiplicity |
| Nonnegative elements | Sliding windows may solve certain sum-threshold problems | Expanding cannot decrease the sum; shrinking cannot increase it |
| Negative values allowed | Sum-based window monotonicity may fail | Consider prefix sums with hashing, monotonic queues, or other suitable methods |
| Count contiguous subarrays with sum `k` | Prefix sums with a frequency map | Store counts of previous prefix sums, not just existence |
| Small integer domain | Counting arrays, buckets, or difference arrays | Space depends on the domain, not just element count |
| Large or sparse coordinates | Hashing, sorting, or coordinate compression | Compression preserves order, not actual distances automatically |
| Small fixed alphabet | Array-based character counts | A dictionary can handle a more general alphabet |
| One query | A direct scan may be sufficient | Preprocessing may not pay off |
| Static data, many range-sum queries | Prefix sums | `O(n)` preprocessing and `O(1)` per query |
| Point updates and range sums | Fenwick tree or segment tree | Updating ordinary prefix sums is expensive |
| Streaming data or limited memory | Online algorithms or bounded heaps | Do not assume all data can be stored and sorted |
| Return all answers | Enumeration, deduplication, and output-sensitive analysis | Output can be quadratic or exponential |
| Binary search on the answer | Requires a monotonic feasibility predicate | A numeric answer alone does not justify binary search |
| Equal nonnegative edge costs | BFS can find shortest paths | Fewest edges corresponds to minimum total cost |
| Nonnegative edge weights | Dijkstra is an option | Ordinary BFS does not solve general weighted shortest paths |
| Negative edges | Consider Bellman–Ford or another suitable algorithm | Relevant negative cycles may make a shortest path undefined |
| Graph may contain cycles | Use visited flags or traversal states as appropriate | Directed-cycle detection distinguishes active and completed nodes |
| Binary search tree | Ordering can support pruning | An ordinary binary tree does not have this guarantee |
| Contiguous subarray vs. noncontiguous subsequence | Different candidate structures often need different algorithms | Windows and prefix sums often help subarrays; DP and greedy may help subsequences |

> Negative values do not invalidate all sliding windows. A window with at most k distinct values does not depend on numeric signs. Algorithm choice depends on the complete problem.

### Typical Input Sizes and Complexity

These are **rough screening guidelines, not runtime guarantees**. Assume `n` is the main input size. Feasibility also depends on time limits, language, constants, data structures, test cases, and the actual work per operation.

| Typical input size | Complexity to consider | Candidate approaches | Key considerations |
| --- | --- | --- | --- |
| `n ≤ 8–10` | `O(n!)` may be feasible | Permutation enumeration and backtracking | `10! ≈ 3.63 million`; multiply by `n` if each permutation is scanned or copied |
| Around `n ≤ 20` | `O(2ⁿ)`; evaluate `O(n·2ⁿ)` carefully | Subset enumeration, backtracking, bitmask DP | `2²⁰ ≈ 1.05 million`; multiplying by `n` gives about 21 million operations, potentially costly in Python |
| `n ≈ 30–40` | Consider roughly `O(2^(n/2))` | Meet-in-the-middle | The problem must split suitably; sorting, matching, and storage add costs |
| `n ≈ 100` | `O(n³)` may be a candidate | Interval DP, Floyd–Warshall, triple enumeration | `100³ = 1 million`; account for work per iteration |
| `n ≈ 300–500` | Prefer `O(n²)`; be careful with cubic work | Two-dimensional DP and pair enumeration | `500³ = 125 million`; pure Python triple loops are usually risky |
| `n ≈ 1,000–3,000` | `O(n²)` may be feasible | Two-dimensional DP, pair comparisons, endpoint enumeration | `3,000² = 9 million`; estimate both time and table memory |
| `n ≈ 10⁴` | Prefer `O(n log n)` or `O(n)` | Sorting, heaps, binary search, hashing, two pointers | `n² = 100 million`; do not assume quadratic work will pass |
| `n ≈ 10⁵–2×10⁵` | Usually `O(n log n)` or `O(n)` | Sorting with greedy, heaps, Fenwick trees, segment trees, linear scans | Quadratic work is generally unsuitable; check hidden copying and rescanning |
| `n ≈ 10⁶` | Prefer `O(n)`; `O(n log n)` depends on context | Linear scans, counting, two pointers, efficient sorting | Memory, object counts, I/O, and constants matter more |
| `n ≈ 10⁷` or larger | Low-constant linear work, or exploit structure to avoid enumeration | Streaming, formulas, blocking, bit operations | Reading an explicit input of `n` elements already takes `Ω(n)` |
| Values up to `10⁹–10¹⁸`, but few elements | Analyze element count and numeric bit length; `O(log U)` or `O(√U)` may apply | Binary search on answers, fast exponentiation, Euclid's algorithm, number theory | The numeric bound `U` is not the array length; it does not automatically require `O(log n)` |

**How to use the table:** rule out clearly unsuitable approaches, then choose based on problem structure. Seeing `n = 10⁵` does not by itself imply a sliding window or greedy solution.

### Multiple Dimensions: Do Not Look Only at n

| Input structure | Total cost to estimate | Example |
| --- | --- | --- |
| An `m × n` matrix | One full traversal is `O(mn)` | A `1,000 × 1,000` matrix has one million cells |
| A graph with `V` vertices and `E` edges | Adjacency-list BFS / DFS is `O(V + E)` | A dense graph can have `O(V²)` edges; an adjacency matrix uses `O(V²)` space |
| Strings of lengths `m` and `n` | Common two-dimensional DP costs `O(mn)` | Two strings of length 5,000 produce 25 million states |
| `q` queries, each scanning `n` items | `O(qn)` total time | If both are `10⁵`, there are about ten billion visits; consider preprocessing |
| 0/1 knapsack with capacity `W` | Classic DP costs `O(nW)` | With `n = 100` and `W = 10⁹`, a direct capacity table is unsuitable |
| `T` test cases | Sum actual costs across cases | Quadratic processing costs `Σ nᵢ²`; check total-input constraints |
| Strings used as hash keys | Include string construction, length, and hashing | Slicing a substring of length `k` is not an overall `O(1)` operation |
| Return every combination or permutation | Include output creation, copying, and storage | Explicitly returning all subsets has worst-case total output size `Θ(n·2ⁿ)` |

### Feasible Time Does Not Imply Feasible Space

- Quadratic time can be acceptable while a full `n × n` table exceeds memory. Consider rolling arrays or computing states on demand.
- Python lists, dictionaries, sets, and integer objects have overhead; do not assume four bytes per element.
- Recursion depth depends on the runtime. Even linear-time processing of a long chain can exceed the stack limit.
- There is no universal operations-per-second rule. Python loops, built-in sorting, hashing, and string copying have different costs.
- Numeric algorithms also need overflow and large-integer cost analysis.

### Example Interview Explanations

> “With up to 100,000 elements, a quadratic approach would require on the order of ten billion operations. I’d look for an O(n log n) or O(n) solution.”

> “There are only 20 elements, so enumerating subsets may be feasible. I’ll also account for the work done per subset and the memory needed.”

Additional constraint checks:

- [ ] Distinguish element count, numeric bounds, dimensions, and query count. <!-- task:check-015 -->
- [ ] Estimate operations at the maximum input size. <!-- task:check-016 -->
- [ ] Include transitions, scans, copies, and output work per state. <!-- task:check-017 -->
- [ ] Evaluate time and memory rather than relying only on asymptotic notation. <!-- task:check-018 -->

### Clarification Examples

> “Can the array contain negative numbers? If all values are nonnegative, expanding the window never decreases the sum, which lets us use a sliding window for this threshold condition. With negative values, that reasoning would no longer hold.”

> “Will the array change between queries? If it stays unchanged, I can build prefix sums for constant-time range-sum queries. If updates are required, I’d consider a Fenwick tree.”

## 3. During Coding: Implement Clearly and Explain Decisions

- [ ] Make the function signature, parameters, and return value clear. <!-- task:check-019 -->
- [ ] Use meaningful names and a straightforward structure. <!-- task:check-020 -->
- [ ] Keep the implementation consistent with the proposed approach. <!-- task:check-021 -->
- [ ] Initialize answers, pointers, counters, and state correctly. <!-- task:check-022 -->
- [ ] Perform necessary bounds checks before accessing data. <!-- task:check-023 -->
- [ ] Update state in the correct order. <!-- task:check-024 -->
- [ ] Ensure loops make progress and recursion terminates. <!-- task:check-025 -->
- [ ] Extract helpers when useful without overengineering. <!-- task:check-026 -->
- [ ] Explain important decisions, state changes, and invariants. <!-- task:check-027 -->
- [ ] Explain why the approach needs to change before modifying it. <!-- task:check-028 -->

### Notes

- **Explain the logic instead of narrating every line.**
- Brief pauses to think are fine; you do not need to talk continuously.
- If stuck, describe the specific difficulty and the hypothesis you are checking.
- After a hint, explain how it changes or supports your approach.
- Prefer understandable, verifiable code over the shortest code.

Examples:

> “The window is invalid now, so I’ll move the left boundary until it satisfies the constraint again.”

> “Let me think through the boundary condition for a moment.”

## 4. After Coding: Review, Trace, Test, and Fix

- [ ] **Review quickly**: indices, loop ranges, comparisons, initialization, and update order. <!-- task:check-029 -->
- [ ] Check return values, no-solution cases, and final cleanup after loops. <!-- task:check-030 -->
- [ ] Check for incorrectly reusing the same element. <!-- task:check-031 -->
- [ ] **Trace the actual code on a normal example**, tracking key variables and major branches. <!-- task:check-032 -->
- [ ] Compare the actual result with the expected result. <!-- task:check-033 -->
- [ ] **Test targeted edge cases**: smallest valid input, duplicates, zeros, no solution, or an answer at the end. <!-- task:check-034 -->
- [ ] **Close the debugging loop**: failing case → root cause → fix → retest. <!-- task:check-035 -->
- [ ] Check other branches affected by the fix when necessary. <!-- task:check-036 -->
- [ ] Run tests if execution is available; determine expected results first. <!-- task:check-037 -->

### Notes

- Tracing code is not the same as repeating the algorithm explanation.
- Do not test only the examples supplied in the problem.
- Explain why a change works instead of repeatedly guessing conditions.
- Passing tests does not replace correctness or complexity analysis.
- You do not need every possible edge case; select cases that challenge this implementation.

## 5. Edge Cases and What to Check

| Edge case | What to check |
| --- | --- |
| Empty input | Accesses to `nums[0]` or `matrix[0]`, extrema of empty collections; handle only if allowed |
| One element | Initialization and return values when loops do not execute |
| Two elements | Pointer meeting conditions and the last comparison |
| Duplicates / all equal | Lost counts, duplicate answers, and equality handling |
| Zero values | Mistaking `0` for missing data, or dividing by zero |
| No solution | Return the agreed value, not an untouched sentinel |
| Answer at the beginning | Initialization includes the first position |
| Answer at the end | Final processing after the loop is not missing |
| All valid / all invalid | Whole-input answers, empty results, and shrinking logic |
| Equal interval endpoints | Closed intervals `[1,2]` and `[2,3]` overlap; half-open intervals `[1,2)` and `[2,3)` do not |
| Equal priorities | Secondary ordering, such as smallest room number |
| Single-row / single-column matrix | Duplicate visits after changing direction |
| Extreme values | Overflow, sentinel choices, and safe comparisons |
| Deep tree / long graph chain | Excessive recursion depth and whether an explicit stack is needed |
| Disconnected graph | Whether traversal must start from every unvisited component |

## 6. Algorithm-Specific Checks

| Algorithm | Explain | Common mistakes |
| --- | --- | --- |
| Two pointers | Why each move cannot miss an answer | Direction, equality, reusing an element |
| Sliding window | Window meaning, validity, answer update timing | Unsynchronized counts; incorrect `if` versus `while` |
| Binary search | Interval definition and elimination rule | Inconsistent bounds, nonshrinking intervals, infinite loops |
| Prefix sums + hashing | Which historical state is queried | Initial prefix sum, query/insert order, counts versus existence |
| DFS / backtracking | Choices at each level and termination | Missing state restoration or copying of results |
| BFS | Queue meaning, levels, or distance rules | Marking visited too late in ordinary BFS, causing duplicate enqueues |
| Heap | Meaning of the top and push/pop timing | Empty access, ordering fields, tie-breaking |
| DP | State, transitions, base cases, evaluation order | Indices, unreachable states, overwriting old values after compression |
| Greedy | Why the local choice is safe | Intuition without a correctness argument |
| Intervals | Sort key and overlap definition | Equal endpoints and missing the final interval |
| Linked list | Pointer relationships before and after changes | Losing the remaining chain, null access, accidental cycles |

## 7. Wrap-up and Follow-ups

- [ ] Confirm time complexity from the final implementation. <!-- task:check-038 -->
- [ ] Account for auxiliary space, including recursion, slices, copies, and sorting. <!-- task:check-039 -->
- [ ] State output space separately when relevant. <!-- task:check-040 -->
- [ ] Explain whether the input is modified. <!-- task:check-041 -->
- [ ] Discuss meaningful optimizations and their tradeoffs if any remain. <!-- task:check-042 -->
- [ ] Clarify new follow-up requirements before identifying what changes in the original approach. <!-- task:check-043 -->
- [ ] Explain the revised approach and complexity, then modify code as requested. <!-- task:check-044 -->

### Complexity Notes

- Nested loops are not always quadratic; count total operations.
- Stack space depends on maximum simultaneous recursion depth and data retained per frame.
- Python slicing and copying allocate additional space.
- In-place sorting does not imply constant auxiliary memory for the sorting algorithm.
- Hash operations are typically analyzed as average `O(1)`; state the assumption.
- Include output size when returning all results.
- If the approach is already appropriately optimal, explain why rather than forcing another optimization.

### Common Follow-ups

- Input becomes a stream or no longer fits in memory.
- The same data must support many queries.
- Updates are allowed between queries.
- Input mutation or extra space is restricted.
- All answers must be returned.
- The input is sorted or has a small value domain.

Sequence: **clarify the change → assess the original approach → explain an adjustment and tradeoffs → implement as requested.**

## 8. Compact Mock Interview Checklist

### Before Coding

- [ ] Restate the goal and clarify inputs and outputs. <!-- task:check-045 -->
- [ ] Identify relevant constraints and screen complexity against maximum input size. <!-- task:check-046 -->
- [ ] Clarify key edge cases and equality rules. <!-- task:check-047 -->
- [ ] Use an example to resolve ambiguity if needed. <!-- task:check-048 -->
- [ ] Outline a direct solution and its bottleneck. <!-- task:check-049 -->
- [ ] Explain the optimized approach and data structures. <!-- task:check-050 -->
- [ ] Explain correctness or the invariant. <!-- task:check-051 -->
- [ ] Give time and auxiliary-space complexity. <!-- task:check-052 -->
- [ ] Briefly check alignment and start coding. <!-- task:check-053 -->

### During Coding

- [ ] Use clear names and a straightforward structure. <!-- task:check-054 -->
- [ ] Explain important logic and decisions. <!-- task:check-055 -->
- [ ] Get initialization, boundaries, and update order right. <!-- task:check-056 -->
- [ ] Ensure loops progress and recursion terminates. <!-- task:check-057 -->
- [ ] Explain changes of approach or specific difficulties. <!-- task:check-058 -->

### After Coding

- [ ] Review indices, conditions, returns, and final cleanup. <!-- task:check-059 -->
- [ ] Trace the actual code with a normal example. <!-- task:check-060 -->
- [ ] Test the smallest input and targeted edge cases. <!-- task:check-061 -->
- [ ] Locate bugs → fix → retest. <!-- task:check-062 -->
- [ ] Confirm final complexity and input mutation. <!-- task:check-063 -->
- [ ] Discuss meaningful optimizations and tradeoffs. <!-- task:check-064 -->
- [ ] Follow-up: clarify changes → analyze → modify. <!-- task:check-065 -->

## 9. Time Allocation and Review

For one main problem with about 30 minutes, the following is a flexible practice guide:

| Stage | Suggested time |
| --- | --- |
| Understand the problem and constraints | 3 minutes |
| Approach, correctness, and complexity | 4 minutes |
| Implementation | 15 minutes |
| Verification and fixes | 5 minutes |
| Wrap-up and follow-ups | 3 minutes |

For multiple problems, shorten each discussion appropriately but still reserve time for verification.

Use the following dimensions for self-review; this is not an official company scoring rubric:

- **Problem Solving**: understanding the problem, identifying constraints, and deriving an approach.
- **Correctness**: correct algorithm and implementation, with a clear justification.
- **Communication**: clear explanations and productive responses to hints.
- **DSA & Complexity**: appropriate data structures and accurate complexity analysis.
- **Code Quality**: naming, structure, readability, and maintainability.
- **Testing & Debugging**: targeted tests and effective diagnosis and fixes.
- **Time Management**: balancing discussion, implementation, and verification.

Practice priorities: **explainable reasoning, correct code, and meaningful verification; then improve speed.**
