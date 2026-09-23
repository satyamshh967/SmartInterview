#pragma once

#include <string>
#include <vector>
#include <map>
#include <sstream>
#include <cctype>
#include <iostream>

namespace SimpleJson {

inline std::string escapeString(const std::string& str) {
    std::string out;
    for (char c : str) {
        if (c == '"') out += "\\\"";
        else if (c == '\\') out += "\\\\";
        else if (c == '\b') out += "\\b";
        else if (c == '\f') out += "\\f";
        else if (c == '\n') out += "\\n";
        else if (c == '\r') out += "\\r";
        else if (c == '\t') out += "\\t";
        else out += c;
    }
    return out;
}

inline std::string unescapeString(const std::string& str) {
    std::string out;
    for (size_t i = 0; i < str.length(); ++i) {
        if (str[i] == '\\' && i + 1 < str.length()) {
            char next = str[++i];
            if (next == '"') out += '"';
            else if (next == '\\') out += '\\';
            else if (next == 'n') out += '\n';
            else if (next == 'r') out += '\r';
            else if (next == 't') out += '\t';
            else out += next;
        } else {
            out += str[i];
        }
    }
    return out;
}

// Simple key extractor from JSON string
inline std::string extractString(const std::string& json, const std::string& key) {
    std::string searchKey = "\"" + key + "\"";
    size_t pos = json.find(searchKey);
    if (pos == std::string::npos) return "";

    pos = json.find(':', pos + searchKey.length());
    if (pos == std::string::npos) return "";

    size_t start = json.find('"', pos);
    if (start == std::string::npos) return "";

    size_t end = start + 1;
    while (end < json.length()) {
        if (json[end] == '"' && json[end - 1] != '\\') break;
        end++;
    }
    if (end > json.length()) return "";

    return unescapeString(json.substr(start + 1, end - start - 1));
}

inline int extractInt(const std::string& json, const std::string& key, int defaultVal = 0) {
    std::string searchKey = "\"" + key + "\"";
    size_t pos = json.find(searchKey);
    if (pos == std::string::npos) return defaultVal;

    pos = json.find(':', pos + searchKey.length());
    if (pos == std::string::npos) return defaultVal;

    size_t start = json.find_first_not_of(" \t\r\n", pos + 1);
    if (start == std::string::npos) return defaultVal;

    size_t end = json.find_first_of(",}\r\n", start);
    std::string valStr = json.substr(start, end - start);
    try {
        return std::stoi(valStr);
    } catch (...) {
        return defaultVal;
    }
}

struct ParsedTestCase {
    std::string id;
    std::string input;
    std::string expectedOutput;
    bool isHidden = false;
};

inline std::vector<ParsedTestCase> extractTestCases(const std::string& json) {
    std::vector<ParsedTestCase> cases;
    size_t keyPos = json.find("\"testCases\"");
    if (keyPos == std::string::npos) return cases;

    size_t arrayStart = json.find('[', keyPos);
    if (arrayStart == std::string::npos) return cases;

    // Find matching ']' for arrayStart, ignoring characters inside quotes
    size_t arrayEnd = std::string::npos;
    bool inQuote = false;
    int bracketDepth = 0;
    for (size_t i = arrayStart; i < json.length(); ++i) {
        if (json[i] == '"' && (i == 0 || json[i - 1] != '\\')) {
            inQuote = !inQuote;
        } else if (!inQuote) {
            if (json[i] == '[') bracketDepth++;
            else if (json[i] == ']') {
                bracketDepth--;
                if (bracketDepth == 0) {
                    arrayEnd = i;
                    break;
                }
            }
        }
    }
    if (arrayEnd == std::string::npos) arrayEnd = json.length();

    // Extract each top-level object '{ ... }' within [arrayStart, arrayEnd]
    size_t cur = arrayStart + 1;
    while (cur < arrayEnd) {
        size_t objStart = std::string::npos;
        inQuote = false;
        for (size_t i = cur; i < arrayEnd; ++i) {
            if (json[i] == '"' && (i == 0 || json[i - 1] != '\\')) {
                inQuote = !inQuote;
            } else if (!inQuote && json[i] == '{') {
                objStart = i;
                break;
            }
        }
        if (objStart == std::string::npos) break;

        size_t objEnd = std::string::npos;
        int braceDepth = 0;
        inQuote = false;
        for (size_t i = objStart; i < arrayEnd; ++i) {
            if (json[i] == '"' && (i == 0 || json[i - 1] != '\\')) {
                inQuote = !inQuote;
            } else if (!inQuote) {
                if (json[i] == '{') braceDepth++;
                else if (json[i] == '}') {
                    braceDepth--;
                    if (braceDepth == 0) {
                        objEnd = i;
                        break;
                    }
                }
            }
        }
        if (objEnd == std::string::npos) break;

        std::string objStr = json.substr(objStart, objEnd - objStart + 1);

        ParsedTestCase tc;
        tc.id = extractString(objStr, "id");
        if (tc.id.empty()) {
            tc.id = std::to_string(cases.size() + 1);
        }
        tc.input = extractString(objStr, "input");
        tc.expectedOutput = extractString(objStr, "expectedOutput");
        tc.isHidden = (objStr.find("\"isHidden\":true") != std::string::npos ||
                       objStr.find("\"isHidden\": true") != std::string::npos);

        cases.push_back(tc);
        cur = objEnd + 1;
    }

    return cases;
}

} // namespace SimpleJson
