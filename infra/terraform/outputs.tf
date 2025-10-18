output "alb_dns_name" {
  description = "ALB DNS name"
  value       = aws_lb.app.dns_name
}

output "cluster_name" {
  value = aws_ecs_cluster.this.name
}

output "service_name" {
  value = aws_ecs_service.app.name
}

output "ecr_repository_url" {
  description = "ECR repository URL (if created)"
  value       = var.create_ecr ? aws_ecr_repository.this[0].repository_url : null
}

output "recommended_image_uri" {
  description = "Image URI used by the task definition (if container_image not provided, uses <repo_url>:image_tag)"
  value       = local.image_uri
}
