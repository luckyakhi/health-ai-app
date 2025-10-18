variable "app_name" {
  description = "Application name prefix"
  type        = string
  default     = "health-ai-app"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "aws_account_id" {
  description = "AWS Account ID (for docs/commands; not required by Terraform resources)"
  type        = string
  default     = ""
}

variable "vpc_cidr" {
  description = "VPC CIDR"
  type        = string
  default     = "10.10.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDRs"
  type        = list(string)
  default     = ["10.10.1.0/24", "10.10.2.0/24"]
}

variable "container_image" {
  description = "Container image URI (e.g., ECR URI:tag). If empty and ECR is created, uses <repo_url>:image_tag"
  type        = string
  default     = ""
}

variable "container_port" {
  description = "Container port"
  type        = number
  default     = 80
}

variable "create_ecr" {
  description = "Create an ECR repository for this app"
  type        = bool
  default     = true
}

variable "ecr_repo_name" {
  description = "ECR repository name (defaults to app_name)"
  type        = string
  default     = ""
}

variable "image_tag" {
  description = "Docker image tag to reference when using the created ECR repo"
  type        = string
  default     = "latest"
}
