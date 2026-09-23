#pragma once

#include <string>
#include <vector>
#include <chrono>
#include <fstream>
#include <filesystem>
#include <algorithm>
#include <iostream>
#include <sstream>

#ifdef _WIN32
#include <windows.h>
#include <psapi.h>
#else
#include <unistd.h>
#include <sys/wait.h>
#include <sys/resource.h>
#endif

#include "json_helper.hpp"

namespace fs = std::filesystem;

struct TestCaseOutput {
    std::string id;
    bool passed = false;
    std::string input;
    std::string expectedOutput;
    std::string actualOutput;
    long long executionTimeMs = 0;
    long long memoryKb = 0;
    std::string error;
    bool isHidden = false;

    std::string toJson() const {
        std::ostringstream ss;
        ss << "{"
           << "\"id\":\"" << SimpleJson::escapeString(id) << "\","
           << "\"passed\":" << (passed ? "true" : "false") << ","
           << "\"input\":\"" << SimpleJson::escapeString(input) << "\","
           << "\"expectedOutput\":\"" << SimpleJson::escapeString(isHidden ? "[Hidden Test Case]" : expectedOutput) << "\","
           << "\"actualOutput\":\"" << SimpleJson::escapeString(isHidden && !passed ? "[Output Hidden]" : actualOutput) << "\","
           << "\"executionTimeMs\":" << executionTimeMs << ","
           << "\"memoryKb\":" << memoryKb << ","
           << "\"error\":\"" << SimpleJson::escapeString(error) << "\","
           << "\"isHidden\":" << (isHidden ? "true" : "false")
           << "}";
        return ss.str();
    }
};

struct ExecutionReport {
    std::string status = "ACCEPTED"; // ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, COMPILATION_ERROR, RUNTIME_ERROR
    int totalTestCases = 0;
    int passedTestCases = 0;
    long long totalExecutionTimeMs = 0;
    long long peakMemoryKb = 0;
    std::string compilationError;
    std::vector<TestCaseOutput> details;

    std::string toJson() const {
        std::ostringstream ss;
        ss << "{"
           << "\"status\":\"" << status << "\","
           << "\"totalTestCases\":" << totalTestCases << ","
           << "\"passedTestCases\":" << passedTestCases << ","
           << "\"totalExecutionTimeMs\":" << totalExecutionTimeMs << ","
           << "\"peakMemoryKb\":" << peakMemoryKb << ",";
        if (!compilationError.empty()) {
            ss << "\"compilationError\":\"" << SimpleJson::escapeString(compilationError) << "\",";
        }
        ss << "\"details\":[";
        for (size_t i = 0; i < details.size(); ++i) {
            if (i > 0) ss << ",";
            ss << details[i].toJson();
        }
        ss << "]}";
        return ss.str();
    }
};

class CodeEvaluator {
public:
    static ExecutionReport evaluate(const std::string& language,
                                    const std::string& code,
                                    const std::vector<SimpleJson::ParsedTestCase>& testCases,
                                    int timeLimitMs = 3000) {
        ExecutionReport report;
        report.totalTestCases = (int)testCases.size();

        std::string runId = "eval_" + std::to_string(std::chrono::system_clock::now().time_since_epoch().count());
        fs::path tempDir = fs::temp_directory_path() / runId;
        std::error_code ec;
        fs::create_directories(tempDir, ec);

        std::string lang = toLower(language);
        std::string execCommand;

        // Pre-compilation / Setup
        if (lang == "python" || lang == "py") {
            fs::path srcFile = tempDir / "solution.py";
            std::ofstream out(srcFile);
            out << code;
            out.close();
            execCommand = "python \"" + srcFile.string() + "\"";
        } else if (lang == "javascript" || lang == "js" || lang == "node") {
            fs::path srcFile = tempDir / "solution.js";
            std::ofstream out(srcFile);
            out << code;
            out.close();
            execCommand = "node \"" + srcFile.string() + "\"";
        } else if (lang == "cpp" || lang == "c++") {
            fs::path srcFile = tempDir / "solution.cpp";
            fs::path exeFile = tempDir / "solution.exe";
            std::ofstream out(srcFile);
            out << code;
            out.close();

            std::string compCmd = "g++ -O2 \"" + srcFile.string() + "\" -o \"" + exeFile.string() + "\"";
            std::string compErr;
            bool ok = runSimpleCommand(compCmd, tempDir.string(), compErr, 10000);
            if (!ok || !fs::exists(exeFile)) {
                report.status = "COMPILATION_ERROR";
                report.compilationError = compErr.empty() ? "Compilation failed" : compErr;
                cleanup(tempDir);
                return report;
            }
            execCommand = "\"" + exeFile.string() + "\"";
        } else if (lang == "c") {
            fs::path srcFile = tempDir / "solution.c";
            fs::path exeFile = tempDir / "solution.exe";
            std::ofstream out(srcFile);
            out << code;
            out.close();

            std::string compCmd = "gcc -O2 \"" + srcFile.string() + "\" -o \"" + exeFile.string() + "\"";
            std::string compErr;
            bool ok = runSimpleCommand(compCmd, tempDir.string(), compErr, 10000);
            if (!ok || !fs::exists(exeFile)) {
                report.status = "COMPILATION_ERROR";
                report.compilationError = compErr.empty() ? "Compilation failed" : compErr;
                cleanup(tempDir);
                return report;
            }
            execCommand = "\"" + exeFile.string() + "\"";
        } else {
            report.status = "COMPILATION_ERROR";
            report.compilationError = "Unsupported language: " + language;
            cleanup(tempDir);
            return report;
        }

        // Run each testcase
        for (const auto& tc : testCases) {
            TestCaseOutput res;
            res.id = tc.id;
            res.input = tc.input;
            res.expectedOutput = tc.expectedOutput;
            res.isHidden = tc.isHidden;

            runProcessWithLimits(execCommand, tempDir.string(), tc.input, timeLimitMs, res);
            report.details.push_back(res);

            report.totalExecutionTimeMs += res.executionTimeMs;
            if (res.memoryKb > report.peakMemoryKb) {
                report.peakMemoryKb = res.memoryKb;
            }

            if (res.passed) {
                report.passedTestCases++;
            } else if (report.status == "ACCEPTED") {
                if (res.error.find("Time Limit Exceeded") != std::string::npos) {
                    report.status = "TIME_LIMIT_EXCEEDED";
                } else if (!res.error.empty() && res.error.find("Runtime Error") != std::string::npos) {
                    report.status = "RUNTIME_ERROR";
                } else {
                    report.status = "WRONG_ANSWER";
                }
            }
        }

        cleanup(tempDir);
        return report;
    }

private:
    static std::string toLower(std::string s) {
        std::transform(s.begin(), s.end(), s.begin(), [](unsigned char c){ return std::tolower(c); });
        return s;
    }

