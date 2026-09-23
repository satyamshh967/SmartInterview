#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <thread>

#ifdef _WIN32
#include <winsock2.h>
#include <ws2tcpip.h>
#pragma comment(lib, "ws2_32.lib")
#endif

#include "json_helper.hpp"
#include "evaluator.hpp"

const int DEFAULT_PORT = 8082;

void sendResponse(SOCKET clientSocket, int statusCode, const std::string& statusText,
                  const std::string& contentType, const std::string& body) {
    std::ostringstream response;
    response << "HTTP/1.1 " << statusCode << " " << statusText << "\r\n"
             << "Content-Type: " << contentType << "\r\n"
             << "Content-Length: " << body.length() << "\r\n"
             << "Access-Control-Allow-Origin: *\r\n"
             << "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
             << "Access-Control-Allow-Headers: Content-Type, Authorization\r\n"
             << "Connection: close\r\n\r\n"
             << body;

    std::string respStr = response.str();
    send(clientSocket, respStr.c_str(), (int)respStr.length(), 0);
}

void handleClient(SOCKET clientSocket) {
    std::string requestData;
    char buffer[4096];
    int bytesRead = 0;

    // Read headers
    while ((bytesRead = recv(clientSocket, buffer, sizeof(buffer) - 1, 0)) > 0) {
        buffer[bytesRead] = '\0';
        requestData.append(buffer, bytesRead);
        if (requestData.find("\r\n\r\n") != std::string::npos) {
            break;
        }
    }

    if (requestData.empty()) {
        closesocket(clientSocket);
        return;
    }

    // Parse method and path
    std::istringstream reqStream(requestData);
    std::string method, path, protocol;
    reqStream >> method >> path >> protocol;

    if (method == "OPTIONS") {
        sendResponse(clientSocket, 204, "No Content", "text/plain", "");
        closesocket(clientSocket);
        return;
    }

    if (path == "/health" && method == "GET") {
        std::string healthJson = "{\"status\":\"UP\",\"service\":\"C++ Code Evaluation Engine\",\"port\":8082,\"supportedLanguages\":[\"python\",\"javascript\",\"cpp\",\"c\"]}";
        sendResponse(clientSocket, 200, "OK", "application/json", healthJson);
        closesocket(clientSocket);
        return;
    }

    if (path == "/evaluate" && method == "POST") {
        // Read Content-Length
        size_t clPos = requestData.find("Content-Length:");
        if (clPos == std::string::npos) clPos = requestData.find("content-length:");
        int contentLength = 0;
        if (clPos != std::string::npos) {
            size_t valStart = requestData.find(':', clPos) + 1;
            size_t valEnd = requestData.find("\r\n", valStart);
            std::string clStr = requestData.substr(valStart, valEnd - valStart);
            try { contentLength = std::stoi(clStr); } catch (...) { contentLength = 0; }
        }

        size_t headerEnd = requestData.find("\r\n\r\n");
        std::string body = requestData.substr(headerEnd + 4);

        while ((int)body.length() < contentLength) {
            bytesRead = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
            if (bytesRead <= 0) break;
            body.append(buffer, bytesRead);
        }

        std::string language = SimpleJson::extractString(body, "language");
        if (language.empty()) language = "python";
        std::string code = SimpleJson::extractString(body, "code");
        int timeLimitMs = SimpleJson::extractInt(body, "timeLimitMs", 3000);
        auto testCases = SimpleJson::extractTestCases(body);

        ExecutionReport report = CodeEvaluator::evaluate(language, code, testCases, timeLimitMs);
        std::string jsonResp = report.toJson();

        sendResponse(clientSocket, 200, "OK", "application/json", jsonResp);
        closesocket(clientSocket);
        return;
    }

    sendResponse(clientSocket, 404, "Not Found", "application/json", "{\"error\":\"Route not found\"}");
    closesocket(clientSocket);
}

int main(int argc, char* argv[]) {
    int port = DEFAULT_PORT;
    if (argc > 1) {
        try { port = std::stoi(argv[1]); } catch (...) {}
    }

    WSADATA wsaData;
    int iResult = WSAStartup(MAKEWORD(2, 2), &wsaData);
    if (iResult != 0) {
        std::cerr << "WSAStartup failed: " << iResult << std::endl;
        return 1;
    }

    SOCKET listenSocket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (listenSocket == INVALID_SOCKET) {
        std::cerr << "socket failed with error: " << WSAGetLastError() << std::endl;
        WSACleanup();
        return 1;
    }

    BOOL opt = TRUE;
    setsockopt(listenSocket, SOL_SOCKET, SO_REUSEADDR, (char*)&opt, sizeof(opt));

    sockaddr_in service;
    service.sin_family = AF_INET;
    service.sin_addr.s_addr = INADDR_ANY;
    service.sin_port = htons(port);

    if (bind(listenSocket, (SOCKADDR*)&service, sizeof(service)) == SOCKET_ERROR) {
        std::cerr << "bind failed with error: " << WSAGetLastError() << std::endl;
        closesocket(listenSocket);
        WSACleanup();
        return 1;
    }

    if (listen(listenSocket, SOMAXCONN) == SOCKET_ERROR) {
        std::cerr << "listen failed with error: " << WSAGetLastError() << std::endl;
        closesocket(listenSocket);
        WSACleanup();
        return 1;
    }

    std::cout << "=================================================" << std::endl;
    std::cout << "  C++ Code Evaluation Engine Running on Port " << port << std::endl;
    std::cout << "  Sandboxed Process Runner: Active" << std::endl;
    std::cout << "  Supported: Python, JavaScript, C++, C" << std::endl;
    std::cout << "=================================================" << std::endl;

    while (true) {
        SOCKET clientSocket = accept(listenSocket, NULL, NULL);
        if (clientSocket == INVALID_SOCKET) {
            continue;
        }
        std::thread(handleClient, clientSocket).detach();
    }

    closesocket(listenSocket);
    WSACleanup();
    return 0;
}
