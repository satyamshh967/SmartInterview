import re
import math
from collections import Counter

DSA_TERMS = {
    "hash map", "hashmap", "hash table", "hashset", "array", "list", "vector",
    "linked list", "doubly linked list", "stack", "queue", "deque", "priority queue",
    "heap", "min-heap", "max-heap", "binary search", "tree", "binary tree", "bst",
    "graph", "adjacency list", "bfs", "breadth first", "dfs", "depth first",
    "dynamic programming", "memoization", "tabulation", "two pointers", "pointer",
    "sliding window", "greedy", "divide and conquer", "recursion", "recursive",
    "base case", "edge case", "boundary condition", "constraints", "trade-off", "tradeoff",
    "brute force", "optimization", "in-place", "auxiliary space", "bit manipulation",
    "trie", "prefix tree", "disjoint set", "union find", "topological sort", "backtracking"
}

COMPLEXITY_PATTERNS = [
    r"o\s*\(\s*1\s*\)",
    r"o\s*\(\s*n\s*\)",
    r"o\s*\(\s*log\s*n\s*\)",
    r"o\s*\(\s*n\s*log\s*n\s*\)",
    r"o\s*\(\s*n\s*\^?\s*2\s*\)",
    r"o\s*\(\s*n\s*\*\s*m\s*\)",
    r"o\s*\(\s*2\s*\^\s*n\s*\)",
    r"constant\s+time",
    r"linear\s+time",
    r"logarithmic\s+time",
    r"quadratic\s+time",
    r"time\s+complexity",
    r"space\s+complexity",
    r"auxiliary\s+space",
    r"memory\s+complexity"
]

STRUCTURAL_MARKERS = {
    "problem_understanding": ["understand", "input", "output", "given", "assume", "clarify", "constraint", "example"],
    "approach_strategy": ["approach", "first", "strategy", "idea", "algorithm", "solution", "instead of", "brute force"],
    "implementation": ["iterate", "loop", "traverse", "check", "store", "compare", "update", "return", "initialize"],
    "edge_cases": ["edge case", "corner case", "null", "empty", "negative", "overflow", "duplicate", "single element"],
    "complexity_tradeoff": ["complexity", "trade-off", "tradeoff", "optimal", "bottleneck", "faster", "space efficient"]
}

FILLER_WORDS = {
    "um", "uh", "like", "you know", "sort of", "kind of", "i guess", "maybe",
    "basically basically", "literally", "actually actually", "so yeah", "i think maybe"
}