    static std::string normalize(const std::string& str) {
        std::string s = str;
        s.erase(0, s.find_first_not_of(" \t\r\n"));
        s.erase(s.find_last_not_of(" \t\r\n") + 1);

        std::string out;
        bool inSpace = false;
        for (char c : s) {
            if (c == '\r') continue;
            if (c == ' ' || c == '\t' || c == '\n') {
                if (!inSpace) {
                    out += ' ';
                    inSpace = true;
                }
            } else {
                out += c;
                inSpace = false;
            }
        }
        return out;
    }

    static void cleanup(const fs::path& p) {
        std::error_code ec;
        fs::remove_all(p, ec);
    }

    static bool runSimpleCommand(const std::string& cmd, const std::string& workingDir, std::string& output, int timeoutMs) {
#ifdef _WIN32
        SECURITY_ATTRIBUTES sa;
        sa.nLength = sizeof(SECURITY_ATTRIBUTES);
        sa.bInheritHandle = TRUE;
        sa.lpSecurityDescriptor = NULL;

        HANDLE hChildStd_OUT_Rd = NULL;
        HANDLE hChildStd_OUT_Wr = NULL;
        if (!CreatePipe(&hChildStd_OUT_Rd, &hChildStd_OUT_Wr, &sa, 0)) return false;
        SetHandleInformation(hChildStd_OUT_Rd, HANDLE_FLAG_INHERIT, 0);

        STARTUPINFOA si;
        ZeroMemory(&si, sizeof(si));
        si.cb = sizeof(si);
        si.hStdError = hChildStd_OUT_Wr;
        si.hStdOutput = hChildStd_OUT_Wr;
        si.dwFlags |= STARTF_USESTDHANDLES;

        PROCESS_INFORMATION pi;
        ZeroMemory(&pi, sizeof(pi));

        std::string cmdCopy = cmd;
        BOOL success = CreateProcessA(NULL, cmdCopy.data(), NULL, NULL, TRUE, 0, NULL,
                                      workingDir.empty() ? NULL : workingDir.c_str(), &si, &pi);
        CloseHandle(hChildStd_OUT_Wr);

        if (!success) {
            CloseHandle(hChildStd_OUT_Rd);
            output = "Failed to launch compilation process";
            return false;
        }

        DWORD waitResult = WaitForSingleObject(pi.hProcess, timeoutMs);
        if (waitResult == WAIT_TIMEOUT) {
            TerminateProcess(pi.hProcess, 1);
            output = "Compilation timed out";
            CloseHandle(pi.hProcess);
            CloseHandle(pi.hThread);
            CloseHandle(hChildStd_OUT_Rd);
            return false;
        }

        char buffer[4096];
        DWORD bytesRead = 0;
        while (ReadFile(hChildStd_OUT_Rd, buffer, sizeof(buffer) - 1, &bytesRead, NULL) && bytesRead != 0) {
            buffer[bytesRead] = '\0';
            output += buffer;
        }

        DWORD exitCode = 0;
        GetExitCodeProcess(pi.hProcess, &exitCode);
        CloseHandle(pi.hProcess);
        CloseHandle(pi.hThread);
        CloseHandle(hChildStd_OUT_Rd);
        return exitCode == 0;
#else
        return false;
#endif
    }

