# Deploy to AWS ECS (Fargate)

This guide deploys the app to AWS ECS Fargate behind an Application Load Balancer using Terraform.

## Prerequisites
- AWS account and credentials configured (AWS CLI or environment vars)
- Terraform >= 1.5
- Docker (to build/push the image)

## What Terraform creates
- VPC, 2 public subnets, IGW, routing
- Security groups for ALB and ECS tasks
- Application Load Balancer (HTTP 80)
- CloudWatch Log Group
- Optional ECR repository (enabled by default)
- ECS Cluster, Task Definition, and Service (Fargate)

## Recommended deploy flow (two-phase)
1) Prepare variables

- Copy `terraform.tfvars` and adjust values as needed (region, account):

```
aws_region     = "us-east-1"
aws_account_id = "123456789012"
```

2) Initialize Terraform

```
terraform init
```

3) Create only the ECR repository first (targeted apply)

```
terraform apply -auto-approve \
  -target=aws_ecr_repository.this[0] \
  -target=aws_ecr_lifecycle_policy.this[0]
```

4) Build and push the image to ECR

- Get the ECR repository URL and construct the image URI using your desired tag (defaults to `latest`, or set `image_tag` in `terraform.tfvars`):

```
REPO_URL="$(terraform output -raw ecr_repository_url)"
TAG="latest"   # or the value you set in terraform.tfvars (image_tag)
IMAGE_URI="$REPO_URL:$TAG"
```

- Log in to ECR and push (replace `<region>` with your AWS region, or rely on your AWS CLI default region):

```
aws ecr get-login-password --region <region> | \
  docker login --username AWS --password-stdin ${IMAGE_URI%%/*}

docker build -t "$IMAGE_URI" ../..
docker push "$IMAGE_URI"
```

5) Apply the rest of the infrastructure

- This provisions networking, ALB, ECS cluster/service, etc.

```
terraform apply -auto-approve
```

6) Access the app

- Open the DNS from the output `alb_dns_name` in your browser: `http://<alb_dns_name>`

## Using an existing image (skip ECR)
- Provide your image directly and disable ECR creation:

```
terraform apply \
  -var="create_ecr=false" \
  -var="container_image=<your_registry>/<repo>:<tag>"
```

## Variables of interest
- `aws_region` (string): AWS region (default `us-east-1`)
- `aws_account_id` (string): For documentation/commands (not required by resources)
- `create_ecr` (bool): Create an ECR repo (default `true`)
- `ecr_repo_name` (string): ECR name (defaults to `app_name`)
- `image_tag` (string): Tag used when Terraform-created ECR is used (default `latest`)
- `container_image` (string): Full image URI to use (overrides ECR logic)

## Notes
- The service runs in public subnets with `assign_public_ip = true` and only accepts traffic from the ALB.
- To enable HTTPS, add an ACM certificate and an HTTPS listener to the ALB.
- To place tasks in private subnets, add NAT gateways and update the service subnets accordingly.
