# MLOps & Productionization

Course 20 of 20. Lean and practical: how a trained model becomes a service that stays correct.
Packaging, serving, containers, CI gates, orchestration, tracking, monitoring, retraining, and
the cost of inference. Complements System Design's ML-systems chapters — that course *designs*
production, this one *builds* it.

## Chapters

1. Packaging a model: artifacts, schemas, and versioning
2. Serving with FastAPI: async, validation, and batching
3. Containerizing: reproducible builds and resource limits
4. CI/CD for models: test the data, test the model, gate on metrics
5. Pipelines and scheduling: Airflow, n8n, and what runs when
6. Experiment and model tracking
7. Monitoring: data quality, drift, and alerting that works
8. Retraining triggers and the feedback loop
9. Cost, latency, and scaling inference (+ Under the Trench)
10. Capstone: productionize a model end to end

## What each chapter builds

| Chapter | You build |
|---|---|
| 1 | a self-describing artifact with schema, versions, and a golden smoke test |
| 2 | a FastAPI model server with lifespan loading, micro-batching, and a Prometheus histogram |
| 3 | a multi-stage Dockerfile, a layer-cache cost model, and a Dockerfile linter for CI |
| 4 | data expectations, slice metrics, behavioural tests, and a promotion gate that blocks |
| 5 | a DAG with critical-path analysis, partitioned reruns, sensors, and SLA-aware retries |
| 6 | an MLflow-style tracker and a model registry with stages and an audit trail |
| 7 | a prediction log, PSI drift monitors, and alert rules with hysteresis and runbooks |
| 8 | a retraining controller with label-maturity holds, gates, and automatic rollback |
| 9 | unit economics, batching and device trade-offs, and a capacity plan |

## How to study this course

Every chapter runs. The demos are small on purpose — a registry in forty lines, a monitoring job
in twenty — because the point is the *shape* of the machinery, not a product you would buy.

Three habits the course is built around:

- **Convert silent wrongness into loud failure.** Nearly every technique here does exactly that:
  a version check that crashes at startup, a schema that returns 422, a gate that blocks a
  promotion, a sensor that refuses to compute on missing data.
- **Automate the check or you do not have it.** A convention document is not a control; a CI
  step is.
- **Name the number.** Every threshold in a production ML system — drift, gate tolerance, batch
  wait, retrain cadence — should trace back to a measurement or a stated assumption.

## Prerequisites

You should be able to train a model and read Python comfortably. No deep learning is required:
the running example is a small scikit-learn pipeline, and everything transfers unchanged to a
larger model. Chapters 7–8 are easier after System Design's monitoring chapter, but do not
depend on it.

## Environment note

The serving chapters use `fastapi`, `uvicorn`, `httpx`, and `pydantic`, which are included in
`environment/requirements.txt`. Chapter 2 runs the API through FastAPI's `TestClient`, so no
port is opened and every example is reproducible inside the kernel.

## Reference

Designing Machine Learning Systems (Huyen) for the lifecycle view; the Google SRE book for
alerting and error budgets; the FastAPI, Docker, and Airflow documentation for the specifics.