    static void runProcessWithLimits(const std::string& cmd,
                                     const std::string& workingDir,
                                     const std::string& input,
                                     int timeoutMs,
                                     TestCaseOutput& result) {
#ifdef _WIN32
        SECURITY_ATTRIBUTES sa;
        sa.nLength = sizeof(SECURITY_ATTRIBUTES);
        sa.bInheritHandle = TRUE;
        sa.lpSecurityDescriptor = NULL;

        HANDLE hIn_Rd = NULL, hIn_Wr = NULL;
        HANDLE hOut_Rd = NULL, hOut_Wr = NULL;
        HANDLE hErr_Rd = NULL, hErr_Wr = NULL;

        CreatePipe(&hIn_Rd, &hIn_Wr, &sa, 0);
        CreatePipe(&hOut_Rd, &hOut_Wr, &sa, 0);
        CreatePipe(&hErr_Rd, &hErr_Wr, &sa, 0);

        SetHandleInformation(hIn_Wr, HANDLE_FLAG_INHERIT, 0);
        SetHandleInformation(hOut_Rd, HANDLE_FLAG_INHERIT, 0);
        SetHandleInformation(hErr_Rd, HANDLE_FLAG_INHERIT, 0);

        if (!input.empty()) {
            DWORD written = 0;
            WriteFile(hIn_Wr, input.c_str(), (DWORD)input.length(), &written, NULL);
        }
        CloseHandle(hIn_Wr);

        STARTUPINFOA si;
        ZeroMemory(&si, sizeof(si));
        si.cb = sizeof(si);
        si.hStdInput = hIn_Rd;
        si.hStdOutput = hOut_Wr;
        si.hStdError = hErr_Wr;
        si.dwFlags |= STARTF_USESTDHANDLES;

        PROCESS_INFORMATION pi;
        ZeroMemory(&pi, sizeof(pi));

        std::string cmdCopy = cmd;
        auto startTime = std::chrono::high_resolution_clock::now();

        BOOL success = CreateProcessA(NULL, cmdCopy.data(), NULL, NULL, TRUE, 0, NULL,
                                      workingDir.empty() ? NULL : workingDir.c_str(), &si, &pi);

        CloseHandle(hIn_Rd);
        CloseHandle(hOut_Wr);
        CloseHandle(hErr_Wr);

        if (!success) {
            CloseHandle(hOut_Rd);
            CloseHandle(hErr_Rd);
            result.passed = false;
            result.error = "Failed to spawn runner process";
            return;
        }

        DWORD waitRes = WaitForSingleObject(pi.hProcess, timeoutMs);
        auto endTime = std::chrono::high_resolution_clock::now();
        result.executionTimeMs = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime).count();

        // Get peak memory usage
        PROCESS_MEMORY_COUNTERS pmc;
        if (GetProcessMemoryInfo(pi.hProcess, &pmc, sizeof(pmc))) {
            result.memoryKb = pmc.PeakWorkingSetSize / 1024;
        } else {
            result.memoryKb = 1024;
        }

        if (waitRes == WAIT_TIMEOUT) {
            TerminateProcess(pi.hProcess, 1);
            CloseHandle(pi.hProcess);
            CloseHandle(pi.hThread);
            CloseHandle(hOut_Rd);
            CloseHandle(hErr_Rd);
            result.passed = false;
            result.error = "Time Limit Exceeded (> " + std::to_string(timeoutMs) + "ms)";
            return;
        }

        char buffer[2048];
        DWORD bytesRead = 0;
        std::string stdoutStr;
        while (ReadFile(hOut_Rd, buffer, sizeof(buffer) - 1, &bytesRead, NULL) && bytesRead != 0) {
            buffer[bytesRead] = '\0';
            stdoutStr += buffer;
        }
        CloseHandle(hOut_Rd);

        std::string stderrStr;
        while (ReadFile(hErr_Rd, buffer, sizeof(buffer) - 1, &bytesRead, NULL) && bytesRead != 0) {
            buffer[bytesRead] = '\0';
            stderrStr += buffer;
        }
        CloseHandle(hErr_Rd);

        DWORD exitCode = 0;
        GetExitCodeProcess(pi.hProcess, &exitCode);
        CloseHandle(pi.hProcess);
        CloseHandle(pi.hThread);

        result.actualOutput = stdoutStr;
        while (!result.actualOutput.empty() && (result.actualOutput.back() == '\n' || result.actualOutput.back() == '\r')) {
            result.actualOutput.pop_back();
        }

        if (exitCode != 0) {
            result.passed = false;
            result.error = "Runtime Error (code " + std::to_string(exitCode) + "): " + stderrStr;
            return;
        }

        std::string normExp = normalize(result.expectedOutput);
        std::string normAct = normalize(result.actualOutput);
        result.passed = (normExp == normAct);
        if (!result.passed && !stderrStr.empty()) {
            result.error = stderrStr;
        }
#endif
    }
};
