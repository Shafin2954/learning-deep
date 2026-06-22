# Code-runner image: FastAPI service + full ML environment in one place so the
# kernel can import everything. CPU build by default.
#
# For GPU: switch the base to an NVIDIA CUDA image
#   (e.g. nvidia/cuda:12.1.1-cudnn8-runtime-ubuntu22.04 + install python),
#   install torch from the cu121 index, and run the container with `--gpus all`.

FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# build tools for packages with native extensions (lightgbm, hdbscan, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# install the full DS/ML stack first (best layer caching)
COPY environment/requirements.txt /app/environment/requirements.txt
RUN pip install -U pip && pip install -r /app/environment/requirements.txt

# runner service deps + code
COPY code-runner/requirements.txt /app/code-runner/requirements.txt
RUN pip install -r /app/code-runner/requirements.txt
COPY code-runner/ /app/code-runner/

WORKDIR /app/code-runner
EXPOSE 8000
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
