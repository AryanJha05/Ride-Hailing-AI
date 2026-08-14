FROM ollama/ollama:latest

# Expose internal Ollama API port
EXPOSE 11434

# Ensure Ollama binds to all network interfaces inside the container
ENV OLLAMA_HOST=0.0.0.0:11434

# Run Ollama daemon
ENTRYPOINT ["ollama", "serve"]
