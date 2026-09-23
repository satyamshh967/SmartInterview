# Containerized Evaluator Engine
FROM gcc:13-bookworm

# Install Python and Node.js for multi-language execution
RUN apt-get update && apt-get install -y \
    python3 \
    nodejs \
    npm \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY src/ /app/src/

# Compile evaluator with POSIX support if on Linux or run via lightweight runner
COPY build.bat /app/

EXPOSE 8082

CMD ["./evaluator_service", "8082"]
