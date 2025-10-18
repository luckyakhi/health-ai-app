# Health AI App (Skeleton)

A minimal Vite + React (TypeScript) skeleton with a single landing page that lists tasks for a user or their group. Unassigned tasks can be locked; assigned tasks can be viewed.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm run preview` — preview production build

## Getting Started

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`

## Notes

- React is pinned to `^18.3.1` (latest stable at time of scaffolding). You can upgrade to React 19 when stable for your environment.
- The current user is hardcoded in `src/App.tsx`. Replace with your auth/user context later.
- Mock tasks live in `src/data/mockTasks.ts`. Replace with a real API when ready.

## Containerization

This repo includes a multi-stage Dockerfile that builds the app and serves it via Nginx with SPA routing.

Build locally:

```
docker build -t health-ai-app:local .
docker run --rm -p 8080:80 health-ai-app:local
```

## AWS ECS (Terraform)

Infrastructure code is under `infra/terraform` to deploy the app on ECS Fargate behind an Application Load Balancer.

What it creates:

- VPC with two public subnets
- Internet Gateway and routing
- Security groups for ALB and ECS tasks
- Application Load Balancer (HTTP 80)
- ECS Cluster, Task Definition, Service (Fargate)
- CloudWatch Log Group for container logs

Inputs you provide:

- `aws_region` (default `us-east-1`)
- Either provide `container_image` (full registry URI:tag) OR let Terraform create an ECR repo and use `image_tag`.

Recommended deploy flow (two-phase):

1) Initialize Terraform

```
cd infra/terraform
terraform init
```

2) Create ECR repository first (targeted apply)

```
terraform apply -auto-approve -target=aws_ecr_repository.this[0] -target=aws_ecr_lifecycle_policy.this[0]
```

3) Build and push the image to ECR

```
REPO_URL="$(terraform output -raw ecr_repository_url)"
TAG="latest"  # or use the tag you set in terraform.tfvars (image_tag)
IMAGE_URI="$REPO_URL:$TAG"

aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin ${IMAGE_URI%%/*}

docker build -t "$IMAGE_URI" ../..
docker push "$IMAGE_URI"
```

4) Apply the rest of the infrastructure

```
terraform apply -auto-approve
```

5) Open the app

- From output `alb_dns_name`: http://<alb_dns_name>

If you prefer using an external registry or an existing ECR repo, set `-var="container_image=<uri:tag>"` and optionally `-var="create_ecr=false"`.

Notes:

- For simplicity, tasks run in public subnets with `assign_public_ip = true` and are only reachable through the ALB security group.
- To add HTTPS, provision an ACM certificate and add an HTTPS listener on the ALB.
- To use private subnets, add NAT gateways and update the service subnets accordingly.

## Architecture Diagram

See the deployment diagram at `docs/diagrams/deployment.svg`. The Mermaid source is at `docs/diagrams/deployment.mmd`.
