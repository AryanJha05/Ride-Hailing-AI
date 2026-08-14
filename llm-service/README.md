# Ride AI — LLM Microservice (Ollama Runtime)

This microservice provides containerized Ollama LLM execution for the Ride AI backend.

## Environment Variables

- `OLLAMA_HOST`: Configured inside the container to `0.0.0.0:11434`.
- `OLLAMA_MODEL`: Target model (e.g. `gemma2`, `llama3`).

## Model Management (On-Demand)

Models are NOT pre-packaged into the Docker image to keep the image lightweight.
Models persist across container restarts via the `ollama_data` volume.

To pull a model into the running container:

```bash
docker compose exec llm-service ollama pull gemma2
```