class NLPEvaluator:
    @staticmethod
    def evaluate(transcript: str, problem_context: str = "", code: str = "", time_taken_seconds: int = 0) -> dict:
        if not transcript or not transcript.strip():
            return {
                "overallScore": 0,
                "technicalClarityScore": 0,
                "complexityAwarenessScore": 0,
                "structuralCoherenceScore": 0,
                "verbalConfidenceScore": 0,
                "detectedKeywords": [],
                "complexityIdentified": False,
                "strengths": ["Interview response received"],
                "improvements": ["Please provide a detailed verbal or written explanation of your solution approach, time/space complexity, and edge cases."],
                "wordCount": 0,
                "summary": "No explanation transcript was provided."
            }

        text = transcript.strip()
        lower_text = text.lower()
        words = re.findall(r'\b[a-zA-Z0-9_\-\^]+\b', lower_text)
        word_count = len(words)

        # 1. Technical Clarity & Terminology
        found_terms = set()
        for term in DSA_TERMS:
            if re.search(r'\b' + re.escape(term) + r'\b', lower_text):
                found_terms.add(term)

        term_count = len(found_terms)
        # 10+ terms = 100%, 1 term = ~30%
        technical_score = min(100, int(30 + (term_count * 7))) if term_count > 0 else 25

        # 2. Complexity Awareness
        complexity_matches = []
        for pat in COMPLEXITY_PATTERNS:
            matches = re.findall(pat, lower_text)
            if matches:
                complexity_matches.extend(matches)

        has_time_mention = bool(re.search(r'\btime\b', lower_text))
        has_space_mention = bool(re.search(r'\bspace\b|\bmemory\b', lower_text))
        has_big_o = len(complexity_matches) > 0

        complexity_score = 20
        if has_big_o:
            complexity_score += 40
        if has_time_mention:
            complexity_score += 20
        if has_space_mention:
            complexity_score += 20
        complexity_score = min(100, complexity_score)

        # 3. Structural Coherence (STAR / Structured Problem Solving)
        structure_stages_found = 0
        stage_details = {}
        for stage, markers in STRUCTURAL_MARKERS.items():
            hit = any(marker in lower_text for marker in markers)
            stage_details[stage] = hit
            if hit:
                structure_stages_found += 1

        # 5 stages -> 20 pts each
        structural_score = min(100, structure_stages_found * 20)

        # 4. Verbal Confidence & Filler Ratio
        filler_count = 0
        for filler in FILLER_WORDS:
            filler_count += len(re.findall(r'\b' + re.escape(filler) + r'\b', lower_text))

        filler_ratio = filler_count / max(1, word_count)
        if filler_ratio < 0.02:
            confidence_score = 95
        elif filler_ratio < 0.05:
            confidence_score = 80
        elif filler_ratio < 0.10:
            confidence_score = 65
        else:
            confidence_score = 45

        # Length bonus / penalty
        if word_count < 25:
            confidence_score = max(20, confidence_score - 30)
            structural_score = max(20, structural_score - 30)
            technical_score = max(20, technical_score - 20)
        elif word_count > 80:
            confidence_score = min(100, confidence_score + 5)

        # Overall Composite Score
        overall = int(
            (technical_score * 0.35) +
            (complexity_score * 0.25) +
            (structural_score * 0.25) +
            (confidence_score * 0.15)
        )
        overall = max(0, min(100, overall))

        # Strengths & Improvement recommendations
        strengths = []
        improvements = []

        if term_count >= 4:
            strengths.append(f"Strong algorithmic vocabulary: clearly referenced {', '.join(list(found_terms)[:4])}.")
        elif term_count > 0:
            strengths.append(f"Used relevant technical concepts ({', '.join(list(found_terms))}).")
        else:
            improvements.append("Incorporate specific data structure and algorithmic terms (e.g. hash map, two pointers, traversal, recursion).")

        if has_big_o and has_time_mention and has_space_mention:
            strengths.append("Excellent explicit analysis covering both time and space complexity.")
        elif has_big_o:
            strengths.append("Recognized asymptotic complexity using Big-O notation.")
            if not has_space_mention:
                improvements.append("Remember to state auxiliary space complexity in addition to runtime.")
        else:
            improvements.append("Clearly state Big-O time and space complexity (e.g. 'This solution runs in O(n) time and O(1) space').")

        if stage_details.get("edge_cases"):
            strengths.append("Proactively addressed edge cases and boundary constraints.")
        else:
            improvements.append("Mention potential edge cases explicitly (empty inputs, negative values, single elements).")

        if stage_details.get("approach_strategy"):
            strengths.append("Articulated problem-solving approach clearly before jumping into code.")
        else:
            improvements.append("Structure explanation with clear transitions: first clarify requirements, state approach, then discuss trade-offs.")

        if filler_count == 0 and word_count >= 30:
            strengths.append("Crisp, professional verbal delivery with minimal filler hesitation.")
        elif filler_count > 3:
            improvements.append(f"Detected {filler_count} filler words (e.g. 'um', 'like', 'you know'); practice pausing silently instead of using verbal fillers.")

        # Summary paragraph
        summary = (
            f"Candidate achieved an overall communication score of {overall}/100. "
            f"Demonstrated {technical_score}% technical vocabulary density across {word_count} words. "
            f"{'Covered Big-O complexity accurately.' if has_big_o else 'Needs more focus on asymptotic complexity analysis.'}"
        )

        return {
            "overallScore": overall,
            "technicalClarityScore": technical_score,
            "complexityAwarenessScore": complexity_score,
            "structuralCoherenceScore": structural_score,
            "verbalConfidenceScore": confidence_score,
            "detectedKeywords": sorted(list(found_terms)),
            "complexityIdentified": has_big_o,
            "wordCount": word_count,
            "fillerCount": filler_count,
            "strengths": strengths if strengths else ["Delivered response within allotted interview time."],
            "improvements": improvements if improvements else ["Continue practicing articulating real-time trade-offs between space and runtime."],
            "summary": summary
        }
